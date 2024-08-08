<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <ElCard shadow="never" class="page-container">
    <template v-if="title" #header>
      <div class="content-header">
        <span class="content-header-title">{{ title }}</span>
        <ElTooltip v-if="message" effect="dark" placement="right">
          <template #content>
            <div class="content-header-msg">{{ message }}</div>
          </template>
          <el-icon class="icon"><InfoFilled /></el-icon>
        </ElTooltip>
        <div class="content-header-slot">
          <slot name="header"></slot>
        </div>
      </div>
    </template>
    <div class="content-main">
      <slot></slot>
    </div>
  </ElCard>
</template>

<style scoped lang="scss">
.page-container {
  --el-card-padding: 12px;
  --card-header-height: 18px;

  height: 100%;
  border: none;

  :deep(.el-card__body) {
    height: calc(
      100% - var(--el-card-padding) * 3 - var(--card-header-height) - var(
          --pagination-height
        )
    );
  }
}

.content-header {
  @include flex-layout();

  height: var(--card-header-height);

  .icon {
    margin-left: 5px;
  }

  &-title {
    font-size: 14px;
    font-weight: 700;
  }

  &-msg {
    max-width: 200px;
  }

  &-slot {
    @include flex-layout();

    padding-left: 20px;
  }
}

.content-main {
  width: 100%;
  height: 100%;
}
</style>
