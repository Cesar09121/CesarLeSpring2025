import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, PublicUser } from './user'


const session = ref({
  user: null as User | null,
  token: null as string | null,
})

export function useSession() {
  const router = useRouter()
  
  const getSession = () => session
  
  const isAdmin = () => session.value?.user?.role === 'admin'
  
  const isLoggedIn = () => session.value?.user !== null
  
  const login = async (username: string, password: string): Promise<boolean> => {

    await new Promise(resolve => setTimeout(resolve, 500))
 
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[]
    const user = users.find(u => u.username === username && u.password === password)
    
    if (user) {

      const token = `token_${Math.random().toString(36).substring(2, 15)}`
 
      session.value = {
        user,
        token
      }
      localStorage.setItem('auth_token', token)
      
      return true
    }
    
    return false
  }
  
  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    
    await new Promise(resolve => setTimeout(resolve, 500))
  
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[]
    
    if (users.some(u => u.username === userData.username)) {
      throw new Error('Username already taken')
    }
    
    const newId = users.length > 0 
      ? Math.max(...users.map(u => u.id)) + 1 
      : 1
    
    const newUser: User = {
      id: newId,
      ...userData
    }
    
    users.push(newUser)
    
    localStorage.setItem('users', JSON.stringify(users))
    
    return true
  }
  
  const logout = () => {
    session.value = {
      user: null,
      token: null
    }
  
    localStorage.removeItem('auth_token')
 
    router.push('/login')
  }
  
  const getCurrentUser = (): PublicUser | null => {
    if (!session.value.user) return null
    
    const { id, username, name, role } = session.value.user
    
    return {
      id,
      username,
      name,
      role
    }
  }
  
  const initSession = async (): Promise<void> => {
 
    const token = localStorage.getItem('auth_token')
    
    if (token) {
    
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[]
      const user = users[0] 
      
      if (user) {
        session.value = {
          user,
          token
        }
      }
    }
  }
  
  return {
    getSession,
    isAdmin,
    isLoggedIn,
    login,
    register,
    logout,
    getCurrentUser,
    initSession
  }
}