<template>
  <div class="logo">
    <img src="@/assets/vue.svg" alt="logo" />
    <p>{{ config.title }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import config from '@/layout/settings';
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  width: 100%;
  height: $base-menu-logo-height;
  padding: 10px;
  color: #fff;

  img {
    width: 40px;
    height: 40px;
  }

  p {
    margin-left: 10px;
    font-size: $base-logo-title-fontsize;
  }
}
</style>
