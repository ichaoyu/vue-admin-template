import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/index.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import AppIcon from '@/components/Icon/index.vue'
import './permission'
import { useThemeStore } from '@/store/theme'
import { permission } from '@/directives/permission'

const app = createApp(App)

app.component('AppIcon', AppIcon)

app.directive('permission', permission)

app.use(router)
app.use(pinia)

const themeStore = useThemeStore()
themeStore.initTheme()

app.mount('#app')
