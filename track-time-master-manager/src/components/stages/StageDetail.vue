<script setup>
import { ref, watch, computed, inject, onMounted } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'
import moment from 'moment'
import { BIconArrowRight, BIconArrowDown, BIconTrash } from "bootstrap-icons-vue";

const serverBaseUrl = inject("serverBaseUrl");
const axios = inject('axios')
const toast = inject('toast')

const props = defineProps({
  stage: {
    type: Object,
    required: true,
  },
  operationType: {
    type: String,
    default: "insert", // insert / update
  },
})

const emit = defineEmits(["save", "cancel"]);

//https://stackoverflow.com/questions/46708110/convert-date-format-in-javascript-using-vuejs
const formatDate = (value)=>{
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm:ss a')
  }
}

const editingStage = ref(props.stage)

watch(
  () => props.stage,
  (newStage) => {
    editingStage.value = newStage
  },
  { immediate: true }
)

const stageTitle = computed(() => {
  if (!editingStage.value){
    return ""
  }
  return props.operationType == "insert" ? "Nova Etapa" : "Etapa #" + editingStage.value.id;
})

const save = () => {
  emit("save", editingStage.value);
}

const cancel = () => {
  emit("cancel", editingStage.value);
}
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">{{ stageTitle }}</h3>
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
            v-model="editingStage.name"
          />
        </div>

        <div class="mb-3 px-1">
          <label for="inputDateStart" class="form-label">Data de Início</label>
          <input
            type="datetime-local"
            class="form-control"
            id="inputDateStart"
            required
            v-model="editingStage.date_start"
          />
        </div>

        <!--div class="mb-3">
          <label for="inputNumRuns" class="form-label">Nº de Partidas</label>
          <input
            type="number"
            class="form-control"
            id="inputNumRuns"
            placeholder="Nº de Partidas"
            min="1"
            required
            v-model="editingStage.num_runs"
          />
        </div>

        <div-- class="mb-3">
          <label for="inputTimeUntilNextRunMins" class="form-label">Minutos até partida seguinte</label>
          <input
            type="number"
            class="form-control"
            id="inputTimeUntilNextRunMins"
            placeholder="Minutos até partida seguinte"
            min="0"
            required
            v-model="editingStage.time_until_next_run_mins"
          />
        </div-->
        
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
