<script setup lang="ts">
  import VideoPlayer from './components/VideoPlayer.vue';
  import StreamSelector from './components/StreamSelector.vue';

  import { ref } from 'vue';

  const streamSources = ref([]);
</script>

<template>
  <VideoPlayer v-for="streamSource in streamSources" :key="streamSource" :source="streamSource" />

  <StreamSelector v-model="streamSources" />
</template>

<style>
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  #app {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
</style>
