<script setup>
import { inject, computed, ref, onMounted, watch } from "vue";
import { useUserStore } from "../../stores/user.js"
import { useRouter } from 'vue-router'  

const userStore = useUserStore()
const router = useRouter()  
const axios = inject('axios')
const toast = inject('toast')

const props = defineProps({
  userCategoriesListAux: {
    type: Array,
    default: () => []
  },
  userCategories: {
    type: Array,
    default: () => [],
  },
  userCategoriesOnlyTrashed: {
    type: Array,
    default: () => [],
  },
  userCategoriesWithTrashed: {
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

const emit = defineEmits(["edit", "deleteCategory", "restoreCategory", "loadUserCategories", "loadUserCategoriesAux", "loadUserCategoriesOnlyTrashed", "loadUserCategoriesWithTrashed"]);

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
  const objWithIdIndex = props.userCategoriesListAux.findIndex((obj) => obj.id === id);
  if (objWithIdIndex > -1){
    props.userCategoriesListAux.splice(objWithIdIndex, 1);
  }
}

const addObject = (userCategoryToAdd, arrayToUpdated) => {
  arrayToUpdated.push(userCategoryToAdd);
}
  
const deleteClick = (async (userCategory) => {
  await getUsersWithUserCategory(userCategory.id);
  console.log("Eventos com categoria " + userCategory.id + " : " + usersWithUserCategory.value.length)
  if (usersWithUserCategory.value.length == 0){
    //console.log("Pode ser eliminado")
    emit("deleteCategory", userCategory);
    removeObjectWithId(userCategory.id);
    addObject(userCategory, props.userCategoriesOnlyTrashed);
  }
  else{
    //console.log("Nao pode ser eliminado")
    toast.error('Categoria ' + userCategory.name + '(#' +userCategory.id+ ') tem ' + usersWithUserCategory.value.length + ' utilizador(es) associado(s)!')
    return;
  }
})

const restoreClick = (userCategory) => {
  emit("restoreCategory", userCategory)
  removeObjectWithId(userCategory.id)
  addObject(userCategory, props.eventCategories); 
}

const usersWithUserCategory = ref([]);
const getUsersWithUserCategory = (async (usercategoryId) => {
  await axios.get('users/withUserCategory/' + usercategoryId)
      .then((response) => {
        usersWithUserCategory.value = response.data
        //console.log("Eventos com categoria " + usercategoryId + " : " + usersWithUserCategory.value.length)
      })
      .catch((error) => {
        console.log(error)
      })
})

const isSelected = ref(1);
const withTrashed = () => {
  setTimeout(()=>{
    if (isSelected.value){
      emit("loadUserCategories")
      updateArrayValues(props.userCategoriesListAux, props.userCategoriesOnlyTrashed)
      isSelected.value = 0;
    }else{
      emit("loadUserCategoriesOnlyTrashed")
      updateArrayValues(props.userCategoriesListAux, props.userCategories)
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
  <table class="table table-hover table-striped">
    <thead class="table-dark" style="cursor: pointer">
      <tr>
        <th class="align-middle w-25" >Nome</th>
        <th class="align-middle w-50">Sigla</th>
        <th class="align-middle w-50">Descrição</th>
        <th class="align-middle w-auto"></th>
        <th class="align-middle w-auto"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="userCategory in userCategoriesListAux" :key="userCategory.id">
        <td class="align-middle text-danger text-decoration-line-through font-weight-bold" v-if="isTrashed()">{{ userCategory.name }}</td>
        <td class="align-middle" v-else>{{ userCategory.name }}</td>
        <td class="align-middle text-danger text-decoration-line-through font-weight-bold" v-if="isTrashed()">{{ userCategory.sigla }}</td>
        <td class="align-middle" v-else>{{ userCategory.sigla }}</td>
        <td class="align-middle text-danger text-decoration-line-through font-weight-bold" v-if="isTrashed()">{{ userCategory.description }}</td>
        <td class="align-middle" v-else>{{ userCategory.description }}</td>
        <td><button v-if="isAdmin() && !isTrashed()" @click="editClick(userCategory)" class="btn btn-dark" title="Editar"><BIconPencil/></button></td>
        <td><button v-if="isAdmin() && !isTrashed()" @click="deleteClick(userCategory)" class="btn btn-danger" title="Apagar"><BIconTrash/></button></td>
        
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
