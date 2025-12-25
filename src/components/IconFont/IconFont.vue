<template>
  <!-- ElementPlus图标 -->
  <el-icon v-if="icon" :color="color" :size="size">
    <component :is="icon" />
  </el-icon>
  <!-- IconFont图标 -->
  <el-icon v-else :color="color" :size="size">
    <svg
      class="icon"
      aria-hidden="true"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <use :xlink:href="prefix + name" :fill="color" />
    </svg>
  </el-icon>
</template>

<script setup>
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  // element-plus图标名称
  icon: {
    type: String,
    default: '',
  },
  // iconfont图标名称
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
    type: [Number, String],
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
}
</style>
