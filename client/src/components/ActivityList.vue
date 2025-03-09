<template>
  <div>
    <div v-if="activities.length > 0">
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Type</th>
            <th>Distance</th>
            <th>Duration</th>
            <th>Date</th>
            <th v-if="showActions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="activity in activities" :key="activity.id">
            <td>{{ activity.type }}</td>
            <td>{{ activity.distance }} {{ activity.distanceUnit }}</td>
            <td>{{ activity.duration }} min</td>
            <td>{{ formatDate(activity.date) }}</td>
            <td v-if="showActions">
              <div class="buttons are-small">
                <button
                  @click="$emit('edit', activity.id)"
                  class="button is-info"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(activity.id)"
                  class="button is-danger"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="has-text-centered my-4">No activities found.</p>
    
    <div class="modal" :class="{ 'is-active': showDeleteModal }">
      <div class="modal-background" @click="cancelDelete"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm Deletion</p>
          <button @click="cancelDelete" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          Are you sure you want to delete this activity? This action cannot be undone.
        </section>
        <footer class="modal-card-foot">
          <button @click="confirmDeleteAction" class="button is-danger">Delete</button>
          <button @click="cancelDelete" class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Activity } from '../models/activity'

interface Props {
  activities: Activity[];
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true
})
const { activities, showActions } = props
const emit = defineEmits<{
  (e: 'edit', id: number): void;
  (e: 'delete', id: number): void;
}>()

const showDeleteModal = ref(false)
const activityToDelete = ref<number | null>(null)

const confirmDelete = (id: number) => {
  activityToDelete.value = id
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  activityToDelete.value = null
}

const confirmDeleteAction = () => {
  if (activityToDelete.value !== null) {
    emit('delete', activityToDelete.value)
    showDeleteModal.value = false
    activityToDelete.value = null
  }
}

const formatDate = (dateString:  string | Date): string => {
  const dateObj = typeof dateString === 'string' ? new Date(dateString) : dateString
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric',timeZone:'UTC' }
  return dateObj.toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.my-4 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>