<template>
  <!-- ElementPlus图标 -->
  <el-icon v-if="icon" :color="color" :size="size">
    <component :is="icon" :style="{ width, height }" />
  </el-icon>
  <!-- IconFont图标 -->
  <svg
    v-else
    class="icon"
    aria-hidden="true"
    :style="{ width, height, 'font-size': size + 'px' }"
  >
    <use :xlink:href="prefix + name" :fill="color" />
  </svg>
</template>

<script setup>
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  // element-plus图表名称
  icon: {
    type: String,
    default: '',
  },
  // iconfont图表名称
  name: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 12,
  },
});
</script>

<style lang="scss" scoped>
.icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  outline: none;
  fill: currentcolor;
  vertical-align: -0.15em;
}
</style>
