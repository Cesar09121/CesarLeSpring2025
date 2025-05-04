<script setup lang="ts">
import type { DataListEnvelope } from '@/models/dataEnvelopes'
import { getAll, type Post } from '@/models/posts'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
import { ref } from 'vue'

dayjs.extend(realTime)

const posts = ref({} as DataListEnvelope<Post>)

getAll().then((response) => {
  posts.value = response
})
</script>

<template>
  <h1 class="title is-3">All Activities</h1>
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
                    <h1>{{ post.distance }}</h1>
                  </div>
                  <div>
                    <p>DURATION</p>
                    <h1>{{ post.duration }} minutes</h1>
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
</style>