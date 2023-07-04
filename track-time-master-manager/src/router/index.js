import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
import HomeView from '../views/HomeView.vue'
import RouteRedirector from "../components/global/RouteRedirector.vue"
import Login from '../components/auth/Login.vue'
import ChangePassword from "../components/auth/ChangePassword.vue"
import Users from "../components/users/Users.vue"
import User from "../components/users/User.vue"
import Vehicles from "../components/vehicles/Vehicles.vue"
import Vehicle from "../components/vehicles/Vehicle.vue"
import Drivers from "../components/drivers/Drivers.vue"
import Driver from "../components/drivers/Driver.vue"
import PrivatePage from '../components/privatePage/PrivatePage.vue'
import Events from "../components/events/Events.vue"
import Event from "../components/events/Event.vue"
import EventCategories from "../components/eventCategories/EventCategories.vue"
import EventCategory from "../components/eventCategories/EventCategory.vue"
import Enrollments from "../components/enrollments/Enrollments.vue"
import UserCategories from "../components/userCategories/UserCategories.vue"
import UserCategory from "../components/userCategories/UserCategory.vue"
import PublicPage from '../components/publicPage/PublicPage.vue'
import Stages from "../components/stages/Stages.vue"
import Stage from "../components/stages/Stage.vue"
import StageRun from "../components/stage_runs/StageRun.vue"
import RaceStart from "../components/race_start/RaceStart.vue"
import RaceTimeControl from "../components/race_time_control/RaceTimeControl.vue"
import Classifications from "../components/classifications/Classifications.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PublicPage
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
      path: '/backend/users/:id/password',
      //path: '/secretariado/users/user/password',
      name: 'ChangePassword',
      component: ChangePassword,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/backend/users',
      name: 'Users',
      component: Users,
    },
    {
      path: '/backend/vehicles',
      name: 'Vehicles',
      component: Vehicles,
    },
    {
      path: '/backend/vehicles/new',
      name: 'NewVehicle',
      component: Vehicle,
    },
    {
      path: '/backend/vehicles/:id',
      name: 'Vehicle',
      component: Vehicle,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/backend/drivers',
      name: 'Drivers',
      component: Drivers,
    },
    {
      path: '/backend/drivers/:id',
      name: 'Driver',
      component: Driver,
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/backend/drivers/new',
      name: 'NewDriver',
      component: Driver,
    },
    {
      path: '/backend/users/new',
      name: 'NewUser',
      component: User,
    },
    {
      path: '/backend/events/categories/new',
      name: 'NewEventCategory',
      component: EventCategory,
    },
    {
      path: '/backend/users/categories/new',
      name: 'NewUserCategory',
      component: UserCategory,
    },
    {
      path: '/backend/events/new',
      name: 'NewEvent',
      component: Event,
    },
    {
      path: '/backend/events',
      name: 'Events',
      component: Events,
    },
    {
      path: '/backend/events/:event_id/stages',
      name: 'Stages',
      component: Stages,
      props: route => ({ event_id: parseInt(route.params.event_id) })
    },
    {
      path: '/backend/events/:event_id/stages/new',
      name: 'NewStage',
      component: Stage,
      props: route => ({ event_id: parseInt(route.params.event_id) })
    },
    {
      path: '/backend/events/:event_id/stages/:stage_id',
      name: 'Stage',
      component: Stage,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ event_id: parseInt(route.params.event_id), stage_id: parseInt(route.params.stage_id) })
    },
    {
      path: '/backend/events/:event_id/stages/:stage_id/classifications',
      name: 'StageClassifications',
      component: Classifications,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ event_id: parseInt(route.params.event_id), stage_id: parseInt(route.params.stage_id), c_type: 'stage' })
    },
    {
      path: '/backend/events/:event_id/stages/:stage_id/stage_runs/new',
      name: 'NewStageRun',
      component: StageRun,
      props: route => ({ event_id: parseInt(route.params.event_id), stage_id: parseInt(route.params.stage_id) })
    },
    {
      path: '/backend/events/:event_id/stages/:stage_id/stage_runs/:stage_run_id',
      name: 'StageRun',
      component: StageRun,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ event_id: parseInt(route.params.event_id), stage_id: parseInt(route.params.stage_id), stage_run_id: parseInt(route.params.stage_run_id) })
    },
    {
      path: '/backend/events/:event_id/stages/:stage_id/stage_runs/:stage_run_id/classifications',
      name: 'RunClassifications',
      component: Classifications,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ event_id: parseInt(route.params.event_id), stage_id: parseInt(route.params.stage_id), stage_run_id: parseInt(route.params.stage_run_id), c_type: 'stageRun' })
    },
    {
      path: '/backend/events/:event_id/stages/:stage_id/stage_runs/:stage_run_id/race_start',
      name: 'RaceStart',
      component: RaceStart,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ event_id: parseInt(route.params.event_id), stage_id: parseInt(route.params.stage_id), stage_run_id: parseInt(route.params.stage_run_id) })
    },
    {
      path: '/backend/events/:event_id/stages/:stage_id/stage_runs/:stage_run_id/race_time_control',
      name: 'RaceTimeControl',
      component: RaceTimeControl,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ event_id: parseInt(route.params.event_id), stage_id: parseInt(route.params.stage_id), stage_run_id: parseInt(route.params.stage_run_id) })
    },
    {
      path: '/backend/events/categories',
      name: 'EventCategories',
      component: EventCategories,
    },
    {
      path: '/backend/users/categories',
      name: 'UserCategories',
      component: UserCategories,
    },
    {
      path: '/backend/users/:id',
      name: 'User',
      component: User,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/backend/events/:id',
      name: 'Event',
      component: Event,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/backend/events/:id/enrollments',
      name: 'Enrollments',
      component: Enrollments,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/backend/events/category/:id',
      name: 'EventCategory',
      component: EventCategory,
      //props: true
      // Replaced with the following line to ensure that id is a number
      props: route => ({ id: parseInt(route.params.id) })
    },
    {
      path: '/backend/users/category/:id',
      name: 'UserCategory',
      component: UserCategory,
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
  if (!userStore.user && to.name != 's') {
    next({ name: 'Login' })
    return
  }
  if (to.name == 'User') {
    if ((userStore.user.type_id == 1) || (userStore.user.id == to.params.id)) {
      next()
      return
    }
    next({ name: 'home' })
    return
  }
  next()
})

export default router
