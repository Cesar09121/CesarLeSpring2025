<template>
    <div class="box">
      <form @submit.prevent="submitPost">
        <div class="field">
          <label class="label">Title</label>
          <div class="control has-icons-left">
          <input 
            class="input" 
            type="text" 
            v-model="newPost.title" 
            placeholder="Share your thoughts with us" 
            required 
          />
          <span class="icon is-small is-left">
            <i class="fas fa-heading"></i>
          </span>
        </div>
          <label class="label">Activity Type</label>
          <div class="control has-icons-left">
            <input 
              class="input" 
              type="text" 
              v-model="newPost.type" 
              placeholder="Running, Swimming, Cycling, etc." 
              required 
            />
            <span class="icon is-small is-left">
              <i class="fas fa-running"></i>
            </span>
          </div>
        </div>
        
        <div class="field">
          <label class="label">Location</label>
          <div class="control has-icons-left">
            <input 
              class="input" 
              type="text" 
              v-model="newPost.location" 
              placeholder="Gym, Park, Home, etc." 
              required 
            />
            <span class="icon is-small is-left">
              <i class="fas fa-map-marker-alt"></i>
            </span>
          </div>
        </div>
        
        <div class="columns">
          <div class="column">
            <div class="field">
              <label class="label">Duration (minutes)</label>
              <div class="control has-icons-left">
                <input 
                  class="input" 
                  type="number" 
                  v-model="newPost.duration" 
                  min="1" 
                  required 
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-clock"></i>
                </span>
              </div>
            </div>
          </div>
          
          <div class="column">
            <div class="field">
              <label class="label">Date</label>
              <div class="control has-icons-left">
                <input 
                  class="input" 
                  type="date" 
                  v-model="newPost.date" 
                />
                <span class="icon is-small is-left">
                  <i class="fas fa-calendar-alt"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="field">
          <label class="label">Distance (km)</label>
          <div class="control has-icons-left">
            <input 
              class="input" 
              type="number" 
              v-model="newPost.distance" 
              min="0" 
              step="0.01" 
              placeholder="0.00" 
            />
            <span class="icon is-small is-left">
              <i class="fas fa-route"></i>
            </span>
          </div>
        </div>
        
        <div class="field mt-4">
          <div class="control">
            <button 
              class="button is-primary is-fullwidth" 
              type="submit" 
              :class="{ 'is-loading': isSubmitting }"
            >
              <span class="icon">
                <i class="fas fa-plus-circle"></i>
              </span>
              <span>Add Post</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  import realTime from 'dayjs/plugin/relativeTime'
  import { useSession } from '@/models/session'
  import { getAll as getPost,create as createPostApi, type Post } from '@/models/posts'

  
  dayjs.extend(realTime)
  
  const session = useSession()
  const currentUser = session.value.user
  
  const newPost = ref<Partial<Post>>({
    title: '',
    type: '',
    duration: 0,
    distance: 0,
    date: dayjs().format('YYYY-MM-DD'),
    location: ''
  })
  
  const isSubmitting = ref(false)
  
  const recentPost = ref<Post[]>([])
  
  getPost().then((response) => {
    recentPost.value = response.items
  })
  
  async function createPost(post: Post) {
  try {
    const response = await createPostApi(post)
    console.log('Post created:', response)
    return response
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

async function submitPost() {
  if (!currentUser) {
    alert('You must be logged in to create a post.')
    return
  }
  
  isSubmitting.value = true
    const postedPost: Post = {
    title: newPost.value.title || '',
    id: -1,
    userId: currentUser.id,
    username: currentUser.username,
    type: newPost.value.type || '',
    duration: newPost.value.duration || 0,
    date: newPost.value.date ? dayjs(newPost.value.date).toISOString() : dayjs().toISOString(),
    distance: newPost.value.distance || 0,
    location: newPost.value.location || ''
  } 
  console.log('Creating new post:', currentUser.id)
    try {
    await createPost(postedPost)
    newPost.value = {
      title: '',
      type: '',
      duration: 0,
      distance: 0,
      date: dayjs().format('YYYY-MM-DD'),
      location: ''
    }
    
    getPost().then((response) => {
      recentPost.value = response.items
    })
    
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Something went wrong. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
  
  </script>
  
  <style scoped>
  .box {
    margin-bottom: 2rem;
    box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
    border-radius: 6px;
  }
  
  .mt-4 {
    margin-top: 1.5rem;
  }
  
  .mb-4 {
    margin-bottom: 1.5rem;
  }
  
  .input:focus {
    box-shadow: 0 0 0 2px rgba(32, 156, 238, 0.25);
  }
  
  .button, .input {
    transition: all 0.2s ease-in-out;
  }
  
  .icon.is-small {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  </style>