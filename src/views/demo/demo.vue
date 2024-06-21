<template>
  {{ meta.title }}-{{ name }} <icon-font name="fullscreen" />
  <IconFont name="fullscreen-exit" />
  <icon-font name="moon" color="#ffe794" />
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
const { name, meta } = useRoute();
</script>
