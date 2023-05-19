<script setup>
  import { ref, watch, computed, inject } from 'vue'
  import EventCategoryDetail from "./EventCategoryDetail.vue"
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

  const newEventCategory = () => {
      return {
        id: null,
        name: '',
        description: ''
      }
  }

  const loadEventCategory = (id) => {
      errors.value = null
      if (!id || (id < 0)) {
        eventCategory.value = newEventCategory()
      } else {
        axios.get('eventCategories/' + id)
          .then((response) => {
            eventCategory.value = response.data.data
          })
          .catch((error) => {
            console.log(error)
          })
      }
  }

  const save = () => {
      errors.value = null
      if (operation.value == "insert"){
        axios.post('eventCategories', eventCategory.value)
          .then((response) => {
            eventCategory.value = response.data.data
            toast.success('Categoria de evento #' + eventCategory.value.id + ' criada com sucesso!')
            router.push({name: 'EventCategories'})
          })
          .catch((error) => {
            if (error.response.status == 422) {
              toast.error('Categoria de evento não criada devido a erros de validação!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Categoria de evento Categoria de evento não criada devido a um erro(s) desconhecido para o servidor!')
            }
          })
      }else{
        axios.put('eventCategories/' + props.id, eventCategory.value)
        .then((response) => {
          eventCategory.value = response.data.data
          toast.success('Categoria de evento #' + eventCategory.value.id + ' atualizada com sucesso!')
          router.push({name: 'EventCategories'})
        })
        .catch((error) => {
          if (error.response.status == 422) {
              toast.error('Categoria de evento #' + props.id + ' não atualizada devido a erros de validação!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Categoria de evento #' + eventCategory.id + ' não atualizada devido a um erro(s) desconhecido para o servidor!')
            }
        })
      }
  }

  const cancel = () => {
    router.push({name: 'EventCategories'})
  }

  const eventCategory = ref(newEventCategory())
  const errors = ref(null)

  watch(
    () => props.id,
    (newValue) => {
      loadEventCategory(newValue)
      },
    {immediate: true}  
    )

</script>

<template>

  <eventCategory-detail
    :operationType="operation"
    :eventCategory="eventCategory"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></eventCategory-detail>
</template>
