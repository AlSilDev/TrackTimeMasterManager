<script setup>
import { inject } from "vue";
import { useUserStore } from "../../stores/user.js"
import avatarNoneUrl from '@/assets/avatar-none.png'

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()

const props = defineProps({
  vehicles: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: false,
  },
  showModel: {
    type: Boolean,
    default: true,
  },
  showClass: {
    type: Boolean,
    default: true,
  },
  showLicensePlate: {
    type: Boolean,
    default: true,
  },
  showYear: {
    type: Boolean,
    default: true,
  },
  showEngineCapacity: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["edit"]);

const photoFullUrl = (user) => {
  return user.photo_url
    ? serverBaseUrl + "/storage/fotos/" + user.photo_url
    : avatarNoneUrl;
};

const editClick = (user) => {
  emit("edit", user);
};

const canViewUserDetail = (userId) => {
  if (!userStore.user) {
    return false
  }
  return userStore.user.type == 'A' || userStore.user.id == userId
}
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th class="align-middle">#</th>
        <th class="align-middle">Model</th>
        <th class="align-middle">Category</th>
        <th class="align-middle">Class</th>
        <th class="align-middle">License Plate</th>
        <th class="align-middle">Year</th>
        <th class="align-middle">Engine Capacity</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="vehicle in vehicles" :key="vehicle.id">
        <td class="align-middle"></td>
        <td class="align-middle">{{ vehicle.model }}</td>
        <td class="align-middle">{{ vehicle.category }}</td>
        <td class="align-middle">{{ vehicle.class }}</td>
        <td class="align-middle">{{ vehicle.license_plate }}</td>
        <td class="align-middle">{{ vehicle.year }}</td>
        <td class="align-middle">{{ vehicle.engine_capacity }}</td>
        <!--td class="align-middle">
          <img :src="photoFullUrl(user)" class="rounded-circle img_photo" />
        </td>
        <td class="align-middle">{{ user.name }}</td>
        <td v-if="showEmail" class="align-middle">{{ user.email }}</td>
        <td v-if="showAdmin" class="align-middle">{{ user.type == "A" ? "Sim" : "" }}</td>
        <td v-if="showGender" class="align-middle">{{ user.gender_name }}</td>
        <td class="text-end align-middle" v-if="showEditButton">
          <div class="d-flex justify-content-end" v-if="canViewUserDetail(user.id)">
            <button
              class="btn btn-xs btn-light"
              @click="editClick(user)"
              v-if="showEditButton"
            >
              <i class="bi bi-xs bi-pencil"></i>
            </button>
          </div>
        </td-->
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
</style>
