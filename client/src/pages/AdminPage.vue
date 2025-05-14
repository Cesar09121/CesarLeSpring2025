<template>
  <div class="admin">
    <h1 class="title">User Management</h1>
    
    <div v-if="users.items && users.items.length > 0">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users.items" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <div class="buttons">
                <button class="button is-info is-small" @click="editUser(user)">Edit</button>
                <button 
                  class="button is-danger is-small" 
                  @click="deleteUser(user.id)"
                  v-if="isAdmin()"
                >Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="showForm && editingUser" class="box edit-form mt-4">
      <h2 class="subtitle">Edit User</h2>
      <form @submit.prevent="submitUpdate">
        <div class="field">
          <label class="label">Full Name</label>
          <div class="control">
            <input class="input" type="text" v-model="editingUser.name" required>
          </div>
        </div>
        
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-right">
            <input 
              class="input" 
              :type="showPassword ? 'text' : 'password'" 
              v-model="editingUser.password" 
              placeholder="Leave blank to keep current password"
            >
            <span class="icon is-right is-clickable" @click="showPassword = !showPassword">
              <i class="fas" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
            </span>
          </div>
          <p class="help">Enter a new password or leave blank to keep the current one</p>
        </div>
        
        <div class="field is-grouped">
          <div class="control">
            <button type="submit" class="button is-link">Save</button>
          </div>
          <div class="control">
            <button type="button" class="button" @click="showForm = false">Cancel</button>
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
import { isAdmin } from '@/models/session'

const users = ref({} as DataListEnvelope<User>)
const editingUser = ref<User | null>(null)
const showForm = ref(false)
const showPassword = ref(false)

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
  console.log('Original user to edit:', user)

  editingUser.value = {
    ...JSON.parse(JSON.stringify(user)),
    password: ''
  }
  
  console.log('Prepared user for editing:', editingUser.value)
  showForm.value = true
}

async function updateUser() {
  if (!editingUser.value) return
  
  console.log('User before update:', editingUser.value)
  
  try {
    const updateData: Partial<User> = {
      id: editingUser.value.id,
      name: editingUser.value.name
    }
    
    if (editingUser.value.password && editingUser.value.password.trim()) {
      updateData.password = editingUser.value.password.trim()
    }
    
    console.log('Sending update with data:', updateData)
    
    await update(updateData as User)
    await fetchUsers()
    if (users.value && users.value.items) {
      const userIndex = users.value.items.findIndex(u => u.id === editingUser.value?.id)
      if (userIndex !== -1) {
        users.value.items[userIndex].name = editingUser.value.name
      }
    }
    
    showForm.value = false
    editingUser.value = null
    
  } catch (error) {
    console.error('Error updating user:', error)
    alert('Failed to update user. Please try again.')
  }
}

async function submitUpdate() {
  await updateUser()
}

async function deleteUser(id: number) {
  if(!isAdmin()) {
    alert('You do not have permission to delete users.')
    return
  } 
  
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const response = await remove(id)
      console.log('User deleted:', response)
      await fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Failed to delete user')
    }
  }
}
</script>

<style scoped>
.edit-form {
  max-width: 500px;
  margin: 0 auto;
}

.is-clickable {
  cursor: pointer;
}
</style>