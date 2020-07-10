import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/dashboard/dashboard.vue'
import Commands from '../views/commands/commands.vue'
import Settings from '../views/settings/settings.vue'
import Register from '../views/register/register.vue'
import Login from '../views/login/login.vue'
import Logout from '../views/logout/logout.vue'
import StreamOverlay from '../views/streamoverlay/streamoverlay.vue'
import RequestAccessToken from '../views/requestaccesstoken/requestaccesstoken.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Default',
    component: Login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/commands',
    name: 'Commands',
    component: Commands
  },
  {
    path: '/placeholder',
    name: 'Home',
    component: Home
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/register/:step',
    name: 'Register',
    component: Register,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout
  },
  {
    path: '/streamoverlay',
    name: 'StreamOverlay',
    component: StreamOverlay
  },
  {
    path: '/requestaccesstoken',
    name: 'RequestAccessToken',
    component: RequestAccessToken
  },
  {
    path: '*',
    component: Dashboard
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
