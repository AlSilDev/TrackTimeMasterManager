<script setup>
import { ref, inject, onMounted } from "vue";
import { useUserStore } from "../../stores/user.js"
import avatarNoneUrl from '@/assets/avatar-none.png'

const axios = inject('axios')
const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()

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

const editClick = (user) => {
  emit("edit", user);
};

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

const getResults = async (page = 1) => {
  await axios.get(`vehicles?page=${page}&column=${sortedColumn.value}&order=${order.value}`)
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
    getResults()
}

onMounted(async ()=>{
  await getResults()
})
</script>

<template>
  <table class="table table-hover">
    <thead class="thead-dark">
      <tr>
        <th class="align-middle" @click="sortByColumn('model')">Modelo <span v-if="sortedColumn == 'model'"><i v-if="order === 'asc' " class="fas fa-arrow-up"></i><i v-else class="fas fa-arrow-down"></i></span></th>
        <th class="align-middle" @click="sortByColumn('category')">Categoria <span v-if="sortedColumn == 'category'"><i v-if="order === 'asc' " class="fas fa-arrow-up"></i><i v-else class="fas fa-arrow-down"></i></span></th>
        <th class="align-middle" @click="sortByColumn('class')">Classe <span v-if="sortedColumn == 'class'"><i v-if="order === 'asc' " class="fas fa-arrow-up"></i><i v-else class="fas fa-arrow-down"></i></span></th>
        <th class="align-middle" @click="sortByColumn('license_plate')">Matrícula <span v-if="sortedColumn == 'license_plate'"><i v-if="order === 'asc' " class="fas fa-arrow-up"></i><i v-else class="fas fa-arrow-down"></i></span></th>
        <th class="align-middle" @click="sortByColumn('year')">Ano <span v-if="sortedColumn == 'year'"><i v-if="order === 'asc' " class="fas fa-arrow-up"></i><i v-else class="fas fa-arrow-down"></i></span></th>
        <th class="align-middle" @click="sortByColumn('engine_capacity')">Cilindrada (cm3) <span v-if="sortedColumn == 'engine_capacity'"><i v-if="order === 'asc' " class="fas fa-arrow-up"></i><i v-else class="fas fa-arrow-down"></i></span></th>
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
      </tr>
    </tbody>
  </table>

  <div>
    <ul class="pagination" style="cursor: pointer">
      <li v-if="currentPage != 1" class="page-item"><a class="page-link" @click="getResults(currentPage-1)">Previous</a></li>
      <li v-for="(link, index) in filteredPages" class="page-item" :class="{active: currentPage == filteredPages[index].label}" @click="getResults(index+1)"><a class="page-link">{{filteredPages[index].label}}</a></li>
      <li v-if="currentPage != laravelData.last_page" class="page-item"><a class="page-link" @click="getResults(currentPage+1)">Next</a></li>
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
</style>
