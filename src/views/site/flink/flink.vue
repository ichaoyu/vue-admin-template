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
  <!-- 抽屉弹窗 -->
  <create-draw
    :visible="isShowDraw"
    :record="currentRecord"
    @update:visible="toggleShowDraw"
    @refresh-table="fetchTableList"
  />
</template>

<script setup lang="ts">
import { getFriendlinkListApi, delFriendlinkApi } from '@/api/cms.friendlink.api';
import Table from '@/components/Table';
import createDraw from './flink.create.vue';

import Columns from './flink.columns';
import { FlinkType } from '@/interface';
import { PageDTO, PageVO } from '@/types';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

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
const currentRecord = ref<FlinkType | null>(null);
const edit = (row: FlinkType) => {
  currentRecord.value = row;
  toggleShowDraw(true);
};
// #region 删除
const onDelete = async (row: FlinkType) => {
  const ids = [row.id!];
  handleDelete(ids);
};
// 批量删除
const onBatchDelete = (data: FlinkType[]) => {
  const ids = data.map((item) => item.id!);
  handleDelete(ids);
};
// 删除操作
const handleDelete = async (ids: string[] | number[]) => {
  try {
    await delFriendlinkApi({ ids });
    ElMessage.success('删除成功');
  } catch (err) {
    console.error(err);
  } finally {
    await fetchTableList();
  }
};
//#endregion 删除

const data = ref<FlinkType[]>([]);
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
      page: currentPage.value,
      pageSize: pageSize.value,
      keywords: keywords.value,
    };
    const res = await getFriendlinkListApi(params);
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
const onSelection = (data: FlinkType[]) => {
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

<style lang="scss" scoped>
.toolbar-box {
  margin-bottom: 10px;
}
</style>
