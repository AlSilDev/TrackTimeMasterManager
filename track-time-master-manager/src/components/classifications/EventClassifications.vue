<script setup>
import { inject, onMounted, ref } from 'vue';

const axios = inject('axios')
const toast = inject('toast')

const props = defineProps({
    event_id: {
        type: Number
    }
})

const classifications = ref([])
const loadClassifications = () => {
    axios.get(`events/${props.event_id}/classifications`)
    .then((response) => {
        console.log(response.data)
        classifications.value = response.data.classifications
        console.log('classifications', classifications.value)
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

onMounted(()=>{
    loadClassifications()
})
</script>
<template>
<div>
    <h2>CLASSIFICAÇÃO GERAL OFICIAL</h2>
    <div v-for="category in classifications">
        <p>{{ category[0].vehicle_category }}</p>
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
                        <th class="align-middle">CG</th>
                        <th class="align-middle">Total</th>
                        <th class="align-middle" v-for="stage in category[0].stages">{{ stage.name }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(c, index) in category">
                        <td class="align-middle">{{ index + 1 }}</td>
                        <td class="align-middle">{{ c.run_order }}</td>
                        <td class="align-middle"><i :class="flag(c.first_driver_country)"></i> {{ c.first_driver_name }}</td>
                        <td class="align-middle"><i :class="flag(c.second_driver_country)"></i> {{ c.second_driver_name }}</td>
                        <td class="align-middle">{{ c.vehicle_model }}</td>
                        <td class="align-middle">{{ c.vehicle_category }}</td>
                        <td class="align-middle">{{ c.vehicle_class }}</td>
                        <td class="align-middle">{{ c.general_pos }}</td>
                        <td class="align-middle">{{ c.points }}</td>
                        <td class="align-middle" v-for="stage in c.stages">{{ stage.stage_points }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
    
</div>
</template>