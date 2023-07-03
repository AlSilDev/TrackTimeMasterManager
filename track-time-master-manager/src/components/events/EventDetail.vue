<script setup>
import { ref, watch, computed, inject, onMounted } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'
import moment from 'moment'
import { BIconArrowRight, BIconArrowDown, BIconTrash } from "bootstrap-icons-vue";

const serverBaseUrl = inject("serverBaseUrl");
const axios = inject('axios')
const toast = inject('toast')

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

//https://stackoverflow.com/questions/46708110/convert-date-format-in-javascript-using-vuejs
const formatDate = (value)=>{
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm:ss a')
  }
}

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
/* Press methods */
const pressName = ref('')
const press_file_input = ref('')
const pressFullUrl = ref()

const uploadPress =  ()=>{
    pressFullUrl.value = URL.createObjectURL(press_file_input.value.files[0])
}
/* */

const save = () => {
  emit("save", editingEvent.value, image_file_input.value.files[0], file.value);
}

const cancel = () => {
  emit("cancel", editingEvent.value);
}

const pressFiles = ref([])
const loadPressFiles = async ()=>{
  await axios.get(`events/${editingEvent.value.id}/press`)
    .then((response)=>{
      console.log(response.data)
      pressFiles.value = response.data
    })
    .catch((error)=>{
      console.error(error)
    })
}

const addPressFile = async ()=>{
  const formData = new FormData()
  formData.append('press_file', press_file_input.value.files[0])
  formData.append('name', pressName.value)
  await axios.post(`events/${editingEvent.value.id}/press`, formData, { headers: { 'Content-Type': 'multipart/form-data' }})
    .then((response)=>{
      //console.log(response.data)
      press_file_input.value = ''
      pressName.value = ''
      toast.success(`O ficheiro ${pressName.value} foi adicionado com sucesso.`)
      pressFiles.value.push(response.data)
      //console.log(pressFiles.value)
    })
    .catch((error)=>{
      toast.error('Ocorreu um erro no servidor')
      console.error(error)
    })
}
const deletePressFile = async (pressFile)=>{
  await axios.delete(`press/${pressFile.id}`)
    .then((response)=>{
      //console.log(response.data)
      toast.success(`O ficheiro ${pressFile.name} foi eliminado com sucesso.`)
      console.log('index: ' + pressFiles.value.indexOf(pressFile))
      pressFiles.value.splice(pressFiles.value.indexOf(pressFile), 1)
      //console.log(pressFiles.value)
    })
    .catch((error)=>{
      toast.error('Ocorreu um erro no servidor')
      console.error(error)
    })  
}

/* Video methods */
const videoLinkToUpload = ref({'video_url': ''})

const videoLinks = ref([])
const loadVideoLinks = async ()=>{
  await axios.get(`events/${editingEvent.value.id}/videos`)
    .then((response)=>{
      console.log(response.data)
      videoLinks.value = response.data
    })
    .catch((error)=>{
      console.error(error)
    })
}

const addVideoLink = async ()=>{
  await axios.post(`events/${editingEvent.value.id}/videos`, videoLinkToUpload.value)
    .then((response)=>{
      //console.log(response.data)
      videoLinkToUpload.video_url = ''
      toast.success(`O vídeo foi adicionado com sucesso.`)
      videoLinks.value.push(response.data)
      //console.log(pressFiles.value)
    })
    .catch((error)=>{
      toast.error('Ocorreu um erro no servidor')
      console.error(error)
    })
}

const deleteVideoLink = async (video)=>{
  await axios.delete(`videos/${video.id}`)
    .then((response)=>{
      //console.log(response.data)
      toast.success(`O vídeo foi eliminado com sucesso.`)
      console.log('index: ' + videoLinks.value.indexOf(video))
      videoLinks.value.splice(videoLinks.value.indexOf(video), 1)
      //console.log(pressFiles.value)
    })
    .catch((error)=>{
      toast.error('Ocorreu um erro no servidor')
      console.error(error)
    })  
}

/* */

/* Regulations methods */
const regulationName = ref('')
const regulation_file_input = ref('')
const regulationFiles = ref([])
const loadRegulationFiles = async ()=>{
  await axios.get(`events/${editingEvent.value.id}/regulations`)
    .then((response)=>{
      console.log(response.data)
      regulationFiles.value = response.data
    })
    .catch((error)=>{
      console.error(error)
    })
}

const addRegulationFile = async ()=>{
  const formData = new FormData()
  formData.append('regulation_file', regulation_file_input.value.files[0])
  formData.append('name', regulationName.value)
  await axios.post(`events/${editingEvent.value.id}/regulations`, formData, { headers: { 'Content-Type': 'multipart/form-data' }})
    .then((response)=>{
      //console.log(response.data)
      regulation_file_input.value.files.splice(0, 1)
      regulationName.value = ''
      toast.success(`O ficheiro ${pressName.value} foi adicionado com sucesso.`)
      regulationFiles.value.push(response.data)
      //console.log(pressFiles.value)
    })
    .catch((error)=>{
      toast.error('Ocorreu um erro no servidor')
      console.error(error)
    })
}

const deleteRegulationFile = async (regulation)=>{
  await axios.delete(`regulations/${regulation.id}`)
    .then((response)=>{
      //console.log(response.data)
      toast.success(`O ficheiro ${regulation.name} foi eliminado com sucesso.`)
      console.log('index: ' + regulationFiles.value.indexOf(regulation))
      regulationFiles.value.splice(regulationFiles.value.indexOf(regulation), 1)
      //console.log(pressFiles.value)
    })
    .catch((error)=>{
      toast.error('Ocorreu um erro no servidor')
      console.error(error)
    })  
}
/* */

const eventCategories = ref([])
const loadEventCategoriesArray = (async () => {
  await axios.get('eventCategories')
      .then((response) => {
        eventCategories.value = response.data
      })
      .catch((error) => {
        console.log(error)
      })
})

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
    if (props.operationType == "update")
    {
      loadPressFiles()
      loadVideoLinks()
      loadRegulationFiles()
    }
  }, 1000)
  loadEventCategoriesArray()
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

        <!--div class="mb-3 px-1">
          <label for="inputCategory" class="form-label">Categoria: </label>
          <select id="inputCategory" v-model="editingEvent.category_id">
            <option value="1">Rally em Sprint</option>
            <option value="2">Rampa</option>
            <Fazer fetch dos dados da BD, tabela event_categories>
          </select>
        </div-->

        <div class="mb-3 px-1">
          <label for="inputCategory" class="form-label">Categoria: </label>
          <select id="inputCategory" v-model="editingEvent.category_id">
              <option v-for="eventCategory in eventCategories" v-bind:value="eventCategory.id">{{eventCategory.name}}</option>
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

  <hr>
  <div>
    <h3>Imprensa</h3>

    <form class="row g-3 needs-validation" novalidate @submit.prevent="addPressFile">
      <!-- Press files -->
      <div class="d-flex flex-wrap justify-content-center">
          <div class="w-75 pe-4">
            <div class="mb-3">
              <label for="inputNamePress" class="form-label">Nome</label>
              <input
                type="text"
                class="form-control"
                id="inputNamePress"
                placeholder="Nome"
                required
                v-model="pressName"
              />
            </div>
          </div>
          <div class="w-25">
            <div class="mb-3">
              <label class="form-label">Ficheiro</label>
              <input type="file" ref="press_file_input" class="form-control" name="press" v-on:change="uploadPress()"/>
            </div>
          </div>
        </div>
        <div class="col-sm"><button type="button" class="btn btn-dark" :disabled="!pressName.length && !press_file_input.files" @click="addPressFile()">Adicionar Ficheiro</button></div>
      </form>
      
      <br>
      <table class="table table-hover table-striped" v-if="pressFiles.length">
        <thead class="table-dark" style="cursor: pointer">
          <tr>
            <th class="align-middle">Nome</th>
            <th class="align-middle">Data de Criação</th>
            <th class="align-middle">Data de Atualização</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="press in pressFiles" :key="press.id">
            <td class="align-middle">{{ press.name }}</td>
            <td class="align-middle">{{ formatDate(press.created_at) }}</td>
            <td class="align-middle">{{ formatDate(press.updated_at) }}</td>
            <td class="align-middle"><button class="btn btn-danger" @click="deletePressFile(press)"><BIconTrash/></button></td>
            <td class="align-middle"><a class="btn btn-info" :href="serverBaseUrl + '/storage/imprensa/' + press.file_url" target="_blank"><BIconArrowDown/></a></td>
          </tr>
        </tbody>
      </table>

      <h4 v-if="!pressFiles.length">Ainda não há ficheiros de imprensa</h4>
  </div>

  <hr>
  <div>
    <h3>Vídeos</h3>

    <form class="row g-3 needs-validation" novalidate @submit.prevent="addVideoLink">
      <!-- Video links -->
        <div class="mb-3">
          <label for="inputVideoLink" class="form-label">URL</label>
          <input
            type="text"
            class="form-control"
            id="inputVideoLink"
            placeholder="Nome"
            required
            v-model="videoLinkToUpload.video_url"
          />
        </div>
        <div class="col-sm"><button type="button" class="btn btn-dark" :disabled="!videoLinkToUpload.video_url.length" @click="addVideoLink()">Adicionar Vídeo</button></div>
      </form>
      
      <br>
      <table class="table table-hover table-striped" v-if="videoLinks.length">
        <thead class="table-dark" style="cursor: pointer">
          <tr>
            <th class="align-middle">URL</th>
            <th class="align-middle">Data de Criação</th>
            <th class="align-middle">Data de Atualização</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="video in videoLinks" :key="video.id">
            <td class="align-middle">{{ video.video_url }}</td>
            <td class="align-middle">{{ formatDate(video.created_at) }}</td>
            <td class="align-middle">{{ formatDate(video.updated_at) }}</td>
            <td class="align-middle"><button class="btn btn-danger" @click="deleteVideoLink(video)"><BIconTrash/></button></td>
            <td class="align-middle"><a class="btn btn-info" :href="video.video_url" target="_blank"><BIconArrowRight/></a></td>
          </tr>
        </tbody>
      </table>

      <h4 v-if="!videoLinks.length">Ainda não há vídeos</h4>
  </div>
    
  <hr>
  <div>
    <h3>Regulamentos</h3>

    <form class="row g-3 needs-validation" novalidate @submit.prevent="addRegulationsFile">
      <!-- Press files -->
      <div class="d-flex flex-wrap justify-content-center">
          <div class="w-75 pe-4">
            <div class="mb-3">
              <label for="inputNameRegulation" class="form-label">Nome</label>
              <input
                type="text"
                class="form-control"
                id="inputNameRegulation"
                placeholder="Nome"
                required
                v-model="regulationName"
              />
            </div>
          </div>
          <div class="w-25">
            <div class="mb-3">
              <label class="form-label">Ficheiro</label>
              <input type="file" ref="regulation_file_input" class="form-control" name="regulation"/>
            </div>
          </div>
        </div>
        <div class="col-sm"><button type="button" class="btn btn-dark" :disabled="!regulationName.length && !regulation_file_input.files" @click="addRegulationFile()">Adicionar Ficheiro</button></div>
      </form>
      
      <br>
      <table class="table table-hover table-striped" v-if="regulationFiles.length">
        <thead class="table-dark" style="cursor: pointer">
          <tr>
            <th class="align-middle">Nome</th>
            <th class="align-middle">Data de Criação</th>
            <th class="align-middle">Data de Atualização</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="regulation in regulationFiles" :key="regulation.id">
            <td class="align-middle">{{ regulation.name }}</td>
            <td class="align-middle">{{ formatDate(regulation.created_at) }}</td>
            <td class="align-middle">{{ formatDate(regulation.updated_at) }}</td>
            <td class="align-middle"><button class="btn btn-danger" @click="deleteRegulationFile(regulation)"><BIconTrash/></button></td>
            <td class="align-middle"><a class="btn btn-info" :href="serverBaseUrl + '/storage/regulamentos/' + regulation.file_url" target="_blank"><BIconArrowDown/></a></td>
          </tr>
        </tbody>
      </table>

      <h4 v-if="!regulationFiles.length">Ainda não há ficheiros de regulamentos</h4>
  </div>

</template>

<style scoped>

</style>
