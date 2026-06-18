<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :destroy-on-close="destroyOnClose"
    :show-close="showClose"
    v-bind="$attrs"
  >
    <el-scrollbar :height="contentHeight">
      <div class="pro-dialog-content">
        <slot />
      </div>
    </el-scrollbar>

    <template #footer>
      <slot name="footer">
        <div class="pro-dialog-footer">
          <el-button @click="handleCancel">{{ cancelText }}</el-button>
          <el-button type="primary" :loading="confirmLoading" @click="handleConfirm">
            {{ confirmText }}
          </el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'ProDialog',
})

// #region Props 定义

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '500px',
  },
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  confirmText: {
    type: String,
    default: '确定',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  destroyOnClose: {
    type: Boolean,
    default: true,
  },
  contentHeight: {
    type: String,
    default: '50vh',
  },
})

// #endregion

// #region Emits 定义

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

// #endregion

// #region 数据定义

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const width = computed(() => {
  if (typeof props.width === 'number') {
    return `${props.width}px`
  }
  return props.width
})

// #endregion

// #region 事件处理

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  visible.value = false
  emit('cancel')
}

// #endregion

// #region 暴露方法

defineExpose({
  open: () => {
    visible.value = true
  },
  close: () => {
    visible.value = false
  },
})

// #endregion
</script>

<style scoped>
.pro-dialog-content {
  padding: 0 4px;
}

.pro-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
