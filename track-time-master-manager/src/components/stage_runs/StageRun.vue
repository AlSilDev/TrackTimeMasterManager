<script setup>
  import { ref, watch, computed, inject, onMounted } from 'vue'
  import StageRunDetail from "./StageRunDetail.vue"
  import { useRouter, onBeforeRouteLeave } from 'vue-router'  
  
  const router = useRouter()  
  const axios = inject('axios')
  const toast = inject('toast')

  const props = defineProps({
      stage_run_id: {
        type: Number,
        default: null
      },
      event_id: {
        type: Number,
        required: true
      },
      stage_id: {
        type: Number,
        required: true
      }
  })

  const operation = computed( () => (!props.stage_run_id || props.stage_run_id < 0) ? 'insert' : 'update')

  const newStageRun = () => {
      return {
        id: null,
        stage_id: props.stage_id,
        date_start: Date,
        practice: 0
        //num_runs: null,
        //time_until_next_run_mins: null,
      }
  }

  const stageRun = ref(newStageRun())

  const loadStageRun = (stage_run_id) => {    
    console.log(stage_run_id)
      errors.value = null
      if (!stage_run_id || (stage_run_id < 0)) {
        stageRun.value = newStageRun()
      } else {
        axios.get(`stageRuns/${stage_run_id}`)
          .then((response) => {
            stageRun.value = response.data.data
            console.log('stageRun', stageRun.value)
          })
          .catch((error) => {
            console.log(error)
          })
      }
  }

  const save = (editingStageRunValue) => {
    errors.value = null
    console.log('stageRun save', editingStageRunValue)
    if (operation.value == "insert")
    {
      axios.post(`stageRuns`, editingStageRunValue)
        .then((response) => {
          stageRun.value = response.data.data
          toast.success('Partida #' + stageRun.value.id + ' criada com sucesso!')
          //TODO
          router.push({name: 'Stages', params: { event_id: props.event_id }})
        })
        .catch((error) => {
          if (error.response.status == 422) {
            toast.error('Partida não criada devido a erros de validação!')
            errors.value = error.response.data.errors
          } else {
            toast.error('Partida não criada devido a erro desconhecido!')
          }
        })
    }
    else
    {
      console.log("PUT Method", editingStageRunValue)
      axios.put(`stageRuns/${props.stage_run_id}`, editingStageRunValue)
      .then((response) => {
        //console.log(response.data.data)
        stageRun.value = response.data.data
        toast.success('Partida #' + stageRun.value.id + ' foi atualizada com sucesso!')
        //TODO
        router.push({name: 'Stages', params: { event_id: props.event_id }})
      })
      .catch((error) => {
        console.error(error)
        if (error.response.status == 422) {
            toast.error('Partida #' + props.stageRun + ' não atualizada devido a erros de validação!')
            errors.value = error.response.data.errors
          } else {
            toast.error('Partida #' + props.stageRun + ' não atualizada devido a erro desconhecido!')
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
    () => props.stage_run_id,
    (newValue) => {
        loadStageRun(newValue)
      },
    {immediate: true}  
    )

  onMounted(()=>{
    //console.log('params', router.currentRoute.value.params)
  })

</script>

<template>
  <!--stageRun-detail
    :stageRun="stageRun"
    :errors="errors"
    :operationType="operation"
    @save="save"
    @cancel="cancel"
  ></stageRun-detail-->
  <stage-run-detail
    :stageRun="stageRun"
    :operationType="operation"
    @save="save"
    @cancel="cancel"
  ></stage-run-detail>
</template>
