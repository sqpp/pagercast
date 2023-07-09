   
<script lang="ts">

import { defineComponent , ref, h} from 'vue';
import { socket, state } from '@/socket';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import { type } from 'os';


interface User {
    name: string;
    serial: string;
    number: string;
    ringtone: string;
    device: string;
    privacy: string;
    regcode: string;
    pincode: string;
    twillio: boolean;
    registrationResponse: string;
    authCodeVerified: boolean;
    // Add more properties as needed
}

interface PhoneNumber {
    number: string;
    formatted: string;
    premium: boolean;
}
export default defineComponent({
    data() {
        return {
            isLoading: !state.connected, // Indicates if Socket.IO is loading or not
            devices: [] as any[],
            phoneNumbers: [] as any[],
            isInvalidSerialNumber: false,
            serialNumberPlaceholder: '',

            // Registration Details
            name: '',
            serialNumber: '',
            selectedPhoneNumber: '',
            showPremiumNumbers: false,
            selectedPremiumNumber: '',
            formattedPremiumNumber: '',
            selectedSound: '',
            selectedDevice: '',
            privacySelector: '',
            regcode: '',
            pincode: '', // Set the initial value as number
            twillio: false,
            registrationResponse: '',
            authCodeVerified: false

        };
    },
    computed: {
        formattedPhoneNumbers() {
            return this.phoneNumbers.map((phoneNumber: any) => {
                const formattedNumber = '+' + phoneNumber.number.toString().replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3.$4');
                return {
                    number: phoneNumber.number,
                    formatted: formattedNumber
                };
            });
        },

        formattedPremiumNumbers() {
            return this.phoneNumbers.map((phoneNumber: any) => {
                const formattedPremiumNumber = '+' + phoneNumber.number.toString().replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3.$4');
                return {
                    number: phoneNumber.number,
                    formatted: formattedPremiumNumber
                };
            });
        },
        isSerialNumberDisabled() {
            return !this.selectedDevice;
        },

        selectedDeviceData() {
            return this.devices.find((device: any) => device.name === this.selectedDevice);
        },
        filteredPhoneNumbers() {
            return this.phoneNumbers.filter(phoneNumber => !phoneNumber.premium);
        },
        filteredPremiumNumbers() {
            return this.phoneNumbers.filter(phoneNumber => phoneNumber.premium);
        },
    },
    mounted() {
        this.$nextTick(() => {
            //this.setupSocketConnection();
            this.fetchPhoneNumbers();
            this.fetchDevices();
        });

    },
    methods: {

        fetchPhoneNumbers() {
            socket.emit('getFreeNumbers');
            socket.on("freeNumbers", (numbers: PhoneNumber[]) => {

                this.phoneNumbers = numbers.map(phoneNumber => {
                    const formattedNumber = '+' + phoneNumber.number.toString().replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3.$4');
                    return {
                        number: phoneNumber.number,
                        formatted: formattedNumber,
                        premium: phoneNumber.premium
                    };
                });
            });
        },
        togglePremiumNumbers() {
            this.showPremiumNumbers = !this.showPremiumNumbers;
        },

        fetchDevices() {
            socket.emit('getDevices');
            socket.on("listDevices", (deviceList) => {
                this.devices = deviceList;
            });
        },
        playSound() {
            const audio = new Audio(this.selectedSound);
            audio.play();
        },


        checkCode(code: String) {
            return new Promise((resolve, reject) => {
                socket.emit('verifyCode', code);
                socket.on('codeVerificationResult', (result) => {
                    resolve(result);
                });
            });
        },

        async registerUser() {
            // Check if all required fields are filled
            if (
                this.name &&
                this.selectedDevice &&
                this.serialNumber &&
                (this.selectedPhoneNumber || this.selectedPremiumNumber) && // At least one number must be selected
                this.pincode &&
                this.selectedSound &&
                this.privacySelector &&
                this.regcode
            ) {
                // Perform user registration on the backend
                const user: User = {
                    name: this.name,
                    serial: this.serialNumber,
                    number: this.showPremiumNumbers ? this.selectedPremiumNumber : this.selectedPhoneNumber,
                    ringtone: this.selectedSound,
                    device: this.selectedDevice,
                    privacy: this.privacySelector,
                    regcode: this.regcode,
                    pincode: this.pincode,
                    twillio: this.twillio,
                    registrationResponse: '',
                    authCodeVerified: false
                };

                try {
                    const result = await this.checkCode(this.regcode) as { exists: boolean };
                    if (result.exists) {
                        // Registration code is correct, proceed with registration
                        this.authCodeVerified = true;
                        socket.emit('register', user);
                        socket.on('registerCallback', (response) => {
                            this.registrationResponse = response;
                        });
                    } else {
                        // Registration code is incorrect, show warning message
                        this.authCodeVerified = false;
                        toast.warning('The registration code is incorrect', {
                            position: toast.POSITION.TOP_CENTER,
                            theme: 'dark',
                            toastId: 'missingFields',
                        });
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('An error occurred during code verification.', {
                        position: toast.POSITION.TOP_CENTER,
                        theme: 'dark',
                        toastId: 'missingFields',
                    });
                }
            } else {
                // Show error message or validation feedback
                toast.error('Please fill in all required fields!', {
                    position: toast.POSITION.TOP_CENTER,
                    theme: 'dark',
                    toastId: 'missingFields',
                });
            }
        },

        handleDeviceSelection() {
            // Reset the serial number when the device selection changes
            this.serialNumber = '';
        },

        formatSerialNumber() {
            let value = this.serialNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

            if (value.length === 0) {
                value = '';
                this.isInvalidSerialNumber = false;
            } else if (value.length === 1 && value === 'M') {
                value = 'M-';
                this.isInvalidSerialNumber = false;
            } else if (value.length <= 4 && value.startsWith('M')) {
                value = 'M-' + value.slice(1);
                this.isInvalidSerialNumber = false;
            } else if (value.length <= 10 && value.startsWith('M')) {
                const deviceSerial = this.devices.find((device: any) => device.name === this.selectedDevice)?.serial;
                if (deviceSerial) {
                    const pattern = deviceSerial.replace('M-', '');
                    const inputPattern = value.slice(1, 1 + pattern.length);
                    if (pattern === inputPattern) {
                        value = 'M-' + inputPattern + '-' + value.slice(1 + pattern.length);
                        this.isInvalidSerialNumber = false;
                    } else {
                        value = 'M-' + inputPattern;
                        this.isInvalidSerialNumber = false;
                    }
                }
            } else {
                value = '';
                this.isInvalidSerialNumber = true;
            }
            this.serialNumber = value;
        },
        handleInput(event: Event) {
            const input = event.target as HTMLInputElement;
            const numericValue = input.value.replace(/\D/g, ""); // Remove non-numeric characters
            this.pincode = numericValue; // Assign the filtered numeric value to the pinCode property
        },
    },
    watch: {
        selectedDevice(newDevice) {
            const device = this.devices.find((device) => device.name === newDevice);
            this.serialNumberPlaceholder = device.serial + '-XXXXXX';
        },
        registrationResponse(newResponse) {
            console.log('registrationResponse:', newResponse); // Add this line to log the value of newResponse

            if (newResponse) {
                if (newResponse.success) {
                    const successRegister =toast.success('You have been registered successfully!', {
                        position: toast.POSITION.TOP_CENTER,
                        theme: 'dark',
                        toastId: 'missingFields',
                        autoClose: 3000,
                    });
                    setTimeout(() => {
                    toast.update(successRegister, {
                        render: (props) => {
                            console.log(props);
                            return h('div', 'Redirecting to login in 3s...');
                        },
                        type: toast.TYPE.INFO,
                        autoClose: 3000,
                    })
                    window.location.href = '/login';
                }, 6000);
                } else {
                    toast.error('Registration failed due to an error!', {
                        position: toast.POSITION.TOP_CENTER,
                        theme: 'dark',
                        toastId: 'missingFields',
                    });
                }
            }
        }
    },
});
</script>

<template>
    <div class="grid flex-col grid-cols-1 grid-rows-3 gap-2 mx-4 text-left md:grid-cols-2">
        <div class="flex flex-col max-w-80 lg:w-80">
            <label for="device" class="py-2">Pager Model*</label>
            <select required
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                title="device" name="device" id="device" v-model="selectedDevice" @change="handleDeviceSelection">
                <option selected disabled value="">Choose Your Model</option>
                <option v-for="device in devices" :value="device.name" :key="device.name">
                    {{ device.name }}
                </option>
            </select>
        </div>

        <div class="flex flex-col max-w-80 lg:w-80">
            <label for="serial-number" class="py-2">Pager Serial Number*</label>
            <input required type="text"
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                :class="{ 'w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 text-gray-50 bg-gray-950 focus:ring-red-500 focus:border-red-500': isInvalidSerialNumber, 'focus:ring-green-500 focus:border-green-500': !isInvalidSerialNumber }"
                title="serial-number" name="serial-number" id="serial-number" maxlength="12" @input="formatSerialNumber"
                v-model="serialNumber" :placeholder="serialNumberPlaceholder ? serialNumberPlaceholder : 'Serial Number'"
                :disabled="isSerialNumberDisabled">

        </div>

        <div class="flex flex-col max-w-80 lg:w-80">
            <label for="name" class="py-1">Your Name*</label>
            <input required type="text"
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                title="name" name="name" id="name" v-model="name" placeholder="John Doe">
        </div>

        <div class="flex flex-col max-w-80 lg:w-80">
            <label for="freeNumbers" class="py-1">Available Phone Numbers*</label>

            <div v-if="!showPremiumNumbers">
                <select required :disabled="filteredPhoneNumbers.length === 0"
                    class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                    title="freeNumber" name="freeNumbers" v-model="selectedPhoneNumber" id="phoneNumber">
                    <option v-if="filteredPhoneNumbers.length === 0" selected value='' disabled>No available numbers</option>
                    <option v-if="filteredPhoneNumbers.length > 0" value='' disabled>Choose Your Number</option>
                    <option v-for="phoneNumber in filteredPhoneNumbers" :value="phoneNumber.number" :key="phoneNumber.id">{{
                        phoneNumber.formatted }}</option>
                  
                </select>

                <span class="mt-2 text-xs text-orange-400 hover:cursor-pointer" @click="showPremiumNumbers = true">
                    <a>Looking for <strong>Premium numbers?</strong></a>
                </span>
            </div>
            <div v-else>
                <select :disabled="filteredPremiumNumbers.length === 0"
                    class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none disabled:text-gray-600 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                    title="premiumNumber" name="premiumNumbers" v-model="selectedPremiumNumber" id="premiumNumber">
                    <option v-if="filteredPremiumNumbers.length === 0" selected value='' disabled>No available premium numbers</option>
                    <option v-for="phoneNumber in filteredPremiumNumbers" :value="phoneNumber.number" :key="phoneNumber.id">
                        {{ phoneNumber.formatted }}
                    </option>
                </select>

                <span class="mt-2 text-xs text-gray-400 hover:cursor-pointer" @click="showPremiumNumbers = false">
                    <a>Switch back to regular numbers instead?</a>
                </span>
            </div>


        </div>


        <div class="flex flex-col max-w-80 lg:w-80">
            <label for="pin" class="py-2">Your PIN*</label>
            <input required type="text" pattern="[0-9]" inputmode="numeric" autocomplete="new-password" maxlength="4"
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                title="pin" name="pin" id="pin" @input="handleInput" v-model="pincode" placeholder="8717 (4 Chars Numeric)">
        </div>

        <div class="flex flex-col max-w-80 lg:w-80">
            <div class="flex items-center py-2 div">
                <i class="las la-play"></i>
                <label for="ringSelector" class="mx-2">Ringtone</label>
            </div>

            <select required
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                v-model="selectedSound" @change="playSound">
                <option selected disabled value="">Choose Your Beep</option>
                <option value="assets/snd/gta.wav">GTA III</option>
                <option value="assets/snd/beep.ogg">Beep</option>
            </select>
        </div>

        <div class="flex flex-col max-w-80 lg:w-80">
            <label for="privacySelector" class="py-2">Privacy* (Who can send you message)</label>
            <select required
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                title="privacySelector" name="privacySelector" v-model="privacySelector" id="privacySelector">
                <option selected disabled value="">Choose Communication</option>
                <option>Everyone</option>
                <option>Friends</option>
                <option>Only Me</option>
            </select>
        </div>

        <div class="flex flex-col max-w-80 lg:w-80">
            <label for="regCode" class="py-2">Registration Code*</label>
            <input v-model="regcode" required type="password" autocomplete="new-password" maxlength="32"
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                title="regCode" name="regCode" id="regCode" placeholder="Code from Retro Gadgets">
        </div>

        <div class="flex flex-col max-w-80 lg:w-80">

            <label for="twillio" class="py-2">Twillio Number (Paid Feature)</label>
            <div class="flex flex-row items-center -mt-1">
                <input type="checkbox"
                    class="p-3 text-left text-green-500 border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-950"
                    title="twillio" name="twillio" id="twillio" placeholder="John Doe">
                <p class="w-64 p-2 text-xs break-normal">Sending messages to this Twillio number will be
                    forwarded to your pager.</p>
            </div>

            <label for="tos" class="py-2">Agreement</label>
            <div class="flex flex-row items-center -mt-1">
                <input required type="checkbox"
                    class="p-3 text-left text-green-500 border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-gray-950"
                    title="tos" name="tos" id="tos" placeholder="John Doe">
                <label for="tos" class="py-2 pl-2">Agree Terms of Service</label>
            </div>

            <div class="mt-2 w-54">

                <button @click.prevent="registerUser" class="w-full px-3 py-2 bg-green-500 rounded-md">
                    Register Product
                </button>
            </div>


        </div>

    </div>
    <div class="flex flex-col w-64 h-full mx-4">
        <p class="py-2">Preview:</p>
        <div v-if="selectedDevice">
            <div v-for="device in devices" :key="device.name">
                <div v-if="device.name === selectedDevice"
                    class="relative flex w-64 h-full rounded-md cursor-pointer hover:cursor-pointer group">
                    <img :src="device.image ? `assets/pagers/${device.image}` : 'assets/pagers/preview.png'"
                        class="w-64 rounded-md" />
                    <div
                        class="absolute bottom-0 left-0 right-0 flex flex-col justify-center h-full px-4 py-2 text-center rounded-md bg-black/10 backdrop-blur-sm group-hover:backdrop-blur-none">
                        <h3 class="text-xl font-extrabold text-white">{{ device.name }}</h3>
                        <h2 class="font-black">{{ device.version }}</h2>
                        <p class="text-xs">{{ device.connectivity }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
