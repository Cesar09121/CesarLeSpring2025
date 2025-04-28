<template>
  <form @submit.prevent="handleSubmit">
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
      <label class="label">Name</label>
      <div class="control">
        <input
          class="input"
          type="text"
          v-model="form.name"
          placeholder="Enter full name"
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
          :placeholder="isEdit ? 'Leave blank to keep current password' : 'Enter password'"
          :required="!isEdit"
        >
      </div>
    </div>
    <div class="field">
      <label class="label">Role</label>
      <div class="control">
        <div class="select is-fullwidth">
          <select v-model="form.role" required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </div>
    <div class="field is-grouped mt-4">
      <div class="control" :class="{ 'is-expanded': !isEdit }">
        <button type="submit" class="button is-primary" :class="{ 'is-fullwidth': !isEdit }" :disabled="isLoading">
          {{ isLoading ? (isEdit ? 'Updating...' : 'Adding...') : (isEdit ? 'Update User' : 'Add User') }}
        </button>
      </div>
      <div v-if="isEdit" class="control">
        <button type="button" @click="$emit('cancel')" class="button is-light">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth, User, PublicUser } from '../models/user'

interface Props {
  user?: PublicUser | null;
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  isEdit: false
})

const emit = defineEmits<{
  (e: 'user-added'): void;
  (e: 'user-updated'): void;
  (e: 'cancel'): void;
}>()

const { addUser, updateUser } = useAuth()
const isLoading = ref(false)

interface UserForm {
  username: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
}

const form = ref<UserForm>({
  username: '',
  name: '',
  password: '',
  role: 'user'
})

onMounted(() => {
  if (props.user) {
    form.value = {
      username: props.user.username,
      name: props.user.name,
      password: '',
      role: props.user.role as 'user' | 'admin'
    }
  }
})

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    if (props.isEdit && props.user) {
      const userData: Partial<User> = {
        username: form.value.username,
        name: form.value.name,
        role: form.value.role
      }
      
      if (form.value.password) {
        userData.password = form.value.password
      }
      
      // Use await here
      const success = await updateUser(props.user.id, userData)
      if (success) {
        emit('user-updated')
      }
    } else {
      // Use await here
      const success = await addUser({
        username: form.value.username,
        name: form.value.name,
        password: form.value.password,
        role: form.value.role,
        friends: []
      })
      
      if (success) {
        form.value = {
          username: '',
          name: '',
          password: '',
          role: 'user'
        }
        emit('user-added')
      }
    }
  } catch (error: any) {
    console.error('Error handling user:', error.message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.mt-4 {
  margin-top: 1.5rem;
}
</style>