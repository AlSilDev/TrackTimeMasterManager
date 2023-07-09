<script setup>
  import { ref, watch, inject, computed, onMounted } from 'vue'
  import UserDetail from "./UserDetail.vue"
  import { useUserStore } from '../../stores/user';
  import { useRouter, onBeforeRouteLeave } from 'vue-router'  
  
  const router = useRouter()  
  const axios = inject('axios')
  const toast = inject('toast')
  const userStore = useUserStore()
  const socket = inject("socket")

  const props = defineProps({
      id: {
        type: Number,
        default: null
      }
  })

  const operation = computed( () => (!props.id || props.id < 0) ? 'insert' : 'update')

  const newUser = () => {
      return {
        id: null,
        name: '',
        email: '',
        type_id: 1,
        blocked: 0,
        password: '',
        photo_url: null
      }
  }

  const loadUser = (id) => { 
      errors.value = null
      if (!id || (id < 0)) {
        user.value = newUser()
      } else {
        axios.get('users/' + id)
          .then((response) => {
            user.value = response.data.data
          })
          .catch((error) => {
            console.log(error)
          })
      }
  }

  const save = (editingUserValue, photo_fileValue) => {
      errors.value = null
      const formData = new FormData()
      if(photo_fileValue){
          formData.append('photo_file', photo_fileValue)
      }
      formData.append('name', editingUserValue.name)
      formData.append('email', editingUserValue.email)
      formData.append('password', editingUserValue.password)
      formData.append('type_id', editingUserValue.type_id)

      console.log('FormData:' + formData.values())

      if (operation.value == "insert"){
        console.log("POST Method")
        axios.post('users', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then((response) => {
            user.value = response.data.data
            console.log(response.data)
            console.log(editingUserValue.name)
            toast.success('O utilizador ' +  editingUserValue.name + ' foi criado com sucesso.')
            router.push({name: 'Users'})
          })
          .catch((error) => {
            console.log(error)
            if (error.status == 422) {
              toast.error('Utilizador não criado devido a erros de validação.')
              errors.value = error.response.data.errors
            } else {
              toast.error('Utilizador não criado devido a erro desconhecido.')
            }
          })
      }else{
        console.log("PUT Method")
        formData.append('_method', 'put')
        console.log("Nome: " + formData.get("name"))
        console.log("Email: " + formData.get("email"))
        console.log("Photo_file: " + formData.get("photo_file"))
        console.log("_Method: " + formData.get("_method"))
        axios.post('users/' + props.id, formData)
        .then((response) => {
          user.value = response.data.data
          toast.success('O utilizador #' + user.value.id + ' foi atualizado com sucesso.')
          socket.emit('updateUser', user.value);
          router.push({name: 'Users'})
        })
        .catch((error) => {
          if (error.status == 422) {
              toast.error('O utilizador #' + props.id + ' não foi atualizado devido a erros de validação.')
              errors.value = error.response.data.errors
            } else {
              toast.error('O utilizador #' + props.id + ' não foi atualizado devido a erro desconhecido.')
            }
        })
      }
  }

  socket.on('updateUser', (userUpdated) => {
    user.value = userUpdated
  })

  const cancel = () => {
    router.push({name: 'Users'})
  }


  const user = ref(newUser())
  const errors = ref(null)

  watch(
    () => props.id,
    (newValue) => {
      loadUser(newValue)
    },
    {immediate: true}  
    )

  

</script>

<template>
  <user-detail
    :operationType="operation"
    :user="user"
    :errors="errors"
    @cancel="cancel"
    @save="save"
  ></user-detail>
</template>
