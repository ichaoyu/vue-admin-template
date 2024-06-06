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
      breadcrumb: true,
      breadcrumbIcon: true,
      collapse: false,
      uniqueOpened: false,
      hamburger: true,
      screenfull: true,
      size: true,
      tagsView: true,
      tagsViewIcon: true,
      logo: true,
      fixedHeader: true,
      greyMode: false,
      dynamicRouter: true,
      serverDynamicRouter: true,
      pageLoading: false,
      layout: 'classic',
      title: import.meta.env.VITE_APP_TITLE,
      isDark: false,
      currentSize: 'default',
      sizeMap: ['default', 'large', 'small'],
      mobile: false,
      footer: true,
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
    getBreadcrumb(): boolean {
      return this.breadcrumb;
    },
    getBreadcrumbIcon(): boolean {
      return this.breadcrumbIcon;
    },
    getCollapse(): boolean {
      return this.collapse;
    },
    getUniqueOpened(): boolean {
      return this.uniqueOpened;
    },
    getHamburger(): boolean {
      return this.hamburger;
    },
    getScreenfull(): boolean {
      return this.screenfull;
    },
    getSize(): boolean {
      return this.size;
    },
    getTagsView(): boolean {
      return this.tagsView;
    },
    getTagsViewIcon(): boolean {
      return this.tagsViewIcon;
    },
    getLogo(): boolean {
      return this.logo;
    },
    getFixedHeader(): boolean {
      return this.fixedHeader;
    },
    getGreyMode(): boolean {
      return this.greyMode;
    },
    getDynamicRouter(): boolean {
      return this.dynamicRouter;
    },
    getServerDynamicRouter(): boolean {
      return this.serverDynamicRouter;
    },
    getFixedMenu(): boolean {
      return this.fixedMenu;
    },
    getPageLoading(): boolean {
      return this.pageLoading;
    },
    getLayout(): LayoutType {
      return this.layout;
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
    getMobile(): boolean {
      return this.mobile;
    },
    getTheme(): ThemeTypes {
      return this.theme;
    },
    getFooter(): boolean {
      return this.footer;
    },
  },
  actions: {
    setBreadcrumb(breadcrumb: boolean) {
      this.breadcrumb = breadcrumb;
    },
    setBreadcrumbIcon(breadcrumbIcon: boolean) {
      this.breadcrumbIcon = breadcrumbIcon;
    },
    setCollapse(collapse: boolean) {
      this.collapse = collapse;
    },
    setUniqueOpened(uniqueOpened: boolean) {
      this.uniqueOpened = uniqueOpened;
    },
    setHamburger(hamburger: boolean) {
      this.hamburger = hamburger;
    },
    setScreenfull(screenfull: boolean) {
      this.screenfull = screenfull;
    },
    setSize(size: boolean) {
      this.size = size;
    },
    setTagsView(tagsView: boolean) {
      this.tagsView = tagsView;
    },
    setTagsViewIcon(tagsViewIcon: boolean) {
      this.tagsViewIcon = tagsViewIcon;
    },
    setLogo(logo: boolean) {
      this.logo = logo;
    },
    setFixedHeader(fixedHeader: boolean) {
      this.fixedHeader = fixedHeader;
    },
    setGreyMode(greyMode: boolean) {
      this.greyMode = greyMode;
    },
    setDynamicRouter(dynamicRouter: boolean) {
      this.dynamicRouter = dynamicRouter;
    },
    setServerDynamicRouter(serverDynamicRouter: boolean) {
      this.serverDynamicRouter = serverDynamicRouter;
    },
    setFixedMenu(fixedMenu: boolean) {
      this.fixedMenu = fixedMenu;
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
    setMobile(mobile: boolean) {
      this.mobile = mobile;
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
    setFooter(footer: boolean) {
      this.footer = footer;
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
    setMenuTheme(color: string) {
      const primaryColor = getCssVar(
        '--el-color-primary',
        document.documentElement,
      );
      const isDarkColor = colorIsDark(color);
      const theme: Recordable = {
        // 左侧菜单边框颜色
        leftMenuBorderColor: isDarkColor ? 'inherit' : '#eee',
        // 左侧菜单背景颜色
        leftMenuBgColor: color,
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: isDarkColor ? lighten(color!, 6) : color,
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: isDarkColor
          ? 'var(--el-color-primary)'
          : hexToRGB(unref(primaryColor), 0.1),
        // 左侧菜单字体颜色
        leftMenuTextColor: isDarkColor ? '#bfcbd9' : '#333',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: isDarkColor
          ? '#fff'
          : 'var(--el-color-primary)',
        // logo字体颜色
        logoTitleTextColor: isDarkColor ? '#fff' : 'inherit',
        // logo边框颜色
        logoBorderColor: isDarkColor ? color : '#eee',
      };
      this.setTheme(theme);
      this.setCssVarTheme();
    },
    setHeaderTheme(color: string) {
      const isDarkColor = colorIsDark(color);
      const textColor = isDarkColor ? '#fff' : 'inherit';
      const textHoverColor = isDarkColor ? lighten(color!, 6) : '#f6f6f6';
      const topToolBorderColor = isDarkColor ? color : '#eee';
      setCssVar('--top-header-bg-color', color);
      setCssVar('--top-header-text-color', textColor);
      setCssVar('--top-header-hover-color', textHoverColor);
      this.setTheme({
        topHeaderBgColor: color,
        topHeaderTextColor: textColor,
        topHeaderHoverColor: textHoverColor,
        topToolBorderColor,
      });
      if (this.getLayout === 'top') {
        this.setMenuTheme(color);
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
});

export const useAppStoreOut = () => {
  return useAppStore(store);
};
