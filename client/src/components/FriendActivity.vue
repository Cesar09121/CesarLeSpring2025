<template>
  <div class="box">
    <div class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <span class="icon is-large">
            <i class="fas fa-user-circle fa-2x"></i>
          </span>
        </figure>
      </div>
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{ userName }}</strong>
            <small class="ml-2">{{ formatDate(activity.date) }}</small>
            <br>
            Completed a {{ activity.type.toLowerCase() }} for
            <strong>{{ activity.distance }} {{ activity.distanceUnit }}</strong>
            in <strong>{{ activity.duration }} minutes</strong>.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../models/user'
import { Activity } from '../models/activity'

interface Props {
  activity: Activity;
}

const props = defineProps<Props>()
const { getUserById } = useAuth()

const userName = computed((): string => {
  const user = getUserById(props.activity.userId)
  return user ? user.name : 'Unknown User'
})

const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  }
  console.log(dateObj.toLocaleDateString(undefined, options))
  return dateObj.toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.ml-2 {
  margin-left: 0.5rem;
}
</style>