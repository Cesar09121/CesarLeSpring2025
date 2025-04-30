import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuth } from '../models/user'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import ActivityPage from '../pages/ActivityPage.vue'
import FriendsPage from '../pages/FriendsPage.vue'
import StatisticsPage from '../pages/StatisticPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'root',
    redirect: to => {
      const { isLoggedIn } = useAuth()
      return isLoggedIn.value ? '/dashboard' : '/login'
    }
  },
  {
    path: '/dashboard',
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/activities',
    name: 'activities',
    component: ActivityPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/friends',
    name: 'friends',
    component: FriendsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: StatisticsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const { isLoggedIn, currentUser } = useAuth()

router.beforeEach(async (to, _, next) => {
  // Always check auth state first
  if (import.meta.env.PROD && !isLoggedIn.value) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_id')
  }

  // Handle public routes (login/register)
  if (to.path === '/login' || to.path === '/register') {
    if (isLoggedIn.value) {
      next('/dashboard')
    } else {
      next()
    }
    return
  }

  // Handle protected routes
  if (!isLoggedIn.value) {
    next('/login')
    return
  }

  // Handle admin routes
  if (to.meta.requiresAdmin && currentUser.value?.role !== 'admin') {
    next('/dashboard')
    return
  }

  next()
})

export default router