<template>
  <el-icon class="icon-menufold">
    <component
      :is="SettingsStore.menuFold ? 'Fold' : 'Expand'"
      @click="onChangeMenuFold"
    />
  </el-icon>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in route.matched"
      :key="index"
      :to="item.path"
      v-show="item.meta.title"
    >
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import useSettingsStore from '@/store/modules/seeings';

const SettingsStore = useSettingsStore();
const route = useRoute();

const onChangeMenuFold = () => {
  SettingsStore.menuFold = !SettingsStore.menuFold;
};
</script>

<style scoped lang="scss">
.icon-menufold {
  margin-right: 20px;
  font-size: 20px;
  cursor: pointer;
}
</style>
