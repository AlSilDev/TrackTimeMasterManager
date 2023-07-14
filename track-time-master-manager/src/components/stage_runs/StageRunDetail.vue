<script setup>
import { ref, watch, computed, inject, onMounted } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'
import moment from 'moment'
import { BIconArrowRight, BIconArrowDown, BIconTrash } from "bootstrap-icons-vue";
import FieldErrorMessage from '../global/FieldErrorMessage.vue'

const serverBaseUrl = inject("serverBaseUrl");
const axios = inject('axios')
const toast = inject('toast')

const props = defineProps({
  stageRun: {
    type: Object,
    required: true,
  },
  operationType: {
    type: String,
    default: "insert", // insert / update
  },
  errors: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(["save", "cancel"]);

//https://stackoverflow.com/questions/46708110/convert-date-format-in-javascript-using-vuejs
const formatDate = (value)=>{
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm:ss a')
  }
}

const editingStageRun = ref(props.stageRun)

watch(
  () => props.stageRun,
  (newStageRun) => {
    editingStageRun.value = newStageRun
  },
  { immediate: true }
)

const stageRunTitle = computed(() => {
  if (!editingStageRun.value){
    return ""
  }
  return props.operationType == "insert" ? "Nova Partida" : "Editar Partida";
})

const save = () => {
  emit("save", editingStageRun.value);
}

const cancel = () => {
  emit("cancel", editingStageRun.value);
}


onMounted(()=>{
  
})

</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">{{ stageRunTitle }}</h3>
    <hr />
    <div class="justify-content-center">
        <div class="mb-3 px-1">
          <label for="inputDateStart" class="form-label">Data de Início</label>
          <input
            type="datetime-local"
            class="form-control"
            id="inputDateStart"
            required
            v-model="editingStageRun.date_start"
          />
          <field-error-message :errors="props.errors" fieldName="date_start"></field-error-message>
        </div>
        
        <div class="mb-3 px-1">
          <label for="inputPractice" class="form-label">Treino </label>
          <input type="hidden" name="inputPractice" value="0" />
          <input
            type="checkbox"
            id="inputPractice"
            value="1"
            placeholder="Nº de Partidas"
            required
            v-model="editingStageRun.practice"
            :checked="editingStageRun.practice"
          />
          <field-error-message :errors="props.errors" fieldName="practice"></field-error-message>
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
