import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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

const currentUser = ref<User | null>(null);
const isLoggedIn = computed(() => currentUser.value !== null);
const isAdmin = computed(() => currentUser.value?.role === 'admin');

export function useAuth() {
  const router = useRouter();

  const login = (username: string, password: string): boolean => {
    const user = users.value.find(
      u => u.username === username && u.password === password
    );
    
    if (user) {
      currentUser.value = user;
      return true;
    }
    
    return false;
  };

  const logout = () => {
    currentUser.value = null;
    router.push('/login');
  };

  const getAllUsers = computed((): PublicUser[] => {
    return users.value.map(user => ({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    }));
  });

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

  const addUser = (userData: Omit<User, 'id'>): boolean => {
    const newId = Math.max(...users.value.map(u => u.id), 0) + 1;
    
    users.value.push({
      id: newId,
      ...userData
    });
    
    return true;
  };

  const updateUser = (id: number, userData: Partial<User>): boolean => {
    const index = users.value.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    users.value[index] = {
      ...users.value[index],
      ...userData
    };
    
    if (currentUser.value && currentUser.value.id === id) {
      currentUser.value = users.value[index];
    }
    
    return true;
  };

  const deleteUser = (id: number): boolean => {
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
    isLoggedIn,
    isAdmin,
    login,
    logout,
    getAllUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    getFriends
  };
}