

<template>
    <div class="flex flex-row justify-center w-full px-8 pt-32">
        <form ref="loginForm" action="" @submit.prevent="handleFormSubmit"
            class="px-10 py-20 pt-10 bg-gray-900 rounded-lg lg:rounded-r-none lg:rounded-l-lg xl:py-20 w-96">
            <div id="title" class="text-center">
                <span class="text-3xl font-bold">Login</span>
            </div>
            <div class="flex flex-col w-full pt-8">
                <input type="number" inputmode="numeric" pattern="[0-9]*" placeholder="Phone Number" v-model="phoneNumber"
                    class="inline-block w-full px-3 py-2 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950" />
            </div>
            <div class="flex flex-col w-full pt-2">
                <input type="password" placeholder="PIN" maxlength="4" v-model="pin"
                    class="w-full px-3 py-2 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950" />
            </div>

            <div class="flex flex-row items-center pt-2">

                <input type="checkbox"
                    class="p-3 text-left text-green-500 border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-950"
                    title="rememberMe" name="rememberMe" v-model="rememberMe" id="rememberMe" placeholder="John Doe">
                <label for="rememberMe" class="pl-2 text-sm text-gray-400 select-none">Remember Me</label>
            </div>
            <div class="h-captcha" data-theme="dark" data-sitekey="1a6eb7e2-aa17-49f1-85d0-3a19f17e0e8d"></div>
            <button type="submit"
                class="block w-full py-2 mt-4 font-bold transition duration-500 bg-green-500 rounded-md select-none hover:ease-out hover:bg-green-400 active:bg-green-600 g-recaptcha"
                data-sitekey="6LfLGNcmAAAAAO4fACH6S42GDU9FQ4_C-NhhCD1a" data-callback="onSubmit" data-action="submit"> LOGIN
            </button>
            <div class="flex items-center mt-4 text-sm text-gray-500">
                <button @click.prevent="" class="pr-1 text-blue-500 select-none hover:cursor-pointer">
                    Sign
                    in with a security key </button> <i class="mt-0.5 la la-question-circle la-lg"></i>
            </div>
            <div class="mt-4 text-xs text-gray-500">
                <span>Forgot PIN? <a href="/forgotpin" class="text-blue-500">Click here</a> to reset it</span>
            </div>

        </form>
        <div id="register"
            class="relative flex-row hidden bg-gray-800 border-l-2 border-green-500 rounded-r-lg lg:w-1/2 lg:flex xl:w-auto">
            <div class="relative z-50 flex flex-col w-full h-full pt-12 ml-12 lg:px-16">
                <h2 class="text-xl font-bold break-words ">Retro Pagers - Modern environment</h2>
                <span class="text-gray-300">Features that redefine the era of pagers</span>
                <ol class="flex flex-col m-5 font-thin list-disc">
                    <li>Web Pagers <sup>beta</sup></li>
                    <li>Send Messages (Web Only for authentic reasons)</li>
                    <li>Receive Messages</li>
                    <li>Read News (RSS Reader)</li>
                    <li>Smart Reminders</li>
                    <li>Spotify<sup>&copy;</sup> Player</li>
                    <li>Desktop App via <a class="text-blue-500"
                            href="https://store.steampowered.com/app/1730260/Retro_Gadgets/" target="_blank"
                            alt="Retro Gadgets Game on Steam">Retro Gadgets</a></li>
                    <li>Many more... 😎</li>
                </ol>
                <a href="/register"
                    class="flex justify-center w-40 py-2 font-bold uppercase transition duration-500 bg-blue-500 rounded-lg select-none hover:ease-out hover:bg-blue-400 active:bg-blue-600">Register</a>
                <div class="z-0 flex flex-row items-center justify-center h-full gap-4 my-4">
                    <img class="w-20 h-auto" src="@/assets/retrogadgets-logo.png" />
                    <img class="w-20 h-auto" src="@/assets/Spotify_Logo_RGB_Green.png" />
                    <div class="flex flex-row items-center h-auto gap-1">
                        <svg class="flex h-6" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMinYMin meet">
                            <circle cx="128" cy="128" r="114" stroke="#fff" stroke-width="20" fill="none" />
                            <path
                                d="M97.637 121.69c27.327-22.326 54.058-45.426 81.98-67.097-14.646 22.505-29.708 44.711-44.354 67.215-12.562.06-25.123.06-37.626-.119zM120.737 134.132c12.621 0 25.183 0 37.745.179-27.505 22.206-54.117 45.484-82.099 67.096 14.646-22.505 29.708-44.77 44.354-67.275z"
                                fill="#fff" />
                        </svg>
                        <span class="">Socket.IO</span>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>
<style>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { socket } from '@/socket';
import router from '@/router/index'
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import { io } from 'socket.io-client';

export default defineComponent({
    data() {
        return {
            phoneNumber: '',
            pin: '',
            rememberMe: false,
            loginResponse: null,
        };
    },
    methods: {
        async handleFormSubmit() {
            if (!this.phoneNumber || !this.pin) {
                toast.error('Phone Number and PIN are required for login!', {
                    position: toast.POSITION.TOP_CENTER,
                    theme: 'dark',
                    toastId: 'missingFields',
                });
                return;
            }

            const data = {
                phoneNumber: this.phoneNumber,
                pin: this.pin,
            };

            socket.emit('/login', data);
        }
    },
    watch: {
        loginResponse(response) {
            console.log(response)
  if (response.isAuthenticated == true && response.error === false) {
    // Handle successful login
    toast.success('Success... Lets beep together!', {
      position: toast.POSITION.TOP_CENTER,
      theme: 'dark',
      toastId: 'successLogin',
    });
    if (response.isFirstLogin === true) {
      this.$router.push('/setup');
    }
  } else if (response.error === 'inCorrectPIN') {
    // Incorrect PIN error
    toast.error('Sorry. Incorrect PIN!', {
      position: toast.POSITION.TOP_CENTER,
      theme: 'dark',
      toastId: 'incorrectPIN',
    });
  } else if (response.error === 'notFoundPhoneNumber') {
    // Phone number not found error
    toast.info('PhoneNumber is unknown!', {
      position: toast.POSITION.TOP_CENTER,
      theme: 'dark',
      toastId: 'notFoundPhoneNumber',
    });
  } else {
    // Other error scenarios
    toast.warning('Oups.. Something went wrong!', {
      position: toast.POSITION.TOP_CENTER,
      theme: 'dark',
      toastId: 'unknown',
    });
  }
}


},
mounted() {
  socket.on('/login/response', (data) => {
    this.loginResponse = data;
  });
},
});
</script>
