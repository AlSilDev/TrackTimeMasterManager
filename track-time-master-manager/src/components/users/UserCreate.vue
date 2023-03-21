<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'


const axios = inject('axios')
const toast = inject('toast')

const cpassword = ref('')
const router = useRouter()

const newUser = () => {
    return {
        id:null,
        name: '',
        email: '',
        password: '',
        type: 'S',
        blocked: 0,
        photo_url: '',
    }
}

const photo_file = ref('')
const fields = ref(newUser())

const previewFiles =  (event)=>{
    photo_file.value = event.target.files[0];
    
}

const register = (() => {

    console.log(fields.value)
    axios.post('users', fields.value)

        .then((response) => {
            console.log(response)
            fields.value = response.data.data
            console.log(fields.value.id)
            
            toast.success('User ' + fields.value.email + ' was created successfully.')
            router.push({name: 'Login'})
        })
        .catch((error) => {
           console.log(error)
        })
})

const errors = { name: '', email: '', password: '', cpassword: '', phone_num: '', lic_plate: '' }




const invalidPasswordFeedback = computed(() => {

    if (!fields.value.password) {
        console.log("Mandatory field")
        errors.password = "Mandatory field"
    }
    else {
        let passwordLen = fields.value.password.length
        console.log(passwordLen)
        if (passwordLen < 3 || passwordLen > 255) {
            errors.password = "The password's length must be between 3 and 255"
        }
        else {
            errors.password = ''
        }
    }

})

const invalidEmailFeedback = computed(() => {
    //TODO review conditions
    if (!fields.value.email) {
        errors.email = "Mandatory field"
        return
    }
    let emailLen = fields.value.email.length
    if (emailLen < 6 || emailLen > 255) {
        errors.email = "The email's length must be between 6 and 255"
        return
    }
    errors.email = ''
})

const confirmPassword = computed(() => {
    console.log(errors.cpassword)
    console.log(" ")
    if (!cpassword.value) {
        errors.cpassword = "Mandatory field"
        return
    }
    console.log(cpassword.value != fields.value.password)
    if (cpassword.value != fields.value.password) {
        errors.cpassword = "Doesn´t mactch entered password"
        return
    }
    errors.cpassword = ''

})

const togglePasswordC = () => {
    const togglePasswordConst = document.querySelector('#togglePasswordC');
    const password = document.querySelector('#pass1');

    //TODO: not working properly, it needs 2 clicks to function
    togglePasswordConst.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });
}

const togglePassword = () => {
    const togglePasswordConst = document.querySelector('#togglePassword');
    const password = document.querySelector('#pass');

    //TODO: not working properly, it needs 2 clicks to function
    togglePasswordConst.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });
}

const invalidphone_num = computed(() => {
    const re = /^[9][136][0-9]\d{6}$/


    if (!fields.value.phone_num) {
        errors.phone_num = "Mandatory field"
        return
    }


    if (!re.test(fields.value.phone_num)) {
        errors.phone_num = "Phone number is invalid"
        return
    }

    errors.phone_num = ''
})

const invalidLincense = computed(() => {
    const re1 = /^(?:[A-Z]{2}-\d{2}-\d{2})|(?:\d{2}-[A-Z]{2}-\d{2})|(?:\d{2}-\d{2}-[A-Z]{2})|(?:[A-Z]{2}-[A-Z]{2}-\d{2})|(?:[A-Z]{2}-\d{2}-[A-Z]{2})|(?:\d{2}-[A-Z]{2}-[A-Z]{2})$/


    if (!fields.value.lic_plate) {
        errors.lic_plate = "Mandatory field"
        return
    }

    if (!re1.test(fields.value.lic_plate)) {
        errors.lic_plate = "Lincense plate is invalid"
        return
    }

    errors.lic_plate = ''
})

const invalidName = computed(() => {
    if (!fields.value.name) {
        errors.name = "Mandatory Field"
        return
    }

    let nameLen = fields.value.name.length
    if (nameLen < 6 || nameLen > 255) {
        errors.name = "The name length must be between 6 and 255"
        return
    }
    errors.name = ''

})

</script>
<template>

    <form class="row g-3 needs-validation" method="post" enctype="multipart/form-data" novalidate @submit.prevent="register">
        <h3 class="mt-5 mb-3">Register</h3>
        <hr>
        <div class="mb-2 " >
            <label class="form-label">Nome</label>
            <div class="form-inputAndIcon">
                <i class="fa fa-user icon"></i>
                <input  placeholder="Insira o seu nome" type="text" class="form-control" v-model="fields.name"
                    :invalid-feedback="invalidName" required />
            </div>
            <span class="text-danger" style="font-size:10px" v-if="errors.name">{{ errors.name }}</span>
        </div>

        <div class="mb-2 justify-content-center">
            <label class="form-label">Email</label>
            <div class="form-inputAndIcon">
                <i class="fa fa-envelope"></i>
                <input placeholder="Insira a seu email" type="email" id="email" class="form-control"
                    v-model="fields.email" :invalid-feedback="invalidEmailFeedback" required />
            </div>
            <span class="text-danger" style="font-size:10px" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="mb-2 justify-content-center">
            <label class="form-label">Tipo</label>
            <div class="form-inputAndIcon">
                <i class="fa fa-tools"></i>
                <!--input placeholder="Insira a seu email" type="email" id="email" class="form-control"
                    v-model="fields.email" :invalid-feedback="invalidEmailFeedback" required /-->
                <select name="type" v-model="fields.type">
                    <option value="A">Administrador</option>
                    <option value="S">Secretariado</option>
                </select>
            </div>
            <span class="text-danger" style="font-size:10px" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="mb-2 justify-content-center">
            <label class="form-label">Palavra-Passe</label>
            <div class="form-inputAndIcon">
                <i class="fa fa-lock icon"></i>
                <input placeholder="Insira a sua palavra-passe" id="pass" type="password" class="form-control"
                    v-model="fields.password" :invalid-feedback="invalidPasswordFeedback" required />
                <i class="far fa-eye eye-icon" id="togglePassword" @click="togglePassword"></i>
            </div>
            <span class="text-danger" style="font-size:10px" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="mb-2 justify-content-center">
            <label class="form-label">Confirmar Palavra-Passe</label>
            <div class="form-inputAndIcon">
                <i class="fa fa-lock icon"></i>
                <input placeholder="Confirme a sua palavra-passe" id="pass1" type="password" class="form-control"
                    v-model="cpassword" :invalid-feedback="confirmPassword" required />
                <i class="far fa-eye eye-icon" id="togglePasswordC" @click="togglePasswordC"></i>
            </div>
            <span class="text-danger" style="font-size:10px" v-if="errors.cpassword">{{ errors.cpassword
            }}</span>
        </div>
        <br>
        <br>
        <div class="mb-3 d-flex justify-content-center">
            <button type="button" class="btn btn-primary px-5" @click="register">Criar Conta</button>
        </div>

        <div class="form-href" style="margin-top: 8px;">
            <router-link class="nav-link" :to="{ name: 'Login' }">
                Voltar
            </router-link>
        </div>
    </form>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
</template>

<style>

</style>