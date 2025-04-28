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
    // In a real app, this would call an API endpoint
    // return api.post('/auth/register', userData)
    
    // For demo purposes, handle locally
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[]
    
    // Check if username already exists
    if (users.some(u => u.username === userData.username)) {
      throw new Error('Username already taken')
    }
    
    // Create new user with generated ID
    const newId = users.length > 0 
      ? Math.max(...users.map(u => u.id)) + 1 
      : 1
    
    const newUser: User = {
      id: newId,
      ...userData
    }
    
    // Add to users array
    users.push(newUser)
    
    // Save back to storage
    localStorage.setItem('users', JSON.stringify(users))
    
    return true
  }
  
  const logout = () => {
    session.value = {
      user: null,
      token: null
    }
    
    // Remove token from storage
    localStorage.removeItem('auth_token')
    
    // Redirect to login
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
    // Check for saved token
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      // In a real app, validate token with API
      // const user = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` }})
      
      // For demo purposes, just simulate finding the user
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[]
      const user = users[0] // Just get first user for demo
      
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