/**
 * 自定义指令之权限判断
 * 使用：v-permission="[*:*:*]"
 */
import type { App, Directive, DirectiveBinding } from 'vue';
import { useUserStore } from '@/store/modules/user';

const hasPermission = (value: string[]): boolean => {
  const { getPermission } = useUserStore();
  if (!getPermission || !value) return true;
  const hasInclude = value.some((item) => getPermission.includes(item));
  return hasInclude;
};
function hasPermi(el: Element, binding: DirectiveBinding) {
  const value = binding.value;

  const flag = hasPermission(value);
  if (!flag) {
    el.parentNode?.removeChild(el);
  }
}
const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  hasPermi(el, binding);
};

const permiDirective: Directive = {
  mounted,
};

export const setupPermissionDirective = (app: App<Element>) => {
  app.directive('permission', permiDirective);
};

export default permiDirective;
