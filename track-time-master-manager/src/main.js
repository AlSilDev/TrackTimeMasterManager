import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import Toaster from "@meforma/vue-toaster";
import html2pdf from 'html2pdf.js';
import { io } from "socket.io-client"

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
//import { BootstrapIconsPlugin } from 'bootstrap-icons-vue';

import App from './App.vue'
import router from './router'

import CountryFlag from 'vue-country-flag-next'

//import './assets/main.css'

const app = createApp(App)


const apiDomain = import.meta.env.VITE_API_DOMAIN
//const apiDomain = 'http://tracktimemastermanagerapi.test'
const wsConnection = import.meta.env.VITE_WS_CONNECTION

//app.provide('socket', io("http://localhost:8081"))
app.provide('socket',io(wsConnection))

app.provide('axios', axios.create({
    baseURL: apiDomain + '/api',
    headers: {
      'Content-type': 'application/json',
    },
  }))
app.provide('serverBaseUrl', `${apiDomain}`)  

app.use(Toaster, {
    // Global/Default options
    position: 'top',
    timeout: 3000,
    pauseOnHover: true
})

app.provide('toast', app.config.globalProperties.$toast);

app.use(createPinia())
app.use(router)
app.provide('html2pdf', html2pdf)
app.use(CountryFlag)

app.mount('#app')
