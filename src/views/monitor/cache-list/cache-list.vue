<template>
  <page-container :title="meta.title" class="table-container">
    <el-row :gutter="15">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>缓存列表</span>
            <el-button type="primary" size="small" circle plain />
          </template>
          <template #default>
            <el-table
              :data="cacheList"
              highlight-current-row
              @current-change="onSelectCache"
            >
              <el-table-column type="index" />
              <el-table-column label="缓存名称" prop="cacheName" />
              <el-table-column label="备注" prop="remark" />
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button @click="onBatchDelete(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>键名列表</span>
            <el-button type="primary" size="small" circle plain />
          </template>
          <template #default>
            <el-table
              :data="cacheKeys"
              highlight-current-row
              @current-change="onSelectCacheKey"
            >
              <el-table-column type="index" />
              <el-table-column label="缓存键名" prop="cacheKey" />
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button @click="onBatchDelete(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>缓存内容</span>
            <el-button type="primary" size="small" circle plain />
          </template>
          <template #default>
            <el-form>
              <el-form-item label="缓存名称">
                <el-input v-model="cacheValues.cacheName" readonly />
              </el-form-item>
              <el-form-item label="缓存键名">
                <el-input v-model="cacheValues.cacheKey" readonly />
              </el-form-item>
              <el-form-item label="缓存内容">
                <el-input
                  v-model="cacheValues.cacheValue"
                  type="textarea"
                  rows="{8}"
                  readonly
                />
              </el-form-item>
            </el-form>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </page-container>
</template>

<script setup lang="ts">
import {
  getCacheListApi,
  getCacheKeyApi,
  getCacheValueApi,
  delCacheByNameApi,
} from '@/api/monitor.api';

import { CacheModelType, CacheValueType } from '@/interface';
import { ElMessage } from 'element-plus';

const { meta } = useRoute();

const cacheList = ref<CacheModelType[]>([]);
const cacheKeys = ref<any[]>([]);
const cacheValues = ref<CacheValueType>({
  cacheName: '',
  cacheKey: '',
  cacheValue: '',
});
const onSelectCache = async (row: CacheModelType) => {
  const keys = await getCacheKeyApi({ name: row.cacheName });
  cacheKeys.value = keys.map((v) => ({
    cacheKey: v.replace(`${row.cacheName}:`, ''),
  }));
};
const onSelectCacheKey = async (row: any) => {
  console.log('-----------------', row);
  const cache = await getCacheValueApi({ key: row.cacheKey });
  cacheValues.value = cache;
};
// #region 删除
const onDelete = async (row: CacheModelType) => {
  // const ids = [row.id!];
  // handleDelete(ids);
};
// 批量删除
const onBatchDelete = (data: CacheModelType[]) => {
  // const ids = data.map((item) => item.id!);
  // handleDelete(ids);
};
// 删除操作
const handleDelete = async (ids: string[] | number[]) => {
  // try {
  //   await delCacheByNameApi({ ids });
  //   ElMessage.success('删除成功');
  // } catch (err) {
  //   console.error(err);
  // } finally {
  //   await fetchTableList();
  // }
};
//#endregion 删除

onMounted(() => {
  fetchTableList();
});

const loading = ref<boolean>(false);

const fetchTableList = async () => {
  loading.value = true;
  try {
    const res = await getCacheListApi();
    // data.value = res.list;
    // total.value = res.total;
    cacheList.value = res;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.toolbar-box {
  margin-bottom: 10px;
}
</style>
