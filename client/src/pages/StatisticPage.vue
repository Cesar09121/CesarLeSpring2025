<template>
  <div class="stats">

    <h1 class="title is-3 mt-5"><b>Recent Posts</b></h1>
    
    <div v-if="loadingPosts" class="has-text-centered my-4">
      <progress class="progress is-primary" max="100"></progress>
    </div>
    
    <div v-else-if="postsError" class="notification is-danger">
      {{ postsError }}
    </div>
    
    <div v-else-if="!allPosts.items || allPosts.items.length === 0" class="notification is-info">
      No activities found from other users.
    </div>
    
    <div v-else>
      <div class="box activity-box" v-for="(post, index) in allPosts.items" :key="index">
        <div class="is-flex is-justify-content-space-between">
          <div>
            <p class="has-text-weight-bold">{{ post.username }}</p>
            <p class="is-size-7">{{ post.email }}</p>
          </div>
          <p class="is-size-7">{{ formatDate(post.date) }}</p>
        </div>
        
        <div class="activity-details mt-3">
          <div class="activity-item">
            <p></p>
            <h1>{{ post.title }}</h1>
          </div>
          <div class="activity-item">
            <p>EXERCISE TYPE</p>
            <h1>{{ post.type }}</h1>
          </div>
          <div class="activity-item">
            <p>DURATION</p>
            <h1>{{ post.duration }} minutes</h1>
          </div>
          <div class="activity-item">
            <p>DISTANCE</p>
            <h1>{{ post.distance }} km</h1>
          </div>
          <div class="activity-item">
            <p>LOCATION</p>
            <h1>{{ post.location }}</h1>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {get, type Activity} from '@/models/activity'
import {getAll as getAllPosts, type Post} from '@/models/posts'
import {isLoggedIn, useSession} from '@/models/session'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
dayjs.extend(realTime)

const session = useSession()
const activity = ref({} as Activity)
const error = ref('')

const allPosts = ref({ items: [] } as unknown as {items: Post[], total: number})
const loadingPosts = ref(true)
const postsError = ref('')

console.log('Current session:', session.value)
console.log('Is logged in?', isLoggedIn())
console.log('User ID:', session.value.user?.userId)

if(isLoggedIn() && session.value.user?.userId) {
  console.log('Fetching activity for user ID:', session.value.user.userId)
  
  get(session.value.user.userId).then((response) => {
    console.log('Activity API response:', response)
    if(response && response.items && response.items.length > 0) {
      activity.value = response.items[0]
      console.log('Activity set:', activity.value)
    } else {
      console.log('No activity data found in response')
    }
  }).catch((err) => {
    console.error("Error fetching activity:", err)
    error.value = "Failed to load activity data. Please try again later."
  })
} else {
  console.log("User not logged in or user ID is undefined")
}

getAllPosts()
  .then((response) => {
    allPosts.value = response
    console.log('All posts loaded:', allPosts.value)
    loadingPosts.value = false
  })
  .catch((err) => {
    console.error("Error loading all posts:", err)
    postsError.value = "Failed to load all activities. Please try again."
    loadingPosts.value = false
  })

function formatDate(dateString: string | undefined) {
  if (!dateString) return 'N/A'
  const date = dayjs(dateString)
  return date.isValid() ? date.format('MMM D, YYYY') : dateString
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
</style>