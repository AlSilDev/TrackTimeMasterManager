<script setup>
import { ref, watch, computed, inject } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'

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
  { immediate: true }
)

/*const photoFullUrl = computed(() => {
  return editingVehicle.value.photo_url
    ? serverBaseUrl + "/storage/fotos/" + editingVehicle.value.photo_url
    : avatarNoneUrl
})*/

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

const isCLType = () => {
  if (editingVehicle.category == 'CL'){
    console.log("Entrou em CL");
    return editingVehicle.category == 'CL';
  }
};

const isDPType = () => {
  if (editingVehicle.category == 'DP'){
    console.log("Entrou em DP");
    return editingVehicle.category == 'DP';
  }
};

const loadClass = () => {
  if (editingVehicle.category == 'CL'){
    newVehicle.class = 'A3';
  }
  if (editingVehicle.category == 'DP'){
    newVehicle.class = 'D14';
  }
};
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
              <option value="CL">CL</option>
              <option value="DP">DP</option>
              <option value="PR">PR</option>
          </select>
          <field-error-message :errors="errors" fieldName="category"></field-error-message>
        </div>

        <div class="mb-3 px-1" v-if="editingVehicle.category == 'CL'">
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
        </div>

        <div class="mb-3 px-1" v-if="editingVehicle.category == 'DP'">
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
      <button type="button" class="btn btn-primary px-5" @click="save">Guardar</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancelar</button>
    </div>
  </form>
</template>

<style scoped>

</style>
