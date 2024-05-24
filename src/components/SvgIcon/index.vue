<template>
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color" />
  </svg>
</template>

<script setup>
import { ref } from 'vue';
defineProps({
  prefix: {
    type: String,
    default: '#icon-',
  },
  name: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#000',
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

<style lang="less" scoped></style>
