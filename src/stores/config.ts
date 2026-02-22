import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    autoplay: false,
	openMuted: true,
	background: 'architect',
  }),
  persist: true,
})