<script setup>
  import { ref, watch, computed, inject } from 'vue'
  import UserCategoryDetail from "./UserCategoryDetail.vue"
  import { useRouter } from 'vue-router'  
  
  const router = useRouter()  
  const axios = inject('axios')
  const toast = inject('toast')

  const props = defineProps({
      id: {
        type: Number,
        default: null
      }
  })

  const operation = computed( () => (!props.id || props.id < 0) ? 'insert' : 'update')

  const newUserCategory = () => {
      return {
        id: null,
        name: '',
        sigla: '',
        description: ''
      }
  }

  const loadUserCategory = (id) => {
      errors.value = null
      if (!id || (id < 0)) {
        userCategory.value = newUserCategory()
      } else {
        axios.get('userCategories/' + id)
          .then((response) => {
            userCategory.value = response.data.data
          })
          .catch((error) => {
            console.error(error)
          })
      }
  }

  const save = () => {
      errors.value = null
      if (operation.value == "insert"){
        axios.post('userCategories', userCategory.value)
          .then((response) => {
            userCategory.value = response.data.data
            toast.success('Categoria ' + userCategory.value.name + ' criada com sucesso!')
            router.push({name: 'UserCategories'})
          })
          .catch((error) => {
            if (error.response.status == 422) {
              toast.error('Categoria ' + userCategory.value.name + ' não apagada devido a erros de validação!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Categoria ' + userCategory.value.name + ' não apagada devido a erro(s) desconhecido para o servidor!')
            }
          })
      }else{
        axios.put('userCategories/' + props.id, userCategory.value)
        .then((response) => {
          userCategory.value = response.data.data
          toast.success('Categoria atualizada com sucesso!')
          router.push({name: 'UserCategories'})
        })
        .catch((error) => {
          if (error.response.status == 422) {
              toast.error('Categoria não atualizada devido a erros de validação!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Categoria não atualizada devido a erro(s) desconhecido para o servidor!')
            }
        })
      }
  }

  const cancel = () => {
    router.push({name: 'UserCategories'})
  }

  const userCategory = ref(newUserCategory())
  const errors = ref(null)

  watch(
    () => props.id,
    (newValue) => {
      loadUserCategory(newValue)
      },
    {immediate: true}  
    )

</script>

<template>

  <userCategory-detail
    :operationType="operation"
    :userCategory="userCategory"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></userCategory-detail>
</template>
