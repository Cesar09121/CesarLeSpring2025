import type { DataListEnvelope } from './dataEnvelopes'
import { api } from './myFetch'



  export interface Activity {
    id: number;
    userId: number;
    type: string;
    distance: number;
    duration: number; 
    date: Date | string;
    location: String | Location;
  }



export function getAll(): Promise<DataListEnvelope<Activity>> {
  return api('activity')
}

export function get(userId: number): Promise<DataListEnvelope<Activity>> {
  return api(`activity/${userId}`)
}

export function update(data: Activity) {
  return api<Activity>(`activity/${data.userId}`, data, 'PATCH')
}

export function create(data: Activity) {
  return api<Activity>('activity', data, 'POST')
}


  
