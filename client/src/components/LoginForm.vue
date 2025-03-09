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
        <button class="button is-primary is-fullwidth">
          Log in
        </button>
      </div>
    </div>
    <div class="has-text-centered mt-4">
      <button type="button" class="button is-text is-small" @click="showCredentials = !showCredentials">
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

const handleLogin = () => {
  const success = login(username.value, password.value)
  
  if (success) {
    router.push('/')
  } else {
    error.value = 'Invalid username or password'
    setTimeout(() => {
      error.value = ''
    }, 3000)
  }
}
</script>

<style scoped>
.mt-2 {
  margin-top: 0.5rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
</style>