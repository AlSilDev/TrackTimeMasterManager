<script setup>
import { inject, ref, onMounted } from "vue";
import { useUserStore } from "../../stores/user.js"
import { useRouter } from 'vue-router'  

const userStore = useUserStore()
const router = useRouter()  
const axios = inject('axios')
const toast = inject('toast')

const props = defineProps({
  eventCategories: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: false,
  },
  showName: {
    type: String,
    default: '',
  },
  showDescription: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(["edit", "deleteCategory", "loadEventCategories"]);

const isAdmin = () => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type == 'A'
}

const editClick = (category) => {
  emit("edit", category);
}
  
const deleteClick = (async(eventCategory) => {
  await getEventsWithEventCategory(eventCategory.id);
  if (eventsWithEventCategory.value.length == 0){
    emit("deleteCategory", eventCategory);
    await fetchEventCategories();
  }
  else{
    return;
  }
  
})

const eventsWithEventCategory = ref([]);
const getEventsWithEventCategory = (async (eventcategoryId) => {
  console.log("Loading Events With Event Category " + eventcategoryId)
  await await axios.get('events/withEventCategory/' + eventcategoryId)
      .then((response) => {
        eventsWithEventCategory.value = response.data
        console.log(eventsWithEventCategory.value)
      })
      .catch((error) => {
        console.log(error)
      })
})

const fetchEventCategories = (async() => {
  await emit("loadEventCategories");
})

</script>

<template>
  <table class="table table-hover table-striped">
    <thead class="table-dark" style="cursor: pointer">
      <tr>
        <th class="align-middle" >Nome</th>
        <th class="align-middle">Descrição</th>
        <th class="align-middle"></th>
        <th class="align-middle"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="eventCategory in eventCategories" :key="eventCategory.id">
        <td class="align-middle">{{ eventCategory.name }}</td>
        <td class="align-middle">{{ eventCategory.description }}</td>
        <td><button v-if="isAdmin()" @click="editClick(eventCategory)" class="btn btn-dark" title="Editar"><BIconPencil/></button></td>
        <td><button v-if="isAdmin()" @click="deleteClick(eventCategory)" class="btn btn-danger" title="Apagar"><BIconTrash/></button></td>
      </tr>
    </tbody>
  </table>
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
