import { resolve } from 'node:path';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { viteMockServe } from 'vite-plugin-mock';

const root = process.cwd();
const pathResolve = (pathname: string) => resolve(root, '.', pathname);

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, root);
  return {
    plugins: [
      vue(),
      VueJsx(),
      env.VITE_USE_MOCK === 'true'
        ? viteMockServe({
            ignore: /^_/,
            mockPath: 'mock',
          })
        : undefined,
    ],
    resolve: {
      alias: {
        '@/': pathResolve('src') + '/',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnable: true,
          additionalData: `@import "./src/assets/styles/var.scss";`,
        },
      },
    },
    build: {
      target: 'es2015',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true',
      // brotliSize: false,
      rollupOptions: {
        // 拆包
        output: {
          manualChunks: {
            'vue-chunks': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus'],
          },
        },
      },
      cssCodeSplit: !(env.VITE_USE_CSS_SPLIT === 'false'),
    },
    server: {
      open: true,
      port: 7002,
      // 代理配置
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'vue-types',
        'element-plus/es/locale/lang/zh-cn',
        'element-plus/es/locale/lang/en',
        'axios',
        'qs',
        'echarts',
        'vue-json-pretty',
        'dayjs',
      ],
    },
  };
});
