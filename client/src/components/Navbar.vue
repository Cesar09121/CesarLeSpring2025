<template>
  <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        <strong>Fitness Tracker</strong>
      </router-link>
      <a role="button"
         class="navbar-burger"
         :class="{ 'is-active': isActive }"
         aria-label="menu"
         aria-expanded="false"
         @click="toggleMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isActive }">
      <div class="navbar-start">
        <router-link to="/" class="navbar-item">Home</router-link>
        <router-link to="/activities" class="navbar-item">My Activities</router-link>
        <router-link to="/friends" class="navbar-item">Friends</router-link>
        <router-link to="/statistics" class="navbar-item">Stats</router-link>
        <router-link v-if="isAdmin" to="/admin" class="navbar-item">Admin</router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <router-link to="/profile" class="button is-info is-light">
              <span>{{ currentUser?.name }}</span>
            </router-link>
            <button @click="logout" class="button is-light">
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../models/user'

const isActive = ref(false)
const { currentUser, isAdmin, logout } = useAuth()

const toggleMenu = () => {
  isActive.value = !isActive.value
}
</script>