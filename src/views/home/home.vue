<template>
  <div class="index">Home{{ count }}</div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<style lang="less" scoped></style>
