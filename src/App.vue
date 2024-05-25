<script setup lang="ts">
import { onMounted } from 'vue';
import { loginApi } from '@/api/user';
import HelloWorld from './components/HelloWorld.vue';

onMounted(async () => {
  const loginData = await loginApi({
    username: 'admin',
    password: 'admin',
  });
  console.log(loginData);
});
</script>

<template>
  <div>
    <el-button>T</el-button>
    <svg-icon name="test" width="20px" height="20px" color="#fff" />
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
