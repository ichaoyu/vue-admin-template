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

  border: none;
}

.content-header {
  @include flex-layout();

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
}
</style>
