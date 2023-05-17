<script setup>
import { inject, ref, onMounted } from "vue";
import { useUserStore } from "../../stores/user.js"
import {useRouter} from 'vue-router'
import avatarNoneUrl from '@/assets/avatar-none.png'

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()
const axios = inject("axios")
const router = useRouter()

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

const isAdmin = () => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type == 'A'
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

const deleteEvent = async (eventId) => {
  //TODO
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
      <img class="card-img-top" :src="imageFullUrl(event)" alt="Imagem do evento">
      <div class="card-body">
        <h5 class="card-title">{{ event.name }}</h5>
        <button v-if="isAdmin()" @click="editEvent(event)" class="btn btn-primary">Editar</button>
        <button v-if="isAdmin()" @click="deleteEvent(event)" class="btn btn-primary">Eliminar</button>
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