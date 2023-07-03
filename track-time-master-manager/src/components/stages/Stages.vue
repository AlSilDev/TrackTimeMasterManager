<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import StageCards from "./StageCards.vue"
  import { BIconPlus } from 'bootstrap-icons-vue'
  
  const router = useRouter()

  const axios = inject('axios')

  const stages = ref([])

  const totalStages = computed(() => {
    return stages.value.length
  })

  const addStage = () => {
    router.push({ name: 'NewStage', params: { event_id: router.currentRoute.value.params['event_id'] } })
  }
</script>

<template>
  <h3 class="mt-5 mb-3">ETAPAS</h3>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addStage"><BIconPlus/> Nova Etapa</button></div>
    </div>
  </div>
  
  <br>
  
  <stage-cards
    :showId="false"
  ></stage-cards>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 2.3rem;
}
</style>

