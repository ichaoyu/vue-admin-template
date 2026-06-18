<template>
  <el-icon :size="size" :color="color" :class="iconClass">
    <component v-if="isElementIcon" :is="iconComponent" />
    <i v-else :class="iconfontClass" :style="iconfontStyle"></i>
  </el-icon>
</template>

<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
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

const isElementIcon = computed(() => {
  return props.name.startsWith('el-') || ElementPlusIconsVue[props.name]
})

const iconComponent = computed(() => {
  const iconName = props.name.startsWith('el-') ? props.name.substring(3) : props.name
  return ElementPlusIconsVue[iconName] || null
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
