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
        <h1>字典数据</h1>
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
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="ruleForm.dictLabel" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典键值" prop="dictValue">
          <el-input v-model="ruleForm.dictValue" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="ruleForm.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="排序" prop="dictSort">
          <el-input-number
            v-model="ruleForm.dictSort"
            :min="0"
            :max="999"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否默认" prop="isDefault">
          <el-input v-model="ruleForm.isDefault" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="ruleForm.status" />
        </el-form-item>
        <!-- dictSort status -->
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="ruleForm.remark"
            placeholder="请输入备注"
            maxlength="100"
            :autosize="{ minRows: 3 }"
            show-word-limit
            type="textarea"
          />
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
import { DictDataType } from '@/interface';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { addDictDataApi, updateDictDataApi } from '@/api/dict.api';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  record: {
    type: Object as PropType<DictDataType | null>,
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
    dictLabel: '',
    dictValue: '',
    dictSort: 0,
    dictType: '',
    status: '',
    remark: '',
  };
};

const ruleForm = ref<DictDataType>({
  dictLabel: '',
  dictValue: '',
  dictSort: 0,
  dictType: '',
  status: '',
  remark: '',
});

const rules = reactive<FormRules<DictDataType>>({
  // title: [
  //   { required: true, message: '请输入名称', trigger: 'blur' },
  //   { min: 2, max: 20, message: '名称长度应在2~20范围内', trigger: 'blur' },
  // ],
  // link: [
  //   { required: true, message: '请输入链接', trigger: 'blur' },
  //   { validator: checkLink, trigger: 'blur' },
  // ],
});

// 保存
const loading = ref<boolean>(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        const saveApi = props.record ? updateDictDataApi : addDictDataApi;
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
