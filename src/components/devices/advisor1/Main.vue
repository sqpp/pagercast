

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import Screen from '@/components/devices/advisor1/Screen.vue';


export default defineComponent({
  name: 'advisor-1',
  components: {
    Screen
  },
  mounted() {
    const storage = localStorage.getItem('pagerConfig');
    if (!storage) {
      // Initialize pagerConfig object with default values
      const config = {
        backlitState: false,
        messages: {
          1: "01: HELLO 2023 I AM A NEW MOTOROLA PAGER AVAILABLE ON THE WEB",
          2: "02: SECOND MESSAGE",
          3: "03: ANOTHER MESSAGE"
        }
        // other properties...
      };
      // Store the initial pagerConfig object in local storage
      localStorage.setItem('pagerConfig', JSON.stringify(config));

      this.message = "NULL";
    } else {
      const config = JSON.parse(storage);
      // Update the component's data properties using the stored config values
      this.backlitOn = config.backlitState;
      this.message = config.messages[1];
      // other properties...
    }
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  },
  methods: {
    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        // Tab is now visible, reinitialize long press functionality
        this.tabVisible = true;
      } else {
        // Tab is now hidden, pause or disable long press functionality
        this.tabVisible = false;
      }
    },
    handleMousePress(id: string) {
      if (!this.tabVisible) {
      return;
      }
      if (id === 'func') {
        if (this.backlitOn == false) {
          this.pressTimer = setTimeout(() => {
            const storage = localStorage.getItem('pagerConfig');
            if (storage) {
              console.log("DEBUG: Backlit ON")
              const config = JSON.parse(storage);
              this.backlitOn = true
              this.pressTimer = null
              // Update the specific property within the pagerConfig object
              config.backlitState = this.backlitOn;
              // Save the updated object back to local storage
              localStorage.setItem('pagerConfig', JSON.stringify(config));
            }
            this.pressTimer = null
          }, 1000);
        } else {
          this.pressTimer = setTimeout(() => {
            const storage = localStorage.getItem('pagerConfig');
            if (storage) {
              console.log("DEBUG: Backlit OFF")
              const config = JSON.parse(storage);
              this.backlitOn = false
              this.pressTimer = null
              // Update the specific property within the pagerConfig object
              config.backlitState = this.backlitOn;
              // Save the updated object back to local storage
              localStorage.setItem('pagerConfig', JSON.stringify(config));
            }

          }, 1000);
        }
      } else if (id === 'read') {
        // Handle press for the "read" button
      } else if (id === 'up') {
        // Handle press for the "up" button
      } else if (id === 'down') {
        // Handle press for the "down" button
      } else if (id === 'left') {
        // Handle press for the "left" button
      } else if (id === 'right') {
        // Handle press for the "right" button
      }
    },
  },
  data() {
    return {
      message: "",
      funcPressed: false,
      backlitColor: "bg-green-500",
      backlitOn: false,
      pressTimer: null as NodeJS.Timeout | null,
      tabVisible: true
    };
  },

});
</script>


<template>
  <div class="flex flex-col items-center justify-center w-full p-8 my-4 mt-24 ">

    <div id="Pager" class="flex bg-[#12131a] w-[390px]  h-[285px] rounded-lg relative border border-gray-800">
      <!-- Cosmetics -->
      <div
        class="absolute w-9 rounded-tl-[150rem] rounded-tr-[250rem] bg-[#12131a] bg-gradient-to-l from-gray-700/30 from-1% to-60% rounded-lg rounded-bl-full h-[7.5rem] -bottom-4 -left-4">
      </div>
      <div
        class="absolute h-12 bg-gradient-to-bl from-gray-700/30 from-5% to-35% bg-[#12131a] rounded-lg  rounded-bl-full w-9 -bottom-4 -left-4">
      </div>
      <div
        class="bg-gradient-to-b from-gray-700/50 from-1% to-35% absolute w-[10.8rem] h-8 bg-[#12131a] -bottom-4 left-5 rounded-r-lg">
      </div>
      <img src="@/assets/advisorLogo.png"
        class="absolute w-40 bottom-6 bg-[#181922] p-2 shadow-inner border border-black rounded-lg left-7"
        alt="Motorola Logo" />
      <img class="absolute -mb-8 select-none" src="@/assets/frame.png" />
      <div
        class="absolute w-56 h-8  bg-[#0b0b0f] bg-gradient-to-b shadow-lg from-[#181922] rounded-bl-lg rounded-tl-3xl -left-3 -top-4 rounded-br-xl rounded-tr-md">
      </div>
      <div
        class="absolute w-[140px] h-4 bg-[#0d0e13] bg-gradient-to-b from-[#181922] right-10  -top-4 rounded-br-xl rounded-tr-md">
      </div>
      <div id="led-beeper"
        class="absolute flex flex-col w-1 bg-gray-800 border-t border-b border-r border-gray-700 h-14 rounded-t-md bottom-10 -right-1">
        <div id="actual-led" class="relative flex w-1 h-6 mt-2 bg-red-500 animate-ping-fast">
          <div id="led" class="absolute h-full min-w-full transform scale-[200%] bg-red-400 animate-ping-fast blur-sm ">
          </div>
        </div>
        <div class="flex w-1 h-1 mt-1 bg-gray-950"></div>
        <div class="flex w-1 h-1 mt-1 bg-gray-950"></div>
        <div class="flex w-1 h-1 mt-1 bg-gray-950"></div>
      </div>

      <!-- Motorola Advisor I POCSAG LED Screen -->
      <div id="screen"
      class="flex flex-col select-none relative justify-between w-full h-24 p-0.5 m-10 text-black border-2 shadow-inner-xl border-black rounded-lg font-screen z-0"
        :class="backlitOn ? backlitColor : 'bg-green-900/50 '">
        <div class="absolute z-10 flex w-full h-full rounded-lg "
          :class="backlitOn ? 'bg-blue-500/20 bg-gradient-to-tr from-blue-500/20 via-yellow/50 to-green-500 from-20% to-90%' : 'bg-yellow-500/5 bg-gradient-to-tr from-yellow-700/20 to-green-800/20'"></div>

        <Screen class="relative inset-0 z-50" style="" :text="message"></Screen>
     
      </div>

      <!-- Motorola Advisor I POCSAG Buttons -->
      <div id="controls" class="absolute flex w-full bottom-20">
        <div class="bottom-0 flex gap-2 mx-12 left-24">
          <button
            class="relative flex justify-center w-12 h-6 bg-[#13131a] bg-gradient-to-b to-50% from-[#2d2d3d]  border-b-2 border-l-2 border-black shadow-md rounded-bl-md rounded-tr-md active:bg-gray-900"
            id="read">
            <span class="absolute self-center inline-block w-6 h-1 bg-green-500 rounded-md"></span>
          </button>
          <button
            class="relative flex justify-center w-12 h-6 bg-[#13131a] bg-gradient-to-b to-50% from-[#2d2d3d] border-b-2 border-l-2 border-r-2 border-black shadow-md rounded-br-md rounded-tl-md active:bg-gray-900"
            id="func" @mousedown="handleMousePress('func')">
            <span class="absolute self-center inline-block w-6 h-1 bg-red-500 rounded-md"></span>
          </button>
        </div>
      </div>
      <div
        class="absolute flex flex-row h-16 gap-1 border border-black rounded-full shadow-lg bg-gray-950 right-5 bottom-8">
        <button id="left"
          class="h-full w-10 rounded-l-full bg-[#13131a] bg-gradient-to-b to-50% from-[#2d2d3d] active:bg-gray-900  [clip-path:circle(200%_at_-167%)] flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="fillCurrent" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="self-center w-5 h-5 text-yellow-200 rotate-180 fill-current">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        </button>
        <div id="up-down" class="flex flex-col w-20 gap-2">
          <button id="up"
            class="flex justify-center w-20 h-8 bg-[#13131a] bg-gradient-to-b to-50% from-[#2d2d3d] active:bg-gray-900 rounded-b-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="fillCurrent" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="self-end w-5 h-5 text-yellow-200 -rotate-90 fill-current">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </button>
          <button id="down" class="flex justify-center w-20 h-8 bg-[#13131a]  active:bg-gray-900 rounded-t-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="fillCurrent" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="self-start w-5 h-5 text-yellow-200 rotate-90 fill-current">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        </button>
      </div>
      <button id="right"
        class="h-full w-10 rounded-l-sm rounded-r-full active:bg-gray-900  bg-[#13131a] bg-gradient-to-b to-50% from-[#2d2d3d] [clip-path:circle(200%_at_267%)] flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="fillCurrent" viewBox="0 0 24 24" stroke-width="1.5"
          stroke="currentColor" class="self-center w-5 h-5 text-yellow-200 fill-current">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      </button>
    </div>
  </div>
</div></template>