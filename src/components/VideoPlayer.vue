<script setup lang="ts">
  import OvenPlayerVue3 from 'ovenplayer-vue3';
  import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';

  const props = defineProps<{
    source: string,
    muted: boolean,
  }>();

  const emit = defineEmits<{
    (e: 'close'): void
  }>();

  const ovenplayer = useTemplateRef('ovenplayer');
  const showOverlay = ref(false);
  const openMutedDefault = ref(props.muted);

  const playerConfig = computed(() => ({
    autoStart: true,
    mute: openMutedDefault.value,
    sources: [
      {
        type: 'webrpc',
        file: `wss://stream.kirr.nu/app/${props.source}`,
      },
    ],
  }));

  watch(() => props.source, (newSource) => {
    console.log('ovenplayer', ovenplayer.value);
    const inst = ovenplayer.value?.playerInstance;
    inst?.load(playerConfig.value.sources);
  });

  function errorHandler(event: any) {
    console.error('Player error', event);
  }
</script>

<template>
  <div class="container" @mouseover="showOverlay = true" @mouseleave="showOverlay = false">
    <OvenPlayerVue3
      ref="ovenplayer"
      :config="playerConfig"
      @error="errorHandler" />

    <div :class="['overlay', { 'overlay--visible': showOverlay }]">
      <div class="close-button" @click="$emit('close')">
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="mdi-close" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
      </div>
    </div>
    <span class="label">{{ props.source }}</span>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  min-width: 20vw;
  height: auto;

  margin-top: 2rem;
  margin-bottom: 2rem;

  border-radius: 8px;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  right: 0;
  width: 15rem;
  height: 10rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: end;

  background: radial-gradient(ellipse at bottom left, rgba(0,0,0,0) 71%, rgba(0,0,0,1) 100%);
  color: white;
  font-size: 1.2rem;
  display: none;
}

.overlay--visible {
  display: flex;
}

.label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5rem;
}

.close-button {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}
</style>