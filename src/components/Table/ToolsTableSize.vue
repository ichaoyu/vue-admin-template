<template>
  <el-popover
    class="tools-column"
    placement="bottom"
    :width="70"
    trigger="click"
  >
    <template #reference>
      <icon-font class="icon-column-btn" name="column-height" :size="16" />
    </template>
    <div class="columns-box">
      <div
        v-for="item in sizeMap"
        :key="item.value"
        :class="['size-item', currentSize === item.value && 'active']"
        @click="() => onChangeTableSize(item.value)"
      >
        {{ item.label }}
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
const props = defineProps({
  size: {
    type: String as PropType<ElementSize>,
    default: 'small',
  },
});

const sizeMap = [
  {
    label: '宽松',
    value: 'large',
  },
  {
    label: '中等',
    value: 'defalut',
  },
  {
    label: '紧凑',
    value: 'small',
  },
];
const currentSize = ref<string>(props.size);
// 抛出事件
const emits = defineEmits(['change-table-size']);
const onChangeTableSize = (val: string) => {
  currentSize.value = val;
  emits('change-table-size', val);
};
</script>

<style lang="scss" scoped>
.icon-column-btn {
  @extend %item-hover;
}

.columns-box {
  @include flex-layout($direction: column, $align: flex-start);

  .size-item {
    @extend %item-hover;

    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }

  .active {
    color: var(--el-color-primary);
  }
}
</style>
