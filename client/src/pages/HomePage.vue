<template>
  <div>
    <section class="hero is-info welcome is-small mb-4">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">Hello, {{ currentUser?.name }}!</h1>
        </div>
      </div>
    </section>
    
    <div class="columns">
      <div class="column is-6">
        <div class="box">
          <h3 class="title is-4">Activity Summary</h3>
          <p>You have completed <strong>{{ stats.totalActivities }}</strong> activities.</p>
          <p>Total distance: <strong>{{ stats.totalDistance }}</strong> miles</p>
          <p>Total time spent: <strong>{{ stats.totalDuration }}</strong> minutes</p>
          
          <div class="buttons mt-4">
            <router-link to="/activities" class="button is-primary">
              View Activities
            </router-link>
            <router-link to="/statistics" class="button is-info">
              View Stats
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="column is-6">
        <div class="box">
          <h3 class="title is-4">Quick Add Activity</h3>
          <ActivityForm :compact="true" />
        </div>
      </div>
    </div>
    
    <div class="box">
      <h3 class="title is-4">Recent Friend Activities</h3>
      <div v-if="friendsActivities.length > 0">
        <div v-for="activity in friendsActivities.slice(0, 3)" :key="activity.id" class="notification">
          <p>
            <strong>{{ getUserName(activity.userId) }}</strong> completed a
            {{ activity.type.toLowerCase() }} for {{ activity.distance }} {{ activity.distanceUnit }}
            on {{ formatDate(activity.date) }}
          </p>
        </div>
        <div class="has-text-centered mt-4">
          <router-link to="/friends" class="button is-info">
            View All Friend Activities
          </router-link>
        </div>
      </div>
      <p v-else>No recent activities from your friends.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../models/user'
import { useActivities } from '../models/activity'
import ActivityForm from '../components/ActivityForm.vue'

const { currentUser, getUserById } = useAuth()
const { getActivityStats, getFriendsActivities } = useActivities()

const stats = getActivityStats
const friendsActivities = getFriendsActivities

const getUserName = (userId: number): string => {
  const user = getUserById(userId)
  return user ? user.name : 'Unknown User'
}

const formatDate = (dateString: Date | string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric',timeZone:'UTC' }
  return new Date(dateString).toLocaleDateString(undefined, options);
}
</script>

<style scoped>
.mt-4 {
  margin-top: 1.5rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
</style>