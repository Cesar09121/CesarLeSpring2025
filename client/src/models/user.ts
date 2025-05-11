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
export function update(data: User): Promise<User> {
  return api<User>(`users/${data.userId}`, 'PATCH');
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




