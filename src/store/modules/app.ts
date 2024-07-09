import { defineStore } from 'pinia';
import { ComponentSize } from 'element-plus';
import { AppState } from '@/interface';
import store from '../index';

export const useAppStore = defineStore('App', {
  state: (): AppState => {
    return {
      collapse: false,
      size: true,
      logo: true,
      pageLoading: false,
      title: import.meta.env.VITE_GLOB_APP_TITLE,
      isDark: false,
      currentSize: 'small',
      sizeMap: ['default', 'large', 'small'],
      watermark: false,
    };
  },
  getters: {
    getCollapse(): boolean {
      return this.collapse;
    },
    getWatermark(): boolean {
      return this.watermark;
    },
    getSize(): boolean {
      return this.size;
    },
    getLogo(): boolean {
      return this.logo;
    },
    getPageLoading(): boolean {
      return this.pageLoading;
    },
    getTitle(): string {
      return this.title;
    },
    getIsDark(): boolean {
      return this.isDark;
    },
    getCurrentSize(): ComponentSize {
      return this.currentSize;
    },
    getSizeMap(): ComponentSize[] {
      return this.sizeMap;
    },
  },
  actions: {
    setCollapse(collapse: boolean) {
      this.collapse = collapse;
    },
    setWatermark(state: boolean) {
      this.watermark = state;
    },
    setSize(size: boolean) {
      this.size = size;
    },
    setLogo(logo: boolean) {
      this.logo = logo;
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading;
    },
    setTitle(title: string) {
      this.title = title;
    },
    setIsDark(isDark: boolean) {
      this.isDark = isDark;
      if (this.isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    },
    setCurrentSize(currentSize: ComponentSize) {
      this.currentSize = currentSize;
    },
    initTheme() {
      this.setIsDark(this.getIsDark);
    },
  },
  persist: {
    key: 'appSettings',
    storage: sessionStorage,
  },
});

export const useAppStoreOut = () => {
  return useAppStore(store);
};
