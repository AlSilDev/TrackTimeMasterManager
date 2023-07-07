<script setup>
import { inject, computed, ref, onMounted, watch } from "vue";
import { useUserStore } from "../../stores/user.js"
import { useRouter } from 'vue-router'  
import { BIconPencil, BIconTrash, BIconArrowClockwise } from 'bootstrap-icons-vue'

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

const emit = defineEmits(["edit", "deleteCategory", "restoreCategory", "loadEventCategories", "loadEventCategoriesAux", "loadEventCategoriesOnlyTrashed", "loadEventCategoriesWithTrashed"]);

const isAdmin = () => {
  if (!userStore.user) {
    return false
  }
  //ADMIN -> id 1
  return userStore.user.type_id == 1
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

const addObject = (eventCategoryToAdd, arrayToUpdated) => {
  arrayToUpdated.push(eventCategoryToAdd);
}
  
const deleteClick = (async (eventCategory) => {
  await getEventsWithEventCategory(eventCategory.id);
  console.log("Eventos com categoria " + eventCategory.id + " : " + eventsWithEventCategory.value.length)
  if (eventsWithEventCategory.value.length == 0){
    //console.log("Pode ser eliminado")
    emit("deleteCategory", eventCategory);
    removeObjectWithId(eventCategory.id);
    addObject(eventCategory, props.eventCategoriesOnlyTrashed);
  }
  else{
    //console.log("Nao pode ser eliminado")
    toast.error('Categoria ' + eventCategory.name + '(#' +eventCategory.id+ ') tem ' + eventsWithEventCategory.value.length + ' evento(s) associado(s)!')
    return;
  }
})

const restoreClick = (eventCategory) => {
  emit("restoreCategory", eventCategory)
  removeObjectWithId(eventCategory.id)
  addObject(eventCategory, props.eventCategories); 
}

const eventsWithEventCategory = ref([]);
const getEventsWithEventCategory = (async (eventcategoryId) => {
  await axios.get('events/withEventCategory/' + eventcategoryId)
      .then((response) => {
        eventsWithEventCategory.value = response.data
        //console.log("Eventos com categoria " + eventcategoryId + " : " + eventsWithEventCategory.value.length)
      })
      .catch((error) => {
        console.log(error)
      })
})

const isSelected = ref(1);
const withTrashed = () => {
  setTimeout(()=>{
    if (isSelected.value){
      emit("loadEventCategories")
      updateArrayValues(props.eventCategoriesListAux, props.eventCategoriesOnlyTrashed)
      isSelected.value = 0;
    }else{
      emit("loadEventCategoriesOnlyTrashed")
      updateArrayValues(props.eventCategoriesListAux, props.eventCategories)
      isSelected.value = 1;
    }
  },1000);
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
  <div class="table-responsive">
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
          <td class="align-middle text-danger text-decoration-line-through font-weight-bold" v-if="isTrashed()">{{ eventCategory.name }}</td>
          <td class="align-middle" v-else>{{ eventCategory.name }}</td>
          <td class="align-middle text-danger text-decoration-line-through font-weight-bold" v-if="isTrashed()">{{ eventCategory.description }}</td>
          <td class="align-middle" v-else>{{ eventCategory.description }}</td>
          <td><button v-if="isAdmin() && !isTrashed()" @click="editClick(eventCategory)" class="btn btn-dark" title="Editar"><BIconPencil/></button></td>
          <td><button v-if="isAdmin() && !isTrashed()" @click="deleteClick(eventCategory)" class="btn btn-danger" title="Apagar"><BIconTrash/></button></td>
          <td><button v-if="isAdmin() && isTrashed()" @click="restoreClick(eventCategory)" class="btn btn-warning" title="Apagar"><BIconArrowClockwise/></button></td>
        </tr>
      </tbody>
    </table>
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
