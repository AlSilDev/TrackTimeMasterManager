<script setup>
import { useRouter, RouterLink, RouterView } from "vue-router";
import { ref, inject, onMounted } from "vue";
import { useUserStore } from './stores/user.js'
import Login from './components/auth/Login.vue'
import Secretariado from './components/secretariado/Secretariado.vue'


const router = useRouter()
const axios = inject("axios")
const toast = inject("toast")
const userStore = useUserStore()
const buttonSidebarExpand = ref(null)

const logout = async () => {
  if (await userStore.logout()) {
    toast.success('User has logged out of the application.')
    router.push({name: 'home'})
    //clickMenuOption()
  }
  else {
    toast.error('There was a problem logging out of the application!')
  }
}

const clickMenuOption = () => {
  if (window.getComputedStyle(buttonSidebarExpand.value).display !== "none") {
    buttonSidebarExpand.value.click()
  }
}

onMounted(()=>{
  userStore.restoreToken()
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top shadow">
    <div class="container">

      <a class="btn" role="button">
        <h4><b>TtmM</b></h4>
      </a>

      <div class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav">
          <li class="nav-item" v-show="!userStore.user">
            <router-link
              class="nav-link text-dark"
              :class="{ active: $route.name === 'Login' }"
              :to="{ name: 'Login' }"
              @click="clickMenuOption"
            >
              <i class="bi bi-box-arrow-in-right"></i>
              Login
            </router-link>
          </li>
          <li class="nav-item dropdown" v-show="userStore.user">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                :src="userStore.userPhotoUrl"
                class="rounded-circle z-depth-0 avatar-img"
                alt="avatar image"
              />
              <span class="avatar-text">{{ userStore.user?.name ?? 'Anonymous' }}</span>
            </a>
            <ul
              class="dropdown-menu dropdown-menu-dark dropdown-menu-end"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <router-link
                  class="dropdown-item"
                  :class="{ active: $route.name == 'User' && $route.params.id == userStore.userId }"
                  :to="{ name: 'User', params: { id: userStore.userId } }"
                  @click="clickMenuOption"
                >
                  <i class="bi bi-person-square"></i>Profile
                </router-link>
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :class="{ active: $route.name === 'ChangePassword' }"
                  :to="{ name: 'ChangePassword' }"
                  @click="clickMenuOption"
                >
                  <i class="bi bi-key-fill"></i>
                  Change password
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="logout">
                  <i class="bi bi-arrow-right"></i>Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>


  <div class="container-fluid" v-if="userStore.user">
    <Secretariado :clickMenuOption="clickMenuOption"></Secretariado>
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<style>
@import "./assets/dashboard.css";

.avatar-img {
  margin: -1.2rem 0.8rem -2rem 0.8rem;
  width: 3.3rem;
  height: 3.3rem;
}
.avatar-text {
  line-height: 2.2rem;
  margin: 1rem 0.5rem -2rem 0;
  padding-top: 1rem;
}

.dropdown-item {
  font-size: 0.875rem;
}

.btn:focus {
  outline: none;
  box-shadow: none;
}

#sidebarMenu {
  overflow-y: auto;
}
</style>
