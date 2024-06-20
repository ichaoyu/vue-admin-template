import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { constantRoute, asyncRouter } from './routes';

export const routes = [...constantRoute, ...asyncRouter];

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

export default router;
