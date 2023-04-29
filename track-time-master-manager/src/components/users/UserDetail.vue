<script setup>
import { ref, watch, computed, inject, onMounted } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'
import { useUserStore } from "../../stores/user.js"
import { useRouter } from 'vue-router' 

const router = useRouter()  
const axios = inject('axios')
const toast = inject('toast')

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()

const image = ref('');
const photo_file = ref('')
const photo_file_url = ref('')

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    required: false
  },
  operationType: {
    type: String,
    default: "insert", // insert / update
  },
})

const emit = defineEmits(["save", "cancel"]);
//const emit = defineEmits(["cancel"]);

const editingUser = ref(props.user)

watch(
  () => props.user,
  (newUser) => {
    editingUser.value = newUser
  },
  { immediate: true }
)

const uploadImage =  ()=>{
    photo_file.value = image.value.files[0];
    photo_file_url.value = URL.createObjectURL(photo_file.value)
    photoFullUrl.value = photo_file_url.value;
}

const photoFullUrl = ref()

/*const save = () => {
  emit("save", editingUser.value);
}*/

onMounted(()=>{
  setTimeout(()=>{
    photoFullUrl.value = editingUser.value.photo_url ? serverBaseUrl + "/storage/fotos/" + editingUser.value.photo_url : avatarNoneUrl;
    //console.log("Photo: " + photoFullUrl.value)
    //console.log("Photo: " + editingUser.value.photo_url)
    //console.log("Photo props: " + props.user.photo_file)
  },1000);
  
}) 

/*const save = () => {
      errors.value = null
      const formData = new FormData()
      if(photo_file.value){
          formData.append('photo_file', photo_file.value)
      }
      formData.append('name', editingUser.value.name)
      formData.append('email', editingUser.value.email)
      formData.append('password', editingUser.value.password)
      formData.append('type', editingUser.value.type)

      console.log('FormData:' + formData.values())

      if (props.operationType == "insert"){
        axios.post('users', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then((response) => {
            //user.value = response.data.data
            //originalValueStr = dataAsString()
            console.log(response.data)
            console.log(editingUser.value.name)
            toast.success('User ' +  editingUser.value.name + ' was created successfully.')
            router.push({name: 'Users'})
            //emit("save", editingUser.value);
          })
          .catch((error) => {
            if (error.response.status == 422) {
              toast.error('User was not created due to validation errors!')
              //errors.value = error.response.data.errors
            } else {
              toast.error('User was not created due to unknown server error!')
            }
          })
      }else{
        console.log("Put method not implemented yet!")
        axios.put('vehicles/' + props.id, user.value)
        .then((response) => {
          vehicle.value = response.data.data
          originalValueStr = dataAsString()
          toast.success('Vehicle #' + vehicle.value.id + ' was updated successfully.')
          router.push({name: 'Vehicles'})
        })
        .catch((error) => {
          if (error.response.status == 422) {
              toast.error('Vehicle #' + props.id + ' was not updated due to validation errors!')
              errors.value = error.response.data.errors
            } else {
              toast.error('Vehicle #' + props.id + ' was not updated due to unknown server error!')
            }
        })
      }
  }*/

const save = () => {
  emit("save", editingUser.value, photo_file.value);
}

const cancel = () => {
  emit("cancel", editingUser.value);
}

const userTitle = computed(() => {
  if (!editingUser.value){
    return ""
  }
  return props.operationType == "insert" ? "Novo Utilizador" : "Utilizador #" + editingUser.value.id;
})
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">{{ userTitle }}</h3>
    <hr />
    <div class="d-flex flex-wrap justify-content-between">
      <div class="w-75 pe-4">
        <div class="mb-3">
          <label for="inputName" class="form-label">Nome</label>
          <input
            type="text"
            class="form-control"
            id="inputName"
            placeholder="Nome"
            required
            v-model="editingUser.name"
          />
          <field-error-message :errors="errors" fieldName="name"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputEmail" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="inputEmail"
            placeholder="Email"
            required
            v-model="editingUser.email"
          />
          <field-error-message :errors="errors" fieldName="email"></field-error-message>
        </div>

        <div class="mb-3 px-1" v-if="props.operationType == 'insert' && user.id == props.id">
          <label for="inputTipo" class="form-label">Tipo</label>
          <br>
          <select name="type" v-model="editingUser.type">
              <option value="A">Administrador</option>
              <option value="S">Secretariado</option>
          </select>
          <field-error-message :errors="errors" fieldName="type"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputType" class="form-label">Tipo</label>
          <br>
          <select name="type" v-model="editingUser.type" v-if="userStore.user.type == 'A'">
              <option value="A">Administrador</option>
              <option value="S">Secretariado</option>
          </select>
          <select name="type" v-model="editingUser.type" v-else>
            <option value="S">Secretariado</option>
          </select>
          <field-error-message :errors="errors" fieldName="type"></field-error-message>
        </div>

        <div class="mb-3 px-1" v-if="props.operationType == 'insert'">
          <label for="inputEmail" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="inputEmail"
            placeholder="Password"
            required
            v-model="editingUser.password"
          />
          <field-error-message :errors="errors" fieldName="password"></field-error-message>
        </div>

        <!--div class="mb-3 px-1">
          <label for="inputEmail" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="inputEmail"
            placeholder="Email"
            required
            v-model="editingUser.email"
          />
          <field-error-message :errors="errors" fieldName="email"></field-error-message>
        </div-->
      </div>
      <div class="w-25">
        <div class="mb-3">
          <label class="form-label">Fotografia</label>
          <div class="form-control text-center">
            <img :src="photoFullUrl" class="w-100" />
          </div>
          <input type="file" ref="image" class="form-control" name="image" v-on:change="uploadImage()"/>
        </div>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-end">
      <button type="button" class="btn btn-dark px-5" @click="save">Guardar</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancelar</button>
    </div>
  </form>
</template>

<style scoped>
.total_hours {
  width: 26rem;
}
</style>
