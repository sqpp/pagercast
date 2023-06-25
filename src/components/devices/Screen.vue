<template>
    <div id="screen" class="">
      <div id="text" class="mx-1">
        <div v-for="(line, index) in textLines" :key="index" class="flex self-end w-full text-2xl leading-5 truncate line-break">
          {{ line }}
        </div>
      </div>
      <div class="flex self-end justify-center w-full text-2xl leading-6 text-center">
        <!-- Line 4 (date) -->
        <Time></Time>
      </div>
    </div>
  </template>
    
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import Time from './Time.vue';
  
  export default defineComponent({
    components: {
      Time,
    },
    props: {
      text: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const containerWidth = ref(0);
      const textLines = ref([]);
  
      const getTextLines = () => {
  const MAX_CHARACTERS_PER_LINE = 22; // Adjust this value as needed
  const MAX_LINES = 3;
  const lines = [];
  let remainingText = props.text;

  for (let i = 0; i < MAX_LINES; i++) {
    if (remainingText.length <= MAX_CHARACTERS_PER_LINE) {
      lines.push(remainingText);
      break;
    } else {
      let line = remainingText.slice(0, MAX_CHARACTERS_PER_LINE);
      const lastSpaceIndex = line.lastIndexOf(' ');

      if (lastSpaceIndex !== -1) {
        line = line.slice(0, lastSpaceIndex);
      }

      lines.push(line);
      remainingText = remainingText.slice(line.length).trim();
    }
  }

  return lines;
};


  
      const getTextWidth = (text: string) => {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'pre';
        span.style.fontFamily = 'monospace';
        span.style.fontSize = '16px';
        span.textContent = text;
        document.body.appendChild(span);
        const width = span.offsetWidth;
        document.body.removeChild(span);
        return width;
      };
  
      onMounted(() => {
        const containerElement = document.getElementById('screen');
        if (containerElement) {
          containerWidth.value = containerElement.offsetWidth;
          textLines.value = getTextLines();
        }
      });
  
      return {
        textLines,
      };
    },
  });
  </script>
  