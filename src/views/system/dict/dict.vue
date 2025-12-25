<template>
  <page-container :title="meta.title" class="table-container">
    <Table
      class="common-table"
      v-loading="loading"
      selection
      :columns="TypeColumns"
      :data="data"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pagination="{ defaultPageSize: 50, total }"
      :action="operator"
      @page-change="onPageChange"
      @batch-delete="onBatchDelete"
      @selections-change="onSelection"
    >
      <template #toolbar>
        <div class="toolbar-box">
          <div class="search-box">
            <div class="search-form">
              <el-input
                placeholder="请输入名称或链接"
                clearable
                v-model="dictName"
                @clear="onReset"
              />
            </div>
            <div class="search-btn">
              <el-button type="primary" @click="onSearch">搜索</el-button>
              <el-button @click="onReset">重置</el-button>
            </div>
          </div>
          <div class="add-btn">
            <el-button type="primary" @click="onAddOne">新增</el-button>
          </div>
        </div>
      </template>
      <template #dictName="{ scope }">{{ scope.row.dictName }}</template>
      <template #status="{ scope }">
        <el-switch
          v-model="scope.row.status"
          active-value="0"
          inactive-value="1"
          :loading="statusLoading"
          @click="onChangeStatus(scope.row)"
        />
      </template>
    </Table>
  </page-container>
  <!-- 抽屉弹窗 -->
  <create-draw
    :visible="isShowDraw"
    :record="currentRecord"
    @update:visible="toggleShowDraw"
    @refresh-table="fetchTableList"
  />
</template>

<script setup lang="ts">
import {
  getDictTypeListApi,
  delDictTypeApi,
  updateDictTypeApi,
} from '@/api/system.dict.api';
import Table from '@/components/Table';
import createDraw from './dict.create.vue';

import { TypeColumns } from './dict.columns';
import { DictTypeType } from '@/interface';
import { ElMessage } from 'element-plus';

const { meta } = useRoute();

// 新增
const isShowDraw = ref<boolean>(false);
const toggleShowDraw = (v: boolean) => {
  isShowDraw.value = v;
};
const onAddOne = () => {
  currentRecord.value = null;
  toggleShowDraw(true);
};
// 编辑
const currentRecord = ref<DictTypeType | null>(null);
const edit = (row: DictTypeType) => {
  currentRecord.value = row;
  toggleShowDraw(true);
};
// 修改状态
const statusLoading = ref<boolean>(false);
const onChangeStatus = async (row: DictTypeType) => {
  try {
    statusLoading.value = true;
    await updateDictTypeApi(row);
  } finally {
    statusLoading.value = false;
    fetchTableList();
  }
};
// #region 删除
const onDelete = async (row: DictTypeType) => {
  const ids = [row.id!];
  handleDelete(ids);
};
// 批量删除
const onBatchDelete = (data: DictTypeType[]) => {
  const ids = data.map((item) => item.id!);
  handleDelete(ids);
};
// 删除操作
const handleDelete = async (ids: string[] | number[]) => {
  try {
    await delDictTypeApi({ ids });
    ElMessage.success('删除成功');
  } catch (err) {
    console.error(err);
  } finally {
    await fetchTableList();
  }
};
//#endregion 删除

const data = ref<DictTypeType[]>([]);

onMounted(() => {
  fetchTableList();
});
// 搜索
const dictName = ref<string>('');
const onSearch = () => {
  currentPage.value = 1;
  pageSize.value = 20;
  fetchTableList();
};
// 重置
const onReset = () => {
  dictName.value = '';
  currentPage.value = 1;
  pageSize.value = 20;
  fetchTableList();
};

const loading = ref<boolean>(false);
let total = ref<number>(0);
let currentPage = ref<number>(1);
let pageSize = ref<number>(20);
// 分页
const onPageChange = ({ page, size }) => {
  currentPage.value = page ?? currentPage.value;
  pageSize.value = size ?? pageSize.value;
  fetchTableList();
};

const fetchTableList = async () => {
  loading.value = true;
  try {
    const params: PageDTO = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      dictName: dictName.value,
    };
    const res = await getDictTypeListApi(params);
    data.value = res.list;
    total.value = res.total;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
// #region 多选
const selectData = ref<any[]>([]);
const onSelection = (data: DictTypeType[]) => {
  selectData.value = data;
};

const operator = [
  {
    text: '编辑',
    action: edit,
  },
  {
    text: '删除',
    action: onDelete,
    btnStyle: {
      type: 'danger',
    },
  },
];
</script>

<style lang="scss" scoped>
.toolbar-box {
  margin-bottom: 10px;
}
</style>
