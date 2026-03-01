<script setup lang="ts">
  import OvenPlayerVue3 from 'ovenplayer-vue3';
  import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
  import failureImg from '@/assets/stream-broke.jpg';

  const props = defineProps<{
    source: string,
    muted: boolean,
  }>();

  const emit = defineEmits<{
    (e: 'close'): void
  }>();

  const ovenplayer = useTemplateRef('ovenplayer');
  const showOverlay = ref(false);
  const showFailureOverlay = ref(false);
  const openMutedDefault = ref(props.muted);

  const title = computed(() => {
    const parts = props.source.split(':');
    return parts.length == 2 ? parts[1] : props.source;
  });

  const playerConfig = computed(() => {
    const parts = props.source.split(':');
    const pre = parts.length == 2 ? parts[0] : 'app';
    return {
      autoStart: true,
      mute: openMutedDefault.value,
      sources: [
        {
          type: 'webrpc',
          file: `wss://stream.kirr.nu/${pre}/${parts[parts.length - 1]}?transport=tcp`,
        },
      ],
    };
  });

  watch(() => props.source, (newSource) => {
    console.log('ovenplayer', ovenplayer.value);
    const inst = ovenplayer.value?.playerInstance;
    inst?.load(playerConfig.value.sources);
  });

  function errorHandler(event: any) {
    console.error('Player error', event);
    showFailureOverlay.value = true;

    // Remove the stream after 5s
    setTimeout(() => {
      emit('close');
    }, 5000);
  }

  function stateChangedHandler(event: any) {
    console.log('Player state changed', event);
    if (event.newstate == 'playing') {
      showFailureOverlay.value = false;
    }
  }
</script>

<template>
  <div :class="['container', { 'closing': showFailureOverlay }]" @mouseover="showOverlay = true" @mouseleave="showOverlay = false">
    <OvenPlayerVue3
      class="player"
      ref="ovenplayer"
      :config="playerConfig"
      @error="errorHandler"
      @state-changed="stateChangedHandler" />

    <div class="failure-overlay" v-if="showFailureOverlay">
      <span>Stream disconnected</span>
      <div class="failure-img" :style="{ backgroundImage: `url(${failureImg})` }" alt="Stream disconnected" />
    </div>

    <div :class="['overlay', { 'overlay--visible': showOverlay }]">
      <div class="close-button" @click="$emit('close')">
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="mdi-close" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
      </div>
    </div>
    <span class="label">{{ title }}</span>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  width: 100%;
  min-width: 20vw;
  height: auto;

  margin-top: -0.5rem;
  margin-bottom: 2rem;

  border-radius: 8px;
  overflow: hidden;
}

.container.closing {
  animation: fadeOut 5s forwards;
}

.player {
  width: 100%;
  height: auto;
  margin: auto;
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
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
  z-index: 5;

  opacity: 0;
  transition: opacity 0.3s;
}

.overlay--visible {
  display: flex;
  opacity: 1;
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

.failure-overlay {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  padding: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  background: rgba(0, 0, 0, 0.7);
}

.failure-img {
  width: 100%;
  height: 100%;

  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.failure-overlay span {
  color: white;
  font-size: 2.5rem;
}

</style>