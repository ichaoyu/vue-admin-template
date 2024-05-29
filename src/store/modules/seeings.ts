import { defineStore } from 'pinia';

const useSettingsStore = defineStore('Settings', {
  state: () => {
    return {
      menuFold: false,
    };
  },
  actions: {},
  getters: {},
});

export default useSettingsStore;
