<template>
  <el-breadcrumb separator="/" class="breadcrumb">
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
const route = useRoute();
</script>

<style scoped lang="scss">
.breadcrumb {
  margin-left: 20px;
  font-size: 12px;
}
</style>
