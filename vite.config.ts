import { resolve } from 'node:path';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { viteMockServe } from 'vite-plugin-mock';

const root = process.cwd();
const pathResolve = (pathname: string) => resolve(root, '.', pathname);
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, root);
  const isBuild = command === 'build';
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
  };
});
