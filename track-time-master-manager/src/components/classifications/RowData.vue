<script setup>
const props = defineProps({
    run: {
        required: true
    },
    prevRun: {
        required: false
    },
    minFunction: {
        type: Function,
        required: true
    }
})
</script>
<template>
    <td class="align-middle">{{ props.minFunction(props.run.time_secs) }}</td>
    <td class="align-middle">{{ props.run.penalty }}</td>
    <td class="align-middle" v-if="props.prev_run">{{ Math.abs(props.run.time_secs - props.prevRun.time_secs) }}</td>
</template>