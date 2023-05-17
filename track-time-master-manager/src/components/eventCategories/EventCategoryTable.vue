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


const isAdmin = () => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type == 'A'
}


</script>

<template>
  <table class="table table-hover table-striped">
    <thead class="table-dark" style="cursor: pointer">
      <tr>
        <th class="align-middle" >Nome</th>
        <th class="align-middle">Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="eventCategory in eventCategories" :key="eventCategory.id">
        <td class="align-middle">{{ eventCategory.name }}</td>
        <td class="align-middle">{{ eventCategory.description }}</td>
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
