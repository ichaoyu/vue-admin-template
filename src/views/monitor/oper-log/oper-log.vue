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
      :action-config="{ width: 80 }"
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
                v-model="title"
                @clear="onReset"
              />
            </div>
            <div class="search-btn">
              <el-button type="primary" @click="onSearch">搜索</el-button>
              <el-button @click="onReset">重置</el-button>
            </div>
          </div>
          <div class="extra-opr">
            <el-button type="primary" @click="onExportLoginLog">导出</el-button>
            <el-button type="danger" @click="onClearLoginLog"
              >清空日志</el-button
            >
          </div>
        </div>
      </template>
    </Table>
  </page-container>
</template>

<script setup lang="ts">
import {
  getOperLogListApi,
  delOperLogApi,
  clearOperLogApi,
  exportOperLogApi,
} from '@/api/monitor.api';
import Table from '@/components/Table';

import Columns from './oper-log.columns';
import { OperLogType } from '@/interface';
import { ElMessage, ElMessageBox } from 'element-plus';
import { downloadFile } from '@/utils';

const { meta } = useRoute();

// #region 删除
const onDelete = async (row: OperLogType) => {
  const ids = [row.id!];
  handleDelete(ids);
};
// 批量删除
const onBatchDelete = (data: OperLogType[]) => {
  const ids = data.map((item) => item.id!);
  handleDelete(ids);
};
// 删除操作
const handleDelete = async (ids: string[] | number[]) => {
  try {
    await delOperLogApi({ ids });
    ElMessage.success('删除成功');
  } catch (err) {
    console.error(err);
  } finally {
    await fetchTableList();
  }
};
//#endregion 删除

const data = ref<OperLogType[]>([]);
const columns = Columns;

onMounted(() => {
  fetchTableList();
});
// 搜索
const title = ref<string>('');
const onSearch = () => {
  currentPage.value = 1;
  pageSize.value = 20;
  fetchTableList();
};
// 重置
const onReset = () => {
  title.value = '';
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
      title: title.value,
    };
    const res = await getOperLogListApi(params);
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
const onSelection = (data: OperLogType[]) => {
  selectData.value = data;
};

const operator = [
  {
    text: '删除',
    action: onDelete,
    btnStyle: {
      type: 'danger',
    },
  },
];
// 导出
const onExportLoginLog = async () => {
  try {
    loading.value = true;
    const params: PageDTO = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    };
    const res = await exportOperLogApi(params);
    downloadFile(res);
  } catch (err) {
    ElMessage.error('导出失败');
  } finally {
    loading.value = false;
  }
};
// 清空
const onClearLoginLog = async () => {
  ElMessageBox.confirm(
    '确定清空登录日志吗？清空后将永远失去现有数据！',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      try {
        loading.value = true;
        await clearOperLogApi();
        ElMessage({
          type: 'success',
          message: '所有登录日志已清空',
        });
      } finally {
        loading.value = false;
        await fetchTableList();
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '明智的决定',
      });
    });
};
</script>

<style lang="scss" scoped>
.toolbar-box {
  margin-bottom: 10px;
}
</style>
