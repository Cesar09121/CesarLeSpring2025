<template>
  <main class="container">
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="box">
          <h1 class="title">Login</h1>
          <form @submit.prevent="loginSubmit()">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  placeholder="Username"
                  v-model="newUser.username"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  class="input"
                  type="password"
                  placeholder="Password"
                  v-model="newUser.password"
                />
              </div>
            </div>

            <div class="field">
              <button class="button is-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { DataListEnvelope } from '@/models/dataEnvelopes'
import { login } from '@/models/session'
import { getAll, type User } from '@/models/user'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
import { ref } from 'vue'

dayjs.extend(realTime)

const users = ref({} as DataListEnvelope<User>)

const newUser = ref<Partial<User>>({
  username: '',
  password: '',
})

getAll().then((response) => {
  users.value = response
})

async function changeUser() {
  const user = users.value.items.find((user) => user.username === newUser.value.username)
  if (user && user.password === newUser.value.password) {
    login(user.userId)
  }
}
async function loginSubmit() {
  await changeUser()
}
</script>