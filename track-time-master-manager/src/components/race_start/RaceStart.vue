<script setup>
import { inject, ref, watch, onMounted } from 'vue';
import { BIconSave } from 'bootstrap-icons-vue';

const axios = inject('axios')
const toast = inject('toast')
const socket = inject("socket")
const moment = inject('moment')

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
}

const times = ref([])
const loadTimesRun = (stage_run_id) => {
    axios.get(`stageRuns/${stage_run_id}/times`)
    .then((response)=>{
        times.value = response.data
        times.value.forEach((element) => {
            parseDates(element)
        })
    })
    .catch((error)=>{
        console.error(error)
    })
}

const stageRunEnded = ref(false)
const loadStageRun = () => {
    axios.get(`stageRuns/${props.stage_run_id}`)
    .then((response)=>{
        stageRunEnded.value = response.data.data.ended
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
}

const saveTime = (time, index) => {
    var time_to_save = Object.assign({}, time)
    time_to_save.start_date = formatDate(time.start_date.toISOString())
    time_to_save.started = true
    axios.put(`stageRuns/${props.stage_run_id}/times/${time.id}/start`, time_to_save)
    .then((response) => {
        parseDates(response.data.data)
        times.value[index] = response.data.data
        socket.emit('updateStageRunRaceStartTime', times.value[time.run_order - 1]);
        toast.success(`O tempo do participante #${time.run_order} foi alterado com sucesso.`)
    })
    .catch((error) => {
        console.error(error)
    })
}

socket.on('updateStageRunRaceStartTime', (timeUpdated) => {
    //atualizar elemento com timeUpdated nos times
    timeUpdated.start_date = new Date(timeUpdated.start_date)

    const elementToUpdatedIdx = times.value.findIndex((element) => {
        return element.id == timeUpdated.id
    })
    
    const auxDaterFinal = new Date(timeUpdated.start_date)
    times.value[elementToUpdatedIdx].time_split.hours = auxDaterFinal.getHours()
    times.value[elementToUpdatedIdx].time_split.minutes = auxDaterFinal.getMinutes()
    times.value[elementToUpdatedIdx].time_split.seconds = auxDaterFinal.getSeconds()
})

const formatDate = (value)=>{
  if (value) {
    return moment(String(value)).format()
  }
}

watch(
    () => props.stage_run_id,
    (newValue) => {
        loadTimesRun(newValue)
      },
    {immediate: true}
)

onMounted(()=>{
    loadStageRun(props.stage_run_id)
})
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
                <tr v-for="(time, index) in times" :key="time.id">
                    <td class="align-middle">{{ time.run_order }}</td>
                    <td class="align-middle" v-if="!stageRunEnded">
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
                    <td class="align-middle" v-else>{{ `${time.time_split.hours}:${time.time_split.minutes}:${time.time_split.seconds}` }}</td>
                    <td class="align-middle">{{ time.started == 1 ? 'Sim' : 'Não' }}</td>
                    <td class="align-middle">{{ time.arrived == 1 ? 'Sim' : 'Não' }}</td>
                    <td class="align-middle" v-if="!stageRunEnded"><button class="btn btn-info" @click="saveTime(time, index)"><BIconSave></BIconSave></button></td>
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