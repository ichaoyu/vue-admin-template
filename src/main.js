import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/index.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import pinia from './store'
import AppIcon from '@/components/Icon/index.vue'
import './permission'
import { useThemeStore } from '@/store/theme'
import { permission } from '@/directives/permission'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('AppIcon', AppIcon)

app.directive('permission', permission)

app.use(router)
app.use(pinia)

const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')
