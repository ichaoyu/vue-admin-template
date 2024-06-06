<template>
  <div class="logo">
    <img src="@/assets/vue.svg" alt="logo" />
    <p v-if="!props.collapse">vue admin</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  collapse: {
    type: Boolean,
    defaulat: false,
  },
});
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  box-sizing: border-box;
  align-items: center;
  width: 100%;
  height: $base-menu-logo-height;
  padding: 10px;
  color: #000;

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
