<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import VehicleTable from "./VehicleTable.vue"
  import { BIconSearch, BIconPlus } from 'bootstrap-icons-vue'
  
  const router = useRouter()

  const axios = inject('axios')

  /*const vehicles = ref([])

  const totalVehicles = computed(() => {
    return vehicles.value.length
  })*/

  /*const loadVehicles = () => {
    axios.get('vehicles')
        .then((response) => {
          vehicles.value = response.data
          console.log(vehicles.value)
          console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
    }*/


  /*const editVehicle = (vehicle) => {
    router.push({ name: 'Vehicle', params: { id: vehicle.id } })
  }*/

  const addVehicle = () => {
    router.push({ name: 'NewVehicle' })
  }

</script>

<template>
  <h3 class="mt-5 mb-3">Viaturas</h3>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addVehicle"><BIconPlus/> Nova Viatura</button></div>
      <!--div class="col-sm"><button type="button" class="btn btn-dark">Importar Viatura(s)</button></div>
      <div-- class="col-sm"><button type="button" class="btn btn-dark">Exportar Viatura(s)</button></div-->
    </div>
  </div>
  
  <hr>
  <vehicle-table
    :showId="false"
    @edit="editVehicle"
  ></vehicle-table>
  
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 2.3rem;
}
</style>

