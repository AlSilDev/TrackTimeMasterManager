<script setup>
  import { ref, watch, computed, inject } from 'vue'
  import EventDetail from "./EventDetail.vue"
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
            console.log(error)
          })
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
    formData.append('date_start_enrollments', editingEventValue.date_start_enrollments)
    formData.append('date_end_enrollments', editingEventValue.date_end_enrollments)
    formData.append('date_start_event', editingEventValue.date_start_event)
    formData.append('date_end_event', editingEventValue.date_end_event)
    formData.append('year', editingEventValue.year)
    formData.append('category_id', editingEventValue.category_id)
    formData.append('base_penalty', editingEventValue.base_penalty)
    formData.append('point_calc_reason', editingEventValue.point_calc_reason)

        if (operation.value == "insert"){
          axios.post('events', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
            .then((response) => {
              event.value = response.data.data
              toast.success('Event #' + event.value.id + ' was created successfully.')
              router.push({name: 'Events'})
            })
            .catch((error) => {
              if (error.response.status == 422) {
                toast.error('Event was not created due to validation errors!')
                errors.value = error.response.data.errors
              } else {
                toast.error('Event was not created due to unknown server error!')
              }
            })
        }else{
          console.log("PUT Method")
          formData.append('_method', 'put')
          axios.post('events/' + props.id, formData, { headers: { 'Content-Type': 'multipart/form-data' }})
          .then((response) => {
            event.value = response.data.data
            toast.success('Event #' + event.value.id + ' was updated successfully.')
            router.push({name: 'Events'})
          })
          .catch((error) => {
            if (error.response.status == 422) {
                toast.error('Event #' + props.id + ' was not updated due to validation errors!')
                errors.value = error.response.data.errors
              } else {
                toast.error('Event #' + props.id + ' was not updated due to unknown server error!')
              }
          })
        }
  }

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
  <event-detail
    :event="event"
    :errors="errors"
    :operationType="operation"
    @save="save"
    @cancel="cancel"
  ></event-detail>
</template>
