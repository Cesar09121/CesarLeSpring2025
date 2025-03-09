<template>
  <div>
    <div class="box mb-4">
      <h1 class="title is-4">My Profile</h1>
      <p>View and manage your profile information.</p>
    </div>
    
    <UserProfile :userId="0" :showStats="true" />
    
    <div class="box mt-4">
      <h2 class="title is-5">Recent Activities</h2>
      <ActivityList
        :activities="userActivities.slice(0, 5)"
        :showActions="false"
      />
      
      <div class="has-text-centered mt-4">
        <router-link to="/activities" class="button is-primary">
          View All Activities
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UserProfile from '../components/UserProfile.vue'
import ActivityList from '../components/ActivityList.vue'
import { useActivities } from '../models/activity'

const { getUserActivities } = useActivities()

const userActivities = computed(() => {
  return getUserActivities.value
})
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1.5rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
</style>