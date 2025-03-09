<template>
  <div id="app">
    <Navbar v-if="isLoggedIn" />
    <div class="container is-fluid mt-4">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { useAuth } from './models/user'

const { isLoggedIn } = useAuth()
</script>

<style>
.mt-4 {
  margin-top: 1.5rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
</style>