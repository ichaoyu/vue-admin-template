<template>
  <div class="logo">
    <img src="@/assets/vue.svg" alt="logo" />
    <p v-if="!props.collapse">{{ props.title }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  collapse: {
    type: Boolean,
    defaulat: false,
  },
  title: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  height: var(--base-menu-logo-height);
  color: var(--el-text-color-primary);

  img {
    width: 40px;
    height: 40px;
  }

  p {
    margin-left: 10px;
    font-size: var(--base-logo-title-fontsize);
  }
}
</style>
