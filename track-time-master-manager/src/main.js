import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import Toaster from "@meforma/vue-toaster";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
//import { BootstrapIconsPlugin } from 'bootstrap-icons-vue';

import 'mdb-vue-ui-kit/css/mdb.min.css';

import App from './App.vue'
import router from './router'

//import './assets/main.css'

const app = createApp(App)

//const apiDomain = import.meta.env.VITE_API_DOMAIN
const apiDomain = 'http://tracktimemastermanagerapi.test'
const wsConnection = import.meta.env.VITE_WS_CONNECTION

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
//app.use(BootstrapIconsPlugin)

app.mount('#app')
