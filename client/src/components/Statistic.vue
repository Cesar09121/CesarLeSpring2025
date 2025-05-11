<template>
  <div class="box">
    <form @submit.prevent="submitActivity">
      <div class="field">
        <label class="label">Exercise Type</label>
        <div class="control has-icons-left">
          <input 
            class="input" 
            type="text" 
            v-model="newActivity.type" 
            placeholder="Running, Swimming, Cycling, etc." 
            required 
          />
          <span class="icon is-small is-left">
            <i class="fas fa-running"></i>
          </span>
        </div>
      </div>
      
      <div class="field">
        <label class="label">Location</label>
        <div class="control has-icons-left">
          <input 
            class="input" 
            type="text" 
            v-model="newActivity.location" 
            placeholder="Gym, Park, Home, etc." 
            required 
          />
          <span class="icon is-small is-left">
            <i class="fas fa-map-marker-alt"></i>
          </span>
        </div>
      </div>
      
      <div class="columns">
        <div class="column">
          <div class="field">
            <label class="label">Duration (minutes)</label>
            <div class="control has-icons-left">
              <input 
                class="input" 
                type="number" 
                v-model="newActivity.duration" 
                min="1" 
                required 
              />
              <span class="icon is-small is-left">
                <i class="fas fa-clock"></i>
              </span>
            </div>
          </div>
        </div>
        
        <div class="column">
          <div class="field">
            <label class="label">Date</label>
            <div class="control has-icons-left">
              <input 
                class="input" 
                type="date" 
                v-model="newActivity.date" 
              />
              <span class="icon is-small is-left">
                <i class="fas fa-calendar-alt"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="field">
        <label class="label">Distance (km)</label>
        <div class="control has-icons-left">
          <input 
            class="input" 
            type="number" 
            v-model="newActivity.distance" 
            min="0" 
            step="0.01" 
            placeholder="0.00" 
          />
          <span class="icon is-small is-left">
            <i class="fas fa-route"></i>
          </span>
        </div>
      </div>
      
      <div class="field mt-4">
        <div class="control">
          <button 
            class="button is-primary is-fullwidth" 
            type="submit" 
            :class="{ 'is-loading': isSubmitting }"
          >
            <span class="icon">
              <i class="fas fa-plus-circle"></i>
            </span>
            <span>Add Activity</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
import { useSession } from '@/models/session'
import { getAll as getActivity, update, create as createActivityApi, type Activity } from '@/models/activity'

dayjs.extend(realTime)

const session = useSession()
const currentUser = session.value.user
console.log('Current session:', session.value)
console.log(currentUser)

const newActivity = ref<Partial<Activity>>({
  type: '',
  duration: 0,
  distance: 0,
  date: dayjs().format('YYYY-MM-DD'),
  location: ''
})

const isSubmitting = ref(false)

const recentActivity = ref<Activity[]>([])

getActivity().then((response) => {
  recentActivity.value = response.items
})

async function createActivity(activity: Activity) {
  try {
    const response = await createActivityApi(activity)
    console.log('Activity created:', response)
    return response
  } catch (error) {
    console.error('Error creating activity:', error)
  }
}

async function updateActivity() {
  if (!currentUser) return;
 
  const existingActivity = recentActivity.value.find((activity) => activity.userId === currentUser.id);
  
  if (existingActivity) {
    const postedActivity: Activity = {
      id: existingActivity.id,
      type: newActivity.value.type || '',
      location: newActivity.value.location || '',
      duration: newActivity.value.duration || 0,
      userId: currentUser.id,
      date: newActivity.value.date ? dayjs(newActivity.value.date).toISOString() : dayjs().toISOString(),
      distance: newActivity.value.distance || 0
    };
    
    console.log('Updating existing workout:', postedActivity);
    try {
      const response = await update(postedActivity);
      console.log('Update response:', response);
      const updatedActivities = await getActivity();
      if (updatedActivities && updatedActivities.items) {
        recentActivity.value = updatedActivities.items;
      }
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  } else if (currentUser) {
    const activityData = {
      id: -1,
      type: newActivity.value.type || '',
      location: newActivity.value.location || '',
      duration: newActivity.value.duration || 0,
      userId: currentUser.id,
      date: newActivity.value.date ? dayjs(newActivity.value.date).toISOString() : dayjs().toISOString(),
      distance: newActivity.value.distance || 0
    } as Activity;
    
    console.log('Creating new activity:', activityData);
    try {
      const response = await createActivity(activityData);
      console.log('Create response:', response);
      
      const updatedActivities = await getActivity();
      if (updatedActivities && updatedActivities.items) {
        recentActivity.value = updatedActivities.items;
      }
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  }
}
  
async function submitActivity() {
  if (!currentUser) {

    alert('You must be logged in to create a post.')
    return
  }
  
  isSubmitting.value = true
   const postedActivity: Activity = {
      type: newActivity.value.type || '',
      userId: currentUser.id,
      location: newActivity.value.location || '',
      duration: newActivity.value.duration || 0,
      date: newActivity.value.date ? dayjs(newActivity.value.date).toISOString() : dayjs().toISOString(),
      distance: newActivity.value.distance || 0
    }
    console.log('Creating new activity:', currentUser.id)
  try {
    await createActivity(postedActivity)
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Something went wrong. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.box {
  margin-bottom: 2rem;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  border-radius: 6px;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.input:focus {
  box-shadow: 0 0 0 2px rgba(32, 156, 238, 0.25);
}

.button, .input {
  transition: all 0.2s ease-in-out;
}

.icon.is-small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>