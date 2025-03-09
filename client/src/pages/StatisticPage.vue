<template>
  <div class="statistics">
    <h1 class="title">Statistics</h1>
    
    <div v-if="!hasActivities" class="notification is-info">
      You haven't logged any activities yet. Add some workouts to see your statistics.
    </div>
    
    <div v-else>
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Total Activities</p>
            <p class="title">{{ stats.totalActivities }}</p>
          </div>
        </div>
        
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Total Distance</p>
            <p class="title">{{ stats.totalDistance }} mi</p>
          </div>
        </div>
        
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Total Duration</p>
            <p class="title">{{ formatDuration(stats.totalDuration) }}</p>
          </div>
        </div>
        
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Avg Duration</p>
            <p class="title">{{ stats.avgDuration }} min</p>
          </div>
        </div>
      </div>
      
      <div class="columns">
        <div class="column is-6">
          <div class="box">
            <h3 class="title is-5">Activity Types</h3>
            <table class="table is-fullwidth">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(count, type) in stats.activityBreakdown" :key="type">
                  <td>{{ type }}</td>
                  <td>{{ count }}</td>
                  <td>
                    <progress
                      class="progress is-primary"
                      :value="count"
                      :max="stats.totalActivities"
                    ></progress>
                    {{ calcPercentage(count) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="column is-6">
          <div class="box">
            <h3 class="title is-5">Recent Activities</h3>
            <div v-if="recentActivities.length === 0" class="has-text-centered">
              <p>No activities to display</p>
            </div>
            <div v-else>
              <table class="table is-fullwidth">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Distance</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="activity in recentActivities" :key="activity.id">
                    <td>{{ activity.type }}</td>
                    <td>{{ formatDate(activity.date) }}</td>
                    <td>{{ activity.distance }} {{ activity.distanceUnit }}</td>
                    <td>{{ activity.duration }} min</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useActivities } from '../models/activity'

const { getActivityStats, getUserActivities } = useActivities()

const stats = getActivityStats

const hasActivities = computed(() =>
  stats.value.totalActivities && stats.value.totalActivities > 0
)

const recentActivities = computed(() => {
  return getUserActivities.value.slice(0, 5)
})

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMins = minutes % 60
  
  if (remainingMins === 0) {
    return `${hours} hr`
  }
  
  return `${hours} hr ${remainingMins} min`
}

const calcPercentage = (count: number) => {
  return Math.round((count / stats.value.totalActivities) * 100)
}

const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC'
  })
}
</script>