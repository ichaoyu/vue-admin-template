<template>
  <el-popover
    class="tools-column"
    placement="bottom"
    :width="150"
    trigger="click"
  >
    <template #reference>
      <icon-font class="icon-column-btn" icon="Tools" :size="16" />
    </template>
    <div class="columns-box">
      <div>列设置</div>
      <el-checkbox
        v-for="(column, index) in columnsState"
        :checked="!column.hidden"
        :disabled="column.isDisabled"
        :key="index + column.key"
        :label="column.label"
        :value="column.key"
        size="small"
        @change="(checked: boolean) => checkChanged(checked, index)"
      />
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, PropType } from 'vue';
import type { TableColumn } from './types';

const props = defineProps({
  columns: {
    type: Array as PropType<TableColumn[]>,
    default: () => [],
  },
});
// 初始化
const columnsState = ref<TableColumn[]>(props.columns);

// 抛出事件
const emits = defineEmits(['change-columns']);
const checkChanged = (checked: boolean, index: number) => {
  columnsState.value[index].hidden = !checked;

  emits('change-columns', columnsState.value);
};
</script>

<style lang="scss" scoped>
.columns-box {
  @include flex-layout($direction: column, $align: flex-start);
}

.icon-column-btn {
  @extend %item-hover;
}
</style>
