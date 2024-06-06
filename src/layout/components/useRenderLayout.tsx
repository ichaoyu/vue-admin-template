import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';

import Logo from '@/components/Logo';
import Menu from './Menu.vue';
import HeaderBreadcrumb from './HeaderBreadcrumb.vue';
import HeaderSettings from './HeaderSettings.vue';
import AppView from './AppView.vue';
import '../style.scss';

const appStore = useAppStore();
const permissionStore = usePermissionStore();
const menuList = computed(() => permissionStore.getRouters);
// // 菜单折叠
const collapse = computed(() => appStore.getCollapse);

export const useRenderLayout = () => {
  const renderClassic = () => {
    return (
      <el-container class="layout">
        <el-aside class={['layout-aside', collapse.value ? 'fold' : '']}>
          <Logo />
          <el-scrollbar>
            <Menu menuList={menuList} />
          </el-scrollbar>
        </el-aside>
        <el-container class="layout-container">
          <el-header class="layout-header">
            <div class="tabbar-left">
              {/* 顶部左侧图标 */}
              <HeaderBreadcrumb />
            </div>
            {/* 顶部右侧设置按钮 */}
            <div class="tabbar-right">
              <HeaderSettings />
            </div>
          </el-header>

          <el-main class="layout-main">
            <AppView />
          </el-main>
        </el-container>
      </el-container>
    );
  };

  return {
    renderClassic,
  };
};
