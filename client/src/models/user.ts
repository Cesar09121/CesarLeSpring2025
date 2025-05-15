import {api, LoginResponse} from './session'
import type { DataListEnvelope } from './dataEnvelopes'


export interface User {
  userId: number;
  username: string;
  name: string;
  password: string;
  email: string;
  role: string;
  id: number
}

export function getAll(): Promise<DataListEnvelope<User>> {
  return api('users');
}

export function get(userId: number): Promise<User> {
  return api(`users/${userId}`);
}
export function update(user: User): Promise<User> {
  const id = user.id || user.userId;
  return api<User>(`users/${id}`, user,'PATCH');
}
export function create(data: User) {
  return api<User>('users', data)
}
export function remove(userId: number): Promise<void> {
  return api(`users/${userId}`, {}, 'DELETE');
}
export function login({username, password } :{username : string, password : string}) {
  return api<LoginResponse>('auth/login', {username, password })
}
export function search(query: string, limit = 10, offset = 0) {
  return api<DataListEnvelope<User>>(`users/search/${query}?offset=${offset}&limit=${limit}`)
}




