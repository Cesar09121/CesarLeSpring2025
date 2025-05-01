import {api} from './session'
import type { DataListEnvelope } from './dataEnvelopes'


export interface User {
  userId: number;
  username: string;
  name: string;
  password: string;
  email: string;
  admin: boolean;
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





