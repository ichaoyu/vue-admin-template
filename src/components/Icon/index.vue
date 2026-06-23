<template>
  <el-icon :size="size" :color="color" :class="iconClass">
    <component v-if="isElementIcon" :is="iconComponent" />
    <i v-else :class="iconfontClass" :style="iconfontStyle"></i>
  </el-icon>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import './iconfont/iconfont.css'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  color: {
    type: String,
    default: '',
  },
})

// 使用全局注册的图标组件，避免全量 import
const app = getCurrentInstance()?.appContext.app

const isElementIcon = computed(() => {
  if (props.name.startsWith('el-')) return true
  // 检查全局组件注册表中是否存在该图标
  return !!app?.component(props.name)
})

const iconComponent = computed(() => {
  const iconName = props.name.startsWith('el-') ? props.name.substring(3) : props.name
  // 从全局注册表获取图标组件
  return app?.component(iconName) || null
})

const iconClass = computed(() => {
  return isElementIcon.value ? '' : 'iconfont-wrapper'
})

const iconfontClass = computed(() => {
  if (isElementIcon.value) return ''
  return `iconfont ${props.name}`
})

const iconfontStyle = computed(() => {
  if (isElementIcon.value) return {}
  const style = {}
  if (props.color) {
    style.color = props.color
  }
  return style
})
</script>

<style scoped>
.iconfont-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.iconfont {
  font-size: inherit;
}
</style>
