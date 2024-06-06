<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
const currentSize = computed(() => appStore.getCurrentSize);

const greyMode = computed(() => appStore.getGreyMode);
appStore.initTheme();
</script>

<template>
  <ElConfigProvider :size="currentSize">
    <RouterView :class="greyMode ? `grey-mode` : ''" />
  </ElConfigProvider>
</template>

<style scoped></style>
