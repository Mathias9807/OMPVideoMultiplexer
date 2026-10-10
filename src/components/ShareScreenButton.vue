<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { askShareScreen } from '../utils/webrtc';

  const props = defineProps<{
  }>();

  const emits = defineEmits<{
  }>();

  const mode = ref(1);

  // This component turns from a share button, to a text tag input, to a cancel button
  // The three modes switches between three divs

  function regStreamTag() {
  }
</script>

<template>
  <div class="container">
    <button @click="askShareScreen">Share</button>
    <!-- <div :class="['share-mode', mode==1 ? 'selected' : null]">
      <button @click="mode = 2">Share</button>
    </div>
    <div :class="['tag-mode', mode==2 ? 'selected' : null]">
      <input v-model="streamTag" @keydown.enter="regStreamTag" placeholder="Enter private stream tag" />
    </div>
    <div :class="['stop-mode', mode==3 ? 'selected' : null]">
    </div> -->
  </div>
</template>

<style type="scss" scoped>

  .container {
    overflow: hidden;
    padding: 2px;
    font-size: 12px;
    background: #ae9ad9;
    color: #000;
    border: none;
    border-radius: 5px;
  }

  .share-mode, .tag-mode, .stop-mode {
    width: 0;
    border-width: 0;
    overflow: hidden;
    transition: width 0.5s;
    background-color: red;
  }

  .container .share-mode {
    &.selected {
      width: 3rem;
    }
    padding: 2px;
    font-size: 12px;
    background: #ae9ad9;
    color: #000;
    border: none;
    border-radius: 5px;

    & button {
      width: 100%;
      text-align: center;
      background: transparent;
      border: none;
      appearance: none;
    }
  }

</style>
