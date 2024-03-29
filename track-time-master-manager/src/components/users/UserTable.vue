<script setup>
import { inject, ref, onMounted, toDisplayString } from "vue";
import { useUserStore } from "../../stores/user.js"
import avatarNoneUrl from '@/assets/avatar-none.png'
import { BIconSearch, BIconArrowUp, BIconArrowDown, BIconShieldSlash, BIconShieldSlashFill, BIconPencil, BIconKey } from 'bootstrap-icons-vue'

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()
const axios = inject('axios')
const socket = inject("socket")
const moment = inject('moment')

const props = defineProps({
  showId: {
    type: Boolean,
    default: true,
  },
  showEmail: {
    type: Boolean,
    default: true,
  },
  showAdmin: {
    type: Boolean,
    default: true,
  },
  showGender: {
    type: Boolean,
    default: true,
  },
  showPhoto: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
  showBlockButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["edit", "changeBlockValue"]);

const photoFullUrl = (user) => {
  return user.photo_url
    ? serverBaseUrl + "/storage/fotos/" + user.photo_url
    : avatarNoneUrl;
};

const editClick = (user) => {
  emit("edit", user);
};

const changePassword = (user) => {
  emit("changePassword", user);
};

const changeBlockValue = (user) => {
  emit("changeBlockValue", user);
};

socket.on('userBlockValueChange', (user) => {
    const userUpdatedIdx = laravelData.value.data.findIndex((element) => {return element.id == user.id})
    if (userUpdatedIdx != -1)
    {
      laravelData.value.data[userUpdatedIdx].blocked = user.blocked
    }
})

socket.on('updateUser', (userUpdated) => {
    const userUpdatedIdx = laravelData.value.data.findIndex((element) => {return element.id == userUpdated.id})
    if (userUpdatedIdx != -1)
    {
      laravelData.value.data[userUpdatedIdx] = userUpdated
    }
})

const canViewUserDetailAndBlock = (userId) => {
  if (!userStore.user) {
    return false
  }
  //ADMIN -> 1
  return userStore.user.type_id == 1 || userStore.user.id == userId
}

const isUserStore = (userId) => {
  if(userStore.user.id == userId){
    return true
  }else{
    return false
  }
}

const laravelData = ref({})
const currentPage = ref()
const filteredPages = ref([])
const sortedColumn = ref('id')
const order = ref('asc')
const attribute = ref()
const search = ref()

const getResultsFiltered = async (page = 1) => {
  if (attribute.value.value === "type")
    search.value.value = search.value.value.charAt(0)
    
  await axios.get(`users?page=${page}&column=${sortedColumn.value}&order=${order.value}&attribute=${attribute.value.value}&search=${search.value.value}`)
    .then((response) => {
      laravelData.value = response.data
      currentPage.value = page
      filteredPages.value = laravelData.value.links.slice(1, laravelData.value.last_page+1)
    })
    .catch((error)=>{
      console.error(error)
    })
}

const sortByColumn = (column) => {
    if (column === sortedColumn.value) {
      order.value = (order.value === 'asc') ? 'desc' : 'asc'
    } else {
      sortedColumn.value = column
      order.value = 'asc'
    }
    currentPage.value = 1
    getResultsFiltered()
}

  const formatDate = (value)=>{
    if (value) {
      return moment(String(value)).format("DD-MM-YYYY hh:mm:ss")
    }
  }

const restartSearch = () => {
  search.value.value = ""
  attribute.value.selectedIndex = 0
  getResultsFiltered()
}

const userCategories = ref([])
const loadUserCategories = (async() => {
    await axios.get('userCategories')
        .then((response) => {
          userCategories.value = response.data
        })
        .catch((error) => {
          console.log(error)
        })
  })

const getUserCategoryName = (userCategoryId) => {
    for (let index = 0; index < userCategories.value.length; index++) {
      if (userCategories.value[index].id == userCategoryId){
        return userCategories.value[index].name
      }else{
        if(index == userCategories.value.length - 1){
          return ''
        }
        else{
          continue
        }
      }
    }
  }

onMounted(async ()=>{
  await getResultsFiltered()
  loadUserCategories()
})
</script>

<template>
  <div class="mb-2 justify-content-center">
    <div class="input-group">
      <span class="input-group-text"><BIconSearch/></span>
      <input placeholder="Procurar..." type="string" id="search" class="form-control" ref="search" />
      <select class="form-select" id="inputGroupSelect01" ref="attribute">
        <option value="" selected>Escolher Atributo...</option>
        <option value="name">Nome</option>
        <option value="email">Email</option>
        <option value="type_id">Tipo</option>
      </select>
      <button class="btn btn-outline-secondary" type="button" @click="getResultsFiltered()">Procurar</button>
      <button class="btn btn-outline-secondary" type="button" @click="restartSearch()">Reiniciar</button>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table table-hover table-striped">
      <thead class="table-dark" style="cursor: pointer">
        <tr>
          <th v-if="showPhoto" class="align-middle">Foto</th>
          <th class="align-middle" @click="sortByColumn('name')">Nome <span v-if="sortedColumn == 'name'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
          <th class="align-middle" @click="sortByColumn('email')">Email <span v-if="sortedColumn == 'email'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
          <th class="align-middle" @click="sortByColumn('type_id')">Tipo <span v-if="sortedColumn == 'type'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
          <th class="align-middle" @click="sortByColumn('blocked')">Bloqueado<span v-if="sortedColumn == 'blocked'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
          <th class="align-middle" @click="sortByColumn('created_at')">Data de Criação<span v-if="sortedColumn == 'created_at'"><BIconArrowUp v-if="order === 'asc' "/><BIconArrowDown v-else /></span></th>
          <th v-if="showEditButton"></th>
          <th v-if="showBlockButton"></th>
          <th v-if="showBlockButton"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in laravelData.data" :key="user.id">
          <td v-if="showPhoto" class="align-middle">
            <img :src="photoFullUrl(user)" class="rounded-circle img_photo" />
          </td>
          <td class="align-middle">{{ user.name }}</td>
          <td class="align-middle">{{ user.email }}</td>
          <td class="align-middle">{{ getUserCategoryName(user.type_id) }}</td>
          <td class="align-middle">{{ user.blocked == 0 ? "Não" : "Sim" }}</td>
          <td class="align-middle">{{ formatDate(user.created_at) }}</td>
          <td class="text-end align-middle" v-if="showEditButton">
            <div class="d-flex justify-content-end" v-if="canViewUserDetailAndBlock(user.id)">
              <button
                class="btn btn-xs btn-light"
                @click="editClick(user)"
                title="Editar"
              >
                <BIconPencil/>
              </button>
            </div>
          </td>
          <td class="text-end align-middle" v-if="showBlockButton">
            <div class="d-flex justify-content-end" v-if="canViewUserDetailAndBlock(user.id)">
              <button
                class="btn btn-xs btn-light"
                @click="changePassword(user)"
                title="Mudar Password"
              >
                <BIconKey/>
              </button>
            </div>
          </td>
          <td class="text-end align-middle" v-if="showBlockButton && !user.blocked && !isUserStore(user.id)">
            <div class="d-flex justify-content-end" v-if="canViewUserDetailAndBlock(user.id)">
                <button
                  class="btn btn-xs btn-light"
                  @click="changeBlockValue(user)"
                  title="Bloquear"
                >
                  <BIconShieldSlash/>
                </button>
            </div>
          </td>
          <td class="text-end align-middle" v-if="showBlockButton && user.blocked && !isUserStore(user.id)">
            <div class="d-flex justify-content-end" v-if="canViewUserDetailAndBlock(user.id)">
                <button
                  class="btn btn-xs btn-light"
                  @click="changeBlockValue(user)"
                  title="Desbloquear"
                >
                  <BIconShieldSlashFill/>
                </button>
            </div>
          </td>
          <td class="text-end align-middle" v-if="showBlockButton && isUserStore(user.id)">
            <div class="d-flex justify-content-end" v-if="canViewUserDetailAndBlock(user.id)">
              
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  

  <div>
    <ul class="pagination" style="cursor: pointer">
      <li v-if="currentPage != 1" class="page-item"><a class="page-link text-dark" @click="getResultsFiltered(currentPage-1)">&laquo;</a></li>
      <li v-for="(link, index) in filteredPages" class="page-item" :class="{active: currentPage == filteredPages[index].label}" @click="getResultsFiltered(index+1)"><a class="page-link text-dark">{{filteredPages[index].label}}</a></li>
      <li v-if="currentPage != laravelData.last_page" class="page-item"><a class="page-link text-dark" @click="getResultsFiltered(currentPage+1)">&raquo;</a></li>
    </ul>
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
