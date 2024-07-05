<template>
  <!-- ElementPlus图标 -->
  <el-icon v-if="icon" :style="{ width, height, fontSize }"
    ><component :is="icon"
  /></el-icon>
  <!-- IconFont图标 -->
  <svg
    v-else
    class="icon"
    aria-hidden="true"
    :style="{ width, height, fontSize }"
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
  fontSize: {
    type: String,
    default: '12px',
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
