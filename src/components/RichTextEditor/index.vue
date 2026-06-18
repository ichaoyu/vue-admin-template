<template>
  <div class="rich-text-editor" :class="{ 'is-disabled': disabled }">
    <Toolbar class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      class="editor"
      :style="{ height: height + 'px' }"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'RichTextEditor',
})

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: 300,
  },
  placeholder: {
    type: String,
    default: '请输入内容...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'default',
  },
})

const emit = defineEmits(['update:modelValue'])

const editorRef = shallowRef(null)
const valueHtml = ref('')

const toolbarConfig = {
  excludeKeys: [],
}

const editorConfig = computed(() => ({
  placeholder: props.placeholder,
  readOnly: props.disabled,
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 2 * 1024 * 1024,
      allowedFileTypes: ['image/*'],
      customUpload: handleImageUpload,
      onError: (file) => {
        if (file.size > 2 * 1024 * 1024) {
          ElMessage.error('图片大小不能超过 2MB')
        } else {
          ElMessage.error('图片上传失败')
        }
      },
    },
  },
}))

watch(
  () => props.modelValue,
  (val) => {
    if (val !== valueHtml.value) {
      valueHtml.value = val || ''
    }
  },
  { immediate: true }
)

const handleCreated = (editor) => {
  editorRef.value = editor
}

const handleChange = (editor) => {
  emit('update:modelValue', editor.getHtml())
}

const handleImageUpload = async (file, insertFn) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    insertFn(e.target.result, file.name, e.target.result)
  }
  reader.readAsDataURL(file)
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor) {
    editor.destroy()
  }
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.rich-text-editor.is-disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

.toolbar {
  border-bottom: 1px solid #ccc;
}

.editor {
  overflow-y: auto;
}
</style>
