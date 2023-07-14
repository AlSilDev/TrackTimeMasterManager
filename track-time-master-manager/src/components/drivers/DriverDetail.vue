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
  countries: {
    type: Array,
    required: false
  }
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

const selectedCountry = ref()

const save = () => {
  editingDriver.value.country = selectedCountry.value.value
  emit("save", editingDriver.value);
}

const cancel = () => {
  emit("cancel", editingDriver.value);
}
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
          <label for="inputCountry" class="form-label">País</label>
          <br>
          <select class="form-select" name="country" ref="selectedCountry">
              <option v-for="country in props.countries" v-bind:value="country.cca3" :selected="props.operationType == 'update' && country.cca3.localeCompare(editingDriver.country.toUpperCase()) == 0">{{country.name.common}}</option>
          </select>
          <!--field-error-message :errors="errors" fieldName="category"></field-error-message-->
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
          <label for="inputAffiliateNum" class="form-label">Nr. Sócio</label>
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
