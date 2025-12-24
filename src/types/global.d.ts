// 全局类型声明
import { RawAxiosRequestHeaders } from 'axios';

// 扩展全局类型
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // 可以在这里添加全局组件属性
  }
}

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 环境变量类型声明
declare interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_SERVE: string;
  readonly VITE_APP_BASE_API: string;
  readonly VITE_SOURCEMAP: string;
  readonly VITE_OUT_DIR: string;
  readonly VITE_GLOB_APP_TITLE: string;
  readonly VITE_USE_CSS_SPLIT: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
