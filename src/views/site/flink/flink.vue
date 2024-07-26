<template>
  <page-container :title="meta.title" class="table-container">
    <Table
      class="user-table"
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
    />
  </page-container>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { getFlinkListApi } from '@/api/site.api';
import Table from '@/components/Table';

import Columns from './flink.columns';

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
    const res = await getFlinkListApi({
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

<style lang="scss" scoped></style>
