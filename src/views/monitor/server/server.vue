<template>
  <page-container :title="meta.title">
    <el-scrollbar>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>CPU</span>
              </div>
            </template>
            <el-skeleton :loading="!serverData.cpu" animated :throttle="500">
              <template #template>
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
              </template>
              <template #default v-if="serverData.cpu">
                <el-table :data="serverData.cpu">
                  <el-table-column label="属性" prop="key" />
                  <el-table-column label="值" prop="value">
                    <template #default="{ row, $index }">
                      {{ $index === 0 ? row.value : filterPercent(row.value) }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>内存</span>
              </div>
            </template>
            <el-skeleton :loading="!serverData.mem" animated :throttle="500">
              <template #template>
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
              </template>
              <template #default v-if="serverData.mem">
                <el-table :data="serverData.mem">
                  <el-table-column label="属性" prop="key" />
                  <el-table-column label="系统值" prop="sys">
                    <template #default="{ row }">
                      {{ filterValue(row.sys) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="node值" prop="node">
                    <template #default="{ row }">
                      {{ filterValue(row.node) }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>服务器信息</span>
              </div>
            </template>
            <el-skeleton :loading="!serverData.os" animated :throttle="500">
              <template #template>
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
              </template>
              <template #default v-if="serverData.os">
                <el-descriptions border :column="2">
                  <el-descriptions-item label="服务器名称">
                    {{ serverData.os.hostname }}
                  </el-descriptions-item>
                  <el-descriptions-item label="操作系统">
                    {{ serverData.os.platform }}
                  </el-descriptions-item>
                  <el-descriptions-item label="服务器IP">
                    {{ serverData.os.ip }}
                  </el-descriptions-item>
                  <el-descriptions-item label="系统架构">
                    {{ serverData.os.arch }}
                  </el-descriptions-item>
                  <el-descriptions-item label="安全启动">
                    {{ serverData.os.uefi ? '是' : '否' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="系统版本">
                    {{ serverData.os.release }}
                  </el-descriptions-item>
                </el-descriptions>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>Node信息</span>
              </div>
            </template>
            <el-skeleton :loading="!serverData.node" animated :throttle="500">
              <template #template>
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
              </template>
              <template #default v-if="serverData.node">
                <el-descriptions border :column="2">
                  <el-descriptions-item label="Node版本" :span="2">
                    {{ serverData.node.version }}
                  </el-descriptions-item>
                  <el-descriptions-item label="启动时间">
                    {{ startTime }}
                  </el-descriptions-item>
                  <el-descriptions-item label="运行时长">
                    {{ filterUptime(serverData.node.uptime) }}
                  </el-descriptions-item>
                  <el-descriptions-item label="安装路径">
                    {{ serverData.node.nodePath }}
                  </el-descriptions-item>
                  <el-descriptions-item label="项目路径">
                    {{ serverData.node.filePath }}
                  </el-descriptions-item>
                  <el-descriptions-item label="运行参数" span="{2}">
                    {{ serverData.node.args }}
                  </el-descriptions-item>
                </el-descriptions>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>Redis信息</span>
              </div>
            </template>
            <el-skeleton :loading="!serverData.redis" animated :throttle="500">
              <template #template>
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
              </template>
              <template #default v-if="serverData.redis">
                <el-descriptions border :column="4">
                  <el-descriptions-item label="Redis版本">
                    {{ serverData.redis.redis_version }}
                  </el-descriptions-item>
                  <el-descriptions-item label="运行模式">
                    {{
                      serverData.redis.redis_mode === 'standalone'
                        ? '单机'
                        : '集群'
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item label="端口">
                    {{ serverData.redis.tcp_port }}
                  </el-descriptions-item>
                  <el-descriptions-item label="客户端数">
                    {{ serverData.redis.connected_clients }}
                  </el-descriptions-item>
                  <el-descriptions-item label="运行时间(天)">
                    {{ serverData.redis.uptime_in_days }}
                  </el-descriptions-item>
                  <el-descriptions-item label="使用内存">
                    {{ serverData.redis.used_memory_human }}
                  </el-descriptions-item>
                  <el-descriptions-item label="使用CPU">
                    {{
                      Number.parseFloat(
                        serverData.redis.used_cpu_user_children,
                      ).toFixed(2)
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item label="内存配置">
                    {{ serverData.redis.maxmemory_human }}
                  </el-descriptions-item>
                  <el-descriptions-item label="AOF是否开启">
                    {{ serverData.redis.aof_enabled === '0' ? '否' : '是' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="RDB是否成功">
                    {{ serverData.redis.rdb_last_bgsave_status }}
                  </el-descriptions-item>
                  <el-descriptions-item label="Key数量">
                    {{ serverData.redis.db_size }}
                  </el-descriptions-item>
                  <el-descriptions-item label="网络入口/出口">
                    {{ serverData.redis.instantaneous_input_kbps }} kps/
                    {{ serverData.redis.instantaneous_output_kbps }} kps
                  </el-descriptions-item>
                </el-descriptions>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>磁盘状态</span>
              </div>
            </template>
            <el-skeleton :loading="!serverData.disk" animated :throttle="500">
              <template #template>
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
                <el-skeleton-item variant="text" />
              </template>
              <template #default v-if="serverData.disk">
                <el-table :data="serverData.disk">
                  <el-table-column label="盘符路径" prop="fs" />
                  <el-table-column label="文件系统" prop="type" />
                  <el-table-column label="盘符类型" prop="mount" />
                  <el-table-column label="总大小">
                    <template #default="{ row }">{{
                      filterSize(row.size)
                    }}</template>
                  </el-table-column>
                  <el-table-column label="可用大小">
                    <template #default="{ row }">{{
                      filterSize(row.available)
                    }}</template>
                  </el-table-column>
                  <el-table-column label="已用大小">
                    <template #default="{ row }">{{
                      filterSize(row.used)
                    }}</template>
                  </el-table-column>
                  <el-table-column label="已用百分比">
                    <template #default="{ row }">{{
                      ((row.used / row.size) * 100).toFixed(3) + '%'
                    }}</template>
                  </el-table-column>
                </el-table>
              </template>
            </el-skeleton>
          </el-card>
        </el-col>
      </el-row>
    </el-scrollbar>
  </page-container>
</template>

<script lang="ts" setup>
const { meta } = useRoute();
import { WebSocketClient, fmtDuration, dayjs } from '@/utils';
import { ElMessage } from 'element-plus';
const ws = new WebSocketClient();
const serverData = ref<any>({});
onBeforeMount(async () => {
  await connectWs();
});

const connectWs = async () => {
  try {
    ws.connect();
    ws.onopen(() => {
      ws.send('serverInfo');
    });
    ws.onmessage((event: MessageEvent) => {
      const res = JSON.parse(event.data);
      serverData.value = res.data;
    });
  } catch (err: any) {
    ElMessage.error(err);
  }
};
onBeforeUnmount(() => {
  ws.close();
});

const filterSize = (size: number) => {
  return `${(size / 1024 / 1024 / 1024).toFixed(2)}GB`;
};

const filterPercent = (percent: number) => {
  return `${percent}%`;
};

const filterValue = (value: number) => {
  if (value < 1) {
    return filterPercent(value);
  }
  return filterSize(value);
};

const filterUptime = (value: number) => {
  return fmtDuration(value, 'seconds', 'D天H小时mm分钟ss秒');
};
const startTime = computed(() =>
  dayjs()
    .subtract(serverData.value.node.uptime, 'seconds')
    .format('YYYY-MM-DD HH:mm:ss'),
);
</script>

<style lang="scss" scoped>
:deep(.el-row) {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}
</style>
