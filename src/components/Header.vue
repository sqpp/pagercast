<template>
    <div class="">
        <!-- Desktop menu code -->
        <div class="fixed inset-x-0 top-0 z-50 hidden px-10 py-4 text-white bg-gray-950 md:block md:h-max md:flex-row">
            <div class="flex flex-row items-center justify-between w-full xl:mx-auto max-w-7xl">
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
                    <RouterLink to="/login" class="inline-block px-4 py-2 bg-green-500 rounded-md">
                        My Account
                    </RouterLink>
                </div>
            </div>
        </div>
        <div class="fixed top-0 left-0 z-50 flex flex-row w-full bg-gray-900 md:hidden" :class="{ 'bg-green-500': isRoot }">
            <div class="flex flex-row items-center justify-between w-full mx-4">
                <div id="logo-container" class="relative m-4">
                    <div class="relative text-2xl font-bold">PagerCast
                        <span class="absolute flex items-center justify-center w-4 h-4 top-1 left-28">
                            <span
                                class="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                            <span class="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
                        </span>
                    </div>
                </div>
                <svg @click="toggleMenu" :class="{ 'rotate-180 bg-green-800': navVisible, 'bg-green-500': isRoot }"
                    class="self-center w-12 h-12 p-1 m-4 text-white transition-transform duration-300 ease-in-out rounded-md cursor-pointer transform-gpu hover:rotate-180"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <div v-if="navVisible"
                    class="fixed right-0 z-50 w-64 h-full transition-opacity duration-500 ease-in-out translate-x-0 opacity-100 bg-green-700/75 top-20 overscroll-none rounded-bl-xl transform-gpu"
                    :class="{ 'opacity-0 translate-x-full': !navVisible }">
                    <nav id="menu" class="flex flex-col items-center py-4 space-y-4 text-xl">
                        <RouterLink to="/" class="border-green-500 hover:border-b">Home</RouterLink>
                        <RouterLink to="/register">Get Yours</RouterLink>
                        <RouterLink to="/database">Database</RouterLink>
                        <RouterLink to="/login" class="inline-block px-4 py-2 bg-green-500">My Account</RouterLink>
                    </nav>
                </div>

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
    computed: {
        isRoot() {
            return this.$route.path === '/';
        },
    },
});
</script>
