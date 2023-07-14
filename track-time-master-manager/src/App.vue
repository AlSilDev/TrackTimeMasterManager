<script setup>
import { useRouter, RouterLink, RouterView } from "vue-router";
import { ref, inject, watch, onMounted } from "vue";
import { useUserStore } from './stores/user.js'
import Login from './components/auth/Login.vue'
import PrivatePage from './components/privatePage/PrivatePage.vue'
import PublicPage from './components/publicPage/PublicPage.vue'
import { BIconList, BIconArrowRight, BIconPersonFill, BIconKeyFill, BIconBoxArrowInRight } from "bootstrap-icons-vue"


const router = useRouter()
const axios = inject("axios")
const toast = inject("toast")
const userStore = useUserStore()
const buttonSidebarExpand = ref(null)
const socket = inject("socket")

const logout = async () => {
  if (await userStore.logout()) {
    clickMenuOption()
    router.push({name: 'home'})
  } else {
    toast.error('Ocorreu um problema ao fechar a sessão')
  }
}

const publicPage = () => {
  router.push({name: 'home'})
}

const privatePage = () => {
  router.push({name: 'Vehicles'})
}

//For boostrap dropdown
const clickMenuOption = () => {
  if (window.getComputedStyle(buttonSidebarExpand.value).display !== "none") {
    buttonSidebarExpand.value.click()
  }
}

const isBackendPage = () =>  {
  const myArray = router.currentRoute.value.fullPath.split('/')
  if (myArray[1] == "backend"){
    return true;
  }
  return false;
}

onMounted(()=>{
  userStore.restoreToken()
})

watch (
  () => router.currentRoute.value,
  () => {
    isBackendPage();
  }
)

const backend = ref(false)



socket.on('updateUser', (userUpdated) => {
  if (userStore.user.id == userUpdated.id)
  {
    userStore.user = userUpdated
  }
})

</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top shadow">
    <div class="container-fluid">

      <router-link
        class="navbar-brand col-md-3 col-lg-2 me-0 px-3"
        :to="{ name: 'home' }"
        @click="clickMenuOption"
      >
        TtmM
      </router-link>

      <div class="d-flex">
        <ul class="navbar-nav">
          <li class="nav-item" v-show="!userStore.user">
            <router-link
              class="nav-link"
              :class="{ active: $route.name === 'Login' }"
              :to="{ name: 'Login' }"
            >
              <i class="bi bi-box-arrow-in-right"></i>
              <BIconBoxArrowInRight/>
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
              class="dropdown-menu dropdown-menu-dark dropdown-menu-end position-absolute"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <router-link
                  class="dropdown-item"
                  :class="{ active: $route.name == 'User' && $route.params.id == userStore.userId }"
                  :to="{ name: 'User', params: { id: userStore.userId } }"
                  @click="clickMenuOption"
                >
                  <BIconPersonFill/> Perfil
                </router-link>
              </li>
              <li>
                <router-link
                  class="dropdown-item"
                  :class="{ active: $route.name == 'ChangePassword' && $route.params.id == userStore.userId }"
                  :to="{ name: 'ChangePassword', params: { id: userStore.userId } }"
                  @click="clickMenuOption"
                >
                  <BIconKeyFill/> Mudar password
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li v-if="isBackendPage()">
                <a class="dropdown-item" @click="publicPage">
                  <BIconArrowRight/> Página Pública
                </a>
              </li>
              <li v-else>
                <a class="dropdown-item" @click="privatePage">
                  <BIconArrowRight/> Página Backend
                </a>
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="logout">
                  <BIconArrowRight/> Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>

        <button
          id="buttonSidebarExpandId"
          ref="buttonSidebarExpand"
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
          v-if="isBackendPage()"
        >
          <BIconList></BIconList>
        </button>                   
      </div>
    </div>
  </nav>

  <div class="container-fluid">
      <div class="row" v-if="userStore.user && isBackendPage()">
        <nav
          id="sidebarMenu"
          class="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse navbar-collapse"
        >
          <div class="position-relative pt-3">
            <ul class="nav flex-column bg-light text-dark">
              <li class="nav flex-column">
                <h6 class="text-center divider">Administração</h6>
              </li>
            </ul>
            <ul class="nav flex-column">
              <li class="nav flex-column">
                <router-link
                  class="nav-link w-100 me-3 text-white"
                  :class="{ active: $route.name === 'Users' }"
                  :to="{ name: 'Users' }"
                  @click="clickMenuOption"
                >
                  <i class="bi bi-list-check"></i>
                  Utilizadores
                </router-link>
              </li>
            </ul>
            <ul class="nav flex-column bg-light text-dark">
              <li class="nav flex-column">
                <h6 class="text-center divider">Secretariado</h6>
              </li>
            </ul>
            <ul class="nav flex-column">
              <li class="nav flex-column">
                <router-link
                  class="nav-link w-100 me-3 text-white"
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
                  class="nav-link w-100 me-3 text-white"
                  :class="{ active: $route.name === 'Drivers' }"
                  :to="{ name: 'Drivers' }"
                  @click="clickMenuOption"
                >
                  <i class="bi bi-list-check"></i>
                  Concorrentes
                </router-link>
              </li>
            </ul>
            <ul class="nav flex-column bg-light text-dark">
              <li class="nav flex-column">
                <h6 class="text-center divider">Gestão de Provas</h6>
              </li>
            </ul>
            <ul class="nav flex-column">
              <li class="nav flex-column">
                <router-link
                  class="nav-link w-100 me-3 text-white"
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
      <div class="row" v-else>
        <router-view></router-view> 
      </div>

      
        <!--div class="container-fluid" v-if="userStore.user && isBackendPage()">
          <PrivatePage :clickMenuOption="clickMenuOption"></PrivatePage>
        </!--div>
        <div-- v-else>
          <router-view></router-view>
        </div-->

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
  padding-top: 51px;
}

.divider {
  font-size: 10pt;
}

h6 {
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
}
</style>
