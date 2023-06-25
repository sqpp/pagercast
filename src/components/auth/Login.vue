   
<script lang="ts">

import { defineComponent } from 'vue';
import { socket, state } from '@/socket';
import { createPublicKey } from 'crypto';

export default defineComponent({
    data() {
        return {
            phoneNumber: '',
            pinCode: '',
            tFa: '',
            authError: '',
            options: [] as any[],
        }
    },
    computed: {
        Login() {
           console.log("Verification failed. 😭")
        }
    },
});
</script>

<template>
    <div class="flex justify-center w-full h-screen px-8 pt-20 bg-gray-900 ">
        <form action="" class="pt-10" id="login">
            <div id="title" class="text-center">
                <span class="text-3xl font-bold">Login</span>
            </div>
            <div class="flex flex-col w-full pt-8">
                <input type="tel" placeholder="Phone Number"
                    class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950" />
            </div>
            <div class="flex flex-col pt-2">
                <input type="password" placeholder="PIN" maxlength="4"
                    class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950" />
            </div>

            <div class="flex flex-row items-center pt-2">

                <input type="checkbox"
                    class="p-3 text-left text-green-500 border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-950"
                    title="rememberMe" name="rememberMe" id="rememberMe" placeholder="John Doe">
                <label for="rememberMe" class="pl-2 text-sm text-gray-400 select-none">Remember Me</label>
            </div>
            <button @click="() => Login" class="block w-full py-2 mt-4 font-bold bg-green-500 rounded-md"> LOGIN </button>
            <div class="mt-4 text-xs text-gray-500">
                <span>Forgot PIN? <a href="/forgotpin" class="text-blue-500">Click here</a> to reset it</span>
            </div>
        </form>
    </div>
</template>