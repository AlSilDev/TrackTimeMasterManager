<script setup>
import { ref, watch, computed, inject, onMounted } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'

const axios = inject('axios')
const serverBaseUrl = inject("serverBaseUrl");

const props = defineProps({
  driver: {
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

const editingDriver = ref(props.driver)

watch(
  () => props.driver,
  (newDriver) => {
    editingDriver.value = newDriver
  },
  { immediate: true }
)

/*const photoFullUrl = computed(() => {
  return editingUser.value.photo_url
    ? serverBaseUrl + "/storage/fotos/" + editingUser.value.photo_url
    : avatarNoneUrl
})*/

const driverTitle = computed(() => {
  if (!editingDriver.value){
    return ""
  }
  return props.operationType == "insert" ? "Novo Concorrente" : "Concorrente #" + editingDriver.value.id;
})

const countries = ref([])
const loadCountries = async ()=>{
  await axios.get('https://restcountries.com/v3.1/all?fields=name,translations')
  .then((response)=>{
    countries.value = response.data
    countries.value.sort((a, b)=>{
      return a.name.common.localeCompare(b.name.common);
    })
    console.log(countries.value)
  })
  .catch((error)=>{
    console.error(error)
  })
}

const save = () => {
  emit("save", editingDriver.value);
}

const cancel = () => {
  emit("cancel", editingDriver.value);
}

onMounted(async ()=>{
  await loadCountries()
})
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">{{ driverTitle }}</h3>
    <hr />
    <div class="d-flex flex-wrap justify-content-center">
      <div class="w-75 pe-4">
        <div class="mb-3">
          <label for="inputName" class="form-label">Nome</label>
          <input
            type="text"
            class="form-control"
            id="inputName"
            placeholder="Nome"
            required
            v-model="editingDriver.name"
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
            v-model="editingDriver.email"
          />
          <field-error-message :errors="errors" fieldName="email"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputLicenseNum" class="form-label">Nr. Licença</label>
          <input
            type="number"
            class="form-control"
            id="inputLicenseNum"
            placeholder="Numero de Licença"
            required
            v-model="editingDriver.license_num"
          />
          <field-error-message :errors="errors" fieldName="license_num"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputLicenseExpiry" class="form-label">Validade da Licença</label>
          <input
            type="date"
            name="trip-start"
            class="form-control"
            id="inputLicenseExpiry"
            placeholder="Validade da Licença"
            required
            v-model="editingDriver.license_expiry"
          />
          <field-error-message :errors="errors" fieldName="license_expiry"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputPhoneNum" class="form-label">Nr. Telemóvel</label>
          <input
            type="tel"
            class="form-control"
            id="inputPhoneNum"
            placeholder="Numero de Telemovel"
            required
            v-model="editingDriver.phone_num"
          />
          <field-error-message :errors="errors" fieldName="phone_num"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputAffiliateNum" class="form-label">Nr. Afiliação</label>
          <input
            type="number"
            class="form-control"
            id="inputAffiliateNum"
            placeholder="Numero de Afiliacao"
            required
            v-model="editingDriver.affiliate_num"
          />
          <field-error-message :errors="errors" fieldName="affiliate_num"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputCategory" class="form-label">País: </label>
          <select class="form-select" id="inputCategory" v-model="editingDriver.country">
              <option v-for="country in countries" v-bind:value="country.name.common">{{country.name.common}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-dark px-5" @click="save">Guardar</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancelar</button>
    </div>
  </form>
</template>

<style scoped>

</style>
