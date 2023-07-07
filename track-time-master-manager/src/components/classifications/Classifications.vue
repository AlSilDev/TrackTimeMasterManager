<script setup>
import { inject, onMounted, ref } from 'vue';
import RunHeader from './RunHeader.vue'
import RowData from './RowData.vue'
const socket = inject("socket")

const axios = inject('axios')
const toast = inject('toast')

const props = defineProps({
    c_type: {
        required: true
    },
    event_id: {
        type: Number
    },
    stage_id: {
        type: Number
    },
    stage_run_id: {
        type: Number
    }
})

const classifications = ref([])
const num_runs = ref(null)
const loadClassifications = (id) => {
    axios.get(`${props.c_type}s/${id}/classifications`)
    .then((response) => {
        console.log(response.data)
        if (props.c_type == 'stage')
        {
            classifications.value = response.data.classifications
            num_runs.value = response.data.num_runs
            console.log('num runs', num_runs.value)
        }
        else
            classifications.value = response.data
    })
    .catch((error) => {
        console.error(error)
    })
}

const flag = (country)=>{
  return 'flag flag-' + country.toLowerCase().split('(')[0].trim().replaceAll(' ', '-')
}

const timeInMinutes = (time_secs) => {
    var minutes = Math.floor(time_secs / 60)
    var seconds = time_secs - minutes * 60;

    minutes = minutes/10 < 1 ? '0' + minutes : minutes
    seconds = seconds/10 < 1 ? '0' + seconds : seconds
    return minutes + ':' + seconds
}

socket.on('updateFinalTimeForTimeRun', (classificationUpdated) => {
    console.log('timeUpdated', classificationUpdated)

    const elementToUpdatedIdx = classifications.value.findIndex((element) => {
        return element.id == classificationUpdated.id
    })

    console.log('BEFOPRE classifications.value[elementToUpdatedIdx]', classifications.value[elementToUpdatedIdx])
    classifications.value[elementToUpdatedIdx].penalty = classificationUpdated.penalty
    classifications.value[elementToUpdatedIdx].time_mils = classificationUpdated.time_mils
    classifications.value[elementToUpdatedIdx].points = classificationUpdated.time_points
    classifications.value[elementToUpdatedIdx].time_secs = classificationUpdated.time_secs

    classifications.value = classifications.value.slice().sort( (a,b) => {
        return a.time_secs - b.time_secs
    })
})

onMounted(()=>{
    switch(props.c_type)
    {
        case 'stage':
            loadClassifications(props.stage_id)
            break
        case 'stageRun':
            loadClassifications(props.stage_run_id)
            break
    }
    
})
</script>
<template>
<div class="table-responsive">
    <table class="table table-striped table-hoverable table-sm">
        <thead class="table-dark" style="cursor: pointer">
            <tr>
                <th class="align-middle">Pos.</th>
                <th class="align-middle">Nº</th>
                <th class="align-middle">1º Condutor</th>
                <th class="align-middle">2º Condutor</th>
                <th class="align-middle">Veículo</th>
                <th class="align-middle">Cat.</th>
                <th class="align-middle">Classe</th>
                <th class="align-middle">Pontos</th>

                <th class="align-middle" v-if="props.c_type == 'stageRun'">Passagem</th>
                <th class="align-middle" v-if="props.c_type == 'stageRun'">Penalização</th>

                <run-header v-for="n in num_runs" :n="n" v-if="props.c_type != 'event'"></run-header>

                <th class="align-middle" v-for="stage in classifications[0].stages" v-if="props.c_type == 'event' && classifications.length > 0">{{ stage.name }}</th>

                <th class="align-middle" v-if="props.c_type == 'stageRun'">Mils.</th>
                <!--th class="align-middle" v-if="props.c_type == 'stage'"">Dif.</th-->
                <th class="align-middle" v-if="props.c_type == 'stage'">Mils. 1ª</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(classification, index) in classifications" :key="classification.id">
                <td class="align-middle">{{ index + 1 }}</td>
                <td class="align-middle">{{ classification.run_order }}</td>
                <td class="align-middle"><i :class="flag(classification.first_driver_country)"></i> {{ classification.first_driver_name }}</td>
                <td class="align-middle"><i :class="flag(classification.second_driver_country)"></i> {{ classification.second_driver_name }}</td>
                <td class="align-middle">{{ classification.vehicle_model }}</td>
                <td class="align-middle">{{ classification.vehicle_category }}</td>
                <td class="align-middle">{{ classification.vehicle_class }}</td>
                <td class="align-middle" v-if="classification.general_pos">{{ classification.general_pos }}</td>
                <td class="align-middle">{{ classification.points }}</td>

                    <td class="align-middle" v-if="props.c_type == 'stageRun'">{{ timeInMinutes(classification.time_secs) }}</td>
                    <td class="align-middle" v-if="props.c_type == 'stageRun'">{{ classification.penalty }}</td>

                <row-data v-for="run in classification.runs" :run="run" :minFunction="timeInMinutes" :prevRun="index > 0 ? classification.runs[index - 1] : null" v-if="props.c_type != 'event'"></row-data>
                    
                <td class="align-middle" v-for="stage in classification.stages">{{ stage.stage_points }}</td>

                <td class="align-middle" v-if="props.c_type == 'stage' && classification.runs.length == 2">{{ Math.abs(classification.runs[0].time_secs - classification.runs[1].time_secs) }}</td>
                <td class="align-middle" v-if="props.c_type == 'stageRun'">{{ classification.time_mils }}</td>
                <td class="align-middle" v-if="props.c_type == 'stage'">{{ classification.time_mils_first }}</td>
            </tr>
        </tbody>
    </table>
</div>
</template>