import { ref } from 'vue'
import * as myFetch from './myFetch'
import {login , type User} from './user'


export function api<T>(
  action: string,
  data?: any,
  method?: string,
  headers?: HeadersInit,
): Promise<T> {
  return myFetch.api<T>(action, data, method, headers)
}

const session = ref({
  user: null as User | null,
  token: null as string | null,
})

export function useSession() {
return session
}

export const isAdmin = () => session.value.user?.role === 'admin'
export const isLoggedIn = () => session.value.user !== null


export function loginFunction({username, password } :{username : string, password : string}) {
  return login({username, password}).then((user) => {
    session.value.user = user
    return user
  })
}
export function logout() {
  console.log(session.value.user)
  session.value.user = null
  session.value.token = null
}
