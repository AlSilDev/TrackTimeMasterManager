<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import {useRouter} from 'vue-router'
  import UserTable from "./UserTable.vue"
  
  const router = useRouter()

  const axios = inject('axios')

  const users = ref([])

  const totalUsers = computed(() => {
    return users.value.length
  })

  const loadUsers = () => {
    axios.get('users')
        .then((response) => {
          users.value = response.data.data
          console.log(users.value)
        })
        .catch((error) => {
          console.log(error)
        })
    }

  const editUser = (user) => {
    router.push({ name: 'User', params: { id: user.id } })
  }

  onMounted (() => {
    loadUsers()
  })

  const addUser = () => {
    router.push({ name: 'NewUser' })
  }
</script>

<template>
  <h3 class="mt-5 mb-3">Users</h3>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div class="col-sm"><button type="button" class="btn btn-dark" @click="addUser">Novo Utilizador</button></div>
    </div>
  </div>
  <hr>
  <user-table
    :users="users"
    :showId="false"
    @edit="editUser"
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

