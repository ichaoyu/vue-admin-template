/**
 * 自定义指令之auth
 * @Example v-auth="['admin']"
 */
import type { App, Directive, DirectiveBinding } from 'vue';

import { useUserStore } from '@/store/modules/user';

const hasAuth = (value: string[]): boolean => {
  const { getRoles } = useUserStore();
  if (!getRoles || !value) return true;
  const hasInclude = value.some((item) => getRoles?.includes(item));
  return hasInclude;
};
function isAuth(el: Element, binding: DirectiveBinding) {
  const value = binding.value;

  const flag = hasAuth(value);
  if (!flag) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<string | string[]>) => {
  isAuth(el, binding);
};

const authDirective: Directive = {
  mounted,
};

export function setupAuthDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
