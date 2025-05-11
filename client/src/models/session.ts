import { ref } from 'vue'
import * as myFetch from './myFetch'
import {login} from './user'

export interface SessionUser {
  id: number
  name: string
  role: string
  username: string
}
export interface Session {
  user: SessionUser | null
  token: string | null
}
export function api<T>(
  action: string,
  data?: any,
  method?: string,
  headers?: HeadersInit,
): Promise<T> {
  return myFetch.api<T>(action, data, method, headers)
}

const session = ref<Session>({
  user: null,
  token: null,
})
export function useSession() {
return session
}

export const isAdmin = () => session.value.user?.role === 'admin'
export const isLoggedIn = () => session.value.user !== null
export interface LoginResponse {
  user: SessionUser
  token?: string
}

export function loginFunction({ username, password }: { username: string, password: string }) {
  return login({ username, password }).then((response: LoginResponse) => {
    console.log(response)
    session.value.user = response.user
    if (response.token) {
      session.value.token = response.token
    }
    console.log(session.value)
    return response
  })
}
export function logout() {
  console.log(session.value.user)
  session.value.user = null
  session.value.token = null
}
