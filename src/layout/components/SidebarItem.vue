<template>
  <el-sub-menu v-if="hasChildren" :index="item.path">
    <template #title>
      <AppIcon :name="item.meta.icon" v-if="item.meta?.icon" />
      <span>{{ item.meta?.title }}</span>
    </template>
    <sidebar-item v-for="child in visibleChildren" :key="child.key" :item="child" :base-path="item.path" />
  </el-sub-menu>
  <el-menu-item v-else :index="resolvePath(item.path, item.key)">
    <AppIcon :name="item.meta.icon" v-if="item.meta?.icon" />
    <template #title>{{ item.meta?.title }}</template>
  </el-menu-item>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
})

const visibleChildren = computed(() => {
  if (!props.item.children) return []
  return props.item.children.filter((child) => !child.meta?.hidden)
})

const hasChildren = computed(() => visibleChildren.value.length > 0)

const resolvePath = (path, key) => {
  if (path && path.startsWith('/')) {
    return path
  }

  if (props.basePath) {
    const base = props.basePath.endsWith('/') ? props.basePath.slice(0, -1) : props.basePath
    if (path) {
      return `${base}/${path}`
    }
    return base
  }

  return path || `/${key}`
}
</script>

<style scoped>
.el-menu-item.is-active {
  background-color: #1890ff !important;
}
</style>
