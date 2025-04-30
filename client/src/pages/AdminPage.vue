<template>
  <div class="admin">
    <h1 class="title">Admin Management</h1>
    
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': activeTab === 'users' }">
          <a @click="activeTab = 'users'">User List</a>
        </li>
        <li :class="{ 'is-active': activeTab === 'stats' }">
          <a @click="activeTab = 'stats'">System Statistics</a>
        </li>
      </ul>
    </div>
 
    <div v-if="activeTab === 'users'">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <h2 class="subtitle">User Management</h2>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <button @click="showAddUserModal = true" class="button is-primary">
              Add User
            </button>
          </div>
        </div>
      </div>
      
  
  <!-- Add this near the start of your user list section -->
  <div v-if="activeTab === 'users'">
    <div v-if="isLoading" class="has-text-centered">
      <p class="is-loading">Loading users...</p>
    </div>
    <div v-else>
      <!-- Your existing UserList component -->
      <UserList 
        :users="allUsers" 
        @edit="editUser" 
        @delete="deleteUser"
      />
    </div>
  </div>

      
      <div class="modal" :class="{ 'is-active': showAddUserModal }">
        <div class="modal-background" @click="closeAddUserModal"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Add New User</p>
            <button class="delete" aria-label="close" @click="closeAddUserModal"></button>
          </header>
          <section class="modal-card-body">
            <UserForm @user-added="onUserAdded" />
          </section>
        </div>
      </div>

      <div class="modal" :class="{ 'is-active': showEditUserModal }">
        <div class="modal-background" @click="closeEditUserModal"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Edit User</p>
            <button class="delete" aria-label="close" @click="closeEditUserModal"></button>
          </header>
          <section class="modal-card-body">
            <UserForm 
              :user="selectedUser" 
              :is-edit="true"
              @user-updated="onUserUpdated"
              @cancel="closeEditUserModal"
            />
          </section>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'stats'">
      <h2 class="subtitle">System Statistics</h2>
      
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Total Users</p>
            <p class="title">{{ allUsers.length }}</p>
          </div>
        </div>
        
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Admin Users</p>
            <p class="title">{{ adminUsersCount }}</p>
          </div>
        </div>
        
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Total Activities</p>
            <p class="title">{{ totalActivitiesCount }}</p>
          </div>
        </div>
        
        <div class="column is-3">
          <div class="box has-text-centered">
            <p class="heading">Avg. Activities/User</p>
            <p class="title">{{ avgActivitiesPerUser }}</p>
          </div>
        </div>
      </div>
      
      <div class="box">
        <h3 class="title is-5">Activity Distribution</h3>
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Username</th>
              <th>Activities</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in allUsers" :key="user.id">
              <td>{{ user.username }}</td>
              <td>{{ getUserActivitiesCount(user) }}</td>
              <td>
                <progress
                  class="progress is-primary"
                  :value="getUserActivitiesCount(user)"
                  :max="totalActivitiesCount || 1"
                ></progress>
                {{ calcActivityPercentage(user) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth, PublicUser, ROLES } from '../models/user'
import { useActivities } from '../models/activity'
import UserForm from '../components/UserForm.vue'
import UserList from '../components/UserList.vue'
import { onMounted } from 'vue'

const activeTab = ref('users')
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const selectedUserId = ref<number | null>(null)
  const isLoading = ref(true)

const { getAllUsers, getUserById, deleteUser: removeUser } = useAuth()
const { getUserActivities } = useActivities()

const allUsers = ref<PublicUser[]>([])

 



const fetchUsers = async () => {
  try {
    isLoading.value = true
    const users = await getAllUsers()
    allUsers.value = Array.isArray(users) ? users : users.items
    console.log('Users loaded:', allUsers.value)
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const onUserAdded = () => {
  closeAddUserModal()
  fetchUsers() 
}

const onUserUpdated = () => {
  closeEditUserModal()
  fetchUsers() 
}

const deleteUser = async (id: number) => {
  await removeUser(id)
  fetchUsers() 
}

const selectedUser = computed(() => {
  if (selectedUserId.value === null) return null
  return getUserById(selectedUserId.value)
})

const editUser = (id: number) => {
  selectedUserId.value = id
  showEditUserModal.value = true
}



const closeAddUserModal = () => {
  showAddUserModal.value = false
}

const closeEditUserModal = () => {
  showEditUserModal.value = false
  selectedUserId.value = null
}



const adminUsersCount = computed(() => {
  return allUsers.value.filter(user => user.role === ROLES.ADMIN).length
})

const getUserActivitiesById = (userId: number) => {
  return getUserActivities.value.filter(activity => activity.userId === userId)
}

const getUserActivitiesCount = (user: PublicUser) => {
  return getUserActivitiesById(user.id).length
}

const totalActivitiesCount = computed(() => {
  return allUsers.value.reduce((total, user) => {
    return total + getUserActivitiesCount(user)
  }, 0)
})

const avgActivitiesPerUser = computed(() => {
  if (allUsers.value.length === 0) return "0"
  const avg = totalActivitiesCount.value / allUsers.value.length
  return avg.toFixed(1)
})

const calcActivityPercentage = (user: PublicUser) => {
  if (totalActivitiesCount.value === 0) return 0
  const userActivities = getUserActivitiesCount(user)
  return Math.round((userActivities / totalActivitiesCount.value) * 100)
}
</script>

<style scoped>
.admin {
  padding-bottom: 2rem;
}
</style>