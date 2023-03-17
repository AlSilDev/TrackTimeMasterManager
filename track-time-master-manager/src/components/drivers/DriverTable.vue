<script setup>
import { inject } from "vue";
import { useUserStore } from "../../stores/user.js"
import avatarNoneUrl from '@/assets/avatar-none.png'

const serverBaseUrl = inject("serverBaseUrl");
const userStore = useUserStore()

const props = defineProps({
  drivers: {
    type: Array,
    default: () => [],
  },
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
        <th class="align-middle">Nome</th>
        <th class="align-middle">Email</th>
        <th class="align-middle">License Number</th>
        <th class="align-middle">License Expiry</th>
        <th class="align-middle">Phoine Number</th>
        <th class="align-middle">Affiliate Number</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="driver in drivers" :key="driver.id">
        <td class="align-middle"></td>
        <td class="align-middle">{{ driver.name }}</td>
        <td class="align-middle">{{ driver.email }}</td>
        <td class="align-middle">{{ driver.license_num }}</td>
        <td class="align-middle">{{ driver.license_expiry }}</td>
        <td class="align-middle">{{ driver.phone_num }}</td>
        <td class="align-middle">{{ driver.affiliate_num }}</td>
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
