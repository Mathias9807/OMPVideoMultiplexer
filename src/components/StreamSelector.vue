<script setup lang="ts">
  import { useIntervalFn } from '@vueuse/core';
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import PrivateStreamInput from './PrivateStreamInput.vue';

  const POLL_DELAY = 5000;

  const props = defineProps<{
    autoOpenNewStreams: boolean,
  }>();

  const modelValue = defineModel<string[]>({ required: true });
  const streamsThatDied = defineModel<string[]>('streamsThatDied', { required: true });

  const prevStreams = ref<string[]>([]);
  const streams = ref<string[]>([]);

  const { resume } = useIntervalFn(() => {
    fetch(`https://${import.meta.env.VITE_OME_HOST}/streams`, {
      signal: AbortSignal.timeout(POLL_DELAY),
    }).then((res) => res.json())
    .then((data) => {
      streams.value = data.response as string[];
      streamsUpdated();
    });
  }, POLL_DELAY, { immediateCallback: true });

  const unselectedStreams = ref([] as string[]);

  function streamsUpdated() {

    // Add new streams if autoOpenNewStreams is enabled
    const newStreams = streams.value.filter((s) => !prevStreams.value.includes(s));
    if (props.autoOpenNewStreams) {
      modelValue.value.push(...newStreams);
    } else {
      // Re-open a stream that closed due to an error

      // Collect streams that aren't playing but are streaming and were closed by an error
      const resurrectStrms = streams.value.filter(s =>
        !modelValue.value.includes(s) && streamsThatDied.value.includes(s));

      modelValue.value.push(...resurrectStrms);
    }

    unselectedStreams.value = streams.value.filter((s) => !modelValue.value.includes(s));
    prevStreams.value = streams.value;
  }
  watch(modelValue.value, streamsUpdated);

  // When a stream dies, remove its tag from the selector and let it get re-added next sync
  watch(streamsThatDied.value, (died, wereDead) => {
    const newlyDead = died.filter(d => !wereDead.includes(d));
    streams.value = streams.value.filter(s => newlyDead.includes(s));
  });

  watch(modelValue, () => {
    unselectedStreams.value = streams.value.filter((s) => !modelValue.value.includes(s));
  });

  onMounted(() => {
    resume();
  });

  function addStream(stream: string) {
    if (!modelValue.value.includes(stream)) {
      modelValue.value.push(stream);
    }
  }

  watch(() => [streams.value, modelValue.value], () => {
    if (streams.value.length == 0 && modelValue.value.length == 0) {
      // Animate the "no streams" message
      requestAnimationFrame(animateNoStrems);
    }
  }, { immediate: true });
  function animateNoStrems(t: number) {
    const spans = document.querySelectorAll('#no-strems-msg span');
    spans.forEach((span, i) => {
      const y = Math.cos((t / 800) - i * 0.8) * 15 * (0.3 + i * 0.3);
      (span as HTMLElement).style.transform = `translateY(${y}px)`;
    });

    if (streams.value.length == 0 && modelValue.value.length == 0)
      requestAnimationFrame(animateNoStrems);
  }

  const showActiveStreams = computed(() => unselectedStreams.value.length > 0);
  const showNoStrems = computed(() =>
    streams.value.length == 0 && modelValue.value.length == 0
  );
</script>

<template>
  <div :class="{'container': true, 'no-strems': showNoStrems}">
    <div v-if="showActiveStreams" class="active-streams-container">
      <span>Active streams:</span>
      <input v-for="stream in unselectedStreams" :key="stream" class="unselected-streams" type="button" :value="stream" @click="addStream(stream)" />
    </div>

    <template v-if="showNoStrems">
      <div id="no-strems-msg" style="font-family: sans-serif"><span>( ~－ω－~)</span><span>ｚ</span><span>ｚ</span><span>ｚ</span><span>～</span></div>
      <div>no streams</div>
    </template>

    <div v-if="showActiveStreams || showNoStrems" class="divisor"></div>

    <PrivateStreamInput
      :ignore-streams="modelValue.map(s => s.replace('priv:', ''))"
      @add="addStream('priv:' + $event)" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  background: #2d253e;
  color: white;
  border-radius: 6px;

  padding: 0.5rem 1rem;
}

.container .unselected-streams {
  margin: 0.5rem;
  padding: 5px;
  font-size: 16px;
  background: #ae9ad9;
  color: #000;
  border: none;
  border-radius: 5px;
}

.container .divisor {
  width: 100%;
  height: 0;
  margin: 0 1rem 0.5rem 1rem;
  padding: 0;
  border: 0;
  border-bottom: 2px;
  border-style: solid;
  border-color: rgb(160, 125, 173);
}

.no-strems {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: #2d253e;
  color: rgb(160, 125, 173);
  border-radius: 18px;

  font-size: 2rem;
}

.no-strems div {
  margin: auto;
  padding: 0.5rem;
}

.no-strems #no-strems-msg span {
  display: inline-block;
}
</style>
