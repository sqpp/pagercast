
<template>
    <div class="">
        <!-- Desktop menu code -->
        <div class="fixed inset-x-0 top-0 z-50 hidden text-white md:flex md:flex-row">
            <div class="flex flex-row items-center justify-between w-full m-4 xl:mx-auto max-w-7xl">
                <div class="flex flex-row items-center gap-10">
                    <div id="logo-container" class="relative">
                        <div class="relative text-2xl font-bold">PagerCast
                            <span class="absolute flex items-center justify-center w-4 h-4 top-1 left-28">
                                <span
                                    class="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                                <span class="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
                            </span>
                        </div>
                    </div>
                    <nav id="menu" class="flex gap-4 text-xl">
                        <RouterLink to="/" class="border-green-500 hover:border-b">Home</RouterLink>
                        <RouterLink to="/register">Get Yours</RouterLink>
                        <RouterLink to="/database">Database</RouterLink>
                    </nav>
                </div>
                <div class="">
                    <RouterLink to="/login" class="inline-block px-4 py-2 bg-green-500">
                        My Account
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="md:hidden">
            <div v-if="navVisible" class="z-50 bg-gray-900 "></div>
            <dialog id="menu" :class="{ 'top-20 bg-green-900 h-full w-full	overscroll-none bg-opacity-75  backdrop-blur-lg absolute z-50 ': navVisible, 'hidden': !navVisible }"
                class="flex flex-col items-center py-4 space-y-4 text-xl text-white transition-opacity duration-300 ease-in-out"
                :style="{ opacity: navVisible ? '1' : '0' }">
                <div v-show="navVisible" class="self-center">
                    <nav id="menu" class="flex flex-col items-center gap-4 text-xl">
                        <RouterLink to="/" class="border-green-500 hover:border-b">Home</RouterLink>
                        <RouterLink to="/register">Get Yours</RouterLink>
                        <RouterLink to="/database">Database</RouterLink>
                        <RouterLink to="/login" class="inline-block px-4 py-2 bg-green-500">My Account</RouterLink>
                    </nav>
                 
                </div>
            </dialog>
            <div class="flex items-center justify-between m-4 text-xl">
                <a>PagerCast</a>
                <svg @click="toggleMenu" :class="{ 'rotate-180': navVisible }"
                    class="self-end w-12 h-12 p-2 text-white transition-transform duration-300 ease-in-out bg-green-800 rounded-md transform-gpu hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </div>
        </div>

    </div>
</template>
  

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  data() {
    return {
      navVisible: false
    };
  },
  methods: {
    toggleMenu() {
      this.navVisible = !this.navVisible;
    }
  },
});
</script>
