<script setup>
  const props = defineProps({
    errors: {
      type: Object,
      default: null,
    },
    fieldName: {
      type: String,
      default: "",
    }
  })
</script>

<template>
    <div v-if="props.errors ? props.errors[fieldName] : false" class="validation-error">
      {{ props.errors[fieldName][0] || '' }}
    </div>
</template>
  

<style scoped>
.validation-error {
color: red;
font-size: 0.85rem;
}
</style>