<template>
  <div class="container">
    <h1 class="title">Admin Page</h1>
    <table class="table is-fullwidth is-striped">
      <thead>
        <tr>
          <th>Username</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="userItem in users.items" :key="userItem.userId">
          <td>{{ userItem.username }}</td>
          <td>{{ userItem.name }}</td>
          <td>{{ userItem.email }}</td>
          <td>{{ userItem.role === 'admin' ? 'admin' : 'user' }}</td>
          <td>
            <button class="button is-small is-info" @click="editUser(userItem)">Edit</button>
            <button class="button is-small is-danger" @click="deleteUser(userItem.userId)">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="modal-card-body">
      <h2 class="subtitle">Edit User</h2>
      <form @submit.prevent="submitUpdate">
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input class="input" v-model="editingUser.username" type="text" required />
          </div>
        </div>
        <div class="field">
          <label class="label">Full Name</label>
          <div class="control">
            <input class="input" v-model="editingUser.name" type="text" required />
          </div>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input class="input" v-model="editingUser.email" type="email" required />
          </div>
        </div>
        <div class="field">
        </div>
        <div class="field">
          <div class="control">
            <input class="button is-link" type="submit" id="submit" value="Save"></input>
            <button class="button" type="button" @click="showForm = false">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAll, type User, update, remove } from '@/models/user'
import type { DataListEnvelope } from '@/models/dataEnvelopes'

const users = ref({} as DataListEnvelope<User>)
const editingUser = ref({} as User)
const showForm = ref(false)

onMounted(async () => {
  fetchUsers()
})

async function fetchUsers() {
  try {
    users.value = await getAll()
  } catch (err) {
    console.error('Error loading users:', err)
  }
}

function editUser(user: User) {
  editingUser.value = JSON.parse(JSON.stringify(user))
  showForm.value = true
}

async function updateUser() {
  console.log(editingUser)
  if (editingUser) {
    await update(editingUser.value)
    await fetchUsers()
  }
}

async function submitUpdate() {
  await updateUser()
  showForm.value = false
}

async function deleteUser(userId: number) {
  try {
    await remove(userId)
    await fetchUsers()
  } catch (err) {
    console.error('Error deleting user:', err)
  }
}
</script>

<style scoped>
.admin {
  padding-bottom: 2rem;
}
</style>