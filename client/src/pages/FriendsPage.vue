<template>
  <div>
    <div class="box mb-4">
      <h1 class="title is-4">Friends Activity</h1>
      <p>See what your friends have been up to!</p>
    </div>
    
    <div v-if="loading" class="has-text-centered my-6">
      <p class="subtitle">Loading activities...</p>
    </div>
    
    <div v-else-if="friendsActivities.length === 0" class="box has-text-centered my-6">
      <p>Your friends haven't logged any activities yet.</p>
    </div>
    
    <div v-else>
      <div class="mb-4">
        <div class="field">
          <label class="label">Filter by activity type</label>
          <div class="control">
            <div class="select">
              <select v-model="activityTypeFilter">
                <option value="">All activities</option>
                <option value="Run">Running</option>
                <option value="Walk">Walking</option>
                <option value="Cycle">Cycling</option>
                <option value="Swim">Swimming</option>
                <option value="Hike">Hiking</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <FriendActivity
        v-for="activity in filteredActivities"
        :key="activity.id"
        :activity="activity"
        class="mb-3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useActivities } from '../models/activity'
import FriendActivity from '../components/FriendActivity.vue'

const { getFriendsActivities } = useActivities()

const loading = ref(true)
const activityTypeFilter = ref('')

const friendsActivities = computed(() => {
  return getFriendsActivities.value
})

const filteredActivities = computed(() => {
  if (!activityTypeFilter.value) {
    return friendsActivities.value
  }
  return friendsActivities.value.filter(activity =>
    activity.type === activityTypeFilter.value
  )
})

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
.my-6 {
  margin-top: 3rem;
  margin-bottom: 3rem;
}
</style>