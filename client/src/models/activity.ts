import type { DataListEnvelope } from './dataEnvelopes'
import { api } from './myFetch'

export interface Activity {
  id: number;
  userId: number;
  username?:string;
  type: string;
  distance: number;
  duration: number; 
  date: Date | string;
  location: String | Location;
}

export function getAll(): Promise<DataListEnvelope<Activity>> {
  return api('activity')
}

export function get(id: number): Promise<DataListEnvelope<Activity>> {
  return api(`activity/stats/${id}`)
}

export function update(activity: Activity) {
  return api<Activity>(`activity/${activity.id}`, activity, 'PATCH')
}

export function create(activity: Activity) {
  return api<Activity>('activity', activity, 'POST')
}

export function remove(id: number){
  return api<Activity>(`activity/${id}`, undefined, 'DELETE')
}