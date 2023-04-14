<script setup>
import { inject, ref, onMounted } from "vue";
import { useUserStore } from "../../stores/user.js"
import avatarNoneUrl from '@/assets/avatar-none.png'

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()
const axios = inject("axios")

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

const photoFullUrl = (user) => {
  return user.photo_url
    ? serverBaseUrl + "/storage/fotos/" + user.photo_url
    : avatarNoneUrl;
};

const laravelData = ref({})
const currentPage = ref()
const filteredPages = ref([])
const sortedColumn = ref('id')
const order = ref('asc')
const attribute = ref()
const search = ref()

const editDrivers = (driver) => {
  router.push({ name: 'Driver', params: { id: driver.id } })
}

const canViewUserDetail = (userId) => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type == 'A' || userStore.user.id == userId
}

const getResultsFiltered = async (page = 1) => {
  console.log('endpoint: ', `drivers?page=${page}&column=${sortedColumn.value}&order=${order.value}&attribute=${attribute.value.value}&search=${search.value.value}`)
  await axios.get(`drivers?page=${page}&column=${sortedColumn.value}&order=${order.value}&attribute=${attribute.value.value}&search=${search.value.value}`)
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
        <option value="email">Email</option>
        <option value="license_num">Nº de licença</option>
        <option value="phone_num">Nº de telemóvel</option>
        <option value="affiliate_num">Nº de sócio</option>
      </select>
      <button class="btn btn-outline-secondary" type="button" @click="getResultsFiltered()">Procurar</button>
      <button class="btn btn-outline-secondary" type="button" @click="restartSearch()">Reiniciar</button>
    </div>
  </div>

  <table class="table table-hover table-striped">
    <thead class="table-dark" style="cursor: pointer">
      <tr>
        <th class="align-middle" @click="sortByColumn('name')">Nome <span v-if="sortedColumn == 'name'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('email')">Email <span v-if="sortedColumn == 'email'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('license_num')">Nº de Licença <span v-if="sortedColumn == 'license_num'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('license_expiry')">Validade da Licença <span v-if="sortedColumn == 'license_expiry'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('phone_num')">Nº de Telemóvel <span v-if="sortedColumn == 'phone_num'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
        <th class="align-middle" @click="sortByColumn('affiliate_num')">Nº de Sócio <span v-if="sortedColumn == 'affiliate_num'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in laravelData.data" :key="user.id">
        <td class="align-middle">{{ user.name }}</td>
        <td class="align-middle">{{ user.email }}</td>
        <td class="align-middle">{{ user.license_num }}</td>
        <td class="align-middle">{{ user.license_expiry }}</td>
        <td class="align-middle">{{ user.phone_num }}</td>
        <td class="align-middle">{{ user.affiliate_num }}</td>
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
