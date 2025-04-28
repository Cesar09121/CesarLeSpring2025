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
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
    meta: { requiresAuth: false }
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

router.beforeEach((to, _, next) => {
  const { isLoggedIn, currentUser } = useAuth()
  
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    next({ name: 'login' })
  }
  else if (to.meta.requiresAdmin && currentUser.value?.role !== 'admin') {
    next({ name: 'home' })
  }
  else {
    next()
  }
})

export default router