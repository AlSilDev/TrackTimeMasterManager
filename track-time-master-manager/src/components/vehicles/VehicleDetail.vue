<script setup>
import { ref, watch, computed, onMounted, inject } from "vue";

const axios = inject("axios")
const toast = inject("toast")
const serverBaseUrl = inject("serverBaseUrl");

const props = defineProps({
  vehicle: {
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

const editingVehicle = ref(props.vehicle)

watch(
  () => props.vehicle,
  (newVehicle) => {
    editingVehicle.value = newVehicle
  },
  { immediate: true },
)

const vehicleTitle = computed(() => {
  if (!editingVehicle.value){
    return ""
  }
  return props.operationType == "insert" ? "Nova Viatura" : "Viatura #" + editingVehicle.value.id;
})

const save = () => {
  emit("save", editingVehicle.value);
};

const cancel = () => {
  emit("cancel", editingVehicle.value);
};

const categories = ref([])
const classes = ref([])
const classesCategoryId = ref([])

const isCategoryNotNull = (categoryId) => {
  if(categoryId != 0){
    classesCategoryId.value.length = 0;
    let i;
    for (i = 0; i < classes.value.length; i++) {
      if(((classes.value[i]).category_id) == categoryId){
        classesCategoryId.value.push(classes.value[i]);
      }
    }
    return true;
  }
  return false;
}

const loadCategories = (async()  => {
    await axios.get('categories')
        .then((response) => {
          //laravelData.value = response.data
          categories.value = response.data
        })
        .catch((error) => {
          console.log(error)
        })
})

const loadClasses = (async()  => {
    await axios.get('classes')
        .then((response) => {
          //laravelData.value = response.data
          classes.value = response.data
        })
        .catch((error) => {
          console.log(error)
        })
})

onMounted (() => {
  loadCategories()
  loadClasses()
})

</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <!--h3 class="mt-5 mb-3">Vehicle #{{ editingVehicle.id }}</h3-->
    <h3 class="mt-5 mb-3">{{ vehicleTitle }}</h3>
    <hr />
    <div class="d-flex flex-wrap justify-content-center">
      <div class="w-75 pe-4">
        <div class="mb-3">
          <label for="inputModel" class="form-label">Modelo</label>
          <input
            type="text"
            class="form-control"
            id="inputModel"
            placeholder="Modelo"
            required
            v-model="editingVehicle.model"
          />
          <field-error-message :errors="errors" fieldName="model"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputCategory" class="form-label">Categoria</label>
          <br>
          <select name="category" v-model="editingVehicle.category">
              <option v-for="category in categories" v-bind:value="category.id">{{category.name}}</option>
          </select>
          <field-error-message :errors="errors" fieldName="category"></field-error-message>
        </div>

        <div class="mb-3 px-1" v-if="isCategoryNotNull(editingVehicle.category)">
          <label for="inputClass" class="form-label">Classe</label>
          <br>
          <!--select name="class_id" v-model="editingVehicle.class_id"-->
          <select name="class_id" v-model="editingVehicle.class_id">
              <!--option v-for="classe in classes" v-bind:value="classe.id">{{classe.name}}</option-->
              <option v-for="classe in classesCategoryId" v-bind:value="classe.id" >{{classe.name}}</option>
          </select>
          <field-error-message :errors="errors" fieldName="class"></field-error-message>
        </div>

        <!--div class="mb-3 px-1" v-if="editingVehicle.category == 'CL'"-->
        <!--div class="mb-3 px-1" v-if="isCategoryCL(editingVehicle.category)">
          <label for="inputClass" class="form-label">Class</label>
          <br>
          <select name="category" v-model="editingVehicle.class">
              <option value="A3">A3</option>
              <option value="C09">C09</option>
              <option value="C10">C10</option>
              <option value="C11">C11</option>
              <option value="C12">C12</option>
          </select>
          <field-error-message :errors="errors" fieldName="class"></field-error-message>
        </div-->

        <!--div class="mb-3 px-1" v-if="isCategoryDP(editingVehicle.category)">
          <label for="inputClass" class="form-label">Classe</label>
          <br>
          <select name="category" v-model="editingVehicle.class">
              <option value="D14">D14</option>
              <option value="D15">D15</option>
              <option value="D16">D16</option>
              <option value="E18">E18</option>
              <option value="E19">E19</option>
              <option value="E20">E20</option>
              <option value="F24">F24</option>
          </select>
          <field-error-message :errors="errors" fieldName="class"></field-error-message>
        </div-->

        <div class="mb-3 px-1">
          <label for="inputLicensePlate" class="form-label">Matricula</label>
          <input
            type="text"
            class="form-control"
            id="inputLicensePlate"
            placeholder="Matricula"
            required
            v-model="editingVehicle.license_plate"
          />
          <field-error-message :errors="errors" fieldName="license_plate"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputYear" class="form-label">Ano</label>
          <input
            type="number"
            class="form-control"
            id="inputYear"
            placeholder="Ano"
            required
            v-model="editingVehicle.year"
          />
          <field-error-message :errors="errors" fieldName="year"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputEngineCapacity" class="form-label">Cilindrada (cm3)</label>
          <input
            type="number"
            class="form-control"
            id="inputEngineCapacity"
            placeholder="Cilindrada (cm3)"
            required
            v-model="editingVehicle.engine_capacity"
          />
          <field-error-message :errors="errors" fieldName="engine_capacity"></field-error-message>
        </div>
      </div>
      <!--div class="w-25">
        <div class="mb-3">
          <label class="form-label">Photo</label>
          <div class="form-control text-center">
            <img :src="photoFullUrl" class="w-100" />
          </div>
        </div>
      </div-->
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-dark px-5" @click="save">Guardar</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancelar</button>
    </div>
  </form>
</template>

<style scoped>

</style>
