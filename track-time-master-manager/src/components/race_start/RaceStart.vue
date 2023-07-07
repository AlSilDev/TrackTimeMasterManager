<script setup>
import { inject, ref, watch } from 'vue';
import { BIconSave } from 'bootstrap-icons-vue';
import moment from 'moment'

const axios = inject('axios')
const toast = inject('toast')
const socket = inject("socket")

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

const parseDates = (element) => {
    element.start_date = new Date(element.start_date)
    element.end_date = new Date(element.end_date)
    element.time_split = {}
    element.time_split.hours = element.start_date.getHours()
    element.time_split.minutes = element.start_date.getMinutes()
    element.time_split.seconds = element.start_date.getSeconds()
    console.log(`element ${element.run_order}`, element)
}

const times = ref([])
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
            time.start_date.setHours(value)
            break
        case 'min':
            time.start_date.setMinutes(value)
            break
        case 'sec':
            time.start_date.setSeconds(value)
            break
    }
    console.log('updatedTime', time.start_date)
}

const saveTime = (time) => {
    var time_to_save = Object.assign({}, time)
    time_to_save.start_date = time.start_date.toISOString().replace('T', ' ').replace('Z', '')
    time_to_save.started = true
    console.log('tts', time_to_save)
    //console.log('before send', time)
    axios.put(`stageRuns/${props.stage_run_id}/times/${time.id}/start`, time_to_save)
    .then((response) => {
        console.log(response)
        parseDates(response.data.data)
        times.value[time.run_order - 1] = response.data.data
        socket.emit('updateStageRunRaceStartTime', time);
        toast.success(`O tempo do participante #${time.run_order} foi alterado com sucesso.`)
    })
    .catch((error) => {
        console.error(error)
    })
    //console.log('time_to_save', time_to_save)
    //parseDates(time_to_save)
    //times.value[time.run_order - 1] = time_to_save
    //toast.success(`O tempo do participante #${time.run_order} foi alterado com sucesso.`)
    //socket.emit('updateStageRunRaceStartTime', time);
}

socket.on('updateStageRunRaceStartTime', (timeUpdated) => {
    //atualizar elemento com timeUpdated nos times
    console.log('timeUpdated', timeUpdated)
    //const auxDater = new Date(timeUpdated.start_date)
    //console.log('auxDater', auxDater)
    timeUpdated.start_date = new Date(timeUpdated.start_date)

    const elementToUpdatedIdx = times.value.findIndex((element) => {
        return element.id == timeUpdated.id
    })
    console.log('BEFORE times.value[elementToUpdatedIdx]', times.value[elementToUpdatedIdx].start_date)
    console.log('timeUpdated.start_date', timeUpdated.start_date)
    const auxDaterFinal = new Date(timeUpdated.start_date)
    times.value[elementToUpdatedIdx].time_split.hours = auxDaterFinal.getHours()
    times.value[elementToUpdatedIdx].time_split.minutes = auxDaterFinal.getMinutes()
    times.value[elementToUpdatedIdx].time_split.seconds = auxDaterFinal.getSeconds()
    console.log('AFTER times.value[elementToUpdatedIdx]', times.value[elementToUpdatedIdx])
    //const timeUpdatedAux = new Date(timeUpdated.start_date)
    //const timeToUpdate = new Date(times.value[elementToUpdatedIdx].start_date)
    /*updateTime(times.value[elementToUpdatedIdx], timeUpdatedAux.getHours(), 'h');
    updateTime(times.value[elementToUpdatedIdx], timeUpdatedAux.getMinutes(), 'm');
    updateTime(times.value[elementToUpdatedIdx], timeUpdatedAux.getSeconds(), 's');*/
    //console.log('times.value[elementToUpdatedIdx].start_date', times.value[elementToUpdatedIdx].start_date)
    //console.log('timeToUpdate', timeToUpdate)
    //console.log('timeUpdatedAux.getHours()', timeUpdatedAux.getHours())
    //timeToUpdate.setHours(timeUpdatedAux.getHours())
    //timeToUpdate.setMinutes(timeUpdatedAux.getMinutes())
    //timeToUpdate.setSeconds(timeUpdatedAux.getSeconds())
    //console.log('timeToUpdate', timeToUpdate)
})

const formatDate = (value)=>{
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY hh:mm:ss')
  }
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
    <h1>PARTIDAS</h1>
    <div class="table-responsive">
        <table class="table table-striped table-hoverable">
            <thead class="table-dark" style="cursor: pointer">
                <tr>
                    <th class="align-middle"># Porta</th>
                    <th class="align-middle">Hora de Partida</th>
                    <th class="align-middle">Começou</th>
                    <th class="align-middle">Finalizou</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="time in times" :key="time.id">
                    <td class="align-middle">{{ time.run_order }}</td>
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
                        <!--,
                        <input
                            type="number"
                            id="inputStartMilliseconds"
                            min="0"
                            max="999"
                            required
                            v-model="time.time_split.milliseconds"
                            @change="updateTime(time, time.time_split.milliseconds, 'mil')"
                        /-->
                    </td>
                    <td class="align-middle">{{ time.started == 1 ? 'Sim' : 'Não' }}</td>
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