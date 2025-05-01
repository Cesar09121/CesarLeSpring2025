<template>
  <div class="stats">
    <h1 class="title is-3"><b>Recent Activities</b></h1>

    <div class="box" v-if="isLoggedIn()">
      <div class="activity-item">
        <p>EXERCISE TYPE</p>
        <h1>{{ activity?.type }}</h1>
      </div>
      <div class="activity-item">
        <p>DURATION</p>
        <h1>{{ activity?.duration }} minutes</h1>
      </div>
      <div class="activity-item">
        <p>DATE</p>
        <h1>{{ activity?.date }}</h1>
      </div>
      <div class ="activity-item">
        <p>LOCATION</p>
        <h1>{{ activity?.location }}</h1>
    </div>
    <div class="activity-item">
        <p>DISTANCE</p>
        <h1>{{ activity?.distance }} meters</h1>
      </div>
  </div>
  </div>  
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {get, type Activity} from '@/models/activity'
import { isLoggedIn, useSession } from '@/models/session'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
dayjs.extend(realTime)

const session = useSession()

const activity = ref({}as Activity)
if(session.value.user){
  get(session.value.user.userId).then((response) => {
    activity.value = response.items[0]
  })
}


</script>