<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withXSRFToken = true;
axios.defaults.withCredentials = true;
const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');


const register = async ()=>{
    const req = await axios.post('/api/register', {
        name: name.value,
        email: email.value,
        password: password.value
    });
    console.log(req.data);
    router.push('/profile');
}
</script>
<template>
<div class="">
    <div class="max-w-md border p-6 rounded mx-auto mt-12 bg-gray-50">
        <h1 class="text-2xl font-bold my-4 text-gray-800">Register your account</h1>
        <form class="space-y-4 md:space-y-6" >
            <div>
                <label for="name" class="block mb-2 text-sm font-medium text-gray-900 ">name</label>
                <input v-model="name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name">
            </div>
            <div>
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                <input v-model="email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="email@company.com">
            </div>
            <div>
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input v-model="password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5">
            </div>
 
            <button type="button" @click="register" class="w-full text-white bg-blue-400 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign up</button>
            
        </form>
    </div>

</div>
</template>