<script setup lang="ts">
  import VideoPlayer from './components/VideoPlayer.vue';
  import StreamSelector from './components/StreamSelector.vue';
  import Checkbox from './components/Checkbox.vue';

  import { ref, watch } from 'vue';

  const streamSources = ref([]);
  const autoOpenNewStreams = ref(false);
  const openMuted = ref(true);
  const background = ref('architect');

  watch(background, (newBackground) => {
    document.body.className = newBackground;
  }, { immediate: true });

  function closeStream(streamSource: string) {
    streamSources.value = streamSources.value.filter(source => source !== streamSource);
  }
</script>

<template>
  <div class="top-controls">
    <Checkbox v-model="autoOpenNewStreams" label="Auto Open New Streams" />
    <Checkbox v-model="openMuted" label="Open Muted" />
    <select v-model="background">
      <option value="babushka">Babushka</option>
      <option value="architect">Architect</option>
    </select>
  </div>

  <div class="content">
    <VideoPlayer
      v-for="streamSource in streamSources"
      :key="streamSource"
      :source="streamSource"
      :muted="openMuted"
      @close="() => closeStream(streamSource)" />

    <StreamSelector
      :autoOpenNewStreams="autoOpenNewStreams"
      v-model="streamSources" />
  </div>
</template>

<style>
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  #app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .top-controls {
    position: absolute;
    top: 0;
    right: 2rem;
    display: flex;
    justify-content: end;
    align-items: center;
    gap: 1rem;
    z-index: 10;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding-top: 4rem;
    height: 100vh;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    gap: 1rem;
  }
</style>
