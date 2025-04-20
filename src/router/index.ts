import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home/index.vue')
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
