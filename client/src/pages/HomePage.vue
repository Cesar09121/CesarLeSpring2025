<template>
  <h1 class="title is-3">Your Activity</h1>
  <div>
    <button class="button is-primary" @click="form = true">Add New Activity</button>
    <div v-if="form" class="modal is-active">
      <div class="modal-background" @click="form = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">New Activity</p>
          <button class="delete" aria-label="close" @click="form = false"></button>
        </header>
        <section class="modal-card-body">
          <PostForm @cancel="form = false" />
        </section>
      </div>
    </div>

    <div>
      <ul>
        <li v-for="(post, index) in posts.items" :key="index">
          <div class="box">
            <article class="media">
              <div class="media-left">
                <figure class="image is-64x64 is-square">
                </figure>
              </div>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ post.username }}</strong>
                    &nbsp; <small>@{{ post.email }}</small> &nbsp;
                    <small>{{ post.date }}</small>
                  </p>
                  <h4>{{ post.title }}</h4>
                  <div class="post-details">
                    <div>
                      <p>EXERCISE TYPE</p>
                      <h1>{{ post.type }}</h1>
                    </div>
                    <div>
                      <p>DURATION</p>
                      <h1>{{ post.duration }} minutes</h1>
                    </div>
                    <div v-if="post.date">
                      <p>DATE</p>
                      <h1>{{ post.date }}</h1>
                    </div>
                    <div v-if="post.location">
                      <p>LOCATION</p>
                      <h1>{{ post.location }}</h1>
                    </div>
                    <div v-if="post.distance">
                      <p>DISTANCE</p>
                      <h1>{{ post.distance }} meters</h1>
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
                      <a class="level-item" aria-label="delete" @click="deletePost(post.postId)">
                        <span class="icon is-small">
                          <i class="fas fa-trash" aria-hidden="true"></i>
                        </span>
                      </a>
                    </div>
                  </nav>
                </div>
              </div>
            </article>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type DataListEnvelope } from '@/models/dataEnvelopes'
import { get, remove, type Post } from '@/models/posts'
import { isLoggedIn, useSession } from '@/models/session'
import PostForm from '@/components/StaticsticPost.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const form = ref(false)
const posts = ref({} as DataListEnvelope<Post>)
const session = useSession()

if (session.value.user) {
  get(session.value.user.userId).then((response) => {
    posts.value = response
  })
}

async function deletePost(postId: number) {
  const response = await remove(postId)
  posts.value?.items.splice(
    posts.value.items.findIndex((post) => post.postId === postId),
    1,
  )
}
</script>

<style scoped>
.mt-4 {
  margin-top: 1.5rem;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
</style>
