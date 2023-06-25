
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            formattedDate: '',
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

            const timeFormat = today.toLocaleString('en-US', options);
            const dateFormat = today.toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' });
            this.formattedDate = `${timeFormat} ${dateFormat}`;

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
    <div id="clock" class="">
        {{ formattedDate }}
    </div>
</template>
