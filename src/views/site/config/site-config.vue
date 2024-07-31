<template>
  <page-container
    :title="meta.title"
    class="table-container"
    v-loading="loading"
  >
    <el-tabs v-model="activeName" @tab-click="onTabClick">
      <!-- 基本设置 -->
      <el-tab-pane label="基本设置" class="mt-20" name="first">
        <el-form ref="info" :model="info" label-width="84px">
          <el-form-item label="网站名称">
            <el-input v-model="info.name" />
          </el-form-item>

          <el-form-item label="网站域名">
            <el-input v-model="info.domain" />
          </el-form-item>

          <el-form-item label="站长邮箱">
            <el-input v-model="info.email" />
          </el-form-item>

          <el-form-item label="ICP备案号">
            <el-input v-model="info.icp" />
          </el-form-item>

          <el-form-item label="统计代码">
            <el-input
              type="textarea"
              class="textarea"
              :rows="3"
              v-model="info.code"
            />
          </el-form-item>

          <el-form-item label="其他配置">
            <el-input
              type="textarea"
              class="textarea"
              :rows="3"
              v-model="info.json"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- seo设置 -->
      <el-tab-pane label="SEO设置" class="mt-20" name="second">
        <el-form ref="seo" :model="info" label-width="84px">
          <el-form-item label="标题">
            <el-input v-model="info.title" />
          </el-form-item>

          <el-form-item label="关键词">
            <el-input v-model="info.keywords" />
          </el-form-item>

          <el-form-item label="描述">
            <el-input
              type="textarea"
              :rows="3"
              class="textarea"
              v-model="info.description"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-button
      type="primary"
      class="btn-save"
      @click="onSave"
      :loading="submitLoading"
      >保 存</el-button
    >
  </page-container>
</template>

<script setup lang="ts" name="SiteConfig">
import { ElMessage, type TabsPaneContext } from 'element-plus';
import { getSiteInfoApi, updateSiteInfoApi } from '@/api/site.api';
import { siteInfoType } from '@/interface';
const { meta } = useRoute();

onMounted(async () => {
  await getSiteInfo();
});

const siteInfo = ref<siteInfoType>({
  name: '',
  domain: '',
  email: '',
  wx: '',
  icp: '',
  code: '',
  json: '',
  title: '',
  keywords: '',
  description: '',
  template: '',
  appid: '',
  secret: '',
});
const loading = ref<boolean>(false);
const submitLoading = ref<boolean>(false);
const activeName = ref<string>('first');
const activeIndex = ref<string | undefined>('0');

const info = computed(() => {
  return siteInfo.value;
});

const getSiteInfo = async () => {
  try {
    loading.value = true;
    const res = await getSiteInfoApi({ id: 1 });
    siteInfo.value = res;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const onTabClick = (tab: TabsPaneContext) => {
  activeIndex.value = tab.index;
};

const onSave = async () => {
  try {
    submitLoading.value = true;
    await updateSiteInfoApi(info.value);
    ElMessage.success('更新成功');
  } catch (err) {
    console.error(err);
  } finally {
    submitLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.btn-save {
  margin-top: 20px;
  float: right;
}
</style>
