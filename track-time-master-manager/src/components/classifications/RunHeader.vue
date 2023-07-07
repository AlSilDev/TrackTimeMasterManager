<script setup>
import { onMounted } from 'vue';
const props = defineProps({
    n: {
        required: true
    }
})

onMounted(()=>{
    console.log('header', props.n)
})
</script>
<template>
    <th class="align-middle">{{ props.n }}ª Passagem</th>
    <th class="align-middle">Penalização</th>
    <th class="align-middle" v-if="props.n > 1">Dif.</th>
</template>