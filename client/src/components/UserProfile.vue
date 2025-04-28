<template>
  <div class="box">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <figure class="image is-96x96">
            <div class="has-background-grey-lighter is-rounded has-text-centered" style="width: 96px; height: 96px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span class="icon is-large">
                <i class="fas fa-user fa-3x"></i>
              </span>
            </div>
          </figure>
        </div>
        <div class="level-item ml-4">
          <div>
            <p class="title is-4">{{ user?.name }}</p>
            <p class="subtitle is-6">@{{ user?.username }}</p>
            <p class="tag" :class="user?.role === 'admin' ? 'is-danger' : 'is-info'">
              {{ user?.role }}
            </p>
          </div>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <button class="button is-primary" @click="isEditing = true">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="stats" class="mt-4">
      <hr>
      <h3 class="title is-5">Activity Summary</h3>
      <div class="columns">
        <div class="column is-one-third">
          <div class="has-text-centered">
            <p class="heading">Total Activities</p>
            <p class="title is-4">{{ stats.totalActivities }}</p>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="has-text-centered">
            <p class="heading">Total Distance</p>
            <p class="title is-4">{{ stats.totalDistance }} mi</p>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="has-text-centered">
            <p class="heading">Total Duration</p>
            <p class="title is-4">{{ formatDuration(stats.totalDuration) }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal" :class="{ 'is-active': isEditing }">
      <div class="modal-background" @click="cancelEdit"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Profile</p>
          <button @click="cancelEdit" class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <form @submit.prevent="updateProfile">
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
              <label class="label">Username</label>
              <div class="control">
                <input
                  class="input"
                  type="text"
                  v-model="form.username"
                  placeholder="Enter username"
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
                  placeholder="Leave blank to keep current password"
                >
              </div>
              <p class="help">Only fill this if you want to change your password</p>
            </div>
            <div class="field is-grouped mt-4">
              <div class="control is-expanded">
                <button type="submit" class="button is-primary is-fullwidth" :disabled="isLoading">
                  {{ isLoading ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
              <div class="control">
                <button type="button" @click="cancelEdit" class="button is-light">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth, User } from '../models/user'
import { useActivities } from '../models/activity'

interface Props {
  userId?: number;
  showStats?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  userId: 0,
  showStats: true
})

const { currentUser, getUserById, updateUser } = useAuth()
const { getActivityStats } = useActivities()

const user = computed(() => {
  if (props.userId === 0) {
    return currentUser.value
  }
  return getUserById(props.userId)
})

const stats = computed(() => {
  if (!props.showStats) return null
  return getActivityStats.value
})

const isEditing = ref(false)
const isLoading = ref(false)

interface ProfileForm {
  name: string;
  username: string;
  password: string;
}

const form = ref<ProfileForm>({
  name: '',
  username: '',
  password: ''
})

onMounted(() => {
  if (user.value) {
    form.value.name = user.value.name
    form.value.username = user.value.username
    form.value.password = ''
  }
})

const updateProfile = async () => {
  if (!user.value) return;
  isLoading.value = true;

  try {
    const userData: Partial<User> = {
      name: form.value.name,
      username: form.value.username
    }
    
    if (form.value.password) {
      userData.password = form.value.password
    }
    
    // Use await here to fix the TypeScript error
    const success = await updateUser(user.value.id, userData);
    if (success) {
      isEditing.value = false;
    }
  } catch (error: any) {
    console.error('Error updating profile:', error.message);
    // You might want to add error handling here
  } finally {
    isLoading.value = false;
  }
}

const cancelEdit = () => {
  isEditing.value = false;
  if (user.value) {
    form.value.name = user.value.name;
    form.value.username = user.value.username;
    form.value.password = '';
  }
}

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${minutes} min`;
  } else if (remainingMinutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
}
</script>

<style scoped>
.ml-4 {
  margin-left: 1.5rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
</style>