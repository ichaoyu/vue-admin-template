# ProDialog 弹窗组件

> 一个基于 Element Plus 的二次封装弹窗组件

## 功能特性

- ✅ v-model 双向绑定
- ✅ 自定义标题
- ✅ 自定义宽度
- ✅ 确认按钮加载状态
- ✅ 自定义底部
- ✅ 内容区域滚动条
- ✅ 固定高度配置

## 使用示例

### 基础用法

```vue
<template>
  <pro-dialog v-model="visible" title="新增用户" @confirm="handleConfirm">
    <el-form>
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
    </el-form>
  </pro-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'

const visible = ref(false)
const form = reactive({
  username: '',
})

const handleConfirm = async () => {
  // 提交逻辑
  visible.value = false
}
</script>
```

### 自定义底部

```vue
<pro-dialog v-model="visible" title="详情">
  <template #footer>
    <el-button @click="visible = false">关闭</el-button>
  </template>
  
  <div>内容区域</div>
</pro-dialog>
```

### 确认按钮加载状态

```vue
<pro-dialog 
  v-model="visible" 
  title="新增用户" 
  :confirm-loading="loading"
  @confirm="handleConfirm"
>
  <el-form>
    <el-form-item label="用户名">
      <el-input v-model="form.username" />
    </el-form-item>
  </el-form>
</pro-dialog>

<script setup>
import { ref, reactive } from 'vue'

const visible = ref(false)
const loading = ref(false)
const form = reactive({
  username: '',
})

const handleConfirm = async () => {
  loading.value = true
  try {
    // 提交逻辑
    await submitForm(form)
    visible.value = false
  } finally {
    loading.value = false
  }
}
</script>
```

### 懒加载弹窗

使用 `v-if` 实现弹窗懒加载，只有打开时才渲染：

```vue
<pro-dialog
  v-if="visible"
  v-model="visible"
  title="新增用户"
  @confirm="handleConfirm"
>
  <el-form>
    <!-- 表单内容 -->
  </el-form>
</pro-dialog>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue (v-model) | 是否显示 | Boolean | false |
| title | 标题 | String | '' |
| width | 宽度 | String/Number | '500px' |
| closeOnClickModal | 点击遮罩层是否关闭 | Boolean | false |
| showClose | 是否显示关闭按钮 | Boolean | true |
| confirmText | 确认按钮文字 | String | '确定' |
| cancelText | 取消按钮文字 | String | '取消' |
| confirmLoading | 确认按钮加载状态 | Boolean | false |
| destroyOnClose | 关闭时是否销毁 | Boolean | true |
| contentHeight | 内容区域高度 | String | '50vh' |

## Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 显示状态变化 | Boolean |
| confirm | 点击确认按钮 | - |
| cancel | 点击取消按钮 | - |

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 内容区域 |
| footer | 自定义底部 |

## Expose Methods

| 方法名 | 说明 |
|--------|------|
| open | 打开弹窗 |
| close | 关闭弹窗 |
