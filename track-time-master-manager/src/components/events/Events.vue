<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import { useUserStore } from '../../stores/user.js'
  import EventCards from "./EventCards.vue"
  import { BIconPlus, BIconTable } from 'bootstrap-icons-vue'
  
  const router = useRouter()
  const userStore = useUserStore()

  const axios = inject('axios')

  const events = ref([])

  const totalEvents = computed(() => {
    return events.value.length
  })

  const addEvent = () => {
    router.push({ name: 'NewEvent' })
  }

  const showCategories = () => {
    router.push({ name: 'EventCategories' })
  }

</script>

<template>
  <h3 class="mt-5 mb-3">EVENTOS</h3>
  <div class="container" v-if="userStore.user.type_id == 1">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addEvent"><BIconPlus/> Novo Evento</button></div>
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="showCategories"><BIconTable/> Categorias</button></div>
      <!--div-- class="col-sm"><button type="button" class="btn btn-dark">Exportar Concorrente(s)</button></div-->
    </div>
  </div>
  
  <br>
  
  <event-cards
    :showId="false"
  ></event-cards>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 2.3rem;
}
</style>

