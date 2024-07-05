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
    />
  </page-container>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getUserListApi } from '@/api/user';
const { name, meta } = useRoute();
import Table from '@/components/Table';
const viewDetail = (row, index, data) => {
  console.log('viewDetail', row, index, data);
};
const edit = (row, index, data) => {
  console.log('edit', row, index, data);
};
const nullify = (row, index, data) => {
  console.log('nullify', row, index, data);
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
  },
  {
    key: 'author',
    label: '作者',
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
  const res = await getUserListApi({ currentPage, pageSize });
  data.value = res.list;
  total.value = res.total;
};
</script>

<style lang="scss" scoped>
.user-container {
  height: 100%;

  .user-table {
    // height: 90%;
    // height: calc(100% - 500px);
  }
}
</style>
