// vite.config.ts
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "file:///D:/_code/project/vue-admin-template/node_modules/.pnpm/vite@5.2.11_@types+node@20.12.12_sass@1.77.2/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/_code/project/vue-admin-template/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.2.11_@types+node@20.12.12_sass@1.77.2__vue@3.4.27_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import VueJsx from "file:///D:/_code/project/vue-admin-template/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.0.0_vite@5.2.11_@types+node@20.12.12_sass@1.77.2__vue@3.4.27_typescript@5.4.5_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { viteMockServe } from "file:///D:/_code/project/vue-admin-template/node_modules/.pnpm/vite-plugin-mock@3.0.2_esbuild@0.20.2_mockjs@1.1.0_vite@5.2.11_@types+node@20.12.12_sass@1.77.2_/node_modules/vite-plugin-mock/dist/index.mjs";
import AutoImport from "file:///D:/_code/project/vue-admin-template/node_modules/.pnpm/unplugin-auto-import@0.17.6_@vueuse+core@9.13.0_vue@3.4.27_typescript@5.4.5___rollup@4.18.0/node_modules/unplugin-auto-import/dist/vite.js";
import ElementPlus from "file:///D:/_code/project/vue-admin-template/node_modules/.pnpm/unplugin-element-plus@0.8.0_rollup@4.18.0/node_modules/unplugin-element-plus/dist/vite.mjs";
var root = process.cwd();
var pathResolve = (pathname) => resolve(root, ".", pathname);
var vite_config_default = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, root);
  return {
    plugins: [
      vue(),
      VueJsx(),
      env.VITE_USE_MOCK === "true" ? viteMockServe({
        ignore: /^_/,
        mockPath: "mock"
      }) : void 0,
      // 使用element主题scss变量
      ElementPlus({
        useSource: true
      }),
      // 自动引入vue等依赖
      AutoImport({
        dts: "types/auto-imports.d.ts",
        imports: ["vue", "vue-router"]
      })
    ],
    resolve: {
      alias: {
        "@/": pathResolve("src") + "/"
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnable: true,
          additionalData: `
          @use "@/assets/styles/element.scss" as *;
          @use "@/assets/styles/var.scss" as *;
        `
        }
      }
    },
    build: {
      target: "es2015",
      outDir: env.VITE_OUT_DIR || "dist",
      sourcemap: env.VITE_SOURCEMAP === "true",
      // brotliSize: false,
      rollupOptions: {
        // 拆包
        output: {
          manualChunks: {
            "vue-chunks": ["vue", "vue-router", "pinia"],
            "element-plus": ["element-plus"]
          }
        }
      },
      cssCodeSplit: !(env.VITE_USE_CSS_SPLIT === "false")
    },
    server: {
      open: true,
      port: 7002,
      // 代理配置
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true
          // rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "vue-types",
        "element-plus/es/locale/lang/zh-cn",
        "element-plus/es/locale/lang/en",
        "axios",
        "qs",
        "echarts",
        "vue-json-pretty",
        "dayjs"
      ]
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxfY29kZVxcXFxwcm9qZWN0XFxcXHZ1ZS1hZG1pbi10ZW1wbGF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcX2NvZGVcXFxccHJvamVjdFxcXFx2dWUtYWRtaW4tdGVtcGxhdGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L19jb2RlL3Byb2plY3QvdnVlLWFkbWluLXRlbXBsYXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ25vZGU6cGF0aCc7XG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IFZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJztcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xuaW1wb3J0IEVsZW1lbnRQbHVzIGZyb20gJ3VucGx1Z2luLWVsZW1lbnQtcGx1cy92aXRlJztcblxuY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKCk7XG5jb25zdCBwYXRoUmVzb2x2ZSA9IChwYXRobmFtZTogc3RyaW5nKSA9PiByZXNvbHZlKHJvb3QsICcuJywgcGF0aG5hbWUpO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCwgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcm9vdCk7XG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKCksXG4gICAgICBWdWVKc3goKSxcbiAgICAgIGVudi5WSVRFX1VTRV9NT0NLID09PSAndHJ1ZSdcbiAgICAgICAgPyB2aXRlTW9ja1NlcnZlKHtcbiAgICAgICAgICAgIGlnbm9yZTogL15fLyxcbiAgICAgICAgICAgIG1vY2tQYXRoOiAnbW9jaycsXG4gICAgICAgICAgfSlcbiAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAvLyBcdTRGN0ZcdTc1MjhlbGVtZW50XHU0RTNCXHU5ODk4c2Nzc1x1NTNEOFx1OTFDRlxuICAgICAgRWxlbWVudFBsdXMoe1xuICAgICAgICB1c2VTb3VyY2U6IHRydWUsXG4gICAgICB9KSxcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUYxNVx1NTE2NXZ1ZVx1N0I0OVx1NEY5RFx1OEQ1NlxuICAgICAgQXV0b0ltcG9ydCh7XG4gICAgICAgIGR0czogJ3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJyxcbiAgICAgICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlciddLFxuICAgICAgfSksXG4gICAgXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQC8nOiBwYXRoUmVzb2x2ZSgnc3JjJykgKyAnLycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlOiB0cnVlLFxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXG4gICAgICAgICAgQHVzZSBcIkAvYXNzZXRzL3N0eWxlcy9lbGVtZW50LnNjc3NcIiBhcyAqO1xuICAgICAgICAgIEB1c2UgXCJAL2Fzc2V0cy9zdHlsZXMvdmFyLnNjc3NcIiBhcyAqO1xuICAgICAgICBgLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICB0YXJnZXQ6ICdlczIwMTUnLFxuICAgICAgb3V0RGlyOiBlbnYuVklURV9PVVRfRElSIHx8ICdkaXN0JyxcbiAgICAgIHNvdXJjZW1hcDogZW52LlZJVEVfU09VUkNFTUFQID09PSAndHJ1ZScsXG4gICAgICAvLyBicm90bGlTaXplOiBmYWxzZSxcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgLy8gXHU2MkM2XHU1MzA1XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICAgJ3Z1ZS1jaHVua3MnOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJ10sXG4gICAgICAgICAgICAnZWxlbWVudC1wbHVzJzogWydlbGVtZW50LXBsdXMnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGNzc0NvZGVTcGxpdDogIShlbnYuVklURV9VU0VfQ1NTX1NQTElUID09PSAnZmFsc2UnKSxcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIHBvcnQ6IDcwMDIsXG4gICAgICAvLyBcdTRFRTNcdTc0MDZcdTkxNERcdTdGNkVcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIFtlbnYuVklURV9BUFBfQkFTRV9BUEldOiB7XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9TRVJWRSxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgLy8gcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgICd2dWUtcm91dGVyJyxcbiAgICAgICAgJ3Z1ZS10eXBlcycsXG4gICAgICAgICdlbGVtZW50LXBsdXMvZXMvbG9jYWxlL2xhbmcvemgtY24nLFxuICAgICAgICAnZWxlbWVudC1wbHVzL2VzL2xvY2FsZS9sYW5nL2VuJyxcbiAgICAgICAgJ2F4aW9zJyxcbiAgICAgICAgJ3FzJyxcbiAgICAgICAgJ2VjaGFydHMnLFxuICAgICAgICAndnVlLWpzb24tcHJldHR5JyxcbiAgICAgICAgJ2RheWpzJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtUyxTQUFTLGVBQWU7QUFFM1QsU0FBUyxjQUFjLGVBQWU7QUFDdEMsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGlCQUFpQjtBQUV4QixJQUFNLE9BQU8sUUFBUSxJQUFJO0FBQ3pCLElBQU0sY0FBYyxDQUFDLGFBQXFCLFFBQVEsTUFBTSxLQUFLLFFBQVE7QUFFckUsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxTQUFTLEtBQUssTUFBTTtBQUNqRCxRQUFNLE1BQU0sUUFBUSxNQUFNLElBQUk7QUFDOUIsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1AsSUFBSSxrQkFBa0IsU0FDbEIsY0FBYztBQUFBLFFBQ1osUUFBUTtBQUFBLFFBQ1IsVUFBVTtBQUFBLE1BQ1osQ0FBQyxJQUNEO0FBQUE7QUFBQSxNQUVKLFlBQVk7QUFBQSxRQUNWLFdBQVc7QUFBQSxNQUNiLENBQUM7QUFBQTtBQUFBLE1BRUQsV0FBVztBQUFBLFFBQ1QsS0FBSztBQUFBLFFBQ0wsU0FBUyxDQUFDLE9BQU8sWUFBWTtBQUFBLE1BQy9CLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxNQUFNLFlBQVksS0FBSyxJQUFJO0FBQUEsTUFDN0I7QUFBQSxJQUNGO0FBQUEsSUFDQSxLQUFLO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNuQixNQUFNO0FBQUEsVUFDSixrQkFBa0I7QUFBQSxVQUNsQixnQkFBZ0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUlsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixRQUFRLElBQUksZ0JBQWdCO0FBQUEsTUFDNUIsV0FBVyxJQUFJLG1CQUFtQjtBQUFBO0FBQUEsTUFFbEMsZUFBZTtBQUFBO0FBQUEsUUFFYixRQUFRO0FBQUEsVUFDTixjQUFjO0FBQUEsWUFDWixjQUFjLENBQUMsT0FBTyxjQUFjLE9BQU87QUFBQSxZQUMzQyxnQkFBZ0IsQ0FBQyxjQUFjO0FBQUEsVUFDakM7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsY0FBYyxFQUFFLElBQUksdUJBQXVCO0FBQUEsSUFDN0M7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQTtBQUFBLE1BRU4sT0FBTztBQUFBLFFBQ0wsQ0FBQyxJQUFJLGlCQUFpQixHQUFHO0FBQUEsVUFDdkIsUUFBUSxJQUFJO0FBQUEsVUFDWixjQUFjO0FBQUE7QUFBQSxRQUVoQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxjQUFjO0FBQUEsTUFDWixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
