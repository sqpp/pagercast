<template>
    <component :is="componentName" :pagerId="pagerId"></component>
  </template>
    
  <script lang="ts">
  import Advisor1 from '@/components/devices/advisor1/Main.vue';
  
  export default {
    props: {
      pagerId: {
        type: String,
        required: true,
      },
    },
    computed: {
      componentName() {
        if (this.pagerId === 'PGADV1000X') {
          return Advisor1;
        } else {
          return ""
        }
      },
    },
  };
  </script>
  