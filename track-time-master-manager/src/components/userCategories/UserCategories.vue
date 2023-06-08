<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import UserCategoryTable from "./UserCategoryTable.vue"
  import { BIconPlus } from 'bootstrap-icons-vue'
  
  const router = useRouter()

  const axios = inject('axios')
  const toast = inject('toast')

  const userCategories = ref([])
  const userCategoriesOnlyTrashed = ref([])
  const userCategoriesWithTrashed = ref([])
  const userCategoriesListAux = ref([])

  const errors = ref(null)

  const loadUserCategories = (async() => {
    await axios.get('userCategories')
        .then((response) => {
          userCategories.value = response.data
        })
        .catch((error) => {
          console.log(error)
        })
  })

  const loadUserCategoriesAux = (async() => {
    await axios.get('userCategories')
        .then((response) => {
          userCategoriesListAux.value = response.data
        })
        .catch((error) => {
          console.log(error)
        })
  })

  const loadUserCategoriesOnlyTrashed = (async() => {
    await axios.get('userCategories/onlyTrashed')
        .then((response) => {
          userCategoriesOnlyTrashed.value = response.data
        })
        .catch((error) => {
          console.log(error)
        })
  })

  const loadUserCategoriesWithTrashed = (async() => {
    await axios.get('userCategories/withTrashed')
        .then((response) => {
          userCategoriesWithTrashed.value = response.data
        })
        .catch((error) => {
          console.log(error)
        })
  })

  const addNewUserCategory = () => {
    router.push({ name: 'NewUserCategory'})
  }

  const editUserCategory = (category) => {
    router.push({ name: 'UserCategory', params: { id: category.id } })
  }
  
  const deleteUserCategory = (async(userCategory) => {
    errors.value = null
    await axios.delete('userCategories/' + userCategory.id)
        .then((response) => {
          toast.success('Categoria ' + userCategory.name + '(#' +userCategory.id+ ') apagada com sucesso!')
        })
        .catch((error) => {
          if (error.response.status == 422) {
              toast.error('Categoria ' + userCategory.name + '(#' +userCategory.id+ ') não apagada devido a erros de validação!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Categoria ' + userCategory.name + '(#' +userCategory.id+ ') não apagada devido a erro(s) desconhecido para o servidor!')
            }
        });
        
  })

  const restoreUserCategory = (async(userCategory) => {
    errors.value = null
    await axios.get('eventCategories/restore/' + userCategory.id)
        .then((response) => {
          toast.success('Categoria #' + userCategory.id + ' restaurada com sucesso!')
        })
        .catch((error) => {
          if (error.response.status == 422) {
              toast.error('Categoria #' + props.id + ' não restaurada devido a erros de validação!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Categoria #' + userCategory.id + ' não restaurada devido a erro(s) desconhecido para o servidor!')
            }
        });
        
  })

  

  onMounted(()=>{
    loadUserCategories()
    loadUserCategoriesAux()
    loadUserCategoriesOnlyTrashed()
    loadUserCategoriesWithTrashed()
  })

</script>

<template>
  <h3 class="mt-5 mb-3">Categorias de Utilizadores</h3>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addNewUserCategory"><BIconPlus/> Nova Categoria</button></div>
    </div>
  </div>
  <hr>
  <userCategory-table
    :errors="errors"
    :userCategoriesListAux="userCategoriesListAux"
    :userCategories="userCategories"
    :userCategoriesOnlyTrashed="userCategoriesOnlyTrashed"
    :userCategoriesWithTrashed="userCategoriesWithTrashed"
    @edit="editUserCategory"
    @restoreCategory="restoreUserCategory"
    @deleteCategory="deleteUserCategory"
    @loadUserCategories="loadUserCategories"
    @loadUserCategoriesAux="loadUserCategoriesAux"
    @loadUserCategoriesOnlyTrashed="loadUserCategoriesOnlyTrashed"
    @loadUserCategoriesWithTrashed="loadUserCategoriesWithTrashed"
    :showId="false"
  ></userCategory-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 2.3rem;
}
</style>

