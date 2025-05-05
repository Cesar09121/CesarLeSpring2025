<template>
  <div class="stats">
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
            <p class="has-text-weight-bold">Member #{{ activity.id  }}</p>
            <p class="is-size-7">{{ activity.type }}</p>
          </div>
          <p class="is-size-7">{{ formatDate(activity.date?.toString()) }}</p>
        </div>
        
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
import {getAll as getAllActivities, type Activity} from '@/models/activity'
import {isLoggedIn, useSession} from '@/models/session'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
dayjs.extend(realTime)

const session = useSession()

const allActivities = ref({ items: [] } as unknown as {items: Activity[], total: number})
const loadingActivities = ref(true)
const activitiesError = ref('')

console.log('Current session:', session.value)
console.log('Is logged in?', isLoggedIn())
console.log('User ID:', session.value.user?.userId)
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