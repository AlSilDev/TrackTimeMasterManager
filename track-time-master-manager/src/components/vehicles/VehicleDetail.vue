<script setup>
import { ref, watch, computed, onMounted, inject } from "vue";
import FieldErrorMessage from '../global/FieldErrorMessage.vue'

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
  (editingVehicle) => {
    validData()
  },
  { immediate: true },
)

const vehicleTitle = computed(() => {
  if (!editingVehicle.value){
    return ""
  }
  return props.operationType == "insert" ? "Nova Viatura" : "Viatura #" + editingVehicle.value.id;
})

const validData = computed(()=>{
  return (editingVehicle.value.model != ''
          //&& editingVehicle.value.class_id != null
          && editingVehicle.value.class_id != null
          && editingVehicle.value.license_plate != '' 
          && editingVehicle.value.year != '' 
          && editingVehicle.value.engine_capacity != '') == true
})

const save = () => {
  editingVehicle.value.class_id = selectedClass.value.value
  emit("save", categories.value.find((element) => {return element.id == editingVehicle.value.category_id}));
};

const cancel = () => {
  emit("cancel", editingVehicle.value);
};

const categories = ref([])
const classes = ref([])
const classesCategoryId = ref([])

const isCategoryNotNull = (categoryId) => {
  if(categoryId != 0){
    editingVehicle.value.category_id = categoryId;
    //editingVehicle.value.class_id = 
    classesCategoryId.value.length = 0;
    editingVehicle.value.class_id = null
    let i;
    for (i = 0; i < classes.value.length; i++) {
      if(((classes.value[i]).category_id) == categoryId){
        classesCategoryId.value.push(classes.value[i])
        if(props.operationType == 'update' && classes.value[i].id == editingVehicle.value.class.id){
          //console.log('found select', classes.value[i])
        }
      }
    }
    return true;
  }
  return false;
}

const loadCategories = (async()  => {
    await axios.get('vehicles/categories')
        .then((response) => {
          categories.value = response.data
        })
        .catch((error) => {
          console.error(error)
        })
})

const loadClasses = (async()  => {
    await axios.get('vehicles/classes')
        .then((response) => {
          //laravelData.value = response.data
          classes.value = response.data
        })
        .catch((error) => {
          console.error(error)
        })
})

const selectedCategory = ref()
const selectedClass = ref()

onMounted (async () => {
  await loadCategories()
  await loadClasses()

  /* Carrega categoria default */
  if (editingVehicle.value.class.id)
  {
    if(categories.value.length != 0)
    {
      isCategoryNotNull(props.vehicle.category.id)
    }
    editingVehicle.value.class_id = editingVehicle.value.class.id
    //selectedClass.value.value = editingVehicle.value.class.id
  }
  else {
    isCategoryNotNull(selectedCategory.value.value)

    for (var i = 0; i < classes.value.length; i++)
    {
      if(classes.value[i].category_id == selectedCategory.value.value)
      {
        editingVehicle.value.class_id = classes.value[i].id
        break
      }  
    }
  }
  /*
  if (editingVehicle.value.class.id)
  {
    if(categories.value.length != 0)
    {
      isCategoryNotNull(props.vehicle.category.id)
    }
    //editingVehicle.value.class_id = editingVehicle.value.class.id
    //selectedClass.value.value = editingVehicle.value.class.id
  }
  else {
    isCategoryNotNull(selectedCategory.value.value)
    for (var i = 0; i < classes.value.length; i++)
    {
      if(classes.value[i].category_id == selectedCategory.value.value)
        editingVehicle.value.class_id = classes.value[i].id
    }
  }*/
  
})

</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
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
          <field-error-message :errors="props.errors" fieldName="model"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputCategory" class="form-label">Categoria</label>
          <br>
          <select class="form-select" name="category" @change="isCategoryNotNull($event.target.value)" ref="selectedCategory">
              <option v-for="category in categories" v-bind:value="category.id" :selected="props.operationType == 'update' && category.id == editingVehicle.class.category_id">{{category.name}}</option>
          </select>
          <field-error-message :errors="props.errors" fieldName="category"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputClass" class="form-label">Classe</label>
          <br>
          <!--select name="class_id" v-model="editingVehicle.class_id"-->
          <select class="form-select" name="class_id" ref="selectedClass" v-model="editingVehicle.class_id" required><!----><!--editingVehicle.class_id-->
              <!--option v-for="classe in classes" v-bind:value="classe.id">{{classe.name}}</option-->
              <option v-for="(classe, index) in classesCategoryId" v-bind:value="classe.id" :selected="(props.operationType == 'update' && classe.id == editingVehicle.class.id) || index == 1">{{classe.name}}</option>
          </select>
          <field-error-message :errors="props.errors" fieldName="class_id"></field-error-message>
        </div>

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
          <field-error-message :errors="props.errors" fieldName="license_plate"></field-error-message>
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
          <field-error-message :errors="props.errors" fieldName="year"></field-error-message>
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
          <field-error-message :errors="props.errors" fieldName="engine_capacity"></field-error-message>
        </div>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="submit" class="btn btn-dark px-5" :disabled="!validData">Guardar</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancelar</button>
    </div>
  </form>
</template>

<style scoped>

</style>
