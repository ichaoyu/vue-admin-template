<template>
  <el-select
    v-model="innerValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :size="size"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :collapse-tags-tooltip="collapseTagsTooltip"
    :filterable="filterable"
    :loading="loading"
    :style="{ width }"
    v-bind="$attrs"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script setup>
import { useDictStore } from '@/store/dict'
import { isDictEmpty } from '@/utils/dict'

defineOptions({
  name: 'DictSelect',
})

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: '',
  },
  dictType: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: null,
  },
  placeholder: {
    type: String,
    default: '请选择',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'default',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  collapseTags: {
    type: Boolean,
    default: false,
  },
  collapseTagsTooltip: {
    type: Boolean,
    default: false,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '100%',
  },
  valueField: {
    type: String,
    default: 'value',
  },
  labelField: {
    type: String,
    default: 'label',
  },
  showDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const dictStore = useDictStore()

const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

const loading = computed(() => {
  if (!props.dictType || props.options) return false
  return dictStore.isDictLoading(props.dictType)
})

const options = computed(() => {
  let optionsList = []

  if (props.options) {
    optionsList = props.options.map((item) => ({
      label: item[props.labelField] || item.label,
      value: item[props.valueField] || item.value,
      disabled: item.disabled,
    }))

    // 静态选项需要过滤
    if (!props.showDisabled) {
      optionsList = optionsList.filter((item) => !item.disabled)
    }
  } else if (props.dictType) {
    // 字典选项已经在 store 中过滤过了
    optionsList = dictStore.getDictOptions(props.dictType, props.showDisabled)
  }

  return optionsList
})

const loadDict = async () => {
  if (!props.dictType || props.options) return

  // 检查字典数据是否已经存在且未过期
  const dictData = dictStore.getDictData(props.dictType)
  const lastUpdate = dictStore.lastUpdateTime[props.dictType]

  if (dictData.length > 0 && lastUpdate && Date.now() - lastUpdate < dictStore.cacheExpiry) {
    return
  }

  await dictStore.loadDict(props.dictType)
}

watch(
  () => props.dictType,
  () => {
    loadDict()
  }
)

onMounted(() => {
  loadDict()
})
</script>
