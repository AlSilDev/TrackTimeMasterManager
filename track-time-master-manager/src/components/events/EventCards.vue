<script setup>
import { inject, ref, onMounted } from "vue";
import { useUserStore } from "../../stores/user.js"
import {useRouter} from 'vue-router'
import avatarNoneUrl from '@/assets/avatar-none.png'
import { BIconSearch } from 'bootstrap-icons-vue'

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()
const axios = inject("axios")
const router = useRouter()
const toast = inject('toast')
const socket = inject("socket")

const props = defineProps({
  showId: {
    type: Boolean,
    default: false,
  },
  showName: {
    type: Boolean,
    default: true,
  },
  showEmail: {
    type: Boolean,
    default: true,
  },
  showLicenseNum: {
    type: Boolean,
    default: true,
  },
  showLicenseExpiry: {
    type: Boolean,
    default: true,
  },
  showPhoneNum: {
    type: Boolean,
    default: true,
  },
  showAffiliateNum: {
    type: Boolean,
    default: true,
  },
});

const laravelData = ref({})
const currentPage = ref()
const filteredPages = ref([])
const sortedColumn = ref('id')
const order = ref('asc')
const attribute = ref()
const search = ref()

const editEvent = (event) => {
  router.push({ name: 'Event', params: { id: event.id } })
}

//Admin -> id=1
//Secretariado -> id=2
//Verificações Técnicas -> id=3

const isAdmin = () => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type_id == 1
}

const havePermissionsAdminSec = () => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type_id == 1 || userStore.user.type_id == 2
}

const havePermissionsAdminSecVerTec = () => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type_id == 1 || userStore.user.type_id == 2 || userStore.user.type_id == 3
}

const getResultsFiltered = async (page = 1) => {
  sortedColumn.value = 'id'
  order.value = 'asc'
  console.log('endpoint: ', `events?page=${page}&column=${sortedColumn.value}&order=${order.value}&attribute=${attribute.value.value}&search=${search.value.value}`)
  await axios.get(`events?page=${page}&column=${sortedColumn.value}&order=${order.value}&attribute=${attribute.value.value}&search=${search.value.value}`)
    .then((response) => {
      laravelData.value = response.data
      currentPage.value = page
      filteredPages.value = laravelData.value.links.slice(1, laravelData.value.last_page+1)
      console.log(laravelData.value)
      console.log(filteredPages.value)
    })
    .catch((error)=>{
      console.error(error)
    })
}

const imageFullUrl = (event) => {
  return event.image_url
    ? serverBaseUrl + "/storage/fotos/eventos/" + event.image_url
    : avatarNoneUrl;
};

const deleteEvent = async (event) => {
  await axios.delete(`/events/${event.id}`)
    .then((response)=>{
      toast.success(`A prova ${event.name} foi cancelada com sucesso`)
      getResultsFiltered()
    })
    .catch((error)=>{
      toast.error("Ocorreu um erro a cancelar a prova")
    })
}

const sortByColumn = (column) => {
    if (column === sortedColumn.value) {
      order.value = (order.value === 'asc') ? 'desc' : 'asc'
    } else {
      sortedColumn.value = column
      order.value = 'asc'
    }
    currentPage.value = 1
    getResultsFiltered()
}

const restartSearch = () => {
  search.value.value = ""
  attribute.value.selectedIndex = 0
  getResultsFiltered()
}

socket.on('updateEvent', (eventUpdated) => {
    const eventUpdatedIdx = laravelData.value.data.findIndex((element) => {return element.id == eventUpdated.id})
    if (eventUpdatedIdx != -1)
    {
      laravelData.value.data[eventUpdatedIdx] = eventUpdated
    }
})

onMounted(async ()=>{
  await getResultsFiltered()
})
</script>

<template>
  <div class="mb-2 justify-content-center">
    <div class="input-group">
      <span class="input-group-text"><BIconSearch/></span>
      <input placeholder="Procurar..." type="string" id="search" class="form-control" ref="search" />
      <select class="form-select" id="inputGroupSelect01" ref="attribute">
        <option value="" selected>Escolher Atributo...</option>
        <option value="name">Nome</option>
        <option value="year">Ano</option>
        <option value="event_categories.name">Categoria</option>
      </select>
      <button class="btn btn-outline-secondary" type="button" @click="getResultsFiltered()">Procurar</button>
      <button class="btn btn-outline-secondary" type="button" @click="restartSearch()">Reiniciar</button>
    </div>
  </div>

  <div class="row">
    <div class="card" style="width: 18rem; margin: 10px;" v-for="event in laravelData.data" :key="event.id">
      <img class="card-img-top d-flex h-75" :src="imageFullUrl(event)" alt="Imagem do evento">
      <div class="card-body">
        <h5 class="card-title d-flex justify-content-center"><b>{{ event.name }}</b></h5>
        <div class="d-grid gap-3">
          <div class="d-flex justify-content-center">
            <button v-if="havePermissionsAdminSecVerTec()" @click="router.push({ name: 'Enrollments', params: { id: event.id } })" class="btn btn-primary w-100">Inscrições</button>
          </div>
          <div class="d-flex justify-content-between">
            <button v-if="havePermissionsAdminSec()" @click="editEvent(event)" class="btn btn-primary d-flex justify-content-start">Editar</button>
            <button v-if="havePermissionsAdminSec()" @click="deleteEvent(event)" class="btn btn-danger d-flex justify-content-end">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <br>

  <div>
    <ul class="pagination" style="cursor: pointer">
      <li v-if="currentPage != 1" class="page-item"><a class="page-link text-dark" @click="getResultsFiltered(currentPage-1)">&laquo;</a></li>
      <li v-for="(link, index) in filteredPages" class="page-item" :class="{active: currentPage == filteredPages[index].label}" @click="getResultsFiltered(index+1)"><a class="page-link text-dark">{{filteredPages[index].label}}</a></li>
      <li v-if="currentPage != laravelData.last_page" class="page-item"><a class="page-link text-dark" @click="getResults(currentPage+1)">&raquo;</a></li>
    </ul>
  </div>
</template>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}

.img_photo {
  width: 3.2rem;
  height: 3.2rem;
}

.page-item.active > .page-link {
  color:white !important;
  background-color: dimgrey !important;
  border-color: black;
}
</style>
