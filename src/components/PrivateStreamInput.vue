<script setup lang="ts">
  import { ref } from 'vue';

  import { useConfigStore } from '../stores/config';
  const config = useConfigStore();

  const emits = defineEmits<{
    (e: 'add', streamTag: string): void,
  }>();
  
  const streamTag = ref('');
  
  function addPrivateStream() {
    if (streamTag.value.trim() !== '') {
      config.privateStreams.push(streamTag.value.trim());
      config.privateStreams = config.privateStreams.filter((s, i, arr) => arr.indexOf(s) === i); // Remove duplicates
      emits('add', streamTag.value.trim());
      streamTag.value = '';
    }
  }

  function deletePrivateStream(stream: string) {
    config.privateStreams = config.privateStreams.filter(s => s !== stream);
  }
</script>

<template>
  <div class="private-stream-input">
    <input v-model="streamTag" @keydown.enter="addPrivateStream" placeholder="Enter private stream tag" />
    <button @click="addPrivateStream()">Open</button>
  </div>

  <div class="prev-private-streams">
    <div
      v-for="stream in config.privateStreams"
      :key="stream"
      class="unselected-streams"
      @click="$emit('add', stream)"
    >
      <span>{{ stream }}</span>
      <div class="close-btn" @click.stop="deletePrivateStream(stream)">
        <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" id="mdi-close" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .private-stream-input {
    margin-top: 10px;
    display: flex;
    gap: 0px;
  }

  .private-stream-input input {
    padding: 5px;
    font-size: 14px;

    color: rgb(160, 125, 173);
    background: transparent;
    appearance: none;
    border-color: rgb(160, 125, 173);
    border-style: solid;
    border-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-width: 0;
  }

  .private-stream-input button {
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
    background: rgb(160, 125, 173);
    color: #2d253e;
    appearance: none;

    border-radius: 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    border-left-width: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-weight: bold;
  }

  .prev-private-streams {
    max-width: 20rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
    gap: 5px;
  }

  .unselected-streams {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 3px 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    background: rgb(160, 125, 173);
    color: #2d253e;
    appearance: none;

    border-radius: 10px;
  }

  .close-btn {
    width: 22px;
    height: 22px;
    margin-right: -3px;
  }
</style>