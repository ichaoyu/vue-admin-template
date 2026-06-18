<template>
  <el-switch
    v-model="innerValue"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-color="activeColor"
    :inactive-color="inactiveColor"
    :disabled="disabled"
    :loading="loading"
    :size="size"
    @change="handleChange"
  />
</template>

<script setup>
/**
 * StatusSwitch 状态开关组件
 *
 * 封装 el-switch，提供状态切换的通用功能
 * 支持自定义状态值、颜色、文本等
 * 内置状态切换的 API 调用和错误处理
 *
 * @example
 * ```vue
 * <StatusSwitch v-model="row.status" :id="row.id" :api="updateUserAPI" />
 * ```
 */
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'StatusSwitch',
})

// #region Props 定义

const props = defineProps({
  // v-model 绑定值
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  // 数据 ID，用于 API 调用
  id: {
    type: [String, Number],
    default: '',
  },
  // 更新状态的 API 函数
  api: {
    type: Function,
    default: null,
  },
  // API 参数，会与 id 和 status 合并
  apiParams: {
    type: Object,
    default: () => ({}),
  },
  // 激活状态值
  activeValue: {
    type: [String, Number, Boolean],
    default: 1,
  },
  // 非激活状态值
  inactiveValue: {
    type: [String, Number, Boolean],
    default: 0,
  },
  // 激活状态文本
  activeText: {
    type: String,
    default: '',
  },
  // 非激活状态文本
  inactiveText: {
    type: String,
    default: '',
  },
  // 激活状态颜色
  activeColor: {
    type: String,
    default: '#13ce66',
  },
  // 非激活状态颜色
  inactiveColor: {
    type: String,
    default: '#ff4949',
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 尺寸
  size: {
    type: String,
    default: 'default',
  },
  // 成功提示消息
  successMessage: {
    type: String,
    default: '状态更新成功',
  },
  // 是否显示成功消息
  showSuccessMessage: {
    type: Boolean,
    default: true,
  },
})

// #endregion

// #region Emits 定义

const emit = defineEmits(['update:modelValue', 'change', 'success', 'error'])

// #endregion

// #region 数据定义

const loading = ref(false)
const innerValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// #endregion

// #region 事件处理

/**
 * 处理状态切换
 * @param {string|number|boolean} val - 新值
 */
const handleChange = async (val) => {
  // 没有 ID 或没有 API 时，直接触发 change 事件
  if (!props.id || !props.api) {
    emit('change', val)
    return
  }

  loading.value = true

  try {
    // 调用 API 更新状态
    await props.api({
      id: props.id,
      ...props.apiParams,
      status: val,
    })

    // 显示成功消息
    if (props.showSuccessMessage) {
      ElMessage.success(props.successMessage)
    }

    // 触发成功事件
    emit('success', val)
    emit('change', val)
  } catch (error) {
    // 失败时恢复原值
    innerValue.value = val === props.activeValue ? props.inactiveValue : props.activeValue

    console.error('状态更新失败:', error)
    emit('error', error)
  } finally {
    loading.value = false
  }
}

// #endregion
</script>
