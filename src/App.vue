<script setup lang="ts">
import { onMounted } from 'vue';
import { loginApi } from '@/api/user';

onMounted(async () => {
  const loginData = await loginApi({
    username: 'admin',
    password: 'admin',
  });
  console.log(loginData);
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
