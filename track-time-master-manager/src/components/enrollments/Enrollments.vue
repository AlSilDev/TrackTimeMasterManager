<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { useUserStore } from "../../stores/user.js"
import {useRouter} from 'vue-router'
import { BIconArrowUp, BIconArrowDown, BIconBuildingCheck, BIconSearch, BIconArrowCounterclockwise, BIconTrash } from 'bootstrap-icons-vue';
//import { html2pdf } from 'html2pdf.js';

const router = useRouter()
const userStore = useUserStore()
const axios = inject('axios')
const toast = inject('toast')
const html2pdf = inject('html2pdf')

const props = defineProps({
  id: {
    type: Number,
    required: true,
  }
})
const userId = useUserStore().userId

const event = ref()
const enrollOpen = ref(false)
const eventStarted = ref(false)
const eventEnded = ref(false)

const loadEvent = async ()=>{
    //console.log(props)
    await axios.get(`events/${props.id}`)
    .then((response)=>{
        event.value = response.data.data
        /*
        console.log(event.value)
        console.log('date_start_enrollments: ', Date.parse(event.value.date_start_enrollments).valueOf())
        console.log('date_now: ', Date.now())
        console.log('date_end_enrollments: ', Date.parse(event.value.date_end_enrollments).valueOf())
        */
        enrollOpen.value = Date.parse(event.value.date_start_enrollments).valueOf() < Date.now() && Date.parse(event.value.date_end_enrollments).valueOf() > Date.now()
        //console.log('enrollments open: ', enrollOpen.value)
        eventStarted.value = Date.parse(event.value.date_start_event).valueOf() < Date.now()
        eventEnded.value = Date.parse(event.value.date_end_event).valueOf() > Date.now()
    })
    .catch((error)=>{
        console.error(error)
        toast.error('Ocorreu um erro ao procurar o evento.')
    })
}

const driverName = ref('')
const drivers = ref([])

const loadDriversByName = async ()=>{
    //console.log('driver name: ' + driverName.value.value)
    await axios.get(`drivers/canDrive/byName/${event.value.id}/${driverName.value.value}`)
    .then((response)=>{
        drivers.value = response.data
        console.log(drivers.value)
    })
    .catch((error)=>{
        console.error(error)
        toast.error('Ocorreu um erro ao procurar os condutores.')
    })
}

const licensePlate = ref('')
const vehicles = ref('')
const loadVehiclesByLicensePlate = async ()=>{
    await axios.get(`vehicles/canRun/byLicensePlate/${event.value.id}/${licensePlate.value.value}`)
    .then((response)=>{
        vehicles.value = response.data
        //console.log(vehicles.value)
    })
    .catch((error)=>{
        console.error(error)
        toast.error('Ocorreu um erro ao procurar os condutores.')
    })
}

const enrollment = ref({
    event_id: props.id,
    first_driver_id: -1,
    second_driver_id: -1,
    vehicle_id: -1,
    enrolled_by_id: userId
})

const selected_first_driver = ref()
const selectFirstDriver = (driver)=>{
    enrollment.value.first_driver_id=driver.id
    selected_first_driver.value = driver
}

const selected_second_driver = ref()
const selectSecondDriver = (driver)=>{
    enrollment.value.second_driver_id=driver.id
    selected_second_driver.value = driver
}

const selected_vehicle = ref()
const selectVehicle = (vehicle)=>{
    enrollment.value.vehicle_id=vehicle.id
    selected_vehicle.value = vehicle
}

const restartDriversSearch = ()=>{
    driverName.value.value=''
    drivers.value=[]
}

const restartVehiclesSearch = ()=>{
    licensePlate.value.value=''
    vehicles.value=[]
}

const restartSelected = ()=>{
    enrollment.value.first_driver_id = -1
    enrollment.value.second_driver_id = -1
    enrollment.value.vehicle_id = -1
    restartDriversSearch()
    restartVehiclesSearch()
    selected_first_driver.value = null
    selected_second_driver.value = null
    selected_vehicle.value = null
}

const enroll = async ()=>{
    //console.log(enrollment.value)
    await axios.post(`enrollments`, enrollment.value)
    .then((response)=>{
        console.log('enroll', response.data)
        //enrollments.value.push(response.data)
        enrollments.value.push({
            id: response.data.data.id,
            event_id: response.data.data.event_id,
            first_driver_name: selected_first_driver.value.name,
            second_driver_name: selected_second_driver.value.name,
            vehicle_model: selected_vehicle.value.model,
            vehicle_license_plate: selected_vehicle.value.license_plate
        })
        /*restartDriversSearch()
        restartVehiclesSearch()*/
        restartSelected()
        console.log('enrollments after push: ', enrollments.value)
        //loadEnrollments()
    })
    .catch((error)=>{
        console.error(error)
    })
}

const enrollments = ref([])
const loadEventEnrollments = async ()=>{
    console.log("Event id: " + props.id)
    await axios.get('event/' + props.id+ '/enrollments')
    .then((response)=>{
        console.log(response.data)
        enrollments.value = response.data
    })
    .catch((error)=>{
        console.error(error)
    })
}

const eventParticipants = ref([])
const loadEventParticipants = async ()=>{
    console.log("Event id: " + props.id)
    await axios.get('event/' + props.id + '/participants')
    .then((response)=>{
        //console.log(response.data)
        eventParticipants.value = response.data
    })
    .catch((error)=>{
        console.error(error)
    })
}
    
const cancelEnrollment = async (enrollmentId)=>{
    await axios.delete(`enrollments/${enrollmentId}`)
    .then((response)=>{
        const index = enrollments.value.findIndex(element => element.id == enrollmentId)
        enrollments.value.splice(index, 1)
        toast.success(`A inscrição #${enrollmentId} foi cancelada com sucesso.`)
        restartDriversSearch()
        restartVehiclesSearch()
    })
    .catch((error)=>{
        console.error(error)
    })
}

const sortRunOrder = (type, id) => {
    let selected = null
    let aux = null
    switch(type){
        case 'up':
            console.log('up')
            selected = enrollments.value.findIndex((element) => {return element.id == id})
            console.log('selected', enrollments.value[selected])
            const up = enrollments.value.findIndex((element) => {return element.run_order == enrollments.value[selected].run_order-1})
            console.log('up', enrollments.value[up])

            enrollments.value[selected].run_order--
            enrollments.value[up].run_order++

            aux = enrollments.value[up]
            enrollments.value[up] = enrollments.value[selected]
            enrollments.value[selected] = aux

            console.log('new enrollments', enrollments.value)
            break
        case 'down':
            console.log('down')
            selected = enrollments.value.findIndex((element) => {return element.id == id})
            console.log('selected', enrollments.value[selected])
            const down = enrollments.value.findIndex((element) => {return element.run_order == enrollments.value[selected].run_order+1})
            console.log('down', enrollments.value[down])

            enrollments.value[selected].run_order++
            enrollments.value[down].run_order--

            aux = enrollments.value[down]
            enrollments.value[down] = enrollments.value[selected]
            enrollments.value[selected] = aux

            console.log('new enrollments', enrollments.value)
            break
        default:
            console.log('invalid sort type', type)
    }

}

onMounted(async ()=>{
    await loadEvent()
    await loadEventEnrollments()
    await loadEventParticipants()
})

const havePermissionsVT = () => {
  if (!userStore.user) {
    return false
  }
  //Verificações tecnicas - id=3
  return userStore.user.type_id == 3 || userStore.user.type_id == 1
}

const checkInEnroll = async(enrollment) => {
    console.log("Check in done!")
    var checkInValue = {"check_in": 1};
    await axios.patch('enrollments/' + enrollment.id + '/checkIn', checkInValue)
    //remover de eventEnrollment
    removeObjectWithId(enrollment.id)
    //addObject(eventParticipants)
    eventParticipants.value.push(enrollment)
}

const removeObjectWithId = (id) => {
  const objWithIdIndex = enrollments.value.findIndex((obj) => obj.id === id);
  if (objWithIdIndex > -1){
    enrollments.value.splice(objWithIdIndex, 1);
  }
}

const addObject = (enrollmentToAdd, arrayToUpdated) => {
  arrayToUpdated.push(enrollmentToAdd);
}

const updateRunOrder = ()=>{
    const updatedValues = []
    enrollments.value.forEach(enrollment => {
        updatedValues.push({'id': enrollment.id, 'run_order': enrollment.run_order})
    })

    axios.put(`enrollments/${props.id}/run_order`, updatedValues)
    .then((response)=>{
        console.log('put', response.data)
    })
    .catch((error)=>{
        console.error(error)
    })
        
    console.log('updated:', updatedValues)
}

const exportList = async (listName)=>{
    const date = new Date()
    var element = document.getElementById(`pdf-${listName}`);
    var opt = {
        margin:       2,
        filename:     `${listName.toUpperCase()}_${event.value.name}_${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}.pdf`,
        image:        { type: 'png' },
        html2canvas:  { scale: 4, letterRendering: true },
        //html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'cm', format: 'a4', orientation: 'landscape' }
    };
    element.hidden = false
    await html2pdf().set(opt).from(element).save();
    element.hidden = true
}

const flag = (country)=>{
  return 'flag flag-' + country.toLowerCase().split('(')[0].trim().replaceAll(' ', '-')
}

</script>
<template>
    <br>
    <div class="accordion" id="accordionExample" v-if="enrollOpen">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Adicionar Inscrição
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <div>
                        <div class="mb-2 justify-content-center">
                            <div class="input-group">
                            <span class="input-group-text"><BIconSearch/></span>
                            <input placeholder="Nome do condutor..." type="string" id="driverName" class="form-control" ref="driverName" />
                            <button class="btn btn-outline-secondary" type="button" @click="loadDriversByName()">Procurar</button>
                            <button class="btn btn-outline-secondary" type="button" @click="restartDriversSearch()">Reiniciar</button>
                            </div>
                        </div>
                        
                        <table class="table table-hover table-striped" v-if="drivers.length != 0">
                            <thead class="table-dark" style="cursor: pointer">
                                <tr>
                                    <th class="align-middle">Nome</th>
                                    <th class="align-middle">Email</th>
                                    <th class="align-middle">Nº de Licença</th>
                                    <th class="align-middle">Validade da Licença</th>
                                    <th class="align-middle">Nº de Telemóvel</th>
                                    <th class="align-middle">Nº de Sócio</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="driver in drivers" :key="driver.id">
                                    <td class="align-middle">{{ driver.name }}</td>
                                    <td class="align-middle">{{ driver.email }}</td>
                                    <td class="align-middle">{{ driver.license_num }}</td>
                                    <td class="align-middle">{{ driver.license_expiry }}</td>
                                    <td class="align-middle">{{ driver.phone_num }}</td>
                                    <td class="align-middle">{{ driver.affiliate_num }}</td>
                                    <td><button class="btn btn-dark" @click="selectFirstDriver(driver)" v-if="driver.id != enrollment.first_driver_id">1º</button></td>
                                    <td><button class="btn btn-dark" @click="selectSecondDriver(driver)" v-if="driver.id != enrollment.second_driver_id">2º</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <div class="mb-2 justify-content-center">
                            <div class="input-group">
                            <span class="input-group-text"><BIconSearch/></span>
                            <input placeholder="Matrícula..." type="string" id="licensePlate" class="form-control" ref="licensePlate" />
                            <button class="btn btn-outline-secondary" type="button" @click="loadVehiclesByLicensePlate()">Procurar</button>
                            <button class="btn btn-outline-secondary" type="button" @click="restartVehiclesSearch()">Reiniciar</button>
                            </div>
                        </div>

                        <table class="table table-hover table-striped" v-if="vehicles.length != 0">
                            <thead class="table-dark" style="cursor: pointer">
                                <tr>
                                    <th class="align-middle">Matrícula</th>
                                    <th class="align-middle">Modelo</th>
                                    <th class="align-middle">Ano</th>
                                    <th class="align-middle">Cilindrada (cm3)</th>
                                    <th class="align-middle">Classe</th>
                                    <th class="align-middle">Categoria</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="vehicle in vehicles" :key="vehicle.id">  
                                    <td class="align-middle">{{ vehicle.license_plate }}</td>
                                    <td class="align-middle">{{ vehicle.model }}</td>
                                    <td class="align-middle">{{ vehicle.year }}</td>
                                    <td class="align-middle">{{ vehicle.engine_capacity }}</td>
                                    <td class="align-middle">{{ vehicle.class }}</td>
                                    <td class="align-middle">{{ vehicle.category }}</td>
                                    <td><button class="btn btn-dark" @click="selectVehicle(vehicle)"></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button class="btn btn-dark" @click="enroll()" :disabled="!selected_first_driver || !selected_second_driver || !selected_vehicle">Efetuar Inscrição</button>
                    <button class="btn btn-dark" @click="restartSelected()" :disabled="!selected_first_driver && !selected_second_driver && !selected_vehicle"><BIconArrowCounterclockwise/></button>
                </div>
            </div>
        </div>
    </div>

    <br>

    <div v-if="enrollments.length != 0">
        <h2>Inscritos</h2>
        <table class="table table-hover table-striped">
            <thead class="table-dark" style="cursor: pointer">
                <tr>
                    <th v-if="!enrollOpen && !eventStarted" class="align-middle"></th>
                    <th v-if="!enrollOpen && !eventStarted" class="align-middle"># Porta</th>
                    <th class="align-middle"># Inscrição</th>
                    <th class="align-middle">1º Condutor</th>
                    <th class="align-middle">2º Condutor</th>
                    <th class="align-middle">Modelo</th>
                    <th class="align-middle">Matrícula</th>
                    <th class="align-middle" v-if="havePermissionsVT()"></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="eventEnrollment in enrollments" :key="eventEnrollment.id">
                    <td v-if="!enrollOpen && !eventStarted" class="align-middle"><button class="btn btn-link" :disabled="eventEnrollment.run_order==1" @click="sortRunOrder('up', eventEnrollment.id)"><BIconArrowUp/></button><button class="btn btn-link" :disabled="eventEnrollment.run_order==enrollments.length" @click="sortRunOrder('down', eventEnrollment.id)"><BIconArrowDown/></button></td>
                    <td v-if="!enrollOpen && !eventStarted" class="align-middle">{{ eventEnrollment.run_order }}</td>
                    <td class="align-middle"> {{ eventEnrollment.enroll_order }}</td>
                    <td class="align-middle">{{ eventEnrollment.first_driver_name }}</td>
                    <td class="align-middle">{{ eventEnrollment.second_driver_name }}</td>
                    <td class="align-middle">{{ eventEnrollment.vehicle_model }}</td>
                    <td class="align-middle">{{ eventEnrollment.vehicle_license_plate }}</td>
                    <td class="align-middle"><button class="btn btn-success" title="Check in" v-if="havePermissionsVT()" @click="checkInEnroll(eventEnrollment)"><BIconBuildingCheck/></button></td>
                    <td class="align-middle"><button class="btn btn-danger" @click="cancelEnrollment(eventEnrollment.id)"><BIconTrash/></button></td>
                </tr>
            </tbody>
        </table>
        <button v-if="!enrollOpen && !eventStarted" class="btn btn-primary" @click="updateRunOrder">Guardar Alterações</button>

        
        <div id="pdf-enrollments" hidden>
            <h2>Lista de Inscritos</h2>
            <br>
            <table class="table table-hover table-striped table-sm" style="font-size: 8pt;">
                <thead class="table-dark" style="cursor: pointer">
                    <tr>
                        <th class="align-middle">Nº</th>
                        <th class="align-middle">1º Condutor</th>
                        <th class="align-middle">Lic. Nº</th>
                        <th class="align-middle">2º Condutor</th>
                        <th class="align-middle">Lic. Nº</th>
                        <th class="align-middle">Modelo</th>
                        <th class="align-middle">Categoria</th>
                        <th class="align-middle">Classe</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="eventEnrollment in enrollments" :key="eventEnrollment.id">
                        <td class="align-middle">{{ eventEnrollment.run_order }}</td>
                        <td class="align-middle">{{ eventEnrollment.first_driver_name }}</td>
                        <td class="align-middle">{{ eventEnrollment.first_driver_license }}</td>
                        <td class="align-middle">{{ eventEnrollment.second_driver_name }}</td>
                        <td class="align-middle">{{ eventEnrollment.second_driver_license }}</td>
                        <td class="align-middle">{{ eventEnrollment.vehicle_model }}</td>
                        <td class="align-middle">{{ eventEnrollment.vehicle_category }}</td>
                        <td class="align-middle">{{ eventEnrollment.vehicle_class }}</td>
                    </tr>
                </tbody>
            </table>

        </div>
        <button class="btn btn-primary" @click="exportList('enrollments')">Exportar Lista de Inscritos</button>
    </div>
    <div v-else>
        <h2>Inscritos</h2>
        <h6 v-if="eventStarted && !eventEnded">Sem inscritos para fazer check in</h6>
        <h6 v-if="!eventStarted">Sem inscritos</h6>
    </div>

    <br>

    <!--div v-if="eventParticipants.length != 0 && eventStarted"-->
    <div v-if="eventParticipants.length != 0">
        <h2>Participantes</h2>
        <table class="table table-hover table-striped" v-if="eventParticipants.length != 0">
            <thead class="table-dark" style="cursor: pointer">
                <tr>
                    <th class="align-middle">1º Condutor</th>
                    <th class="align-middle">2º Condutor</th>
                    <th class="align-middle">Modelo</th>
                    <th class="align-middle">Matrícula</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="eventParticipant in eventParticipants" :key="eventParticipant.id">
                    <td class="align-middle">{{ eventParticipant.first_driver_name }}</td>
                    <td class="align-middle">{{ eventParticipant.second_driver_name }}</td>
                    <td class="align-middle">{{ eventParticipant.vehicle_model }}</td>
                    <td class="align-middle">{{ eventParticipant.vehicle_license_plate }}</td>
                </tr>
            </tbody>
        </table>

        <div id="pdf-participants" hidden>
            <h2>Lista de Participantes</h2>
            <br>
            <table class="table table-hover table-striped table-sm" style="font-size: 8pt;">
                <thead class="table-dark" style="cursor: pointer">
                    <tr>
                        <th class="align-middle">Nº</th>
                        <th class="align-middle">1º Condutor</th>
                        <th class="align-middle">Lic. Nº</th>
                        <th class="align-middle">2º Condutor</th>
                        <th class="align-middle">Lic. Nº</th>
                        <th class="align-middle">Modelo</th>
                        <th class="align-middle">Categoria</th>
                        <th class="align-middle">Classe</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="eventParticipant in participants" :key="eventParticipant.id">
                        <td class="align-middle">{{ eventParticipant.run_order }}</td>
                        <td class="align-middle">{{ eventParticipant.first_driver_name }}</td>
                        <td class="align-middle">{{ eventParticipant.first_driver_license }}</td>
                        <td class="align-middle">{{ eventParticipant.second_driver_name }}</td>
                        <td class="align-middle">{{ eventParticipant.second_driver_license }}</td>
                        <td class="align-middle">{{ eventParticipant.vehicle_model }}</td>
                        <td class="align-middle">{{ eventParticipant.vehicle_category }}</td>
                        <td class="align-middle">{{ eventParticipant.vehicle_class }}</td>
                    </tr>
                </tbody>
            </table>

        </div>
        <button class="btn btn-primary" @click="exportList('participants')">Exportar Lista de Participantes</button>
    </div>
    <!--div v-if="eventStarted"-->
    <div v-else>
        <h2>Participantes</h2>
        <h6>Sem Participantes</h6>
    </div>
</template>