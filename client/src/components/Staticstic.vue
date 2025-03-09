<template>
  <div class="box">
    <h3 class="title is-5">{{ title }}</h3>
    
    <div class="columns is-multiline">
      <div class="column is-half">
        <div class="notification is-primary">
          <p class="heading">Total Activities</p>
          <p class="title">{{ stats.totalActivities }}</p>
        </div>
      </div>
      
      <div class="column is-half">
        <div class="notification is-info">
          <p class="heading">Total Distance</p>
          <p class="title">{{ stats.totalDistance }} miles</p>
        </div>
      </div>
      
      <div class="column is-half">
        <div class="notification is-success">
          <p class="heading">Total Duration</p>
          <p class="title">{{ formatDuration(stats.totalDuration) }}</p>
        </div>
      </div>
      
      <div class="column is-half">
        <div class="notification is-warning">
          <p class="heading">Average Duration</p>
          <p class="title">{{ stats.avgDuration }} min/activity</p>
        </div>
      </div>
    </div>
    
    <h4 class="title is-6 mt-4">Activity Breakdown</h4>
    <div v-if="Object.keys(stats.activityBreakdown).length > 0">
      <div
        v-for="(count, type) in stats.activityBreakdown"
        :key="type"
        class="level"
      >
        <div class="level-left">
          <div class="level-item">
            <p>{{ type }}</p>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <p class="has-text-weight-bold">{{ count }} activities</p>
          </div>
        </div>
      </div>
    </div>
    <p v-else>No activities logged yet.</p>
  </div>
</template>

<script setup lang="ts">
import { ActivityStats } from '../models/activity'

interface Props {
  stats: ActivityStats;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Activity Statistics'
})
const { stats, title } = props
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours === 0) {
    return `${minutes} minutes`
  } else if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`
  }
}
</script>

<style scoped>
.mt-4 {
  margin-top: 1.5rem;
}
</style>