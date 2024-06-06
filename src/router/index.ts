import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { constantRoute, asyncRouter } from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoute as RouteRecordRaw[],
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});
export default router;
export { asyncRouter, constantRoute };
