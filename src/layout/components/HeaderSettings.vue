<template>
  <el-space>
    <el-button size="small" circle @click="onFullScreen">
      <IconFont :name="isFull ? 'fullscreen-exit' : 'fullscreen'"
    /></el-button>

    <el-dropdown @command="handleSettingsCommand" trigger="click">
      <el-button size="small" icon="Setting" circle />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="watermark"
            >{{ hasWatermark ? '关闭' : '打开' }}水印</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <el-dropdown @command="handlePersonalCommand" trigger="click">
      <span class="avatar-box">
        <el-avatar :icon="UserFilled" size="small" class="icon" />
        admin
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="pcenter">个人中心</el-dropdown-item>
          <el-dropdown-item command="psettings">个人设置</el-dropdown-item>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserFilled } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/modules/user';
import { useWatermark } from '@/hooks/useWatermark';

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
const onLouOut = () => {
  userStore.setRoleIDs([]);
  userStore.setPermission([]);
  userStore.setToken('');
  userStore.setUserName('');
  router.push('/login');
};
// 个人中心操作
const router = useRouter();
const handlePersonalCommand = (command: string) => {
  switch (command) {
    case 'pcenter':
      router.push('/personal/center');
      break;
    case 'psettings':
      router.push('/personal/settings');
      break;
    case 'logout':
      onLouOut();
      break;
    default:
      break;
  }
};

// 设置操作
const { setWatermark, clear } = useWatermark();
const hasWatermark = ref(false);
const handleSettingsCommand = (command: string) => {
  switch (command) {
    case 'watermark':
      if (hasWatermark.value) {
        hasWatermark.value = false;
        clear();
        return;
      }
      hasWatermark.value = true;
      setWatermark('haha');
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
</style>
