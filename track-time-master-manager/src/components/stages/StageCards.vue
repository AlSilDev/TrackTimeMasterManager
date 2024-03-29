<script setup>
import { inject, ref, onMounted } from "vue";
import { useUserStore } from "../../stores/user.js"
import {useRouter} from 'vue-router'
import avatarNoneUrl from '@/assets/avatar-none.png'
import { BIconClock, BIconLock, BIconPencilSquare, BIconPlus, BIconSearch, BIconTable } from 'bootstrap-icons-vue'
import moment from 'moment'

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()
const axios = inject("axios")
const router = useRouter()
const toast = inject('toast')
const socket = inject("socket")

const props = defineProps({
  showId: {
    type: Boolean,
    default: false,
  },
  showName: {
    type: Boolean,
    default: true,
  },
  showEmail: {
    type: Boolean,
    default: true,
  },
  showLicenseNum: {
    type: Boolean,
    default: true,
  },
  showLicenseExpiry: {
    type: Boolean,
    default: true,
  },
  showPhoneNum: {
    type: Boolean,
    default: true,
  },
  showAffiliateNum: {
    type: Boolean,
    default: true,
  },
});

const stages = ref({})

const editStage = (stage) => {
  router.push({ name: 'Stage', params: { event_id: router.currentRoute.value.params['event_id'], stage_id: stage.id } })
}

const isAdmin = () => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type_id == 1
}

const loadStages = async () => {
  await axios.get(`events/${router.currentRoute.value.params['event_id']}/stages`)
    .then((response) => {
      stages.value = response.data
    })
    .catch((error)=>{
      console.error(error)
    })
}

const endStage = (stage) => {
  axios.put(`stages/${stage.id}/end`)
  .then((response) => {
    socket.emit('updateStage', response.data.data)
    toast.success('Etapa terminada com sucesso')
  })
  .catch((error)=>{
    console.error(error)
  })
}

const deleteStage = async (stage) => {
  await axios.delete(`/stages/${stage.id}`)
    .then((response)=>{
      toast.success(`A prova ${stage.name} foi cancelada com sucesso`)
      loadStages()
    })
    .catch((error)=>{
      toast.error("Ocorreu um erro a cancelar a prova")
    })
}

const loadStageRuns = (stage) => {
  axios.get(`stages/${stage.id}/runs`)
  .then((response)=>{
    stage.runs = response.data
  })
}

const editStageRun = (stage, stage_run) => {
  router.push({ name: 'StageRun', params: { event_id: router.currentRoute.value.params['event_id'], stage_id: stage.id, stage_run_id: stage_run.id } })
}

const endStageRun = (run) => {
  axios.put(`stageRuns/${run.id}/end`)
  .then((response) => {
    socket.emit('updateStageRun', response.data.data)
    toast.success('Partida #' + run.run_num + ' terminada com sucesso')
  })
  .catch((error)=>{
    console.error(error)
  })
}

const newStageRun = (stage) => {
  router.push({ name: 'NewStageRun', params: { event_id: router.currentRoute.value.params['event_id'], stage_id: stage.id } })
}

const raceStartTimes = (stage, stage_run) => {
  router.push({ name: 'RaceStart', params: { event_id: router.currentRoute.value.params['event_id'], stage_id: stage.id, stage_run_id: stage_run.id } })
}

const raceTimeControl = (stage, stage_run) => {
  router.push({ name: 'RaceTimeControl', params: { event_id: router.currentRoute.value.params['event_id'], stage_id: stage.id, stage_run_id: stage_run.id } })
}

const runClassifications = (stage, stage_run) => {
  router.push({ name: 'RunClassifications', params: { event_id: router.currentRoute.value.params['event_id'], stage_id: stage.id, stage_run_id: stage_run.id } })
}

const stageClassifications = (stage) => {
  router.push({ name: 'StageClassifications', params: { event_id: router.currentRoute.value.params['event_id'], stage_id: stage.id } })
}

socket.on('updateStageRun', (stageRunUpdated) => {
  const stageRunToUpdate = stages.value[0].runs.find((element) => {
    return element.id == stageRunUpdated.id
  })

  stageRunToUpdate.date_start = formatDate(stageRunUpdated.date_start);
  stageRunToUpdate.practice = stageRunUpdated.practice;
})

socket.on('updateStage', (stageUpdated) => {
  const stageToUpdate = stages.value.find((element) => {
    return element.id == stageUpdated.id
  })
  
  stageToUpdate.date_start = formatDate(stageUpdated.date_start)
  stageToUpdate.name = stageUpdated.name
  stageToUpdate.ended = stageUpdated.ended
})

const formatDate = (value)=>{
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm:ss')
  }
}

const showEndRunHeader = (stage) => {
  var sruns = Object.assign([], stage.runs)
  for(var i = 0; i < sruns.length; i++)
  {
    if (!sruns[i].ended)
    {
      return true
    }
  }
  return false
}

onMounted(async ()=>{
  await loadStages()
  stages.value.forEach(element => {
    loadStageRuns(element)
  });
})
</script>

<template>
  <!--div>
    <table class="table table-striped table-hover">
      <thead class="table-dark" style="cursor: pointer">
        <tr>
          <th class="align-middle">Nome</th>
          <th class="align-middle">Nº de Partidas</th>
          <th class="align-middle"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stage in stages" :key="stage.id">
          <td class="align-middle">{{ stage.name }}</td>
          <td class="align-middle">{{ stage.num_runs }}</td>
          <td class="align-middle"><button class="btn btn-success" @click="editStage(stage)"><BIconPencilSquare></BIconPencilSquare></button></td>
        </tr>
      </tbody>
    </table>
  </div-->

  <div class="accordion" :id="`stage${stage.id}`" v-for="(stage, index) in stages">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="`#collapseStage${stage.id}`" aria-expanded="false" :aria-controls="`collapseStage${stage.id}`">
                    Etapa {{ stage.name }}
                </button>
            </h2>
            <div :id="`collapseStage${stage.id}`" class="accordion-collapse collapse" :data-bs-parent="`#stage${stage.id}`">
                <div class="accordion-body">
                  <p><button class="btn btn-success" @click="editStage(stage)" v-if="userStore.user.type_id == 1"><BIconPencilSquare></BIconPencilSquare> Editar Etapa</button></p>
                  <p><button class="btn btn-warning" @click="endStage(stage)" v-if="userStore.user.type_id == 1 && !stage.ended"><BIconLock></BIconLock> Terminar Etapa</button></p>
                  <p><button class="btn btn-success" @click="newStageRun(stage)" v-if="userStore.user.type_id == 1"><BIconPlus></BIconPlus> Nova Partida</button></p>
                  <p><button class="btn btn-info" @click="stageClassifications(stage)"><BIconTable></BIconTable> Classificações</button></p>
                  <div class="table-responsive table-scroll">
                    <table class="table table-striped table-hover">
                      <thead class="table-dark" style="cursor: pointer">
                        <tr>
                          <th class="align-middle">Partida #</th>
                          <th class="align-middle">Treino</th>
                          <th class="align-middle">Data de Início</th>
                          <th class="align-middle" v-if="userStore.user.type_id == 1"></th>
                          <th class="align-middle" v-if="userStore.user.type_id == 1 || userStore.user.type_id == 5"></th>
                          <th class="align-middle" v-if="userStore.user.type_id == 1 || userStore.user.type_id == 6"></th>
                          <th class="align-middle"></th>
                          <th class="align-middle" v-if="userStore.user.type_id == 1 && showEndRunHeader(stage)"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="run in stage.runs" :key="run.id">
                          <td class="align-middle">{{ run.run_num }}</td>
                          <td class="align-middle">{{ run.practice == 0 ? 'Não' : 'Sim' }}</td>
                          <td class="align-middle">{{ run.date_start }}</td>
                          <td class="align-middle" v-if="userStore.user.type_id == 1"><button class="btn btn-success" @click="editStageRun(stage, run)"><BIconPencilSquare></BIconPencilSquare></button></td>
                          <td class="align-middle" v-if="userStore.user.type_id == 1 || userStore.user.type_id == 5"><button class="btn btn-success" @click="raceStartTimes(stage, run)"><BIconClock></BIconClock> Partidas</button></td>
                          <td class="align-middle" v-if="userStore.user.type_id == 1 || userStore.user.type_id == 6"><button class="btn btn-info" @click="raceTimeControl(stage, run)"><BIconClock></BIconClock> Tomada</button></td>
                          <td class="align-middle"><button class="btn btn-info" @click="runClassifications(stage, run)"><BIconTable></BIconTable> Classificações</button></td>
                          <td class="align-middle" v-if="userStore.user.type_id == 1 && !run.ended"><button class="btn btn-warning" @click="endStageRun(run)"><BIconLock></BIconLock></button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}

.img_photo {
  width: 3.2rem;
  height: 3.2rem;
}

.page-item.active > .page-link {
  color:white !important;
  background-color: dimgrey !important;
  border-color: black;
}

.table-scroll {
  max-height: 500px;
  overflow: auto;
  /*display:inline-block;*/
}
</style>
