<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import EventCards from "./EventCards.vue"
  
  const router = useRouter()

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
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addEvent"><BIconPlus/> Novo Evento</button></div>
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="showCategories"><BIconTable/> Categorias</button></div>
      <!--div-- class="col-sm"><button type="button" class="btn btn-dark">Exportar Concorrente(s)</button></div-->
    </div>
  </div>
  
  <br>
  
  <event-cards
    :showId="false"
    @edit="editEvent"
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

