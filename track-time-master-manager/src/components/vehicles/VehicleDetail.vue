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

const photoFullUrl = computed(() => {
  return editingVehicle.value.photo_url
    ? serverBaseUrl + "/storage/fotos/" + editingVehicle.value.photo_url
    : avatarNoneUrl
})

const vehicleTitle = computed(() => {
  if (!editingVehicle.value){
    return ""
  }
  return props.operationType == "insert" ? "Nova Viatura" : "Viatura #" + editingVehicle.value.id;
})

const save = () => {
  emit("save", editingVehicle.value);
}

const cancel = () => {
  emit("cancel", editingVehicle.value);
}
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <!--h3 class="mt-5 mb-3">Vehicle #{{ editingVehicle.id }}</h3-->
    <h3 class="mt-5 mb-3">{{ vehicleTitle }}</h3>
    <hr />
    <div class="d-flex flex-wrap justify-content-center">
      <div class="w-75 pe-4">
        <div class="mb-3">
          <label for="inputModel" class="form-label">Model</label>
          <input
            type="text"
            class="form-control"
            id="inputModel"
            placeholder="Model"
            required
            v-model="editingVehicle.model"
          />
          <field-error-message :errors="errors" fieldName="model"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputCategory" class="form-label">Category</label>
          <input
            type="text"
            class="form-control"
            id="inputCategory"
            placeholder="Category"
            required
            v-model="editingVehicle.category"
          />
          <field-error-message :errors="errors" fieldName="category"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputClass" class="form-label">Class</label>
          <input
            type="text"
            class="form-control"
            id="inputClass"
            placeholder="Class"
            required
            v-model="editingVehicle.class"
          />
          <field-error-message :errors="errors" fieldName="class"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputLicensePlate" class="form-label">License Plate</label>
          <input
            type="text"
            class="form-control"
            id="inputLicensePlate"
            placeholder="License Plate"
            required
            v-model="editingVehicle.license_plate"
          />
          <field-error-message :errors="errors" fieldName="license_plate"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputYear" class="form-label">Year</label>
          <input
            type="number"
            class="form-control"
            id="inputYear"
            placeholder="Year"
            required
            v-model="editingVehicle.year"
          />
          <field-error-message :errors="errors" fieldName="year"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label for="inputEngineCapacity" class="form-label">Engine Capacity</label>
          <input
            type="number"
            class="form-control"
            id="inputEngineCapacity"
            placeholder="Engine Capacity"
            required
            v-model="editingVehicle.engine_capacity"
          />
          <field-error-message :errors="errors" fieldName="engine_capacity"></field-error-message>
        </div>
        <!--div class="d-flex ms-1 mt-4 flex-wrap justify-content-between">
          <div class="mb-3 me-3 flex-grow-1">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                true-value="A"
                false-value="M"
                v-model="editingVehicle.type"
                id="inputType"
              />
              <label class="form-check-label" for="inputType">
                User is Administrator
              </label>
              <field-error-message :errors="errors" fieldName="type"></field-error-message>
            </div>
          </div>
          <div class="mb-3 ms-xs-3 flex-grow-1">
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="radioGender"
                value="M"
                required
                v-model="editingVehicle.gender"
                id="inputGenderM"
              />
              <label class="form-check-label" for="inputGenderM">Masculino</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                name="radioGender"
                value="F"
                v-model="editingVehicle.gender"
                id="inputGenderF"
              />
              <label class="form-check-label" for="inputGenderF">Feminino</label>
            </div>
            <field-error-message :errors="errors" fieldName="gender"></field-error-message>
          </div>
        </div-->
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
      <button type="button" class="btn btn-primary px-5" @click="save">Save</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancel</button>
    </div>
  </form>
</template>

<style scoped>

</style>
