<template>
  <page-container :title="meta.title" class="table-container">
    <Table
      :columns="columns"
      :data="data"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pagination="{ defaultPageSize: 50, total }"
      @page-change="onPageChange"
      class="common-table"
      v-loading="loading"
    />
  </page-container>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { getConfigListApi } from '@/api/config.api';
import Table from '@/components/Table';

import Columns from './config.columns';

const { name, meta } = useRoute();

const viewDetail = (row, index, data) => {
  console.log('viewDetail', row, index, data);
};
const edit = (row, index, data) => {
  console.log('edit', row, index, data);
};
const nullify = (row, index, data) => {
  console.log('nullify', row, index, data);
};

const data = ref([]);
const columns = Columns;

onMounted(() => {
  fetchTableList();
});
const loading = ref(false);
let total = ref(0);
let currentPage = ref(1);
let pageSize = ref(20);
// 分页
const onPageChange = ({ page, size }) => {
  currentPage = page ?? currentPage.value;
  pageSize = size ?? pageSize.value;
  fetchTableList();
};

const fetchTableList = async () => {
  loading.value = true;
  try {
    const res = await getConfigListApi({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    });
    data.value = res.list;
    total.value = res.total;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
