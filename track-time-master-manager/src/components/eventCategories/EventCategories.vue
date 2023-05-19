<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import EventCategoryTable from "./EventCategoryTable.vue"
  
  const router = useRouter()

  const axios = inject('axios')

  const eventCategories = ref([])

  const loadEventCategories = (async() => {
    await axios.get('eventCategories')
        .then((response) => {
          eventCategories.value = response.data
          console.log(eventCategories.value)
        })
        .catch((error) => {
          console.log(error)
        })
  })

  const totalEventCategories = computed(() => {
    return eventCategories.value.length
  })

  const addNewEventCategory = () => {
    router.push({ name: 'NewEventCategory'})
  }

  const deleteEventCategories = (eventCategory) => {
    axios.delete('eventCategories/' + eventCategory)
        .then((response) => {
          console.log("Removed!")
        })
        .catch((error) => {
          console.log(error)
        });
        console.log("Method DELETE - TO DO " + eventCategory.id)
  }

  onMounted(()=>{
    loadEventCategories()
  })

</script>

<template>
  <h3 class="mt-5 mb-3">Categorias de Eventos</h3>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addNewEventCategory"><BIconPlus/>Nova Categoria</button></div>
    </div>
  </div>
  <hr>
  <eventCategory-table
    :deleteCategory="deleteEventCategories"
    :eventCategories="eventCategories"
    :showId="false"
  ></eventCategory-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 2.3rem;
}
</style>

