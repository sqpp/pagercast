<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>

<template>
  <div id="app" class="w-full mx-auto">
    <div class="flex w-full ">
      <Header></Header>
    </div>
    <div class="flex justify-center w-full mx-auto">
      <RouterView />
    </div>
  </div>
</template>