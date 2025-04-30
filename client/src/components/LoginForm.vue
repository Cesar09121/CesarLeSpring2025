<template>
  <form @submit.prevent="handleLogin">
    <div class="field">
      <label class="label">Username</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="username"
          placeholder="Enter your username"
          required
        >
      </div>
    </div>
    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input
          class="input"
          type="password"
          v-model="password"
          placeholder="Enter your password"
          required
        >
      </div>
    </div>
    <div v-if="error" class="notification is-danger">
      {{ error }}
    </div>
    <div class="field">
      <div class="control">
        <button class="button is-primary is-fullwidth" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Log in' }}
        </button>
      </div>
    </div>
    <div class="has-text-centered mt-4">
      <button type="button" class="button is-text is-small"
        @click="showCredentials = !showCredentials">
        {{ showCredentials ? 'Hide demo accounts' : 'Show demo accounts' }}
      </button>
      
      <div v-if="showCredentials" class="mt-2">
        <p>
          <strong>Demo accounts:</strong>
        </p>
        <ul class="mt-2">
          <li>Admin: username: cle20, password: cesarle</li>
          <li>User: username: jewpaltz, password: professor</li>
          <li>User: username: jngo, password: johnnyngo</li>
          <li>User: username: thunguyen, password: mabu </li>
        </ul>
      </div>
    </div>
    <div class="has-text-centered mt-4">
      <p class="mb-2">Don't have an account?</p>
      <router-link
        to="/register"
        class="button is-link is-light"
      >
        Register Now
      </router-link>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../models/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login } = useAuth()
const username = ref('')
const password = ref('')
const error = ref('')
const showCredentials = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    const success = await login(username.value, password.value)
   
    if (success) {
      console.log('Login success:', success) 
      router.push('/dashboard') // Changed from '/' to '/dashboard'
    } else {
      error.value = 'Invalid username or password'
      setTimeout(() => {
        error.value = ''
      }, 3000)
    }
  } catch (err) {
    error.value = 'An error occurred during login'
    setTimeout(() => {
      error.value = ''
    }, 3000)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.mt-2 {
  margin-top: 0.5rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
</style>