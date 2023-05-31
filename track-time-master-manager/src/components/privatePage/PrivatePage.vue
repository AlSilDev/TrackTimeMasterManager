<script setup>

import { ref, inject} from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'

const router = useRouter()
const axios = inject('axios')
const toast = inject('toast')
const credentials = ref({
  username: '',
  password: ''
})
const userStore = useUserStore()

const emit = defineEmits(['clickMenuOption'])

const clickMenuOption = () => {
  emit("clickMenuOption")
}
</script>

<template>
  <div class="row">
    <nav
      id="sidebarMenu"
      class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
    >
      <div class="position-relative pt-3">
        <ul class="nav flex-column bg-info text-white">
          <li class="nav flex-column">
            <h6 class="text-center">Secretariado</h6>
          </li>
        </ul>
        <ul class="nav flex-column">
          <li class="nav flex-column">
            <router-link
              class="nav-link w-100 me-3"
              :class="{ active: $route.name === 'Vehicles' }"
              :to="{ name: 'Vehicles' }"
              @click="clickMenuOption"
            >
              <i class="bi bi-list-check"></i>
              Viaturas
            </router-link>
          </li>
          <li class="nav flex-column">
            <router-link
              class="nav-link w-100 me-3"
              :class="{ active: $route.name === 'Drivers' }"
              :to="{ name: 'Drivers' }"
              @click="clickMenuOption"
            >
              <i class="bi bi-list-check"></i>
              Concorrentes
            </router-link>
          </li>
          <li class="nav flex-column">
            <router-link
              class="nav-link w-100 me-3"
              :class="{ active: $route.name === 'Users' }"
              :to="{ name: 'Users' }"
              @click="clickMenuOption"
            >
              <i class="bi bi-list-check"></i>
              Utilizadores
            </router-link>
          </li>
        </ul>
        <ul class="nav flex-column bg-success text-white">
          <li class="nav flex-column">
            <br>
          </li>
        </ul>
        <ul class="nav flex-column bg-success text-white">
          <li class="nav flex-column">
            <h6 class="text-center">Events</h6>
          </li>
        </ul>
        <ul class="nav flex-column">
          <li class="nav flex-column">
            <router-link
              class="nav-link w-100 me-3"
              :class="{ active: $route.name === 'Events' }"
              :to="{ name: 'Events' }"
              @click="clickMenuOption"
            >
              <i class="bi bi-list-check"></i>
              Provas
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <router-view></router-view>
    </main>
  </div>
</template>

