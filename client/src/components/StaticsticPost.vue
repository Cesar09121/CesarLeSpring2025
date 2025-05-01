<!-- StaticPost.vue -->
<template>
  <div class="box">
    <h2 class="title is-4 mb-4">Add New Activity</h2>
    <form @submit.prevent="submitPost">
      <div class="field">
        <label class="label">Exercise Type</label>
        <div class="control has-icons-left">
          <input 
            class="input" 
            type="text" 
            v-model="newPost.type" 
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
            v-model="newPost.location" 
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
                v-model="newPost.duration" 
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
                v-model="newPost.date" 
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
            v-model="newPost.distance" 
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
import { create, type Post } from '@/models/posts'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
import { useSession } from '@/models/session'
import { getAll as getActivity, update, create as createActivity, type Activity } from '@/models/activity'

// Initialize dayjs extension
dayjs.extend(realTime)

// Get user session
const session = useSession()
const currentUser = session.value.user

// Form data
const newPost = ref<Partial<Post>>({
  type: '',
  duration: 0,
  distance: 0,
  date: dayjs().format('YYYY-MM-DD'), // Set default date to today
  location: ''
})

// Loading state
const isSubmitting = ref(false)

// Activity data
const recentActivity = ref<Activity[]>([])

// Fetch existing activities
getActivity().then((response) => {
  recentActivity.value = response.items
})

// Add a new post
async function addPost() {
  if (!currentUser) {
    alert('You must be logged in to create a post.')
    return
  }

  const post = {
    ...newPost.value,
    userId: currentUser.userId,
    username: currentUser.username,
    createdAt: dayjs().toISOString(),
    email: currentUser.email,
    location: newPost.value.location || ''
  } as Post

  try {
    const response = await create(post)
    console.log('Post created successfully:', response)
    
    // Reset form
    newPost.value = {
      title: '',
      type: '',
      duration: 0,
      distance: 0,
      date: dayjs().format('YYYY-MM-DD'), // Reset date to today
      location: ''
    }
  } catch (error) {
    console.error('Error creating post:', error)
    alert('Failed to create post. Please try again.')
  }
}

// Update activity
async function updateActivity() {
  if (!currentUser) return;
 
  const existingActivity = recentActivity.value.find((activity) => activity.userId === currentUser.userId);
  
  if (existingActivity) {
    const postedActivity: Activity = {
      id: existingActivity.id, 
      type: newPost.value.type || '',
      location: newPost.value.location || '',
      duration: newPost.value.duration || 0,
      userId: currentUser.userId,
      date: newPost.value.date ? dayjs(newPost.value.date).toISOString() : dayjs().toISOString(),
      distance: newPost.value.distance || 0
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
      id: -1, // Temporary ID for TypeScript
      type: newPost.value.type || '',
      location: newPost.value.location || '',
      duration: newPost.value.duration || 0,
      userId: currentUser.userId,
      date: newPost.value.date ? dayjs(newPost.value.date).toISOString() : dayjs().toISOString(),
      distance: newPost.value.distance || 0
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
  
// Submit handler
async function submitPost() {
  if (!currentUser) {
    alert('You must be logged in to create a post.')
    return
  }
  
  isSubmitting.value = true
  
  try {
    await updateActivity()
    await addPost()
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

/* Improve input focus state */
.input:focus {
  box-shadow: 0 0 0 2px rgba(32, 156, 238, 0.25);
}

/* Smooth transitions */
.button, .input {
  transition: all 0.2s ease-in-out;
}

/* Fix icon alignment */
.icon.is-small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>