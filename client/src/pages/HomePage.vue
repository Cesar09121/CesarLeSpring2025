<template>
  <h1 class="title is-3">All Posts</h1>
  <Post @activity-added="refreshPost" />

  <div>
    <div v-if="loading" class="has-text-centered">
      <progress class="progress is-primary" max="100"></progress>
    </div>
    
    <div v-else-if="error" class="notification is-danger">
      {{ error }}
    </div>
    
    <div v-else-if="!posts.items || posts.items.length === 0" class="notification is-info">
      No activities found.
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
                <h4>{{ post.title }}</h4>
                <div class="post-details">
                  <div>
                    <p>EXERCISE</p>
                    <h1>{{ post.type }}</h1>
                  </div>
                  <div>
                    <p>DISTANCE</p>
                    <h1>{{ post.distance }} km</h1>
                  </div>
                  <div>
                    <p>DURATION</p>
                    <h1>{{ post.duration }} minutes</h1>
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

<script setup lang="ts">
import type { DataListEnvelope } from '@/models/dataEnvelopes'
import { getAll as getAllPost, type Post } from '@/models/posts'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
import { ref } from 'vue'

dayjs.extend(realTime)

const posts = ref({} as DataListEnvelope<Post>)
const loading = ref(true)
const error = ref('')

getAllPost()
  .then((response) => {
    posts.value = response
    loading.value = false
  })
  .catch((err) => {
    console.error('Error fetching posts:', err)
    error.value = 'Failed to load activities. Please try again.'
    loading.value = false
  })

const allPost = ref({ items: [] } as unknown as {items: Post[], total: number})
const loadingPost = ref(true)
const activitiesError = ref('')

getAllPost()
  .then((response) => {
    allPost.value = response
    console.log('All posts loaded:', allPost.value)
    loadingPost.value = false
  })
  .catch((err) => {
    console.error("Error loading all posts:", err)
    activitiesError.value = "Failed to load all posts. Please try again."
    loadingPost.value = false
  })

function formatDate(dateString: string | undefined) {
  if (!dateString) return 'N/A'
  const date = dayjs(dateString)
  return date.isValid() ? date.format('MMM D, YYYY') : dateString
}
function refreshPost() {
  loadingPost.value = true
  getAllPost()
    .then((response) => {
      allPost.value = response
      loadingPost.value = false
    })
    .catch((err) => {
      console.error("Error loading all posts:", err)
      error.value = "Failed to load all activities. Please try again."
      loadingPost.value = false
    })
}
</script>

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
</style>