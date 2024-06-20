<template>
  {{ meta.title }}-{{ name }} <icon-font name="icon-fullscreen" />
  <IconFont name="icon-fullscreen-exit" />
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
const { name, meta } = useRoute();
</script>
