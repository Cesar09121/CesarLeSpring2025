import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { User } from '../models/user'
import {api} from './myFetch'

const TOKEN_KEY = 'auth_token'

const session = ref({
  user: null as User | null,
  token: null as string | null,
  isLoading: false
})

export function useAuth() {
  const router = useRouter()
  const isLoggedIn = () => session.value.user !== null
  
  const isAdmin = () => session.value.user?.role === 'admin'
  
  const getCurrentUser = () => session.value.user
  
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      session.value.isLoading = true
  
      const response = await api<{ user: User; token: string }>('login', {
        method: 'POST',
        body: {
          username,
          password
        }
      });
      console.log('Login response:', response);
  
      if (response && response.user && response.token) {

        session.value.user = response.user;
        session.value.token = response.token;

        localStorage.setItem(TOKEN_KEY, response.token);
        
        return true;
      }
  
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      session.value.isLoading = false;
    }
  };
  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      session.value.isLoading = true
      
      await new Promise(resolve => setTimeout(resolve, 500))
      

      const storedUsers = localStorage.getItem('users')
      const users = storedUsers ? JSON.parse(storedUsers) : []
      
      if (users.some((u: User) => u.username === userData.username)) {
        throw new Error('Username already taken')
      }
      
      const newId = users.length > 0 
        ? Math.max(...users.map((u: User) => u.id)) + 1 
        : 1

      const newUser: User = {
        id: newId,
        ...userData
      }
      
      users.push(newUser)
      
      localStorage.setItem('users', JSON.stringify(users))
      
      return true
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      session.value.isLoading = false
    }
  }
  
  const logout = () => {
    session.value.user = null
    session.value.token = null

    localStorage.removeItem(TOKEN_KEY)
    

    router.push('/login')
  }
  
  const initSession = async (): Promise<void> => {
    const token = localStorage.getItem(TOKEN_KEY)
    
    if (token) {
      try {
        const storedUsers = localStorage.getItem('users')
        if (storedUsers) {
          const users = JSON.parse(storedUsers)
          if (users.length > 0) {
            session.value.user = users[0]
            session.value.token = token
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error)
        localStorage.removeItem(TOKEN_KEY)
      }
    }
  }
  
  return {
    isLoggedIn,
    isAdmin,
    getCurrentUser,
    login,
    register,
    logout,
    initSession,
    session
  }
}