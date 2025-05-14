<template>
  <h1 class="title is-3">All Posts</h1>
  <PostForm @activity-added="refreshPost" />

  <div>
    <div v-if="loadingPost" class="has-text-centered">
      <progress class="progress is-primary" max="100"></progress>
    </div>
    
    <div v-else-if="PostError" class="notification is-danger">
      {{ PostError}}
    </div>
    
    <div v-else-if="!allPost.items || allPost.items.length === 0" class="notification is-info">
      No activities found.
    </div>
    
    <ul v-else>
      <li v-for="(post, index) in allPost.items" :key="index">
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
                  <small class="ml-2">{{ formatDate(post.date) }}</small>
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
                   <button 
                    class="button is-info is-small fixed-width-btn"
                    @click="editPost(post)"
                    v-if="currentUser && (post.userId === currentUser.id || currentUser.role === 'admin')"
                  >
                    <span class="icon is-small">
                      <i class="fas fa-edit" aria-hidden="true"></i>
                    </span>
                    <span>Edit</span>
                  </button>
                   <button 
                  class="button is-danger is-small"
                  @click.prevent="deletePost(post.id)"
                  :disabled="isDeleting === post.id"
                  > 
                 <span class="icon is-small">
                 <i class="fas fa-trash" aria-hidden="true"></i>
                  </span>
                 <span>{{ isDeleting === post.id ? 'Deleting...' : 'Delete' }}</span>
                </button>
                </div>
              </nav>
            </div>
          </article>
        </div>
      </li>
    </ul>
    <div class="modal" :class="{ 'is-active': isEditing }">
      <div class="modal-background" @click="cancelEdit"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Post</p>
          <button class="delete" aria-label="close" @click="cancelEdit"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input class="input" type="text" v-model="editedPost.title" required>
            </div>
          </div>
          
          <div class="field">
            <label class="label">Exercise Type</label>
            <div class="control">
              <input class="input" type="text" v-model="editedPost.type" required>
            </div>
          </div>
          <div class="field">
            <label class="label">Location</label>
            <div class="control">
              <input class="input" type="text" v-model="editedPost.location">
            </div>
          </div>
          
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Duration (minutes)</label>
                <div class="control">
                  <input class="input" type="number" v-model="editedPost.duration" min="1" required>
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Distance (km)</label>
                <div class="control">
                  <input class="input" type="number" v-model="editedPost.distance" min="0" step="0.01" required>
                </div>
              </div>
            </div>
          </div>
          
          <div class="field">
            <label class="label">Date</label>
            <div class="control">
              <input class="input" type="date" v-model="editedPost.date">
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button 
            class="button is-success" 
            @click="savePost" 
            :class="{ 'is-loading': isSaving }"
          >
            Save changes
          </button>
          <button class="button" @click="cancelEdit">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAll as getAllPost,remove as removePost, type Post,update as updatePost } from '@/models/posts'
import dayjs from 'dayjs'
import realTime from 'dayjs/plugin/relativeTime'
import { ref } from 'vue'
import PostForm from '@/components/Post.vue'
import { useSession } from '@/models/session'

dayjs.extend(realTime)
const session = useSession()
const currentUser = session.value.user


const allPost = ref({ items: [] } as unknown as {items: Post[], total: number})
const loadingPost = ref(true)
const PostError = ref('')
const isDeleting = ref<number | null>(null)
const isEditing = ref(false)
const isSaving = ref(false)

getAllPost()
  .then((response) => {
    allPost.value = response
    console.log('All posts loaded:', allPost.value)
    loadingPost.value = false
  })
  .catch((err) => {
    console.error("Error loading all posts:", err)
    PostError.value = "Failed to load all posts. Please try again."
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
      PostError.value = "Failed to load all activities. Please try again."
      loadingPost.value = false
    })
}
const editedPost = ref<Post>({
  id: 0,
  userId: 0,
  username: '',
  date: '',
  title: '',
  type: '',
  duration: 0,
  distance: 0,
  location: ''
})
function editPost(post: Post) {
  editedPost.value ={
    ...post,
   date: post.date ? dayjs(post.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
  }
  isEditing.value = true
}
async function savePost(){
   isSaving.value = true
    const updatedPost = {
      ...editedPost.value,
      date: dayjs(editedPost.value.date).toISOString()
    }
    updatePost(updatedPost)
    .then(() => {
      isEditing.value = false
      refreshPost() 
    })
    .catch(error => {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    })
    .finally(() => {
      isSaving.value = false
    })
}
function cancelEdit() {
  isEditing.value = false
}

async function deletePost(id?: number){
  if (!id){
    console.error('Cannot delete post: ID is undefined')
    return
  }
    const post = allPost.value.items.find(p => p.id === id)
 if (post && currentUser && (post.id === currentUser.id || currentUser.role === 'admin')) {
    if (confirm('Are you sure you want to delete this post?')) {
      isDeleting.value = id
      
      try {
        await removePost(id)
        console.log('Post deleted successfully:', id)
        refreshPost()
      } catch (err) {
        console.error('Error deleting post:', err)
        alert('Failed to delete post. Please try again.')
      } finally {
        isDeleting.value = null
      }
    }
  } else {
    alert('You can only delete your own posts.')
  }
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