<template>
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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
const collapse = computed(() => appStore.getCollapse);

const route = useRoute();

const onChangeMenuFold = () => {
  appStore.setCollapse(!collapse.value);
};
</script>

<style scoped lang="scss">
.icon-menufold {
  margin-right: 20px;
  font-size: 20px;
  cursor: pointer;
}
</style>
