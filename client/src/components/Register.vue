<template>
    <div class="columns is-centered">
      <div class="column is-full">
        <form @submit.prevent="handleRegister">
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="form.username"
                placeholder="Enter your username"
                required
              >
            </div>
          </div>
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                v-model="form.name"
                placeholder="Enter your name"
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
                v-model="form.password"
                placeholder="Enter your password"
                required
              >
              <p class="help">Password must be at least 8 characters long</p>
            </div>
          </div>
          <div class="field">
            <label class="label">Confirm Password</label>
            <div class="control">
              <input
                class="input"
                type="password"
                v-model="form.confirmPassword"
                placeholder="Confirm your password"
                required
              >
            </div>
          </div>
          <div v-if="error" class="notification is-danger">
            {{ error }}
          </div>
          <div v-if="success" class="notification is-success">
            {{ success }}
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-primary is-fullwidth" :disabled="isLoading">
                {{ isLoading ? 'Registering...' : 'Register' }}
              </button>
            </div>
          </div>
          <div class="has-text-centered mt-4">
            <button
              type="button"
              class="button is-link is-light"
              @click="navigateToLogin"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuth } from '../models/user'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const { register } = useAuth()
  
  const form = ref({
    username: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const error = ref('')
  const success = ref('')
  const isLoading = ref(false)
  
  const validateForm = () => {
    // Check if passwords match
    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'Passwords do not match'
      return false
    }
    
    // Check password strength
    if (form.value.password.length < 8) {
      error.value = 'Password must be at least 8 characters long'
      return false
    }
    
    // Check username length
    if (form.value.username.length < 3) {
      error.value = 'Username must be at least 3 characters long'
      return false
    }
    
    return true
  }
  
  const handleRegister = async () => {
    // Reset error/success messages
    error.value = ''
    success.value = ''
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    isLoading.value = true
    
    try {
      await register({
        username: form.value.username,
        password: form.value.password,
        name: form.value.name,
        role: 'user', // Default role for new users
        friends: []
      })
      
      success.value = 'Registration successful! You can now log in.'
      form.value = { username: '', password: '', confirmPassword: '', name: '' }
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigateToLogin()
      }, 2000)
    } catch (err: any) {
      error.value = err.message || 'An error occurred during registration'
    } finally {
      isLoading.value = false
    }
  }
  
  const navigateToLogin = () => {
    router.push('/login')
  }
  </script>
  
  <style scoped>
  .mt-4 {
    margin-top: 1rem;
  }
  </style>