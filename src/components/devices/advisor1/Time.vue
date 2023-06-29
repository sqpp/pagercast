
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      timeFormat: '',
      dateFormat: '',
    };
  },
  mounted() {
    this.updateFormattedDate();
  },
  methods: {
    updateFormattedDate() {
      const today = new Date();
      const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };

      this.timeFormat = today.toLocaleString('en-US', options as Intl.DateTimeFormatOptions);
      this.dateFormat = today.toLocaleString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      } as Intl.DateTimeFormatOptions);


      // Update the formatted date every second (optional)
      setInterval(() => {
        this.updateFormattedDate();
      }, 1000);
    },
  },
});
</script>
  
<style lang="ts">
/* Add any necessary styles here */
</style>
<template>
  <div id="clock" class="flex gap-8">
    <div>{{ timeFormat }}</div>
    <div>{{ dateFormat }}</div>
  </div>
</template>
  
