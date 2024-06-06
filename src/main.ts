import { createApp } from 'vue';
import 'vue/jsx';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// 引入全部组件
import allGloablComponent from '@/components';
import 'virtual:svg-icons-register';
// 引入路由
import router from './router';
// 引入pinia
import store from './store';

import '@/assets/styles/index.scss';

import '@/router/permission';

import App from './App.vue';

const app = createApp(App);
// 注册pinia
app.use(store);
app.use(ElementPlus, {
  // ElementPlus国际化
  locale: zhCn,
});

// 安装自定义组件
app.use(allGloablComponent);

// 注册路由
app.use(router);

app.mount('#app');
