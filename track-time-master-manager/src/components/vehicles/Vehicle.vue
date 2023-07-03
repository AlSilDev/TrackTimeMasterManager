<script setup>
  import { ref, watch, computed, inject } from 'vue'
  import VehicleDetail from "./VehicleDetail.vue"
  import { useRouter, onBeforeRouteLeave } from 'vue-router'  
  
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

  const newVehicle = () => {
      return {
        id: null,
        model: '',
        class_id: null,
        class: {
          category_id: null
        },
        license_plate: '',
        year: null,
        engine_capacity: null
    }
  }

  let originalValueStr = ''
  const loadVehicle = (id) => {    
    originalValueStr = ''
      errors.value = null
      if (!id || (id < 0)) {
        vehicle.value = newVehicle()
        originalValueStr = dataAsString()
      } else {
        axios.get('vehicles/' + id)
          .then((response) => {
            vehicle.value = response.data.data
            originalValueStr = dataAsString()
          })
          .catch((error) => {
            console.log(error)
          })
      }
  }

  const save = () => {
      errors.value = null
      if (operation.value == "insert"){
        axios.post('vehicles', vehicle.value)
          .then((response) => {
            vehicle.value = response.data.data
            originalValueStr = dataAsString()
            toast.success('Veículo #' + vehicle.value.id + ' criado com sucesso')
            router.push({name: 'Vehicles'})
          })
          .catch((error) => {
            if (error.response.status == 422) {
              toast.error('Veículo não criado devido a erros de validação')
              errors.value = error.response.data.errors
            } else {
              toast.error('Veículo não criado devido a erro de servidor desconhecido')
            }
          })
      }else{
        axios.put('vehicles/' + props.id, vehicle.value)
        .then((response) => {
          vehicle.value = response.data.data
          originalValueStr = dataAsString()
          toast.success('Veículo #' + vehicle.value.id + ' atualizado com sucesso')
          router.push({name: 'Vehicles'})
        })
        .catch((error) => {
          if (error.response.status == 422) {
              toast.error('Veículo #' + props.id + ' não atualizado devido a erros de validação')
              errors.value = error.response.data.errors
            } else {
              toast.error('Vehicle #' + props.id + ' was not updated due to unknown server error!')
            }
        })
      }
  }

  const cancel = () => {
    originalValueStr = dataAsString()
    router.push({name: 'Vehicles'})
  }

  const dataAsString = () => {
      return JSON.stringify(vehicle.value)
  }

  let nextCallBack = null
  const leaveConfirmed = () => {
      if (nextCallBack) {
        nextCallBack()
      }
  }

  onBeforeRouteLeave((to, from, next) => {
    nextCallBack = null
    let newValueStr = dataAsString()
    if (originalValueStr != newValueStr) {
      nextCallBack = next
    } else {
      next()
    }
  })  

  const vehicle = ref(newVehicle())
  const errors = ref(null)

  watch(
    () => props.id,
    (newValue) => {
      loadVehicle(newValue)
      },
    {immediate: true}  
    )

</script>

<template>
  <vehicle-detail
    :operationType="operation"
    :vehicle="vehicle"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></vehicle-detail>
</template>
