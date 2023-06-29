import { createRouter, createWebHistory } from 'vue-router'
import Home from'../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Database from '../views/Database.vue'
import Devices from '../views/devices/Devices.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/database',
      name: 'database',
      component: Database
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/device/:pagerId',
      name: 'Device',
      component: Devices,
      props: true,
    },
  ]
})

export default router
