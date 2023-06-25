   
<script lang="ts">

import { defineComponent } from 'vue';
import { socket, state } from '@/socket';
import { notify } from '@kyvg/vue3-notification';
export default defineComponent({
    data() {
        return {
            devices: [] as any[],
            phoneNumbers: [] as any[],
            selectedPhoneNumber: '',
            selectedSound: '',
            selectedDevice: '',
            serialNumber: '',
            isInvalidSerialNumber: false,
            serialNumberPlaceholder: '',
            privacySelector: '',
            regCode: '',
            verified: '',
            authError: ''
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
        isSerialNumberDisabled() {
            return !this.selectedDevice;
        },
        selectedDeviceData() {
            return this.devices.find((device: any) => device.name === this.selectedDevice);
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.fetchPhoneNumbers();
            this.fetchDevices();
        });
    },
    methods: {
        fetchPhoneNumbers() {
            socket.emit('getFreeNumbers');
            socket.on("freeNumbers", (Numbers) => {
                this.phoneNumbers = Numbers;
            });
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
        verifyCode() {
            // Send code to server for verification
            if (this.regCode.trim() === '') {
                // Handle form validation error
                notify({ text: "Please fill out all the details", type: "error" });
            } else {
                socket.emit('verifyCode', this.regCode);
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
        }
    },
    watch: {
        selectedDevice(newDevice: any) {
            const device = this.devices.find((device: any) => device.name === newDevice);
            console.log(device);
            this.serialNumberPlaceholder = device.serial + '-XXXXXX';
        }
    }
});
</script>

<template>
    <notifications  pauseOnHover=true draggable=true draggablePercent=0.6 icon=true />
    <div class="grid flex-col grid-cols-1 grid-rows-3 gap-4 mx-4 text-left md:grid-cols-2">
        <div class="flex flex-col">
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

        <div class="flex flex-col">
            <label for="serial-number" class="py-2">Pager Serial Number*</label>
            <input required type="text"
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                :class="{ 'w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-1 text-gray-50 bg-gray-950 focus:ring-red-500 focus:border-red-500': isInvalidSerialNumber, 'focus:ring-green-500 focus:border-green-500': !isInvalidSerialNumber }"
                title="serial-number" name="serial-number" id="serial-number" maxlength="12" @input="formatSerialNumber"
                v-model="serialNumber" :placeholder="serialNumberPlaceholder ? serialNumberPlaceholder : 'Serial Number'"
                :disabled="isSerialNumberDisabled">

        </div>

        <div class="flex flex-col">
            <label for="name" class="py-2">Your Name*</label>
            <input required type="text"
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                title="name" name="name" id="name" placeholder="John Doe">
        </div>

        <div class="flex flex-col">
            <label for="freeNumbers" class="py-2">Available Phone Numbers*</label>
            <select required
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                title="freeNumber" name="freeNumbers" v-model="selectedPhoneNumber" id="phoneNumber">
                <option value="">Choose Your Number</option>
                <option v-for="phoneNumber in formattedPhoneNumbers" :value="phoneNumber.number" :key="phoneNumber.number">
                    {{ phoneNumber.formatted }}
                </option>
            </select>
        </div>

        <div class="flex flex-col">
            <label for="pin" class="py-2">Your PIN*</label>
            <input required type="password" autocomplete="new-password" maxlength="4"
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                title="pin" name="pin" id="pin" placeholder="8717 (4 Chars Numeric)">
        </div>

        <div class="flex flex-col ">
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

        <div class="flex flex-col">
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

        <div class="flex flex-col">
            <label for="regCode" class="py-2">Registration Code*</label>
            <input v-model="regCode" required type="password" autocomplete="new-password" maxlength="32"
                class="w-full px-3 py-2 pr-20 text-left border-gray-700 rounded-md shadow-sm appearance-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-gray-50 bg-gray-950"
                title="regCode" name="regCode" id="regCode" placeholder="Code from Retro Gadgets">
        </div>

        <div class="flex flex-col ">

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
                <div v-if="authError" class="px-4 py-2 my-2 text-center text-red-500 bg-red-200 rounded-md">{{ authError }}
                </div>
                <button @click.prevent="verifyCode" class="w-full px-3 py-2 bg-green-500 rounded-md">
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
