<script setup lang="ts">
import type { DataListEnvelope } from '@/models/dataEnvelopes'
import { getAll, type Post } from '@/models/posts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ref } from 'vue'

dayjs.extend(relativeTime)

const posts = ref<DataListEnvelope<Post>>({ 
  items: [], 
  total: 0,
  skip: 0,
  limit: 0
})
const loading = ref(true)
const error = ref('')

console.log('FriendActivityPage component initializing')

getAll()
  .then((response) => {
    console.log('API response:', response)
    posts.value = response
    console.log('Posts loaded:', posts.value.items?.length || 0)
    loading.value = false
  })
  .catch((err) => {
    console.error('Error fetching posts:', err)
    error.value = 'Failed to load activities: ' + (err.message || 'Unknown error')
    loading.value = false
  })

function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Unknown date'
  const date = dayjs(dateString)
  return date.isValid() ? date.fromNow() : dateString
}
</script>

<template>
  <div>
    <h1 class="title is-3">All Activities</h1>
    <div v-if="loading" class="has-text-centered my-4">
      <p>Loading activities...</p>
      <progress class="progress is-primary" max="100"></progress>
    </div>
    <div v-else-if="error" class="notification is-danger">
      <p><strong>Error:</strong> {{ error }}</p>
      <p class="is-size-7">Check browser console for more details.</p>
    </div>
    <div v-else-if="!posts.items || posts.items.length === 0" class="notification is-info">
      <p>No activities found.</p>
    </div>
    <ul v-else>
      <li v-for="(post, index) in posts.items" :key="index">
        <div class="box">
          <article class="media">
            <div class="media-left">
              <figure class="image is-64x64 is-square">
                <div class="has-background-primary has-text-white is-flex is-align-items-center is-justify-content-center" style="width: 100%; height: 100%;">
                  {{ post.username ? post.username.charAt(0).toUpperCase() : 'U' }}
                </div>
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{ post.username }}</strong>
                  &nbsp; <small>@{{ post.email }}</small> &nbsp;
                  <small>{{ formatDate(post.date) }}</small>
                  <br />
                </p>
                <h4 v-if="post.title">{{ post.title }}</h4>
                <div class="post-details">
                  <div>
                    <p>EXERCISE</p>
                    <h1>{{ post.type || 'N/A' }}</h1>
                  </div>
                  <div>
                    <p>DISTANCE</p>
                    <h1>{{ post.distance || 0 }} km</h1>
                  </div>
                  <div>
                    <p>DURATION</p>
                    <h1>{{ post.duration || 0 }} minutes</h1>
                  </div>
                  <div v-if="post.location">
                    <p>LOCATION</p>
                    <h1>{{ post.location }}</h1>
                  </div>
                </div>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <a class="level-item" aria-label="reply">
                    <span class="icon is-small">
                      <i class="fas fa-reply" aria-hidden="true"></i>
                    </span>
                  </a>
                  <a class="level-item" aria-label="retweet">
                    <span class="icon is-small">
                      <i class="fas fa-retweet" aria-hidden="true"></i>
                    </span>
                  </a>
                  <a class="level-item" aria-label="like">
                    <span class="icon is-small">
                      <i class="fas fa-heart" aria-hidden="true"></i>
                    </span>
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.has-text-grey-light {
  text-decoration: line-through;
}
.box {
  margin-bottom: 1rem;
}
.button.is-center {
  display: block;
  width: 200px;
}
.post-details h1 {
  margin-top: 0;
}
.post-details p {
  margin-bottom: 3px;
}
.post-details {
  text-align: center;
}

.post-details div {
  margin-right: 20px;
}

.post-details {
  display: flex;
  align-items: center;
  gap: 10px;
}

.image.is-64x64.is-square {
  overflow: hidden;
}

.is-flex {
  display: flex;
}

.is-align-items-center {
  align-items: center;
}

.is-justify-content-center {
  justify-content: center;
}

.has-background-primary {
  background-color: #209cee;
}

.has-text-white {
  color: white;
}

.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>