<template>
  <page-container :title="meta.title" class="table-container">
    <Table
      :columns="columns"
      :data="data"
      selection
      :action="operator"
      :actionConfig="{
        width: 250,
      }"
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
import { getUserListApi } from '@/api/user.api';
import Table from '@/components/Table';
import { useClipboard } from '@/hooks/useClipboard';
import Columns from './user.columns';

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

// 复制
const { copy, copied, text, isSupported } = useClipboard();
const onCopyItem = (row) => {
  if (!isSupported.value) {
    ElMessage.error('你的浏览器不支持 Clipboard API');
    return;
  }
  copy(row);
  copied && ElMessage.success('复制成功');
};

const data = ref([]);
const columns = Columns;
const operator = [
  {
    text: '查看',
    action: viewDetail,
    btnStyle: {
      text: false,
      link: false,
      color: '#626aef',
      icon: 'Edit',
    },
  },
  {
    text: '编辑',
    action: edit,
    btnStyle: {
      type: 'danger',
      text: false,
      link: false,
      icon: 'Search',
    },
  },
  {
    text: '删除',
    action: nullify,
    btnStyle: {
      text: false,
      link: false,
      plain: true,
      color: '#626aef',
      icon: 'Edit',
    },
  },
];

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
    const res = await getUserListApi({
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
