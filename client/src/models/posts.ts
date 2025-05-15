import type { DataListEnvelope } from './dataEnvelopes'
import { api } from './session'

export interface Post {
  title: string
  id: number
  userId: number
  username: string
  type: string
  duration: number
  date: string
  distance: number
  location: string
}

export function get(id: number): Promise<DataListEnvelope<Post>> {
  return api(`posts/${id}`)
}

export function getAll(): Promise<DataListEnvelope<Post>> {
  return api('posts')
}

export function create(post: Post) {
  return api<Post>('posts', post)
}
export function remove(id: number) {
  return api<Post>(`posts/${id}`, undefined, 'DELETE')
}
export function update(post: Post) {
  return api<Post>(`posts/${post.id}`, post, 'PATCH')
}
export function search(query: string, limit = 10, offset = 0) {
  return api<DataListEnvelope<Post>>(`posts/search/${query}?offset=${offset}&limit=${limit}`)
}