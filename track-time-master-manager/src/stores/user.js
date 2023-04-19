import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import avatarNoneUrl from '@/assets/avatar-none.png'

export const useUserStore = defineStore('user', () => {
    const axios = inject('axios')
    const serverBaseUrl = inject('serverBaseUrl')

    const user = ref(null)
    const errors = ref(null)

    const userPhotoUrl = computed(() => {
        if (!user.value?.photo_url) {
            return avatarNoneUrl
        }
        return serverBaseUrl + '/storage/fotos/' + user.value.photo_url
    })

    const userId = computed(() => {
        return user.value?.id ?? -1
    })

    async function loadUser () {
        try {
            const response = await axios.get('users/me')
            user.value = response.data.data
        } catch (error) {
            clearUser()
            throw error
        }
    }

    function clearUser () {
        delete axios.defaults.headers.common.Authorization
        sessionStorage.removeItem('token')
        user.value = null
    }

    async function login (credentials) {
        try {
            const response = await axios.post('login', credentials)
            axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token
            sessionStorage.setItem('token', response.data.access_token)
            await loadUser()
            return true
        }
        catch(error) {
            clearUser()
            return false
        }
    }
    
    async function logout () {
        try {
            await axios.post('logout')
            clearUser()
            return true
        } catch (error) {
            return false
        }
    }

    async function restoreToken () {
        let storedToken = sessionStorage.getItem('token')
        if (storedToken) {
            axios.defaults.headers.common.Authorization = "Bearer " + storedToken
            await loadUser()
            return true
        }
        clearUser()
        return false
    }

    async function changeBlockValue (user) {
        if(user.blocked == 1){
            var blockValue = {"blocked": 0};
        }else{
            var blockValue = {"blocked": 1};
        }
        console.log("User ID: " + user.id)
        try {
            console.log("User ID: " + user.id)
            await axios.patch('users/' + user.id + '/blocked', blockValue)
            return true;
        } catch (error) {
            if (error.response.status == 422) {
                errors.value = error.response.data.errors
            }
            return false
        }
    }
            
    async function changePassword (passwords) {
        errors.value = null
        if (passwords.password != passwords.password_confirmation) {
            return false
        }
        try {
            await axios.patch('users/' +userId.value + '/password', passwords)
            return true;
        } catch (error) {
            if (error.response.status == 422) {
                errors.value = error.response.data.errors
            }
            return false
        }
    }

    return { user, userId, userPhotoUrl, loadUser, clearUser, login, logout, restoreToken, changePassword, changeBlockValue }
})