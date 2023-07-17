<script setup>

import { ref, inject} from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'

const router = useRouter()
const axios = inject('axios')
const toast = inject('toast')
const credentials = ref({
  email: '',
  password: ''
})
const userStore = useUserStore()

const emit = defineEmits(['login'])
const login = async () => {
  var response = null
  response = await userStore.login(credentials.value)
  if (response === true) {
    toast.success('O utilizador ' + userStore.user.name + ' iniciou sessão.')
    emit('login')
    router.push({name: 'Vehicles'})
  }
  else {
    credentials.value.password = ''
    toast.error(response)
  }
}
</script>

<template>
  <div class="container-fluid bg-dark text-white" style="padding-top: 5%; padding-bottom: 5%">
    <div class="container">
      <div class="d-flex justify-content-center">
        <div>
          <form
            class="row g-3 needs-validation"
            novalidate
            @submit.prevent="login"
          >
          <h3 class="mt-5 mb-3">Login</h3>
          <div class="mb-3">
            <div class="mb-3">
              <label
                style="color: white;"
                for="inputEmail"
                class="form-label"
              >Email</label>
              <input
                type="text"
                class="form-control"
                id="inputEmail"
                required
                v-model="credentials.email"
              >
            </div>
          </div>
          <div class="mb-3">
            <div class="mb-3">
              <label
                style="color: white;"
                for="inputPassword"
                class="form-label"
              >Password</label>
              <input
                type="password"
                class="form-control"
                id="inputPassword"
                required
                v-model="credentials.password"
              >
            </div>
          </div>
          <div class="mb-3 d-flex justify-content-center">
            <button
              type="submit"
              class="btn btn-light px-5"
            >Login</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

