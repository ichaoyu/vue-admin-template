<template>
  <page-container :title="meta.title" class="user-container">
    <Table
      :columns="columns"
      :data="data"
      index
      selection
      :action="operator"
      :actionConfig="{
        width: 250,
      }"
      :currentPage="currentPage"
      :pageSize="pageSize"
      :pagination="{ defaultPageSize: 50, total }"
      @page-change="onPageChange"
      class="user-table"
      v-loading="loading"
    />
  </page-container>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getUserListApi } from '@/api/user';
import Table from '@/components/Table';
import { useClipboard } from '@/hooks/useClipboard';

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
const columns = [
  {
    key: 'id',
    label: 'ID',
    align: 'center',
  },
  {
    key: 'title',
    label: '名称',
    oprAction: viewDetail,
    copy: onCopyItem,
  },
  {
    key: 'author',
    label: '作者',
    copy: onCopyItem,
  },
];
const data = ref([]);
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
let currentPage = reactive(1);
let pageSize = reactive(20);
// 分页
const onPageChange = ({ page, size }) => {
  currentPage = page ?? currentPage;
  pageSize = size ?? pageSize;
  fetchTableList();
};

const fetchTableList = async () => {
  loading.value = true;
  try {
    const res = await getUserListApi({ currentPage, pageSize });
    data.value = res.list;
    total.value = res.total;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.user-container {
  height: 100%;
}
</style>
