import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import HomeView from '../views/HomeView.vue'
import RouteRedirector from "../components/global/RouteRedirector.vue"
import Login from '../components/auth/Login.vue'
import ChangePassword from "../components/auth/ChangePassword.vue"
import Users from "../components/users/Users.vue"
import User from "../components/users/User.vue"
import UserCreate from "../components/users/UserCreate.vue"
import Vehicles from "../components/vehicles/Vehicles.vue"
import Vehicle from "../components/vehicles/Vehicle.vue"
import Drivers from "../components/drivers/Drivers.vue"
import Driver from "../components/drivers/Driver.vue"
import Secretariado from '../components/secretariado/Secretariado.vue'
import Events from "../components/events/Events.vue"
import Event from "../components/events/Event.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/redirect/:redirectTo',
      name: 'Redirect',
      component: RouteRedirector,
      props: route => ({ redirectTo: route.params.redirectTo})
    },
    {
      path: '/login',
      name:'Login',
      component: Login
    },
    {
      path: '/secretariado/users/:id/password',
      //path: '/secretariado/users/user/password',
      name: 'ChangePassword',
      component: ChangePassword,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/secretariado/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/secretariado/vehicles',
      name: 'Vehicles',
      component: Vehicles,
    },
    {
      path: '/secretariado/vehicles/new',
      name: 'NewVehicle',
      component: Vehicle,
    },
    {
      path: '/secretariado/drivers',
      name: 'Drivers',
      component: Drivers,
    },
    {
      path: '/secretariado/drivers/new',
      name: 'NewDriver',
      component: Driver,
    },
    {
      path: '/secretariado/users/new',
      name: 'NewUser',
      component: User,
    },
    {
      path: '/events',
      name: 'Events',
      component: Events,
    },
    {
      path: '/events/new',
      name: 'NewEvent',
      component: Event,
    },
    /*{
      path: '/secretariado',
      name: 'Secretariado',
      component: Secretariado,
    },*/
    {
      path: '/users/:id',
      name: 'User',
      component: User,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/events/:id',
      name: 'Event',
      component: Event,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

let handlingFirstRoute = true

router.beforeEach((to, from, next) => {
  if (handlingFirstRoute) {
    handlingFirstRoute = false
    next({name: 'Redirect', params: {redirectTo: to.fullPath}})
    return
  } else if (to.name == 'Redirect') {
    next()
    return
  }
  const userStore = useUserStore()
  if ((to.name == 'Login') || (to.name == 'home')) {
    next()
    return
  }
  if (!userStore.user && to.name != 'home') {
    next({ name: 'Login' })
    return
  }
  if (to.name == 'User') {
    if ((userStore.user.type == 'A') || (userStore.user.id == to.params.id)) {
      next()
      return
    }
    next({ name: 'home' })
    return
  }
  next()
})

export default router
