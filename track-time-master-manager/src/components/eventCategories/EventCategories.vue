<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import EventCategoryTable from "./EventCategoryTable.vue"
  
  const router = useRouter()

  const axios = inject('axios')
  const toast = inject('toast')

  const eventCategories = ref([])

  const errors = ref(null)

  const loadEventCategories = (async() => {
    await axios.get('eventCategories')
        .then((response) => {
          eventCategories.value = response.data
          console.log(eventCategories.value)
          return eventCategories
        })
        .catch((error) => {
          console.log(error)
          return null
        })
  })

  const totalEventCategories = computed(() => {
    return eventCategories.value.length
  })

  const addNewEventCategory = () => {
    router.push({ name: 'NewEventCategory'})
  }

  const editEventCategory = (category) => {
    router.push({ name: 'EventCategory', params: { id: category.id } })
  }

  const deleteEventCategory = (eventCategory) => {
    //console.log("Deleting " + eventCategory.id)
    errors.value = null
    axios.delete('eventCategories/' + eventCategory.id)
        .then((response) => {
          //console.log("Removed!")
          toast.success('Categoria de evento #' + eventCategory.id + ' apagada com sucesso!')
        })
        .catch((error) => {
          if (error.response.status == 422) {
              toast.error('Categoria de evento #' + props.id + ' não apagada devido a erros de validação!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Categoria de evento #' + eventCategory.id + ' não apagada devido a erro(s) desconhecido para o servidor!')
            }
        });
        
  }

  

  onMounted(()=>{
    loadEventCategories()
  })

</script>

<template>
  <h3 class="mt-5 mb-3">Categorias de Eventos</h3>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addNewEventCategory"><BIconPlus/> Nova Categoria</button></div>
    </div>
  </div>
  <hr>
  <eventCategory-table
    :errors="errors"
    :eventCategories="eventCategories"
    @edit="editEventCategory"
    @deleteCategory="deleteEventCategory"
    @loadEventCategories="loadEventCategories"
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

