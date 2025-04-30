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
    redirect: '/login'
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

// Initialize auth state before router starts
router.beforeEach(async (to, _, next) => {
  // Clear any stale auth data in production
  if (import.meta.env.PROD && !isLoggedIn.value) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_id')
  }

  // Guest pages (login/register)
  if (to.meta.requiresGuest && isLoggedIn.value) {
    next('/dashboard')
    return
  }

  // Protected routes
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next('/login')
    return
  }

  // Admin routes
  if (to.meta.requiresAdmin && currentUser.value?.role !== 'admin') {
    next('/dashboard')
    return
  }

  next()
})

export default router