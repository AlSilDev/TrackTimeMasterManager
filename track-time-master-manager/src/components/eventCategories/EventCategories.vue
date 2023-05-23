<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import EventCategoryTable from "./EventCategoryTable.vue"
  
  const router = useRouter()

  const axios = inject('axios')
  const toast = inject('toast')

  const eventCategories = ref([])
  const eventCategoriesOnlyTrashed = ref([])
  const eventCategoriesWithTrashed = ref([])
  const eventCategoriesListAux = ref([])

  const errors = ref(null)

  const loadEventCategories = (async() => {
    await axios.get('eventCategories')
        .then((response) => {
          eventCategories.value = response.data
          console.log("Event Categories: " + eventCategories.value)
        })
        .catch((error) => {
          console.log(error)
        })
  })

  const loadEventCategoriesAux = (async() => {
    await axios.get('eventCategories')
        .then((response) => {
          eventCategoriesListAux.value = response.data
          console.log("Event Categories: " + eventCategories.value)
        })
        .catch((error) => {
          console.log(error)
        })
  })

  const loadEventCategoriesOnlyTrashed = (async() => {
    await axios.get('eventCategories/onlyTrashed')
        .then((response) => {
          eventCategoriesOnlyTrashed.value = response.data
          console.log("Event Categories only trashed: " + eventCategoriesOnlyTrashed.value)
        })
        .catch((error) => {
          console.log(error)
        })
  })

  const loadEventCategoriesWithTrashed = (async() => {
    await axios.get('eventCategories/withTrashed')
        .then((response) => {
          eventCategoriesWithTrashed.value = response.data
          console.log("Event Categories with trashed: " + eventCategoriesWithTrashed.value)
        })
        .catch((error) => {
          console.log(error)
        })
  })

  const addNewEventCategory = () => {
    router.push({ name: 'NewEventCategory'})
  }

  const editEventCategory = (category) => {
    router.push({ name: 'EventCategory', params: { id: category.id } })
  }
  
  const deleteEventCategory = (async(eventCategory) => {
    errors.value = null
    await axios.delete('eventCategories/' + eventCategory.id)
        .then((response) => {
          toast.success('Categoria ' + eventCategory.name + '(#' +eventCategory.id+ ') apagada com sucesso!')
        })
        .catch((error) => {
          if (error.response.status == 422) {
              toast.error('Categoria ' + eventCategory.name + '(#' +eventCategory.id+ ') não apagada devido a erros de validação!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Categoria ' + eventCategory.name + '(#' +eventCategory.id+ ') não apagada devido a erro(s) desconhecido para o servidor!')
            }
        });
        
  })

  const restoreEventCategory = (async(eventCategory) => {
    errors.value = null
    await axios.get('eventCategories/restore/' + eventCategory.id)
        .then((response) => {
          toast.success('Categoria de evento #' + eventCategory.id + ' restaurada com sucesso!')
        })
        .catch((error) => {
          if (error.response.status == 422) {
              toast.error('Categoria de evento #' + props.id + ' não restaurada devido a erros de validação!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Categoria de evento #' + eventCategory.id + ' não restaurada devido a erro(s) desconhecido para o servidor!')
            }
        });
        
  })

  

  onMounted(()=>{
    loadEventCategories()
    loadEventCategoriesAux()
    loadEventCategoriesOnlyTrashed()
    loadEventCategoriesWithTrashed()
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
    :eventCategoriesListAux="eventCategoriesListAux"
    :eventCategories="eventCategories"
    :eventCategoriesOnlyTrashed="eventCategoriesOnlyTrashed"
    :eventCategoriesWithTrashed="eventCategoriesWithTrashed"
    @edit="editEventCategory"
    @restoreCategory="restoreEventCategory"
    @deleteCategory="deleteEventCategory"
    @loadEventCategories="loadEventCategories"
    @loadEventCategoriesAux="loadEventCategoriesAux"
    @loadEventCategoriesOnlyTrashed="loadEventCategoriesOnlyTrashed"
    @loadEventCategoriesWithTrashed="loadEventCategoriesWithTrashed"
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

