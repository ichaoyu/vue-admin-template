<template>
  <el-space size="default">
    <el-button size="small" circle @click="onFullScreen">
      <IconFont :name="isFull ? 'fullscreen-exit' : 'fullscreen'"
    /></el-button>

    <el-dropdown @command="handleSettingsCommand" trigger="click" size="small">
      <el-button size="small" icon="Setting" circle />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="watermark"
            >{{ watermark ? '关闭' : '打开' }}水印</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown @command="handlePersonalCommand" trigger="click" size="small">
      <span class="avatar-box">
        <el-avatar :icon="UserFilled" size="small" class="icon" />
        admin
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="pcenter">个人中心</el-dropdown-item>
          <el-divider />
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-space>
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/modules/user';
import { useAppStore } from '@/store/modules/app';
import { useWatermark } from '@/hooks/useWatermark';
import { loginOutApi } from '@/api/user.api';

// 全屏
const isFull = ref<boolean>(false);
const onFullScreen = () => {
  isFull.value = !isFull.value;
  const full = document.fullscreenElement;
  if (!full) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const userStore = useUserStore();
const appStore = useAppStore();

// 退出登录
const onLouOut = async () => {
  try {
    await loginOutApi();
    sessionStorage.clear();
    router.push('/login');
  } catch (err) {
    console.error(err);
  }
};
// 个人中心操作
const router = useRouter();
const handlePersonalCommand = (command: string) => {
  switch (command) {
    case 'pcenter':
      router.push('/personal/center');
      break;
    case 'logout':
      onLouOut();
      break;
    default:
      break;
  }
};

onMounted(() => {
  onToggleWatermark();
});
// 设置操作
// 水印
const { setWatermark, clear } = useWatermark();
const watermark = computed(() => appStore.getWatermark);
const onToggleWatermark = () => {
  if (!watermark.value) {
    appStore.setWatermark(false);
    clear();
    return;
  }
  const username = userStore.getUserinfo?.userName ?? 'vue-admin-template';
  appStore.setWatermark(true);
  setWatermark(username);
};
const handleSettingsCommand = (command: string) => {
  switch (command) {
    case 'watermark':
      appStore.setWatermark(!watermark.value);
      onToggleWatermark();
      break;
    default:
      break;
  }
};
</script>

<style scoped lang="scss">
.avatar-box {
  @include flex-layout();

  cursor: pointer;

  .icon {
    margin-right: 5px;
  }
}

.el-divider--horizontal {
  margin: 4px 0;
}

:deep(.el-dropdown-menu__item) {
  &.active {
    color: var(--el-color-primary);
  }
}
</style>
