<script setup>
import { ref, watch, computed, inject, onMounted } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'
import { useRouter } from 'vue-router' 
import FieldErrorMessage from '../global/FieldErrorMessage.vue'

const router = useRouter()  
const axios = inject('axios')
const toast = inject('toast')

const serverBaseUrl = inject("serverBaseUrl");

const image = ref('');
const photo_file = ref('')
const photo_file_url = ref('')

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  userCategories: {
    type: Array,
    default: () => []
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

const userCategories = ref([])
const loadUserCategories = (async() => {
    await axios.get('userCategories')
        .then((response) => {
          userCategories.value = response.data
        })
        .catch((error) => {
          console.error(error)
        })
  })

onMounted(()=>{
  setTimeout(()=>{
    photoFullUrl.value = editingUser.value.photo_url ? serverBaseUrl + "/storage/fotos/" + editingUser.value.photo_url : avatarNoneUrl;
  },1000);
  loadUserCategories()
})

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
          <field-error-message :errors="props.errors" fieldName="name"></field-error-message>
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
          <field-error-message :errors="props.errors" fieldName="email"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputCategory" class="form-label">Categoria: </label>
          <br>
          <select id="inputCategory" class="form-select" v-model="editingUser.type_id">
              <option v-for="userCategory in userCategories" v-bind:value="userCategory.id">{{userCategory.name}} ({{userCategory.abv}})</option>
          </select>
          <field-error-message :errors="props.errors" fieldName="category"></field-error-message>
        </div>

        <div class="mb-3 px-1" v-if="props.operationType == 'insert'">
          <label for="inputPassword" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            placeholder="Password"
            required
            v-model="editingUser.password"
          />
          <field-error-message :errors="props.errors" fieldName="password"></field-error-message>
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
          <label class="form-label">Photo</label>
          <div class="form-control text-center">
            <img :src="photoFullUrl" class="w-100" />
          </div>
          <input type="file" ref="image" class="form-control" name="image" v-on:change="uploadImage()"/>
          <field-error-message :errors="props.errors" fieldName="photo_url"></field-error-message>
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
