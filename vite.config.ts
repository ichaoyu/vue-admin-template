import { resolve } from 'node:path';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { viteMockServe } from 'vite-plugin-mock';

const root = process.cwd();
const pathResolve = (pathname: string) => resolve(root, '.', pathname);

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, root);
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
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
    server: {
      open: true,
      port: 7002,
      // 代理配置
      proxy: {
        '/api': {
          target: 'http://localhost:7001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
