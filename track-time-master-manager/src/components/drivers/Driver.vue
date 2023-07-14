<script setup>
  import { ref, watch, computed, inject, onMounted } from 'vue'
  import DriverDetail from "./DriverDetail.vue"
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

  const newDriver = () => {
      return {
        id: null,
        name: '',
        email: '',
        license_num: null,
        license_expiry: Date,
        phone_num: null,
        affiliate_num: null,
        country: ''
      }
  }

  const countries = ref([])
  const loadCountries = async ()=>{
    await axios.get('https://restcountries.com/v3.1/all?fields=name,translations')
    .then((response)=>{
      countries.value = response.data
    })
  }

  const pathHaveWordHistory = ref(null)

  const loadDriver = (id) => {
      errors.value = null
      if (!id || (id < 0)) {
        driver.value = newDriver()
      } else {
        const currentPath = router.currentRoute.value.fullPath
        pathHaveWordHistory.value = currentPath.includes('history')

        if (!pathHaveWordHistory.value){
          axios.get('drivers/' + id)
          .then((response) => {
            driver.value = response.data.data
          })
          .catch((error) => {
            console.error(error)
          })
        }else{
          axios.get('driversHistory/' + id)
          .then((response) => {
            driver.value = response.data.data
          })
          .catch((error) => {
            console.error(error)
          })
        }
      }
  }

  const save = () => {
      errors.value = null
      if (!pathHaveWordHistory.value){
        if (operation.value == "insert"){
          axios.post('drivers', driver.value)
            .then((response) => {
              driver.value = response.data.data
              toast.success('O condutor #' + driver.value.id + ' foi criado com sucesso.')
              router.push({name: 'Drivers'})
            })
            .catch((error) => {
              if (error.response.status == 422) {
                toast.error('O condutor não foi criado devido a erros de validação.')
                errors.value = error.response.data.errors
              } else {
                toast.error('O condutor não foi criado devido a erro desconhecido.')
              }
            })
        }else{
          axios.put('drivers/' + props.id, driver.value)
          .then((response) => {
            driver.value = response.data.data
            toast.success('Condutor #' + driver.value.id + ' atualizado com sucesso.')
            socket.emit('updateDriver', driver.value);
            router.back()
          })
          .catch((error) => {
            if (error.response.status == 422) {
                toast.error('Condutor #' + props.id + ' não atualizado devido a erros de validação.')
                errors.value = error.response.data.errors
              } else {
                toast.error('Condutor #' + props.id + ' não atualizado devido a erro desconhecido.')
              }
          })
        }
      }else{
        axios.put('driversHistory/' + props.id, driver.value)
          .then((response) => {
            driver.value = response.data.data
            toast.success('Condutor #' + driver.value.id + ' atualizado com sucesso.')
            socket.emit('updateDriver', driver.value);
            router.back()
          })
          .catch((error) => {
            if (error.response.status == 422) {
                toast.error('Condutor #' + props.id + ' não atualizado devido a erros de validação.')
                errors.value = error.response.data.errors
              } else {
                toast.error('Condutor #' + props.id + ' não atualizado devido a erro desconhecido.')
              }
          })
      }
  }

  socket.on('updateDriver', (driverUpdated) => {
    if ((pathHaveWordHistory && driverUpdated.driver_id != null) || !pathHaveWordHistory && !driverUpdated.driver_id){
      if (driver.value.id == driverUpdated.id){
        driver.value = driverUpdated
      }
    }
  })

  const cancel = () => {
    router.push({name: 'Drivers'})
  }

  const driver = ref(newDriver())
  const errors = ref(null)

  watch(
    () => props.id,
    (newValue) => {
        loadDriver(newValue)
      },
    {immediate: true}  
    )

  onMounted(async ()=>{
    await loadCountries()
  })

</script>

<template>
  <driver-detail
    :driver="driver"
    :errors="errors"
    :countries="countries"
    @save="save"
    @cancel="cancel"
  ></driver-detail>
</template>
