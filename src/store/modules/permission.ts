import { defineStore } from 'pinia';
import store from '../index';

export interface PermissionState {
  roles: string[];
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    roles: [],
  }),
  getters: {
    getRoles(): string[] {
      return this.roles;
    },
  },
  actions: {
    setRoles(roles: string[]): void {
      this.roles = roles;
    },
  },
  persist: {
    key: 'permission',
    storage: sessionStorage,
  },
});

export const usePermissionStoreOut = () => {
  return usePermissionStore(store);
};
