<script setup>
import { ref, watch, computed, inject } from "vue";

const serverBaseUrl = inject("serverBaseUrl");

const props = defineProps({
  eventCategory: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    required: false
  },
  operationType: {
    type: String,
    default: "insert", // insert / update
  },
})
const emit = defineEmits(["save", "cancel"]);

const editingEventCategory = ref(props.eventCategory)

watch(
  () => props.eventCategory,
  (newEventCategory) => {
    editingEventCategory.value = newEventCategory
  },
  { immediate: true }
)

/*const photoFullUrl = computed(() => {
  return editingUser.value.photo_url
    ? serverBaseUrl + "/storage/fotos/" + editingUser.value.photo_url
    : avatarNoneUrl
})*/

const eventCategoryTitle = computed(() => {
  if (!editingEventCategory.value){
    return ""
  }
  return props.operationType == "insert" ? "Nova Categoria de Evento" : "Categoria de Evento #" + editingEventCategory.value.id;
})

const save = (editingEventCategory) => {
  emit("save", editingEventCategory.value);
}

const cancel = () => {
  emit("cancel", editingEventCategory.value);
}
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">{{ eventCategoryTitle }}</h3>
    <hr />
    <div class="d-flex flex-wrap justify-content-center">
      <div class="w-75 pe-4">
        <div class="mb-3">
          <label for="inputName" class="form-label">Nome</label>
          <input
            type="text"
            rows="4"
            class="form-control"
            id="inputName"
            placeholder="Nome"
            required
            v-model="editingEventCategory.name"
          />
        </div>

        <div class="mb-3 px-1">
          <label for="inputDescription" class="form-label">Descrição</label>
          <textarea
            type="text"
            class="form-control"
            id="inputDescription"
            placeholder="Descrição"
            required
            v-model="editingEventCategory.description"
          ></textarea>
        </div>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-dark px-5" @click="save">Guardar</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancelar</button>
    </div>
  </form>
</template>

<style scoped>

</style>
