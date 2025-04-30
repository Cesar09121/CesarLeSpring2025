import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from './myFetch';
export * from './auth';

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
}

export interface User {
  id: number;
  username: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
  friends: number[];
}

const TOKEN_KEY = 'auth_token';

const currentUser = ref<User | null>(null);
const isLoading = ref(false);

export interface PublicUser {
  id: number;
  username: string;
  name: string;
  role: string;
}

const users = ref<User[]>([
  {
    id: 1,
    username: 'cle20',
    name: 'Cesar Le',
    password: 'cesarle', 
    role: 'admin',
    friends: [2, 3]
  },
  {
    id: 2,
    username: 'jewpaltz',
    name: 'Rabbi Moshe Plotkin',
    password: 'professor',
    role: 'user',
    friends: [1, 3]
  },
  {
    id: 3,
    username: 'jngo',
    name: 'Johnny Ngo',
    password: 'johnnyngo',
    role: 'user',
    friends: [1, 2]
  },
  {
    id: 4,
    username: 'thunguyen',
    name: 'Thu Nguyen',
    password: 'mabu',
    role: 'user',
    friends: [1, 4]
  }
]);

const hashPassword = (password: string): string => {
  return `hashed_${password}`;
}


const initFromStorage = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userIdStr = localStorage.getItem('user_id');
  
  console.log('[Auth] Checking stored credentials manually');
  
  if (token && userIdStr) {
    try {
      const userId = parseInt(userIdStr);
      const user = users.value.find(u => u.id === userId);
      
      if (user) {
        currentUser.value = user;
        console.log('[Auth] User restored from storage:', user.username);
        return true;
      }
    } catch (error) {
      console.error('[Auth] Error restoring user:', error);
    }
  }
  
  currentUser.value = null;
  return false;
};

export function useAuth() {
  const router = useRouter();
  
  const isLoggedIn = computed(() => currentUser.value !== null);
  const isAdmin = computed(() => currentUser.value?.role === ROLES.ADMIN);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      isLoading.value = true;

      let mockResponse = null;
      const user = users.value.find(u => 
        u.username === username && u.password === password
      );
      
      if (user) {
        mockResponse = {
          user,
          token: 'mock_token_' + Date.now()
        };
      }

      const response = mockResponse;
      console.log('Login response:', response);
  
      if (response && response.user) {
        currentUser.value = response.user;
        console.log('currentUser after login:', currentUser.value);
        
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem('user_id', response.user.id.toString());
        
        return true;
      }
  
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  const logout = () => {
    currentUser.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user_id');
    router.push('/login');
  };
  
  const getAllUsers = async (): Promise<PublicUser[]> => {
    const result = await api<any>('user');
    
    return Array.isArray(result) ? result : result.items ?? [];
  };
  
  const getUserById = (id: number): PublicUser | null => {
    const user = users.value.find(u => u.id === id);
    if (!user) return null;
    
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    };
  };
  
  const register = async (userData: Omit<User, 'id'>): Promise<void> => {
    
    const existingUser = users.value.find(u => u.username === userData.username);
    if (existingUser) {
      throw new Error('Username already taken');
    }
    
    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
 
    const newId = Math.max(...users.value.map(u => u.id), 0) + 1;
    
    users.value.push({
      id: newId,
      username: userData.username,
      name: userData.name,
      password: hashPassword(userData.password), 
      role: userData.role || ROLES.USER,
      friends: userData.friends || []
    });
    
    return;
  };
  
  const addUser = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    if (!isAdmin.value) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    const newId = Math.max(...users.value.map(u => u.id), 0) + 1;
    
    users.value.push({
      id: newId,
      ...userData
    });
    
    return true;
  };
  
  const updateUser = async (id: number, userData: Partial<User>): Promise<boolean> => {
    if (!isAdmin.value && currentUser.value?.id !== id) {
      throw new Error('Unauthorized: You can only update your own account');
    }
    
    const index = users.value.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    users.value[index] = {
      ...users.value[index],
      ...userData
    };
    
    if (currentUser.value && currentUser.value.id === id) {
      currentUser.value = { ...users.value[index] };
    }
    
    return true;
  };
  
  const deleteUser = async (id: number): Promise<boolean> => {
    if (!isAdmin.value) {
      throw new Error('Unauthorized: Admin access required');
    }
    
    const index = users.value.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    users.value.splice(index, 1);
    return true;
  };
  
  const getFriends = (): PublicUser[] => {
    if (!currentUser.value) return [];
    
    return currentUser.value.friends
      .map(friendId => getUserById(friendId))
      .filter((user): user is PublicUser => user !== null);
  };
  
  return {
    currentUser,
    isLoading,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    getAllUsers,
    getUserById,
    register,
    addUser,
    updateUser,
    deleteUser,
    getFriends,
    initFromStorage 
  };
}