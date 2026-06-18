<template>
  <el-button
    :type="type"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :icon="icon"
    :plain="plain"
    :round="round"
    :circle="circle"
    :link="link"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </el-button>
</template>

<script setup>
/**
 * ConfirmButton 确认按钮组件
 *
 * 封装 el-button，提供点击确认功能
 * 适用于删除、批量操作等需要二次确认的场景
 *
 * @example
 * ```vue
 * <ConfirmButton type="danger" text="删除" :on-confirm="handleDelete" />
 * ```
 */
import { ElMessageBox, ElMessage } from 'element-plus'

defineOptions({
  name: 'ConfirmButton',
})

// #region Props 定义

const props = defineProps({
  // 按钮文本
  text: {
    type: String,
    default: '',
  },
  // 确认提示消息
  message: {
    type: String,
    default: '确认执行此操作吗？',
  },
  // 确认弹窗标题
  title: {
    type: String,
    default: '提示',
  },
  // 确认按钮文本
  confirmButtonText: {
    type: String,
    default: '确定',
  },
  // 取消按钮文本
  cancelButtonText: {
    type: String,
    default: '取消',
  },
  // 弹窗类型
  messageType: {
    type: String,
    default: 'warning',
  },
  // 按钮类型
  type: {
    type: String,
    default: 'default',
  },
  // 按钮尺寸
  size: {
    type: String,
    default: 'default',
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 是否显示 loading
  loading: {
    type: Boolean,
    default: false,
  },
  // 图标
  icon: {
    type: [String, Object],
    default: null,
  },
  // 是否朴素按钮
  plain: {
    type: Boolean,
    default: false,
  },
  // 是否圆角按钮
  round: {
    type: Boolean,
    default: false,
  },
  // 是否圆形按钮
  circle: {
    type: Boolean,
    default: false,
  },
  // 是否链接按钮
  link: {
    type: Boolean,
    default: false,
  },
  // 确认回调函数
  onConfirm: {
    type: Function,
    default: null,
  },
  // 成功提示消息
  successMessage: {
    type: String,
    default: '',
  },
  // 是否显示成功消息
  showSuccessMessage: {
    type: Boolean,
    default: true,
  },
})

// #endregion

// #region Emits 定义

const emit = defineEmits(['confirm', 'cancel'])

// #endregion

// #region 事件处理

const loading = ref(false)

/**
 * 处理点击事件
 */
const handleClick = async () => {
  try {
    await ElMessageBox.confirm(props.message, props.title, {
      confirmButtonText: props.confirmButtonText,
      cancelButtonText: props.cancelButtonText,
      type: props.messageType,
    })

    // 触发确认事件
    emit('confirm')

    // 执行确认回调
    if (props.onConfirm) {
      loading.value = true
      try {
        await props.onConfirm()

        // 显示成功消息
        if (props.showSuccessMessage && props.successMessage) {
          ElMessage.success(props.successMessage)
        }
      } finally {
        loading.value = false
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error)
    }
    emit('cancel')
  }
}

// #endregion
</script>
