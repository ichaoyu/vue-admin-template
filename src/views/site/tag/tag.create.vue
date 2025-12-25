<template>
  <el-drawer
    size="460px"
    :model-value="props.visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    @close="onCancelVisible"
  >
    <template #header>
      <div class="title">
        <h1>标签</h1>
        <h2>{{ props.record ? '编辑' : '新建' }}</h2>
      </div>
    </template>
    <template #default>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        size="default"
        status-icon
      >
        <el-form-item label="名称" prop="title">
          <el-input v-model="ruleForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="ruleForm.path" placeholder="请输入路径" />
        </el-form-item>
        <div class="opr-btns">
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef)"
            v-loading="loading"
          >
            保存
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </div>
      </el-form>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { TagType } from '@/interface';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { addTagApi, updateTagApi } from '@/api/cms.tag.api';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  record: {
    type: Object as PropType<TagType | null>,
    default: () => null,
  },
});

// 监听显隐 设置编辑数据
watch(
  () => props.visible,
  (val) => {
    if (val && props.record) {
      ruleForm.value = props.record;
    }
  },
  { deep: true },
);

const emits = defineEmits(['update:visible', 'refreshTable']);
const ruleFormRef = ref<FormInstance>();
// 设置显隐
const updateVisible = (newValue: boolean) => {
  emits('update:visible', newValue);
};
const onCancelVisible = () => {
  updateVisible(false);
  ruleForm.value = {
    name: '',
    path: '',
  };
};

const ruleForm = ref<TagType>({
  name: '',
  path: '',
});
// 校验
const rules = reactive<FormRules<TagType>>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, max: 15, message: '名称长度应在1~15范围内', trigger: 'blur' },
  ],
});

// 保存
const loading = ref<boolean>(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        const saveApi = props.record ? updateTagApi : addTagApi;
        await saveApi(ruleForm.value);
        ElMessage.success('操作成功');
        onCancelVisible();
        emits('refreshTable');
      } finally {
        loading.value = false;
      }
    }
  });
};
// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style lang="scss" scoped>
.title {
  @include flex-layout();

  gap: 10px;

  h1 {
    color: var(--el-text-color-primary);
    font-size: 14px;
  }

  h2 {
    align-self: flex-end;
    font-size: 12px;
    font-weight: normal;
  }
}

.opr-btns {
  @include flex-layout($justify: flex-end);
}
</style>
