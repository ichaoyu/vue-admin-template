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
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped lang="scss">
.icon-menufold {
  margin-right: 20px;
  font-size: 20px;
  cursor: pointer;
}
</style>
