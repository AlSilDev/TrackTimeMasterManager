<script setup>
import { inject, ref, onMounted } from "vue";
import { useUserStore } from "../../stores/user.js"
import {useRouter} from 'vue-router'
import avatarNoneUrl from '@/assets/avatar-none.png'
import { BIconClock, BIconPencilSquare, BIconPlus, BIconSearch } from 'bootstrap-icons-vue'

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()
const axios = inject("axios")
const router = useRouter()
const toast = inject('toast')

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
  console.log('stage cards id', stage.id)
  router.push({ name: 'Stage', params: { event_id: router.currentRoute.value.params['event_id'], stage_id: stage.id } })
}

const isAdmin = () => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type_id == 1
}

const loadStages = async () => {
  console.log('endpoint: ', `events/${router.currentRoute.value.params['event_id']}/stages`)
  await axios.get(`events/${router.currentRoute.value.params['event_id']}/stages`)
    .then((response) => {
      stages.value = response.data
      console.log(stages.value)
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

onMounted(async ()=>{
  await loadStages()
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

  <div class="accordion" :id="`stage${stage.id}`" v-for="stage in stages">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="`#collapseStage${stage.id}`" aria-expanded="true" :aria-controls="`collapseStage${stage.id}`">
                    Etapa #{{ stage.id }}
                </button>
            </h2>
            <div :id="`collapseStage${stage.id}`" class="accordion-collapse collapse" :data-bs-parent="`#stage${stage.id}`">
                <div class="accordion-body">
                  <p>Nome da Etapa: {{ stage.name }}</p>
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
</style>
