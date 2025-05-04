<!-- LoginForm.vue -->
<template>
  <!-- Logged in state -->
  <div class="navbar-item has-dropdown is-hoverable" v-if="isLoggedIn()">
    <a class="navbar-link">
      <span class="icon is-small mr-1">
        <i class="fas fa-user-circle"></i>
      </span>
      {{ session?.user?.username }}
    </a>
    
    <div class="navbar-dropdown is-right">
      <RouterLink to="/dashboard" class="navbar-item">
        <span class="icon is-small mr-2">
          <i class="fas fa-dumbbell"></i>
        </span>
        My Activity
      </RouterLink>
      <hr class="navbar-divider">
      <a @click="logout()" class="navbar-item has-text-danger">
        <span class="icon is-small mr-2">
          <i class="fas fa-sign-out-alt"></i>
        </span>
        Logout
      </a>
    </div>
  </div>

  <!-- Admin access - only show if logged in and is admin -->
  <div class="navbar-item" v-if="isLoggedIn() && isAdmin()">
    <RouterLink to="/admin" class="button is-light is-small">
      <span class="icon is-small">
        <i class="fas fa-shield-alt"></i>
      </span>
      <span>Admin</span>
    </RouterLink>
  </div>
  
  <!-- Logged out state -->
  <template v-if="!isLoggedIn()">
    <div class="navbar-item">
      <div class="buttons">
        <RouterLink to="/register" class="button is-primary is-small">
          <span class="icon is-small">
            <i class="fas fa-user-plus"></i>
          </span>
          <span>Sign up</span>
        </RouterLink>
        
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="button is-light is-small navbar-link">
            <span>Login</span>
            <span class="icon is-small ml-1">
              <i class="fas fa-angle-down"></i>
            </span>
          </a>
          
          <div class="navbar-dropdown is-right">
            <p class="navbar-item is-size-7 has-text-grey">
              Quick Login
            </p>
            <template v-for="user in users" :key="user.userId">
              <a class="navbar-item" @click="loginFunction(user)">
                <span class="icon is-small mr-2">
                  <i class="fas fa-user"></i>
                </span>
                {{ user.username }}
              </a>
            </template>
            <hr class="navbar-divider">
            <RouterLink to="/login" class="navbar-item">
              <span class="icon is-small mr-2">
                <i class="fas fa-key"></i>
              </span>
              Login with password
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { isAdmin, isLoggedIn, loginFunction, logout, useSession } from '@/models/session'
import { getAll, type User } from '@/models/user'

const users = ref<User[]>([])
const session = useSession()

onMounted(() => {
  // Fetch users for quick login dropdown
  getAll().then((response) => {
    users.value = response.items
  })
})
</script>

<style scoped>
.mr-1 {
  margin-right: 0.25rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.ml-1 {
  margin-left: 0.25rem;
}

/* Ensure dropdown menus don't get cut off */
.navbar-dropdown {
  min-width: 200px;
}

/* Make buttons more compact in navbar */
.button.is-small {
  height: 2.2rem;
}

/* Fix icon alignment */
.icon.is-small {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Smooth transitions */
.button, .navbar-item {
  transition: background-color 0.2s ease;
}
</style>