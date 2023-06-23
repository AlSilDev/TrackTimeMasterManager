<script setup>
import { ref, inject, onMounted } from "vue";
import { useUserStore } from "../../stores/user.js"
import { useRouter } from "vue-router";
import avatarNoneUrl from '@/assets/avatar-none.png'
import { BIconArrowUp, BIconArrowDown, BIconSearch, BIconPencil } from "bootstrap-icons-vue";

const axios = inject('axios')
const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()
const router = useRouter()

const props = defineProps({
  showId: {
    type: Boolean,
    default: false,
  },
  showModel: {
    type: Boolean,
    default: true,
  },
  showClass: {
    type: Boolean,
    default: true,
  },
  showLicensePlate: {
    type: Boolean,
    default: true,
  },
  showYear: {
    type: Boolean,
    default: true,
  },
  showEngineCapacity: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["edit"]);

const photoFullUrl = (user) => {
  return user.photo_url
    ? serverBaseUrl + "/storage/fotos/" + user.photo_url
    : avatarNoneUrl;
};

const editVehicles = (vehicle) => {
  router.push({ name: 'Vehicle', params: { id: vehicle.id } })
}

const canViewUserDetail = (userId) => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type == 'A' || userStore.user.id == userId
}

const laravelData = ref({})
const currentPage = ref()
const filteredPages = ref([])
const sortedColumn = ref('id')
const order = ref('asc')
const attribute = ref()
const search = ref()

const getResultsFiltered = async (page = 1) => {
  console.log('endpoint: ', `vehicles?page=${page}&column=${sortedColumn.value}&order=${order.value}&attribute=${attribute.value.value}&search=${search.value.value}`)
  await axios.get(`vehicles?page=${page}&column=${sortedColumn.value}&order=${order.value}&attribute=${attribute.value.value}&search=${search.value.value}`)
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

const restartSearch = () => {
  search.value.value = ""
  attribute.value.selectedIndex = 0
  getResultsFiltered()
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
        <option value="model">Modelo</option>
        <option value="vehicle_categories.name">Categoria</option>
        <option value="vehicle_classes.name">Classe</option>
        <option value="license_plate">Matrícula</option>
        <option value="year">Ano</option>
      </select>
      <button class="btn btn-outline-secondary" type="button" @click="getResultsFiltered()">Procurar</button>
      <button class="btn btn-outline-secondary" type="button" @click="restartSearch()">Reiniciar</button>
    </div>
  </div>

  <table class="table table-hover table-striped">
    <thead class="table-dark" style="cursor: pointer">
      <tr>
        <th class="align-middle" @click="sortByColumn('model')">Modelo <span v-if="sortedColumn == 'model'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('category')">Categoria <span v-if="sortedColumn == 'category'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('class')">Classe <span v-if="sortedColumn == 'class'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('license_plate')">Matrícula <span v-if="sortedColumn == 'license_plate'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('year')">Ano <span v-if="sortedColumn == 'year'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('engine_capacity')">Cilindrada (cm3) <span v-if="sortedColumn == 'engine_capacity'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th v-if="userStore.user.type_id == 1 || userStore.user.type_id == 2"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="vehicle in laravelData.data" :key="vehicle.id">
        <td class="align-middle">{{ vehicle.model }}</td>
        <td class="align-middle">{{ vehicle.category }}</td>
        <td class="align-middle">{{ vehicle.class }}</td>
        <td class="align-middle">{{ vehicle.license_plate }}</td>
        <td class="align-middle">{{ vehicle.year }}</td>
        <td class="align-middle">{{ vehicle.engine_capacity }}</td>
        <td class="text-end align-middle" v-if="userStore.user.type_id == 1 || userStore.user.type_id == 2">
            <button
              class="btn btn-xs btn-light"
              @click="editVehicles(vehicle)"
              title="Editar"
            >
              <BIconPencil/>
            </button>
        </td>
      </tr>
    </tbody>
  </table>

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
