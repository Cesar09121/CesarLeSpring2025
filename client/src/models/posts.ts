import type { DataListEnvelope } from './dataEnvelopes'
import { api } from './session'

export interface Post {
  title: string
  postId: number
  userId: number
  username: string
  type: string
  duration: number
  date: string
  distance: number
  location: string
  email: string
}

export function get(id: number): Promise<DataListEnvelope<Post>> {
  return api(`posts/${id}`)
}

export function getAll(): Promise<DataListEnvelope<Post>> {
  return api('posts')
}

export function create(data: Post) {
  return api<Post>('posts', data)
}

export function remove(postId: number) {
  return api<Post>(`posts/${postId}`, undefined, 'DELETE')
}