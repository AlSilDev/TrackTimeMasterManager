<script setup>
  import { ref, watch, computed, inject } from 'vue'
  import VehicleDetail from "./VehicleDetail.vue"
  import { useRouter, onBeforeRouteLeave } from 'vue-router'
  
  const router = useRouter()  
  const axios = inject('axios')
  const toast = inject('toast')
  const socket = inject("socket")

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

  const pathHaveWordHistory = ref(null)

  let originalValueStr = ''
  const loadVehicle = (id) => {    
      errors.value = null
      if (!id || (id < 0)) {
        vehicle.value = newVehicle()
      } else {
        const currentPath = router.currentRoute.value.fullPath
        pathHaveWordHistory.value = currentPath.includes('history')

        if (!pathHaveWordHistory.value){
          axios.get('vehicles/' + id)
          .then((response) => {
            vehicle.value = response.data.data
          })
          .catch((error) => {
            console.error(error)
          })
        }else{
          axios.get('vehiclesHistory/' + id)
          .then((response) => {
            vehicle.value = response.data.data
          })
          .catch((error) => {
            console.error(error)
          })
        }
        
      }
  }

  const save = async(category) => {
      errors.value = null
      if (!pathHaveWordHistory.value){
        if (operation.value == "insert"){
          axios.post('vehicles', vehicle.value)
            .then((response) => {
              vehicle.value = response.data.data
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
          await axios.put('vehicles/' + props.id, vehicle.value)
          .then((response) => {
            vehicle.value = response.data.data
            toast.success('Veículo #' + vehicle.value.id + ' atualizado com sucesso.')
            vehicle.value.category = category.name
            vehicle.value.class = vehicle.value.class.name
            socket.emit('updateVehicle', vehicle.value);
            router.back()
          })
          .catch((error) => {
            if (error.response.status == 422) {
                toast.error('Veículo #' + props.id + ' não atualizado devido a erros de validação.')
                errors.value = error.response.data.errors
              } else {
                toast.error('Veículo #' + props.id + ' não atualizado devido a erro desconhecido.')
              }
          })
          router.go(-1)
        }
      }else{
        axios.put('vehiclesHistory/' + props.id, vehicle.value)
          .then((response) => {
            vehicle.value = response.data.data
            //originalValueStr = dataAsString()
            toast.success('Veículo #' + vehicle.value.id + ' atualizado com sucesso.')
            vehicle.value.category = category.name
            vehicle.value.class = vehicle.value.class.name
            socket.emit('updateVehicle', vehicle.value);
            router.back()
          })
          .catch((error) => {
            if (error.response.status == 422) {
                toast.error('Veículo #' + props.id + ' não atualizado devido a erros de validação.')
                errors.value = error.response.data.errors
              } else {
                toast.error('Veículo #' + props.id + ' não atualizado devido a erro desconhecido.')
              }
          })
      }
  }

  socket.on('updateVehicle', (vehicleUpdated) => {
    if ((pathHaveWordHistory && vehicleUpdated.vehicle_id != null) || !pathHaveWordHistory && !vehicleUpdated.vehicle_id){
      if (driver.value.id == driverUpdated.id){
        vehicle.value = vehicleUpdated
      }
    }
  })

  const cancel = () => {
    router.back()
  }

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
