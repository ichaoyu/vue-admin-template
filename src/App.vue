<script setup lang="ts">
import { onMounted } from 'vue';
import { loginApi } from '@/api/user';
import useUserStore from '@/store/modules/user';

onMounted(async () => {
  const loginData = await loginApi({
    username: 'admin',
    password: 'admin',
  });
  console.log(loginData);

  const userStore = useUserStore();
  console.log('token', userStore.token);
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
