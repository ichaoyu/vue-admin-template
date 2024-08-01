<template>
  <page-container :title="meta.title" class="table-container">
    <Table
      class="common-table"
      v-loading="loading"
      selection
      :columns="columns"
      :data="data"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pagination="{ defaultPageSize: 50, total }"
      :action="operator"
      :actionConfig="{
        // width: 250,
      }"
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
                v-model="keywords"
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
      <template #selections><el-button>demo</el-button></template>
      <template #remark="{ scope }">
        {{ scope.row.remark }}
      </template>
    </Table>
  </page-container>
</template>

<script setup lang="ts">
import { getFlinkListApi, delFlinkApi } from '@/api/site.api';
import Table from '@/components/Table';

import Columns from './flink.columns';
import { flinkType } from '@/interface';
import { ElMessage } from 'element-plus';

const { meta } = useRoute();

const edit = (row: flinkType, index: number, data: flinkType[]) => {
  console.log('edit', row, index, data);
};
// #region 删除
const onDelete = async (row: flinkType) => {
  const ids = [row.id!];
  handleDelete(ids);
};
// 批量删除
const onBatchDelete = (data: flinkType[]) => {
  const ids = data.map((item) => item.id!);
  handleDelete(ids);
};
// 删除操作
const handleDelete = async (ids: string[] | number[]) => {
  try {
    await delFlinkApi({ ids });
    ElMessage.success('删除成功');
  } catch (err) {
    console.error(err);
  } finally {
    await fetchTableList();
  }
};
//#endregion 删除

// 新增
const onAddOne = () => {
  console.log(1);
};

const data = ref<flinkType[]>([]);
const columns = Columns;

onMounted(() => {
  fetchTableList();
});
// 搜索
const keywords = ref<string>('');
const onSearch = () => {
  currentPage.value = 1;
  pageSize.value = 20;
  fetchTableList();
};
// 重置
const onReset = () => {
  keywords.value = '';
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
  currentPage = page ?? currentPage.value;
  pageSize = size ?? pageSize.value;
  fetchTableList();
};

const fetchTableList = async () => {
  loading.value = true;
  try {
    const params: PageDTO = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keywords: keywords.value,
    };
    const res = await getFlinkListApi(params);
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
const onSelection = (data: flinkType[]) => {
  selectData.value = data;
};

const operator = [
  {
    text: '编辑',
    action: edit,
    // btnStyle: {
    //   plain: true,
    //   text: false,
    //   link: false,
    //   color: '#626aef',
    //   icon: 'Edit',
    // },
  },
  {
    text: '删除',
    action: onDelete,
    btnStyle: {
      type: 'danger',
      // text: false,
      // link: false,
      // icon: 'Delete',
    },
  },
];
</script>

<style lang="scss" scoped></style>
