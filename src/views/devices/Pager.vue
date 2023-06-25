<template>
  <div class="flex flex-col items-center justify-center w-full my-4 mt-24">

    <div class="flex bg-gray-900 w-[390px] h-64 rounded-lg relative border border-gray-700">
      <div id="led-beeper" class="absolute flex flex-col w-1 bg-gray-800 h-14 rounded-t-md bottom-10 -right-1">
  <div id="actual-led" class="relative flex w-1 h-6 mt-2 bg-red-500 animate-ping-fast">
    <div id="led" class="absolute h-full min-w-full transform scale-[200%] bg-red-400 animate-ping-fast blur-sm "></div>
    <audio id="beep-sound" src="beep.mp3"></audio>
  </div>
  <div class="flex w-1 h-1 mt-1 bg-gray-950"></div>
  <div class="flex w-1 h-1 mt-1 bg-gray-950"></div>
  <div class="flex w-1 h-1 mt-1 bg-gray-950"></div>
</div>


      <div id="screen"
        class="flex flex-col select-none justify-between w-full h-24 p-0.5 m-10 text-black border-2 border-black rounded-lg shadow-inner  font-mono-screen"
        :class="backlitColor">
        <Screen :text="message"></Screen>
      </div>

      <div id="controls" class="absolute flex w-full bottom-20">
        <div class="bottom-0 flex gap-2 mx-12 left-24">
          <button
            class="relative flex justify-center w-12 h-6 bg-gray-800 border border-black rounded-md shadow-md active:bg-gray-900"
            id="btn1">
            <span class="absolute self-center inline-block w-6 h-1 bg-green-500 rounded-md"></span>
          </button>
          <button
            class="relative flex justify-center w-12 h-6 bg-gray-800 border border-black rounded-md shadow-md active:bg-gray-900"
            id="btn2" @mousedown="handleBtn2Press().startPress" @mouseup="handleBtn2Press().cancelPress">
            <span class="absolute self-center inline-block w-6 h-1 bg-red-500 rounded-md"></span>
          </button>
        </div>
      </div>
      <div
        class="absolute flex flex-row h-16 gap-1 border border-black rounded-full shadow-lg bg-gray-950 right-5 bottom-10">
        <button id="left"
          class="h-full w-10 rounded-l-full bg-gray-800 active:bg-gray-900  [clip-path:circle(200%_at_-167%)] flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="fillCurrent" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="self-center w-5 h-5 text-yellow-200 rotate-180 fill-current">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        </button>
        <div id="up-down" class="flex flex-col w-20 gap-2">
          <button id="up" class="flex justify-center w-20 h-8 bg-gray-800 active:bg-gray-900 rounded-b-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="fillCurrent" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="self-end w-5 h-5 text-yellow-200 -rotate-90 fill-current">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </button>
          <button id="down" class="flex justify-center w-20 h-8 bg-gray-800 active:bg-gray-900 rounded-t-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="fillCurrent" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="self-start w-5 h-5 text-yellow-200 rotate-90 fill-current">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </button>
        </div>
        <button id="right"
          class="h-full w-10 rounded-l-sm rounded-r-full active:bg-gray-900  bg-gray-800 [clip-path:circle(200%_at_267%)] flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="fillCurrent" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="self-center w-5 h-5 text-yellow-200 fill-current">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Screen from '@/components/devices/Screen.vue';


export default defineComponent({
  components: {
    Screen
  },
  data() {
    return {
      message: "01: HELLO 2023 I AM A NEW MOTOROLA PAGER AVAILABLE ON THE WEB",
      funcPressed: false,
      backlitColor: "bg-green-900/50",
      pressTimer: ""
    };
  },
  methods: {
    playBeep() {
    let beepSound = document.getElementById("beep-sound");
    //beepSound.play()
    //flashLED();
    },
    handleBtn2Press() {
      const pressDuration = 1000; // 1 second

      const startPress = () => {
          this.pressTimer = setTimeout(() => {
          // Button pressed for 1 second
          this.funcPressed = true;
          this.backlitColor = "bg-green-500"; // Change the background color
        }, pressDuration);
      };

      const cancelPress = () => {
        clearTimeout(this.pressTimer);
        this.pressTimer = 0;
        if (this.funcPressed) {
          // Button was previously pressed for 1 second
          this.funcPressed = false;
          this.backlitColor = "bg-green-900/50"; // Reset the background color
        }
      };

      startPress(); // Invoke the startPress method immediately

      return { startPress, cancelPress };
    }
  },
  mounted() {
    const btn2 = document.getElementById("btn2");
    if (btn2) {
      btn2.addEventListener("mousedown", this.handleBtn2Press().startPress, { passive: true });
      btn2.addEventListener("mouseup", this.handleBtn2Press().cancelPress, { passive: true });
      btn2.addEventListener("touchstart", this.handleBtn2Press().startPress, { passive: true });
      btn2.addEventListener("touchend", this.handleBtn2Press().cancelPress, { passive: true });
    }
  },
  beforeUnmount() {
    const btn2 = document.getElementById("btn2");
    if (btn2) {
      btn2.removeEventListener("mousedown", this.handleBtn2Press().startPress);
      btn2.removeEventListener("mouseup", this.handleBtn2Press().cancelPress);
      btn2.removeEventListener("touchstart", this.handleBtn2Press().startPress);
      btn2.removeEventListener("touchend", this.handleBtn2Press().cancelPress);
    }
  }
});

</script>
