<template>
  <svg class="icon" aria-hidden="true" :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color" />
  </svg>
</template>

<script setup>
import * as icon from './iconfont';
const props = defineProps({
  prefix: {
    type: String,
    default: '#',
  },
  name: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'var(--el-text-color-primary)',
  },
  width: {
    type: String,
    default: '50px',
  },
  height: {
    type: String,
    default: '50px',
  },
});
</script>

<style lang="scss" scoped>
.icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  fill: currentcolor;
  vertical-align: -0.15em;
}
</style>
