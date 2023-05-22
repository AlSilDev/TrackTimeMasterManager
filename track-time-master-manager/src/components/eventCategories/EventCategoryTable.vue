<script setup>
import { inject, computed, ref, onMounted, watch } from "vue";
import { useUserStore } from "../../stores/user.js"
import { useRouter } from 'vue-router'  

const userStore = useUserStore()
const router = useRouter()  
const axios = inject('axios')
const toast = inject('toast')

const props = defineProps({
  eventCategoriesListAux: {
    type: Array,
    default: () => []
  },
  eventCategories: {
    type: Array,
    default: () => [],
  },
  eventCategoriesOnlyTrashed: {
    type: Array,
    default: () => [],
  },
  eventCategoriesWithTrashed: {
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

const emit = defineEmits(["edit", "deleteCategory", "loadEventCategories", "loadEventCategoriesOnlyTrashed", "loadEventCategoriesWithTrashed"]);

const isAdmin = () => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type == 'A'
}

const isTrashed = () => {
  if (isSelected.value){
    return false
  }
  return true
}

const editClick = (category) => {
  emit("edit", category);
}

const removeObjectWithId = (id) => {
  const objWithIdIndex = props.eventCategoriesListAux.findIndex((obj) => obj.id === id);
  if (objWithIdIndex > -1){
    props.eventCategoriesListAux.splice(objWithIdIndex, 1);
  }
}
  
const deleteClick = (eventCategory) => {
  getEventsWithEventCategory(eventCategory.id);
  if (eventsWithEventCategory.value.length == 0){
    emit("deleteCategory", eventCategory);
    removeObjectWithId(eventCategory.id)
  }
  else{
    return;
  }
  
}

const restoreClick = (eventCategory) => {
  console.log("Entrou no restore method!")
}

const eventsWithEventCategory = ref([]);
const getEventsWithEventCategory = (async (eventcategoryId) => {
  console.log("Loading Events With Event Category " + eventcategoryId)
  await axios.get('events/withEventCategory/' + eventcategoryId)
      .then((response) => {
        eventsWithEventCategory.value = response.data
        console.log(eventsWithEventCategory.value)
      })
      .catch((error) => {
        console.log(error)
      })
})

const isSelected = ref(1);
const withTrashed = () => {
  if (isSelected.value){
    updateArrayValues(props.eventCategoriesListAux, props.eventCategoriesOnlyTrashed)
    isSelected.value = 0;
  }else{
    updateArrayValues(props.eventCategoriesListAux, props.eventCategories)
    isSelected.value = 1;
  }
}

const updateArrayValues = (array1, array2) => {
  array1.splice(0);
  for (let index = 0; index < array2.length; index++) {
    array1.push(array2[index]);
  };
}

</script>

<template>
  <label class="d-flex flex-row-reverse" @click="withTrashed">&nbsp;apagadas
    <input type="checkbox">
    <span class="checkmark"></span>
  </label>
  <br>
  <table class="table table-hover table-striped">
    <thead class="table-dark" style="cursor: pointer">
      <tr>
        <th class="align-middle w-25" >Nome</th>
        <th class="align-middle w-50">Descrição</th>
        <th class="align-middle w-auto"></th>
        <th class="align-middle w-auto"></th>
        <th class="align-middle w-auto"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="eventCategory in eventCategoriesListAux" :key="eventCategory.id">
        <td class="align-middle">{{ eventCategory.name }}</td>
        <td class="align-middle">{{ eventCategory.description }}</td>
        <td><button v-if="isAdmin() && !isTrashed()" @click="editClick(eventCategory)" class="btn btn-dark" title="Editar"><BIconPencil/></button></td>
        <td><button v-if="isAdmin() && !isTrashed()" @click="deleteClick(eventCategory)" class="btn btn-danger" title="Apagar"><BIconTrash/></button></td>
        <td><button v-if="isAdmin() && isTrashed()" @click="restoreClick(eventCategory)" class="btn btn-warning" title="Apagar"><BIconArrowClockwise/></button></td>
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
