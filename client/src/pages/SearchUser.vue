<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DataListEnvelope } from '@/models/dataEnvelopes'
import { api } from '@/models/session'
import type { User } from '@/models/user'

const users = ref({} as DataListEnvelope<User>)
const user = ref<string | null>(null)
const isLoading = ref(false)

async function loadUsers() {
  try {
    isLoading.value = true
    const response = await api<DataListEnvelope<User>>('users', null, 'GET')
    users.value = response
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

loadUsers()
async function searchUsers(query: string) {
  if (!query || query.length < 2) return
  
  try {
    isLoading.value = true
    const response = await api<DataListEnvelope<User>>(`users/search?query=${encodeURIComponent(query)}`, null, 'GET')
    users.value = response
  } catch (error) {
    console.error('Error searching users:', error)
  } finally {
    isLoading.value = false
  }
}
const selectedUser = computed(
  () => users.value.items?.find((u) => u.username === user.value) ?? null,
)

</script>

<template>
  <div class="search-page">
    <section class="odocs-spaced">
      <o-field label="Search for Users">
        <o-autocomplete
          v-model="user"
          :options="users.items?.map((user) => user.username) || []"
          :loading="isLoading"
          rounded
          expanded
          placeholder="Type username to search..."
          icon="search"
          clearable
          open-on-focus
          @typing="searchUsers"
        >
        </o-autocomplete>

        <div v-if="selectedUser" class="user-details">
          <p><b>Selected User:</b></p>
          <ul>
            <li><b>Username:</b> {{ selectedUser.username }}</li>
            <li><b>Email:</b> {{ selectedUser.email }}</li>
            <li v-if="selectedUser.name || selectedUser.name">
              <b>Name:</b> 
              {{ selectedUser.name ? 
                 `${selectedUser.name}` : 
                 selectedUser.name }}
            </li>
          </ul>
          <div class="mt-3">
          </div>
        </div>
        <div v-else class="mt-3">
          <p><b>No user selected.</b></p>
        </div>
      </o-field>
    </section>
  </div>
</template>

<style scoped>
o-field,
.odocs-spaced {
  width: auto;
  display: flex;
  flex-wrap: wrap;
}

.search-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
}

input[type='text'] {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.user-details {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f0f0f0;
  width: 100%;
}

.mt-3 {
  margin-top: 1rem;
  width: 100%;
}

ul {
  list-style: none;
  padding-left: 0;
}

ul li {
  margin-bottom: 0.5rem;
}
</style>