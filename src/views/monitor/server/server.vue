<template>
  <page-container :title="meta.title">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-card v-loading="loading">
          <template #header>
            <div class="card-header">
              <span>CPU</span>
            </div>
          </template>
          <el-table :data="serverData.cpu">
            <ElTableColumn label="属性" prop="key" />
            <ElTableColumn label="值" prop="value" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :loading="loading">
          <template #header>
            <div class="card-header">
              <span>内存</span>
            </div>
          </template>
          <el-table :data="serverData.mem">
            <ElTableColumn label="属性" prop="key" />
            <ElTableColumn label="系统值" prop="sys" />
            <ElTableColumn label="node值" prop="node" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <!-- <cl-card>
      <template #header>
        <div class="card-header">
          <span>服务器信息</span>
        </div>
      </template>
      <el-descriptions border column="{2}">
        <el-descriptionsItem label="服务器名称">
          {{ serverData.os.hostname }}
        </el-descriptionsItem>
        <el-descriptionsItem label="操作系统">
          {{ serverData.os.platform }}
        </el-descriptionsItem>
        <el-descriptionsItem label="服务器IP">
          {{ serverData.os.ip }}
        </el-descriptionsItem>
        <el-descriptionsItem label="系统架构">
          {{ serverData.os.arch }}
        </el-descriptionsItem>
        <el-descriptionsItem label="安全启动">
          {{ serverData.os.uefi ? '是' : '否' }}
        </el-descriptionsItem>
        <el-descriptionsItem label="系统版本">
          {{ serverData.os.release }}
        </el-descriptionsItem>
      </el-descriptions>
    </cl-card> -->
  </page-container>
</template>

<script lang="ts" setup>
const { meta } = useRoute();
import { WebSocketClient } from '@/utils';
const ws = new WebSocketClient();
const loading = ref<boolean>(false);
const serverData = ref<any>({});
onMounted(() => {
  connectWs();
});
const connectWs = () => {
  try {
    loading.value = true;
    ws.connect();
    ws.onopen(() => {
      ws.send('serverInfo');
    });
    ws.onmessage((event: MessageEvent) => {
      const res = JSON.parse(event.data);
      console.log('loading.value: ', loading.value);
      serverData.value = res.data;
    });
  } finally {
    loading.value = false;
  }
};
onBeforeUnmount(() => {
  ws.close();
});
</script>

<style lang="less" scoped></style>
