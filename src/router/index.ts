import { createRouter, createWebHistory } from 'vue-router'
import Home from'../views/Home.vue'
import Login from '../views/auth/Login.vue'
import SetupSecuritKey from '../views/auth/SetupSecurityKey.vue'
import Register from '../views/auth/Register.vue'
import Database from '../views/Database.vue'
import Devices from '../views/devices/Devices.vue'
import { socket, state } from '@/socket';

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
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/setup',
      name: 'SetupSecurityKey',
      component: SetupSecuritKey,
      meta: { requiresAuth: true },
      props: true,
    },
  ]
})


router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  if (to.meta.requiresAuth) {
    try {
      // Emit an authenticated event to the server to verify the authentication
      socket.emit('/isAuthenticated', (isAuthenticated: Boolean) => {
        if (isAuthenticated) {
          // User is authenticated, allow access to the route
          next();
        } else {
          // User is not authenticated, redirect to the login page or any other appropriate action
          next('/login');
        }
      });
    } catch (error) {
      // Error occurred during authentication check, handle the error appropriately
      console.error(error);
      next('/login');
    }
  } else {
    // Route does not require authentication, allow access
    next();
  }
});

// Listen for the response from the server
socket.on('/isAuthenticated/answer', (isAuthenticated: Boolean) => {
  if (!isAuthenticated) {
    // User is not authenticated, redirect to the login page or any other appropriate action
    router.push('/login');
  }
});



export default router
