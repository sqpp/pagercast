<template>
  <div id="app" class="flex justify-center w-full text-gray-100 ">
    <div id="registration" class="flex flex-col items-center justify-center w-full max-w-screen-md text-center md:w-auto md:max-w-7xl">
      <form action="" class="w-full">
        <div id="registration-form"
          class="flex flex-col px-4 py-8 bg-gray-900 rounded-md md:flex-row ">
          <Register />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Register from '@/components/auth/Register.vue';
export default {
  components: {
    Register
  },
};
</script>