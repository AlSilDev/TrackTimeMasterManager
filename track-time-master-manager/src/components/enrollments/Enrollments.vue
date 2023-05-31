<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import {useRouter} from 'vue-router'
import { useUserStore } from '../../stores/user';

const router = useRouter()
const axios = inject('axios')
const toast = inject('toast')

const props = defineProps({
  id: {
    type: Number,
    required: true,
  }
})
const userId = useUserStore().userId

const event = ref()

const loadEvent = async ()=>{
    console.log(props)
    axios.get(`events/${props.id}`)
    .then((response)=>{
        event.value = response.data
        console.log(event.value)
    })
    .catch((error)=>{
        console.error(error)
        toast.error('Ocorreu um erro ao procurar o evento.')
    })
}

const driverName = ref('')
const drivers = ref([])
const selectedDriver = ref()

const loadDriversByName = async ()=>{
    console.log('driver name: ' + driverName.value.value)
    axios.get(`drivers/byName/${driverName.value.value}`)
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
    axios.get(`vehicles/byLicensePlate/${licensePlate.value.value}`)
    .then((response)=>{
        vehicles.value = response.data
        console.log(vehicles.value)
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

const enroll = async ()=>{
    console.log(enrollment.value)
    axios.post(`enrollments`, enrollment.value)
    .then((response)=>{
        console.log(response.data)
    })
    .catch((error)=>{
        console.error(error)
    })
}

const enrollments = ref([])

const loadEnrollments = async ()=>{
    axios.get('enrollments')
    .then((response)=>{
        console.log(response.data)
        enrollments.value = response.data
    })
    .catch((error)=>{
        console.error(error)
    })
}

onMounted(async ()=>{
    await loadEvent()
    await loadEnrollments()
})
</script>
<template>
    <br>
    <div class="accordion" id="accordionExample">
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
                            <button class="btn btn-outline-secondary" type="button" @click="driverName.value=''">Reiniciar</button>
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
                                    <td><button class="btn btn-dark" @click="enrollment.first_driver_id=driver.id" v-if="driver.id != enrollment.first_driver_id">1º</button></td>
                                    <td><button class="btn btn-dark" @click="enrollment.second_driver_id=driver.id" v-if="driver.id != enrollment.second_driver_id">2º</button></td>
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
                            <button class="btn btn-outline-secondary" type="button" @click="licensePlate.value=''">Reiniciar</button>
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
                                    <td><button class="btn btn-dark" @click="enrollment.vehicle_id=vehicle.id"></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button class="btn btn-dark" @click="enroll()">Efetuar Inscrição</button>
                </div>
            </div>
        </div>
    </div>

    <br>

    <table class="table table-hover table-striped" v-if="enrollments.length != 0">
        <thead class="table-dark" style="cursor: pointer">
            <tr>
                <th class="align-middle">1º Condutor</th>
                <th class="align-middle">2º Condutor</th>
                <th class="align-middle">Modelo</th>
                <th class="align-middle">Matrícula</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="enrollment in enrollments" :key="enrollment.id">
                <td class="align-middle">{{ enrollment.first_driver_name }}</td>
                <td class="align-middle">{{ enrollment.second_driver_name }}</td>
                <td class="align-middle">{{ enrollment.vehicle_model }}</td>
                <td class="align-middle">{{ enrollment.vehicle_license_plate }}</td>
            </tr>
        </tbody>
    </table>
</template>