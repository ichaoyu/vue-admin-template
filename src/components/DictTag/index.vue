<template>
  <el-tag v-if="showTag" :type="tagType" :size="size" :effect="effect" :class="customClass">
    {{ displayLabel }}
  </el-tag>
  <span v-else>{{ displayLabel }}</span>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useDictStore } from '@/store/dict'
import { isDictEmpty } from '@/utils/dict'

defineOptions({
  name: 'DictTag',
})

const props = defineProps({
  value: {
    type: [String, Number],
    default: undefined,
  },
  dictType: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['large', 'default', 'small'].includes(value),
  },
  effect: {
    type: String,
    default: 'light',
    validator: (value) => ['dark', 'light', 'plain'].includes(value),
  },
  showTag: {
    type: Boolean,
    default: true,
  },
  tagType: {
    type: String,
    default: undefined,
    validator: (value) => !value || ['primary', 'success', 'info', 'warning', 'danger'].includes(value),
  },
  customClass: {
    type: String,
    default: '',
  },
})

const dictStore = useDictStore()

const displayLabel = computed(() => {
  if (isDictEmpty(props.value)) return ''
  const label = dictStore.getDictLabel(props.dictType, props.value)
  // 如果找不到对应标签，返回原始值
  return label !== String(props.value) ? label : String(props.value)
})

const loadDict = async () => {
  if (!props.dictType) return
  await dictStore.loadDict(props.dictType)
}

onMounted(() => {
  loadDict()
})

watch(
  () => props.dictType,
  () => {
    loadDict()
  }
)
</script>

<style scoped>
.el-tag {
  margin: 0 2px;
}
</style>
