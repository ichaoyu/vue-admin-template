<!-- eslint-disable vue/no-deprecated-slot-scope-attribute -->
<template>
  <page-container :title="meta.title" class="table-container">
    <Table
      class="common-table"
      v-loading="loading"
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
    >
      <template #toolbar>
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
      </template>
      <template #remark="{ scope }">
        {{ scope.row.remark }}
      </template>
    </Table>
  </page-container>
</template>

<script setup lang="ts">
import { getFlinkListApi } from '@/api/site.api';
import Table from '@/components/Table';

import Columns from './flink.columns';
import { flinkType } from '@/interface';

const { meta } = useRoute();

const edit = (row, index: number, data) => {
  console.log('edit', row, index, data);
};
const nullify = (row, index: number, data) => {
  console.log('nullify', row, index, data);
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
    action: nullify,
    btnStyle: {
      type: 'danger',
      // text: false,
      // link: false,
      // icon: 'Delete',
    },
  },
];
</script>

<style lang="scss" scoped>
.search-box {
  .el-input {
    width: 200px;
  }
}
</style>
