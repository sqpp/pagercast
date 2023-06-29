<template>
  <div id="app" class="flex w-full mt-32 text-gray-100 md:max-w-4xl lg:max-w-5xl xl:max-w-5xl ">
    <div id="registration" class="flex flex-col w-full ">
      <form action="" class="">
        <div id="registration-form"
          class="flex flex-col px-4 py-4 bg-gray-900 rounded-md md:flex-row ">
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