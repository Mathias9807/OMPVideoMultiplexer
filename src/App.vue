<script setup lang="ts">
  import VideoPlayer from './components/VideoPlayer.vue';
  import StreamSelector from './components/StreamSelector.vue';
  import Checkbox from './components/Checkbox.vue';

  import { ref, watch } from 'vue';
  import { useConfigStore } from './stores/config';
  const config = useConfigStore();

  const streamSources = ref([]);

  watch(() => config.background, (newBackground) => {
    document.body.className = newBackground;
  }, { immediate: true });

  function closeStream(streamSource: string) {
    streamSources.value = streamSources.value.filter(source => source !== streamSource);
  }

  const izuna = ref<boolean>(false);
  window.addEventListener('keypress', (ev) => {
    let nKeys: string = (window as any).lastNKeys || '';
    nKeys += ev.key;
    (window as any).lastNKeys = nKeys.substring(nKeys.length - 5);
    if ((window as any).lastNKeys.endsWith('izuna')) izuna.value = true;
  });
</script>

<template>
  <div class="top-controls">
    <Checkbox v-model="config.tcpTransport" label="TCP Transport" />
    <Checkbox v-model="config.autoplay" label="Auto Open New Streams" />
    <Checkbox v-model="config.openMuted" label="Open Muted" />
    <select v-model="config.background">
      <option value="babushka">Babushka</option>
      <option value="architect">Architect</option>
    </select>
  </div>

  <div class="content">
    <VideoPlayer
      v-for="streamSource in streamSources"
      :key="streamSource"
      :source="streamSource"
      :muted="config.openMuted"
      :transport="config.tcpTransport ? 'tcp' : ''"
      @close="() => closeStream(streamSource)" />

    <StreamSelector
      :autoOpenNewStreams="config.autoplay"
      v-model="streamSources" />

    <iframe v-if="izuna" src="https://izuna.ninja/" style="width: 500px; height: 500px" ></iframe>
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
    padding: 2px;
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
