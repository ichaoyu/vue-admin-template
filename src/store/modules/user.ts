import { defineStore } from 'pinia';

const useUserStore = defineStore('User', {
  state: () => {
    return {
      token: '',
    };
  },
  actions: {},
  getters: {},
});

export default useUserStore;
