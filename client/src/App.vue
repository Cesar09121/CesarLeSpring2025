<template>
  <div id="app">
    <Navbar />
    <div class="container is-fluid mt-4">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import { RouterView} from 'vue-router'

</script>

<style>
.mt-4 {
  margin-top: 1.5rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
</style>