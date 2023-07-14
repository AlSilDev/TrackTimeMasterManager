<script setup>
  import { ref, watch, computed, inject, onMounted } from 'vue'
  import StageDetail from "./StageDetail.vue"
  import { useRouter, onBeforeRouteLeave } from 'vue-router'  
  
  const router = useRouter()  
  const axios = inject('axios')
  const toast = inject('toast')

  const props = defineProps({
      event_id: {
        type: Number,
        default: null
      },
      stage_id: {
        type: Number,
        default: null
      }
  })

  const operation = computed( () => (!props.stage_id || props.stage_id < 0) ? 'insert' : 'update')

  const newStage = () => {
      return {
        id: null,
        name: '',
        date_start: Date,
        //num_runs: null,
        //time_until_next_run_mins: null,
      }
  }

  const stage = ref(newStage())

  const loadStage = (stage_id) => {    
      errors.value = null
      if (!stage_id || (stage_id < 0)) {
        stage.value = newStage()
      } else {
        axios.get(`stages/${stage_id}`)
          .then((response) => {
            stage.value = response.data.data
          })
          .catch((error) => {
            console.error(error)
          })
      }
  }

  const save = (editingStageValue) => {
    errors.value = null
    if (operation.value == "insert")
    {
      axios.post(`events/${props.event_id}/stages`, editingStageValue)
        .then((response) => {
          stage.value = response.data.data
          toast.success('Etapa ' + stage.value.name + ' criada com sucesso!')
          router.push({name: 'Stages', params: { event_id: props.event_id }})
        })
        .catch((error) => {
          if (error.response.status == 422) {
            toast.error('Etapa não criada devido a erros de validação!')
            errors.value = error.response.data.errors
          } else if (error.response.status == 401) {
            toast.error(error.response.data)
          } else {
            toast.error('Etapa não criada devido a erro desconhecido!')
          }
        })
    }
    else
    {
      axios.put(`events/${props.event_id}/stages/${props.stage_id}`, editingStageValue)
      .then((response) => {
        stage.value = response.data.data
        toast.success('Etapa ' + stage.value.name + ' foi atualizada com sucesso!')
        router.push({name: 'Stages', params: { event_id: props.event_id }})
      })
      .catch((error) => {
        if (error.response.status == 422) {
            toast.error('Etapa não atualizada devido a erros de validação!')
            errors.value = error.response.data.errors
          } else {
            toast.error('Etapa não atualizada devido a erro desconhecido!')
          }
      })
    }
  }

  const cancel = () => {
    router.push({name: 'Stages'})
  }

  const errors = ref(null)
  const confirmationLeaveDialog = ref(null)

  watch(
    () => props.stage_id,
    (newValue) => {
        loadStage(newValue)
      },
    {immediate: true}  
    )
</script>

<template>
  <stage-detail
    :stage="stage"
    :operationType="operation"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></stage-detail>
</template>
