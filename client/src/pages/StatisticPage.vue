<template>
  <div class="stats">

    <Statistic @activity-added="refreshActivities" />
    <h1 class="title is-3 mt-5"><b>All Activities</b></h1>
    <div v-if="loadingActivities" class="has-text-centered my-4">
      <progress class="progress is-primary" max="100"></progress>
    </div>
    
    <div v-else-if="activitiesError" class="notification is-danger">
      {{ activitiesError }}
    </div>
    
    <div v-else-if="!allActivities.items || allActivities.items.length === 0" class="notification is-info">
      No activities found.
    </div>
    
    <div v-else>
      <div class="box activity-box" v-for="(activity, index) in allActivities.items" :key="index">
        <div class="is-flex is-justify-content-space-between">
          <div>
            <p class="has-text-weight-bold">Member #{{ activity.userId  }}</p>
            <p class="is-size-7">{{ activity.type }}</p>
          </div>
          <p class="is-size-7">{{ formatDate(activity.date?.toString()) }}</p>
        </div>
        <button 
                class="button is-info is-small mt-2" 
                @click="editActivity(activity)"
              >
                <span class="icon is-small">
                  <i class="fas fa-edit"></i>
                </span>
                <span>Edit</span>
              </button>
          <div class="modal" :class="{ 'is-active': isEditing }">
    <div class="modal-background" @click="isEditing = false"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit Activity</p>
        <button class="delete" aria-label="close" @click="isEditing = false"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Exercise Type</label>
          <input class="input" type="text" v-model="editedActivity.type">
        </div>
        <div class="field">
          <label class="label">Location</label>
          <input class="input" type="text" v-model="editedActivity.location">
        </div>
        <div class="field">
          <label class="label">Duration (minutes)</label>
          <input class="input" type="number" v-model="editedActivity.duration">
        </div>
         <div class="field">
          <label class="label">Distance (km)</label>
          <input class="input" type="number" v-model="editedActivity.distance" step="0.01">
        </div>
        <div class="field">
          <label class="label">Date</label>
          <input class="input" type="date" v-model="editedActivity.date">
        </div>
      </section>
      <footer class="modal-card-foot">
        <button 
          class="button is-success" 
          @click="saveActivity()" 
          :class="{'is-loading': isSaving}"
        >
          Save changes
        </button>
        <button class="button" @click="isEditing = false">Cancel</button>
      </footer>
    </div>
  </div>
        <button 
            class="button is-danger is-small mt-2" 
            @click="deleteActivity(activity.id)" 
            :disabled="isDeleting === activity.id"
          >
            <span class="icon is-small">
              <i class="fas fa-trash-alt"></i>
            </span>
            <span>Delete</span>
          </button>
        <div class="activity-details mt-3">
          <div class="activity-item">
            <p>EXERCISE TYPE</p>
            <h1>{{ activity.type }}</h1>
          </div>
          <div class="activity-item">
            <p>DURATION</p>
            <h1>{{ activity.duration }} minutes</h1>
          </div>
          <div class="activity-item">
            <p>DISTANCE</p>
            <h1>{{ activity.distance }} km</h1>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {getAll as getAllActivities,remove as removeActivity,update as updateActivity, type Activity} from '@/models/activity'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
import Statistic from '@/components/Statistic.vue'
dayjs.extend(realTime)

const allActivities = ref({ items: [] } as unknown as {items: Activity[], total: number})
const loadingActivities = ref(true)
const activitiesError = ref('')
const isDeleting = ref<number | null>(null)
const isEditing = ref(false)
const isSaving = ref(false)


getAllActivities()
  .then((response) => {
    allActivities.value = response
    console.log('All activities loaded:', allActivities.value)
    loadingActivities.value = false
  })
  .catch((err) => {
    console.error("Error loading all activities:", err)
    activitiesError.value = "Failed to load all activities. Please try again."
    loadingActivities.value = false
  })

function formatDate(dateString: string | undefined) {
  if (!dateString) return 'N/A'
  const date = dayjs(dateString)
  return date.isValid() ? date.format('MMM D, YYYY') : dateString
}
function refreshActivities() {
  loadingActivities.value = true
  getAllActivities()
    .then((response) => {
      allActivities.value = response
      loadingActivities.value = false
    })
    .catch((err) => {
      console.error("Error loading all activities:", err)
      activitiesError.value = "Failed to load all activities. Please try again."
      loadingActivities.value = false
    })
}
const editedActivity=ref<Activity>({
  type: '',
  duration: 0,
  distance: 0,
  date: dayjs().format('YYYY-MM-DD'),
  location: ''
})
async function editActivity(activity : Activity){
    editedActivity.value = {
      ...activity,
      date: dayjs(activity.date).format('YYYY-MM-DD')
    }
    isEditing.value = true
}
function saveActivity() {
  isSaving.value = true
  
  const updatedActivity = {
    ...editedActivity.value,
    date: dayjs(editedActivity.value.date).toISOString()
  }
  
  updateActivity(updatedActivity)
    .then(() => {
      isEditing.value = false
      refreshActivities() 
    })
    .catch(error => {
      console.error('Error updating activity:', error)
      alert('Failed to update activity')
    })
    .finally(() => {
      isSaving.value = false
    })
}

async function deleteActivity(id?: number){
  if (!id) {
    console.error('Cannot delete activity: ID is undefined')
    return
  }
  
  if (confirm('Are you sure you want to delete this activity?')) {
    isDeleting.value = id
    
    try {
      await removeActivity(id)
      console.log('Activity deleted successfully:', id)
      refreshActivities()
    } catch (err) {
      console.error('Error deleting activity:', err)
      alert('Failed to delete activity. Please try again.')
    } finally {
      isDeleting.value = null
    }
  }
}

</script>

<style scoped>
.stats {
  padding: 1rem;
}

.activity-item {
  margin-bottom: 1rem;
}

.activity-item p {
  margin-bottom: 0.2rem;
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
  font-weight: bold;
}

.activity-item h1 {
  font-size: 1.1rem;
  font-weight: bold;
}

.activity-box {
  margin-bottom: 1rem;
  transition: transform 0.1s ease-in-out;
}

.activity-box:hover {
  transform: translateY(-2px);
}

.activity-details {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mt-5 {
  margin-top: 1.5rem;
}

.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.button.is-danger.is-small {
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.mt-2 {
  margin-top: 0.5rem;
}
</style>