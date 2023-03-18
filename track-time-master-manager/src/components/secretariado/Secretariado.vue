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
      <div class="position-sticky pt-3">
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
      </div>
    </nav>

    <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <h3>(Secretariado)</h3>
      <router-view></router-view>
    </main>
  </div>
</template>

