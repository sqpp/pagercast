<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>

<template>
  <div id="app" class="flex flex-col w-full h-full mx-auto ">
    <Header></Header>
    <div class="flex w-full mx-auto md:mt-20">
      <RouterView />
    </div>
  </div>
</template>