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
      :action-config="{ width: 80 }"
      @page-change="onPageChange"
    >
      <template #toolbar>
        <div class="toolbar-box">
          <div class="search-box">
            <div class="search-form">
              <el-input
                placeholder="请输入用户名称名称"
                clearable
                v-model="userName"
                @clear="onReset"
              />
            </div>
            <div class="search-btn">
              <el-button type="primary" @click="onSearch">搜索</el-button>
              <el-button @click="onReset">重置</el-button>
            </div>
          </div>
        </div>
      </template>
    </Table>
  </page-container>
</template>

<script setup lang="ts">
import { getOnlineListApi, delOnlineApi } from '@/api/monitor.api';
import Table from '@/components/Table';

import Columns from './online.columns';
import { OnlineType } from '@/interface';
import { ElMessage } from 'element-plus';

const { meta } = useRoute();

// #region 删除
const onDelete = async (row: OnlineType) => {
  const id = row.tokenId!;
  handleDelete(id);
};
// 删除操作
const handleDelete = async (id: string) => {
  try {
    await delOnlineApi(id);
    ElMessage.success('用户已强制下线');
  } finally {
    await fetchTableList();
  }
};
//#endregion 删除

const data = ref<OnlineType[]>([]);
const columns = Columns;

onMounted(() => {
  fetchTableList();
});
// 搜索
const userName = ref<string>('');
const onSearch = () => {
  currentPage.value = 1;
  pageSize.value = 20;
  fetchTableList();
};
// 重置
const onReset = () => {
  userName.value = '';
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
    };
    const res = await getOnlineListApi(params);
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
    text: '下线',
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
