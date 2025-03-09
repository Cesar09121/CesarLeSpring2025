<template>
  <div>
    <div class="box">
      <h1 class="title is-4">My Activities</h1>
      <div class="buttons mb-4">
        <button
          class="button is-primary"
          @click="showForm = !showForm"
        >
          {{ showForm ? 'Cancel' : 'Add New Activity' }}
        </button>
      </div>
      
      <ActivityForm
        v-if="showForm"
        @activity-added="onActivityAdded"
      />
      
      <div v-if="!showForm">
        <ActivityList
          :activities="userActivities"
          @edit="editActivity"
          @delete="deleteActivity"
        />
      </div>
    </div>
    
    <div v-if="editingActivity" class="modal is-active">
      <div class="modal-background" @click="cancelEdit"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Activity</p>
          <button @click="cancelEdit" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <ActivityForm
            :activity="currentActivity"
            :is-edit="true"
            @activity-updated="onActivityUpdated"
            @cancel="cancelEdit"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useActivities } from '../models/activity'
import ActivityForm from '../components/ActivityForm.vue'
import ActivityList from '../components/ActivityList.vue'

const { getUserActivities, getActivityById, deleteActivity: removeActivity } = useActivities()

const showForm = ref(false)
const editingActivity = ref(false)
const currentActivityId = ref<number | null>(null)

const userActivities = computed(() => {
  console.log(getUserActivities.value)
  return getUserActivities.value
})

const currentActivity = computed(() => {
  if (currentActivityId.value === null) return null
  return getActivityById(currentActivityId.value)
})

const onActivityAdded = () => {
  showForm.value = false
}

const onActivityUpdated = () => {
  editingActivity.value = false
  currentActivityId.value = null
}

const editActivity = (id: number) => {
  currentActivityId.value = id
  editingActivity.value = true
}

const cancelEdit = () => {
  editingActivity.value = false
  currentActivityId.value = null
}

const deleteActivity = (id: number) => {
  removeActivity(id)
}
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1.5rem;
}
</style>