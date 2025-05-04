import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import StatisticsPage from '../pages/StatisticPage.vue'
import AdminPage from '../pages/AdminPage.vue'
import FriendActivityPage from '@/pages/FriendActivityPage.vue'

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
    path: '/statistics',
    name: 'statistics',
    component: StatisticsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/friendActivity',
    name : 'friendActivity',
    component: FriendActivityPage,
    meta:{requiresAuth: true}
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})



export default router