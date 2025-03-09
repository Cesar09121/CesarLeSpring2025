<template>
  <div>
    <div v-if="users.length > 0">
      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td>
              <span
                class="tag"
                :class="user.role === 'admin' ? 'is-danger' : 'is-info'"
              >
                {{ user.role }}
              </span>
            </td>
            <td>
              <div class="buttons are-small">
                <button
                  @click="$emit('edit', user.id)"
                  class="button is-link"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(user)"
                  class="button is-danger"
                  :disabled="user.id === currentUserId"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="has-text-centered my-4">No users found.</p>
    
    <div class="modal" :class="{ 'is-active': showDeleteModal }">
      <div class="modal-background" @click="closeDeleteModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Confirm Delete</p>
          <button class="delete" aria-label="close" @click="closeDeleteModal"></button>
        </header>
        <section class="modal-card-body">
          Are you sure you want to delete this user <strong>{{ userToDelete?.username }}</strong>?
          This will also delete all of their activities. This action cannot be undone.
        </section>
        <footer class="modal-card-foot">
          <button @click="deleteUser" class="button is-danger">Delete</button>
          <button @click="closeDeleteModal" class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth, PublicUser } from '../models/user'

interface Props {
  users: PublicUser[];
}

const props = defineProps<Props>()
  const { users } = props
const emit = defineEmits<{
  (e: 'edit', id: number): void;
  (e: 'delete', id: number): void;
}>()

const { currentUser } = useAuth()
const currentUserId = computed(() => currentUser.value?.id)

const showDeleteModal = ref(false)
const userToDelete = ref<PublicUser | null>(null)

const confirmDelete = (user: PublicUser) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const deleteUser = () => {
  if (userToDelete.value) {
    emit('delete', userToDelete.value.id)
    closeDeleteModal()
  }
}
</script>

<style scoped>
.my-4 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>