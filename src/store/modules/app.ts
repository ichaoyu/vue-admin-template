import { unref } from 'vue';
import { defineStore } from 'pinia';
import { ElMessage, ComponentSize } from 'element-plus';

import { AppState } from '@/interface';
import {
  setCssVar,
  getCssVar,
  humpToUnderline,
  colorIsDark,
  hexToRGB,
  lighten,
  mix,
} from '@/utils';
import store from '../index';

// export const useAppStore = defineStore('App', {
export const useAppStore = defineStore('App', {
  state: (): AppState => {
    return {
      collapse: false,
      size: true,
      logo: true,
      dynamicRouter: true,
      serverDynamicRouter: true,
      pageLoading: false,
      layout: 'classic',
      title: import.meta.env.VITE_GLOB_APP_TITLE,
      isDark: false,
      currentSize: 'default',
      sizeMap: ['default', 'large', 'small'],
      theme: {
        elColorPrimary: '#409eff',
        leftMenuBorderColor: 'inherit',
        leftMenuBgColor: '#001529',
        leftMenuBgLightColor: '#0f2438',
        leftMenuBgActiveColor: 'var(--el-color-primary)',
        leftMenuCollapseBgActiveColor: 'var(--el-color-primary)',
        leftMenuTextColor: '#bfcbd9',
        leftMenuTextActiveColor: '#fff',
        logoTitleTextColor: '#fff',
        logoBorderColor: 'inherit',
        topHeaderBgColor: '#fff',
        topHeaderTextColor: 'inherit',
        topHeaderHoverColor: '#f6f6f6',
        topToolBorderColor: '#eee',
      },
      fixedMenu: true,
    };
  },
  getters: {
    getCollapse(): boolean {
      return this.collapse;
    },
    getLogo(): boolean {
      return this.logo;
    },
    getDynamicRouter(): boolean {
      return this.dynamicRouter;
    },
    getServerDynamicRouter(): boolean {
      return this.serverDynamicRouter;
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
    setSize(size: boolean) {
      this.size = size;
    },
    setLogo(logo: boolean) {
      this.logo = logo;
    },
    setDynamicRouter(dynamicRouter: boolean) {
      this.dynamicRouter = dynamicRouter;
    },
    setServerDynamicRouter(serverDynamicRouter: boolean) {
      this.serverDynamicRouter = serverDynamicRouter;
    },
    setPageLoading(pageLoading: boolean) {
      this.pageLoading = pageLoading;
    },
    setLayout(layout: LayoutType) {
      if (this.mobile && layout !== 'classic') {
        ElMessage.warning('移动端模式下不支持切换其它布局');
        return;
      }
      this.layout = layout;
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
      this.setPrimaryLight();
    },
    setCurrentSize(currentSize: ComponentSize) {
      this.currentSize = currentSize;
    },

    setTheme(theme: ThemeTypes) {
      this.theme = Object.assign(this.theme, theme);
    },
    /**
     * 将theme对象转换为css变量
     */
    setCssVarTheme() {
      for (const key in this.theme) {
        setCssVar(`--${humpToUnderline(key)}`, this.theme[key]);
      }
      this.setPrimaryLight();
    },
    setPrimaryLight() {
      if (this.theme.elColorPrimary) {
        const elColorPrimary = this.theme.elColorPrimary;
        const color = this.isDark ? '#000000' : '#ffffff';
        const lightList = [3, 5, 7, 8, 9];
        lightList.forEach((v) => {
          setCssVar(
            `--el-color-primary-light-${v}`,
            mix(color, elColorPrimary, v / 10),
          );
        });
        setCssVar(`--el-color-primary-dark-2`, mix(color, elColorPrimary, 0.2));
      }
    },
    initTheme() {
      console.log('initTheme: ');
      // const isDark = useDark({
      //   valueDark: 'dark',
      //   valueLight: 'light',
      // });
      // isDark.value = this.getIsDark;
    },
  },
  persist: true,
});

export const useAppStoreOut = () => {
  return useAppStore(store);
};
