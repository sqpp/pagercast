<template>
  <div class="flex flex-col items-center justify-center w-full mt-32">
        <h1 class="mt-4 text-xl font-bold ">Would you like to setup your Security Key?</h1>
        <span class="mt-2 mb-8">You can still do this later in your profile.</span>
        <div class="flex w-32 h-32 p-4 text-green-500 border rounded-full">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 176 176"><defs></defs><g id="icon_art" data-name="icon art"><path class="cls-1" d="M112.53,136.1H63.47a14,14,0,0,1-14-13.85V14.52A14,14,0,0,1,63.47.67h49.06a14,14,0,0,1,14,13.85V122.25A14,14,0,0,1,112.53,136.1ZM63.47,7.67a7,7,0,0,0-7,6.85V122.25a7,7,0,0,0,7,6.85h49.06a7,7,0,0,0,7-6.85V14.52a7,7,0,0,0-7-6.85Z"/><path class="cls-1" d="M109.31,175.33H66.69a3.5,3.5,0,0,1-3.5-3.5V138.32h7v30h35.62v-30h7v33.51A3.5,3.5,0,0,1,109.31,175.33Z"/><path class="cls-2" d="M88,91.79a20.23,20.23,0,1,1,20.55-20.23A20.42,20.42,0,0,1,88,91.79Zm0-33.45a13.23,13.23,0,1,0,13.55,13.22A13.4,13.4,0,0,0,88,58.34Z"/><path class="cls-3" d="M94.19,27.54A6.19,6.19,0,1,1,88,21.46a6.13,6.13,0,0,1,6.19,6.08"/></g></svg>
        </div>
        <div class="flex flex-row gap-4 my-8">
            <button @click="securityKeySetup" class="px-8 py-2 bg-green-500 rounded-lg"> Yes</button>
            <button @click="skip" class="px-8 py-2 bg-gray-500 rounded-lg"> No</button>
        </div>
      
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { socket } from '@/socket';

export default defineComponent({
  data() {
    return {
      reconnecting: false, // Flag to track reconnection attempt
    };
  },
  mounted() {
    this.fetchUser();
    this.setupSocketListeners();
  },
  methods: {
    fetchUser() {
      if (socket && socket.connected) {
        console.log(socket.id); // Access the socket.id property
      } else {
        if (!this.reconnecting) { // Check if reconnection is already in progress
          console.log('Socket not connected. Attempting to reconnect...');
          this.reconnecting = true; // Set the flag to true to prevent multiple reconnection attempts
          socket.connect(); // Reconnect the socket
        }
      }
    },
    setupSocketListeners() {
      socket.on('connect', () => {
        console.log('Socket connected');
        this.reconnecting = false; // Reset the reconnection flag
        console.log(socket.id); // Access the socket.id property
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        this.fetchUser(); // Attempt to reconnect
      });
    },
    securityKeySetup() {
      console.log('start auth process');
    },
    skip() {
      console.log('redirecting to another page...');
    },
  },
});
</script>
