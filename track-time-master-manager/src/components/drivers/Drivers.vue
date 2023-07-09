<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import { useUserStore } from '../../stores/user.js'
  import DriverTable from "./DriverTable.vue"
  import {BIconPlus} from "bootstrap-icons-vue"
  
  const router = useRouter()
  const userStore = useUserStore()

  const axios = inject('axios')

  const drivers = ref([])

  const totalDrivers = computed(() => {
    return drivers.value.length
  })

  const loadDrivers = () => {
    axios.get('drivers')
        .then((response) => {
          drivers.value = response.data.data
          console.log(drivers.value)
        })
        .catch((error) => {
          console.log(error)
        })
    }

  const addDriver = () => {
    router.push({ name: 'NewDriver' })
  }

</script>

<template>
  <h3 class="mt-5 mb-3">Concorrentes</h3>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addDriver" v-if="userStore.user.type_id == 1 || userStore.user.type_id == 2"><BIconPlus/> Novo Concorrente</button></div>
      <!--div class="col-sm"><button type="button" class="btn btn-dark">Importar Concorrente(s)</button></div>
      <div-- class="col-sm"><button type="button" class="btn btn-dark">Exportar Concorrente(s)</button></div-->
    </div>
  </div>
  <hr>
  <driver-table
    :showId="false"
    @edit="editDrivers"
  ></driver-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 2.3rem;
}
</style>

