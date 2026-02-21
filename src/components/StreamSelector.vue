<script setup lang="ts">
  import { useIntervalFn } from '@vueuse/core';
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

  const POLL_DELAY = 5000;

  const props = defineProps<{
  }>();

  const modelValue = defineModel<string[]>({ required: true });

  const streams = ref<string[]>([]);

  const { resume } = useIntervalFn(() => {
    fetch('https://stream.kirr.nu/v1/vhosts/default/apps/app/streams', {
      headers: {
        Authorization: 'Basic ' + btoa('api:IIM9CFlQfdvRBfw'),
      },
      signal: AbortSignal.timeout(POLL_DELAY),
    }).then((res) => res.json())
    .then((data) => {
      streams.value = data.response as string[];
    });
  }, POLL_DELAY, { immediateCallback: true });

  const unselectedStreams = ref([] as string[]);

  watch([streams, modelValue], () => {
    if (streams.value.length === 0) {
      modelValue.value = [];
    }

    unselectedStreams.value = streams.value.filter((s) => !modelValue.value.includes(s));
  });

  onMounted(() => {
    resume();
  });
</script>

<template>
  <div v-if="unselectedStreams.length > 0" class="container">
    <span>Other streams:</span>
    <input v-for="stream in unselectedStreams" :key="stream" class="unselected-streams" type="button" :value="stream" @click="modelValue.push(stream)" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem;
  background: #2d253e;
  color: white;
  border-radius: 18px;

  padding: 1rem 2rem;
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
</style>