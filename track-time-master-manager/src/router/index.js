import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../components/auth/Login.vue'
import ChangePassword from "../components/auth/ChangePassword.vue"
import Users from "../components/users/Users.vue"
import User from "../components/users/User.vue"
import UserCreate from "../components/users/UserCreate.vue"
import Vehicles from "../components/vehicles/Vehicles.vue"
import Vehicle from "../components/vehicles/Vehicle.vue"
import Drivers from "../components/drivers/Drivers.vue"
import Secretariado from '../components/secretariado/Secretariado.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name:'Login',
      component: Login
    },
    {
      path: '/password',
      name: 'ChangePassword',
      component: ChangePassword
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
      path: '/users/create',
      name: 'UserCreate',
      component: UserCreate
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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
