<script setup>
import { inject, ref, watch } from 'vue';
import { BIconSave } from 'bootstrap-icons-vue';

const axios = inject('axios')
const toast = inject('toast')
const props = defineProps({
    event_id: {
        type: Number,
        required: true
    },
    stage_id: {
        type: Number,
        required: true
    },
    stage_run_id: {
        type: Number,
        required: true
    }
})

const times = ref([])

const parseDates = (element) => {
    element.start_date = new Date(element.start_date)
    element.end_date = new Date(element.end_date)
    element.time_split = {}
    element.time_split.hours = element.end_date.getHours()
    element.time_split.minutes = element.end_date.getMinutes()
    element.time_split.seconds = element.end_date.getSeconds()
    console.log(`element ${element.run_order}`, element)
}
const loadTimesRun = (stage_run_id) => {
    axios.get(`stageRuns/${stage_run_id}/times`)
    .then((response)=>{
        console.log(response)
        times.value = response.data
        times.value.forEach((element) => {
            parseDates(element)
        })
    })
    .catch((error)=>{
        console.error(error)
    })
}

const updateTime = (time, value, type) => {
    switch(type)
    {
        case 'h':
            time.end_date.setHours(value)
            break
        case 'min':
            time.end_date.setMinutes(value)
            break
        case 'sec':
            time.end_date.setSeconds(value)
            break
    }
    console.log('updatedTime', time.end_date)
}

const saveTime = (time) => {
    var time_to_save = Object.assign({}, time)
    time_to_save.end_date = time.end_date.toISOString().replace('T', ' ').replace('Z', '')
    time_to_save.arrived = true
    console.log('tts', time_to_save)
    //console.log('before send', time)
    axios.put(`stageRuns/${props.stage_run_id}/times/${time.id}/end`, time_to_save)
    .then((response) => {
        console.log(response)
        parseDates(response.data.data)
        times.value[time.run_order - 1] = response.data.data
        //console.log(time)
        console.log(times)
        toast.success(`O tempo do participante #${time.run_order} foi alterado com sucesso.`)
    })
    .catch((error) => {
        console.error(error)
        toast.error(error.response.data)
    })
}

watch(
    () => props.stage_run_id,
    (newValue) => {
        loadTimesRun(newValue)
      },
    {immediate: true}
)
</script>
<template>
    <h1>TOMADA DE TEMPO</h1>
    <div>
        <table class="table table-striped table-hoverable">
            <thead class="table-dark" style="cursor: pointer">
                <tr>
                    <th class="align-middle"># Porta</th>
                    <th class="align-middle">Hora de Partida</th>
                    <th class="align-middle">Começou</th>
                    <th class="align-middle">Hora de Tomada</th>
                    <th class="align-middle">Pontos</th>
                    <th class="align-middle">Penalização</th>
                    <th class="align-middle">Finalizou</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="time in times" :key="time.id">
                    <td class="align-middle">{{ time.run_order }}</td>
                    <td class="align-middle">{{ time.start_date.getHours() + ':' +  time.start_date.getMinutes() + ':' + time.start_date.getSeconds() }}</td>
                    <td class="align-middle">{{ time.started == 1 ? 'Sim' : 'Não' }}</td>
                    <td class="align-middle">
                        <input
                            type="number"
                            id="inputStartHours"
                            min="0"
                            max="23"
                            required
                            v-model="time.time_split.hours"
                            @change="updateTime(time, time.time_split.hours, 'h')"
                        />
                        :
                        <input
                            type="number"
                            id="inputStartMinutes"
                            min="0"
                            max="59"
                            required
                            v-model="time.time_split.minutes"
                            @change="updateTime(time, time.time_split.minutes, 'min')"
                        />
                        :
                        <input
                            type="number"
                            id="inputStartSeconds"
                            min="0"
                            max="59"
                            required
                            v-model="time.time_split.seconds"
                            @change="updateTime(time, time.time_split.seconds, 'sec')"
                        />
                        ,
                        <input
                            type="number"
                            id="inputStartMilliseconds"
                            min="0"
                            max="999"
                            required
                            v-model="time.time_mils"
                        />
                    </td>
                    <td class="align-middle">{{ time.time_points }}</td>
                    <td class="align-middle">{{ time.penalty }}</td>
                    <td class="align-middle">{{ time.arrived == 1 ? 'Sim' : 'Não' }}</td>
                    <td class="align-middle"><button class="btn btn-info" @click="saveTime(time)"><BIconSave></BIconSave></button></td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<style>
input {
    width: 60px;
}
</style>