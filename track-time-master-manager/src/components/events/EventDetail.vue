<script setup>
import { ref, watch, computed, inject, onMounted } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'

const serverBaseUrl = inject("serverBaseUrl");

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  operationType: {
    type: String,
    default: "insert", // insert / update
  },
})

const emit = defineEmits(["save", "cancel"]);

const editingEvent = ref(props.event)

watch(
  () => props.event,
  (newEvent) => {
    editingEvent.value = newEvent
  },
  { immediate: true }
)



const eventTitle = computed(() => {
  if (!editingEvent.value){
    return ""
  }
  return props.operationType == "insert" ? "Novo Evento" : "Evento #" + editingEvent.value.id;
})


const file_input = ref('');
const file = ref('')
const file_url = ref('')

const uploadCourse =  ()=>{
    file.value = file_input.value.files[0];
    file_url.value = URL.createObjectURL(file.value)
    fileFullUrl.value = file_url.value;
}

const fileFullUrl = ref()


const image_file_input = ref('');

const uploadImage =  ()=>{
    imageFullUrl.value = URL.createObjectURL(image_file_input.value.files[0])
}

const imageFullUrl = ref()

const save = () => {
  emit("save", editingEvent.value, image_file_input.value.files[0], file.value);
}

const cancel = () => {
  emit("cancel", editingEvent.value);
}

onMounted(()=>{
  setTimeout(()=>{
    imageFullUrl.value = editingEvent.value.image_url
      ? serverBaseUrl + "/storage/fotos/eventos/" + editingEvent.value.image_url
      : null

    console.log("image: " + imageFullUrl.value)

    fileFullUrl.value = editingEvent.value.course_url
      ? serverBaseUrl + "/storage/circuitos/" + editingEvent.value.course_url
      : null

    console.log("course: " + editingEvent.value.course_url)
    console.log("course url: " + fileFullUrl.value)
  }, 1000)
})

</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">{{ eventTitle }}</h3>
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
            v-model="editingEvent.name"
          />
        </div>

        <div class="mb-3 px-1">
          <label for="inputDateStartEnrollments" class="form-label">Data de Início de Inscrições</label>
          <input
            type="date"
            class="form-control"
            id="inputDateStartEnrollments"
            required
            v-model="editingEvent.date_start_enrollments"
          />
        </div>

        <div class="mb-3 px-1">
          <label for="inputDateEndEnrollments" class="form-label">Data de Fim de Inscrições</label>
          <input
            type="date"
            class="form-control"
            id="inputDateEndEnrollments"
            required
            v-model="editingEvent.date_end_enrollments"
          />
        </div>

        <div class="mb-3 px-1">
          <label for="inputDateStartEvent" class="form-label">Data de Início da Prova</label>
          <input
            type="date"
            class="form-control"
            id="inputDateStartEvent"
            required
            v-model="editingEvent.date_start_event"
          />
        </div>

        <div class="mb-3 px-1">
          <label for="inputDateEndEvent" class="form-label">Data de Fim da Prova</label>
          <input
            type="date"
            class="form-control"
            id="inputDateEndEvent"
            required
            v-model="editingEvent.date_end_event"
          />
        </div>

        <div class="mb-3 px-1">
          <label for="inputYear" class="form-label">Ano</label>
          <input
            type="number"
            class="form-control"
            id="inputYear"
            min="1900"
            max="2200"
            required
            v-model="editingEvent.year"
          />
        </div>

        <div class="w-25">
          <div class="mb-3">
            <label class="form-label">Imagem do Evento</label>
            <div class="form-control text-center">
              <img :src="imageFullUrl" class="w-100" />
            </div>
            <input type="file" ref="image_file_input" class="form-control" name="image" v-on:change="uploadImage()"/>
          </div>
        </div>

        <div class="w-25">
          <div class="mb-3">
            <label class="form-label">Circuito</label>
            <div class="form-control text-center">
              <img :src="fileFullUrl" class="w-100" />
            </div>
            <input type="file" ref="file_input" class="form-control" name="file" v-on:change="uploadCourse()"/>
          </div>
        </div>

        <div class="mb-3 px-1">
          <label for="inputCategory" class="form-label">Categoria: </label>
          <select id="inputCategory" v-model="editingEvent.category_id">
            <option value="1">Rally em Sprint</option>
            <option value="2">Rampa</option>
            <!--Fazer fetch dos dados da BD, tabela event_categories-->
          </select>
        </div>

        <div class="mb-3 px-1">
          <label for="inputBasePenalty" class="form-label">Penalização base</label>
          <input
            type="number"
            class="form-control"
            id="inputBasePenalty"
            min="0"
            max="10000"
            required
            v-model="editingEvent.base_penalty"
          />
        </div>

        <div class="mb-3 px-1">
          <label for="inputPointCalcReason" class="form-label">Razão de cálculo da pontuação</label>
          <input
            type="number"
            class="form-control"
            id="inputPointCalcReason"
            placeholder="0.1" 
            step="0.01"
            min="0"
            max="100"
            required
            v-model="editingEvent.point_calc_reason"
          />
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
