<script setup>
  import { ref, watch, computed, inject } from 'vue'
  import EventDetail from "./EventDetail.vue"
  import { useRouter, onBeforeRouteLeave } from 'vue-router'  
  
  const router = useRouter()  
  const axios = inject('axios')
  const toast = inject('toast')
  const socket = inject("socket")
  const moment = inject('moment')

  const props = defineProps({
      id: {
        type: Number,
        default: null
      }
  })

  const operation = computed( () => (!props.id || props.id < 0) ? 'insert' : 'update')

  const newEvent = () => {
      return {
        id: null,
        name: '',
        date_start_enrollments: Date,
        date_end_enrollments: Date,
        date_start_event: Date,
        date_end_event: Date,
        year: null,
        course_url: null,
        category_id: null,
        base_penalty: null,
        point_calc_reason: null
      }
  }

  const event = ref(newEvent())

  const loadEvent = (id) => {    
      errors.value = null
      if (!id || (id < 0)) {
        event.value = newEvent()
      } else {
        axios.get('events/' + id)
          .then((response) => {
            event.value = response.data.data
          })
          .catch((error) => {
            console.error(error)
          })
      }
  }

  const formatDate = (value)=>{
    if (value) {
      return moment(String(value)).format()
    }
  }

  const save = (editingEventValue, imageFileValue, courseFileValue) => {
    errors.value = null
    const formData = new FormData()
    if(courseFileValue){
        formData.append('course_file', courseFileValue)
    }
    if(imageFileValue){
        formData.append('image_file', imageFileValue)
    }
    formData.append('name', editingEventValue.name)
    formData.append('date_start_enrollments', formatDate(editingEventValue.date_start_enrollments))
    formData.append('date_end_enrollments', formatDate(editingEventValue.date_end_enrollments))
    formData.append('date_start_event', formatDate(editingEventValue.date_start_event))
    formData.append('date_end_event', formatDate(editingEventValue.date_end_event))
    formData.append('category_id', editingEventValue.category_id)
    formData.append('base_penalty', editingEventValue.base_penalty)
    formData.append('point_calc_reason', editingEventValue.point_calc_reason)

        if (operation.value == "insert"){
          axios.post('events', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
            .then((response) => {
              event.value = response.data.data
              toast.success('Evento ' + event.value.name + ' criado com sucesso!')
              router.push({name: 'Events'})
            })
            .catch((error) => {
              if (error.response.status == 422) {
                toast.error('Evento ' + event.value.name + ' não criado devido a erros de validação!')
                errors.value = error.response.data.errors
              } else {
                toast.error('Evento ' + event.value.name + ' não criado devido a erro(s) desconhecido para o servidor!')
              }
            })
        }else{
          formData.append('_method', 'put')
          axios.post('events/' + props.id, formData, { headers: { 'Content-Type': 'multipart/form-data' }})
          .then((response) => {
            event.value = response.data.data
            toast.success('Evento ' + event.value.name + ' atualizado com sucesso.')
            socket.emit('updateEvent', event.value);
            router.push({name: 'Events'})
          })
          .catch((error) => {
            if (error.response.status == 422) {
                toast.error('Evento ' + event.value.name + ' não atualizado devido a erros de validação.')
                errors.value = error.response.data.errors
              } else {
                toast.error('Evento ' + event.value.name + ' não atualizado devido a erro desconhecido.')
              }
          })
        }
  }

  socket.on('updateEvent', (eventUpdated) => {
    event.value = eventUpdated
  })

  const cancel = () => {
    router.push({name: 'Events'})
  }

  const errors = ref(null)
  const confirmationLeaveDialog = ref(null)

  watch(
    () => props.id,
    (newValue) => {
        loadEvent(newValue)
      },
    {immediate: true}  
    )

</script>

<template>
  <!--event-detail
    :event="event"
    :errors="errors"
    :operationType="operation"
    @save="save"
    @cancel="cancel"
  ></event-detail-->
  <event-detail
    :event="event"
    :operationType="operation"
    @save="save"
    @cancel="cancel"
  ></event-detail>
</template>
