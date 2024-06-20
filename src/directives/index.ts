import type { App } from 'vue';
import { setupPermissionDirective } from './permission';
import { setupAuthDirective } from './auth';

/**
 * 导出指令：v-xxx
 * @methods Permission 按钮权限，用法: v-permission
 * @methods auth 角色，用法: v-auth
 */
const allGlobDirectives = (app: App<Element>) => {
  setupPermissionDirective(app);
  setupAuthDirective(app);
};

export default allGlobDirectives;
