<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
const currentSize = computed(() => appStore.getCurrentSize);

appStore.initTheme();
</script>

<template>
  <ElConfigProvider :size="currentSize">
    <RouterView />
  </ElConfigProvider>
</template>

<style scoped></style>
