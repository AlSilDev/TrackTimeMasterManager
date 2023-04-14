<script setup>
  import { ref, watch, inject, onMounted } from "vue"
  import { useUserStore } from "../../stores/user.js"
  import { useRouter, onBeforeRouteLeave } from "vue-router"

  const router = useRouter()
  const axios = inject('axios')
  const userStore = useUserStore()
  const toast = inject("toast")
  
  const serverBaseUrl = inject("serverBaseUrl");
  
  const passwords = ref({
        current_password: '',
        password: '',
        password_confirmation: ''
    })
  
  const newUser = () => {
    return {
      id: null,
      name: '',
      email: '',
      type: '',
      blocked: null,
      password: '',
      photo_url: null
    }
  }

  const props = defineProps({
    id: {
      type: Number,
      default: null
    }
  })

  const dataAsString = () => {
      return JSON.stringify(user.value)
  }

  let originalValueStr = ''
  const loadUser = (id) => {
    console.log("ID: " + id) 
    originalValueStr = ''
      if (!id || (id < 0)) {
        user.value = newUser()
        originalValueStr = dataAsString()
      } else {
        axios.get('users/' + id)
          .then((response) => {
            user.value = response.data.data
            originalValueStr = dataAsString()
          })
          .catch((error) => {
            console.log(error)
          })
      }
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
      confirmationLeaveDialog.value.show()
    } else {
      next()
    }
  }) 

  const user = ref(newUser())
  const errors = ref(null)
  const confirmationLeaveDialog = ref(null)
  watch(
    () => props.id,
    (newValue) => {
        loadUser(newValue)
      },
    {immediate: true}  
    )

  const passwordConfirmation = ref(null)

  const emit = defineEmits(['changedPassword'])

  const changePassword = async () => {
      if (passwords.value.password != passwords.value.password_confirmation) {
        toast.warning('"Current Password" and "Password Confirmation" are not the same!')
        passwords.value.password_confirmation = ""
        passwordConfirmation.value.focus()
        return
      }
      if (await userStore.changePassword(passwords.value)) {
        toast.success("Password has been changed correctly!")
        emit("changedPassword")
        router.back()
        
      } else {
        passwords.value.password_confirmation = ""
        toast.error("Password has not been changed!")
      }
  }

  const photoFullUrl = ref()
  onMounted(()=>{
    setTimeout(()=>{
      photoFullUrl.value = user.value.photo_url ? serverBaseUrl + "/storage/fotos/" + user.value.photo_url : avatarNoneUrl;
      //console.log("Photo: " + photoFullUrl.value)
      //console.log("Photo: " + editingUser.value.photo_url)
      //console.log("Photo props: " + props.user.photo_file)
    },1000);
}) 
</script>

<template>
  <confirmation-dialog
    ref="confirmationLeaveDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed"
  >
  </confirmation-dialog> 
  {{userStore.errors}}
  <form class="row g-3 needs-validation" novalidate @submit.prevent="changePassword">
    <h3 class="mt-5 mb-3">Mudar a password</h3>
    <hr />

    <div class="container">
      <div class="row">
        <div class="col-sm-2">
          <div class="mb-3">
            <div class="form-control text-center">
              <img :src="photoFullUrl" class="w-100" />
            </div>
          </div>
        </div>
        <div class="col-sm align-self-center">
          <div class="mb-3">
          <label class="bg-warning" v-if="user.type == 'A'">ADMINISTRADOR</label>
          <label class="bg-success" v-if="user.type == 'S'">SECRETARIADO</label>
          </div>
          <div class="mb-3">
            Nome: <label class="fw-bold"> {{ user.name }}</label>
          </div>
          <div class="mb-3">
            Email: <label class="fw-bold"> {{ user.email }}</label>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputCurrentPassword" class="form-label">Atual Password</label>
        <input
          type="password"
          class="form-control"
          id="inputCurrentPassword"
          required
          v-model="passwords.current_password"
        />
        <field-error-message :errors="userStore.errors" fieldName="current_password"></field-error-message>
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputPassword" class="form-label">Nova Password</label>
        <input
          type="password"
          class="form-control"
          id="inputPassword"
          required
          v-model="passwords.password"
        />
        <field-error-message :errors="userStore.errors" fieldName="password"></field-error-message>
      </div>
    </div>
    <div class="mb-3">
      <div class="mb-3">
        <label for="inputPasswordConfirm" class="form-label">Nova Password</label>
        <input
          type="password"
          class="form-control"
          id="inputPasswordConfirm"
          ref="passwordConfirmation"
          required
          v-model="passwords.password_confirmation"
        />
        <field-error-message :errors="userStore.errors" fieldName="password_confirmation"></field-error-message>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-dark px-5" @click="changePassword">
        Mudar a password
      </button>
    </div>
  </form>
</template>

