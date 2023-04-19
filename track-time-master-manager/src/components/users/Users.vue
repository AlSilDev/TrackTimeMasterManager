<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import { useUserStore } from "../../stores/user.js"
  import UserTable from "./UserTable.vue"
  
  const router = useRouter()
  const userStore = useUserStore()

  const axios = inject('axios')
  const toast = inject('toast')

  const users = ref([])

  const emit = defineEmits(["changeBlockValue"])

  const changeBlockValue = async (user) => {
    if (await userStore.changeBlockValue(user)) {
      if(user.blocked == 0){
        toast.success("Utilizador " + user.name + " bloqueado")
      }
      if(user.blocked == 1){
        toast.success("Utilizador " + user.name + " desbloqueado")
      }
      emit("changeBlockValue")
      user.blocked = (user.blocked == 0 ? 1 : 0)
    } else {
      toast.error("Utilizador não foi bloqueado/desbloqueado")
    }
  }

  /*const totalUsers = computed(() => {
    return users.value.length
  })*/

  /*const loadUsers = () => {
    axios.get('users')
        .then((response) => {
          users.value = response.data.data
          console.log(users.value)
        })
        .catch((error) => {
          console.log(error)
        })
    }*/

  const editUser = (user) => {
    router.push({ name: 'User', params: { id: user.id } })
  }

  /*onMounted (() => {
    loadUsers()
  })*/

  const addUser = () => {
    router.push({ name: 'NewUser' })
  }
</script>

<template>
  <h3 class="mt-5 mb-3">Utilizadores</h3>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addUser">Novo Utilizador</button></div>
    </div>
  </div>
  <hr>
  <user-table
    :showId="false"
    @edit="editUser"
    @changeBlockValue="changeBlockValue"
  ></user-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 2.3rem;
}
</style>

