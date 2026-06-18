# ProTable 表格组件

> 一个基于 Element Plus 的二次封装表格组件，支持分页、列设置、工具栏等功能

## 功能特性

- ✅ 分页功能
- ✅ 列显隐控制
- ✅ 表格大小切换
- ✅ 刷新按钮
- ✅ 树形数据支持
- ✅ 自定义列插槽
- ✅ 工具栏插槽

## 使用示例

### 基础用法

```vue
<template>
  <pro-table
    :data="tableData"
    :columns="columns"
    :total="total"
    :page="queryParams.page"
    :limit="queryParams.limit"
    @page-change="handlePageChange"
    @size-change="handleSizeChange"
    @refresh="handleRefresh"
  >
    <!-- 自定义列 -->
    <template #status="{ row }">
      <el-tag :type="row.status === '0' ? 'success' : 'danger'">
        {{ row.status === '0' ? '正常' : '停用' }}
      </el-tag>
    </template>
  </pro-table>
</template>

<script setup>
import { ref, reactive } from 'vue'

const queryParams = reactive({
  page: 1,
  limit: 10,
})

const tableData = ref([])
const total = ref(0)

const columns = [
  { prop: 'menuName', label: '菜单名称', minWidth: 200 },
  { prop: 'menuType', label: '类型', width: 100, slot: 'type' },
  { prop: 'status', label: '状态', width: 100, slot: 'status' },
  { prop: 'orderNum', label: '排序', width: 80 },
  { prop: 'createTime', label: '创建时间', width: 180 },
]

const handlePageChange = (page) => {
  queryParams.page = page
  fetchData()
}

const handleSizeChange = (size) => {
  queryParams.limit = size
  fetchData()
}

const handleRefresh = () => {
  fetchData()
}
</script>
```

### 树形数据

```vue
<pro-table
  :data="treeData"
  :columns="columns"
  row-key="id"
  :tree-props="{ children: 'children' }"
  :default-expand-all="true"
/>
```

### 自定义工具栏

```vue
<pro-table :data="tableData" :columns="columns">
  <template #toolbar-left>
    <el-button type="primary" @click="handleAdd">新增</el-button>
    <el-button @click="handleExport">导出</el-button>
  </template>
</pro-table>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 表格数据 | Array | [] |
| columns | 列配置 | Array | [] |
| border | 是否显示边框 | Boolean | true |
| stripe | 是否显示斑马纹 | Boolean | false |
| rowKey | 行数据的 key | String/Function | 'id' |
| treeProps | 树形数据配置 | Object | { children: 'children' } |
| defaultExpandAll | 是否默认展开所有行 | Boolean | false |
| showToolbar | 是否显示工具栏 | Boolean | true |
| showPagination | 是否显示分页 | Boolean | true |
| total | 总条数 | Number | 0 |
| page | 当前页 | Number | 1 |
| limit | 每页条数 | Number | 10 |
| pageSizes | 每页条数选项 | Array | [10, 20, 50, 100] |
| paginationLayout | 分页布局 | String | 'total, sizes, prev, pager, next, jumper' |
| loading | 加载状态 | Boolean | false |

## Column 配置

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| prop | 列字段名 | String | - |
| label | 列标题 | String | - |
| width | 列宽度 | String/Number | - |
| minWidth | 最小列宽 | String/Number | - |
| fixed | 列固定位置 | String | - |
| sortable | 是否可排序 | Boolean/String | - |
| align | 对齐方式 | String | - |
| headerAlign | 表头对齐方式 | String | - |
| slot | 插槽名称 | String | - |
| formatter | 格式化函数 | Function | - |
| visible | 是否显示 | Boolean | true |

## Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| page-change | 页码变化 | page |
| size-change | 每页条数变化 | size |
| refresh | 刷新 | - |
| sort-change | 排序变化 | { column, prop, order } |

## Slots

| 插槽名 | 说明 |
|--------|------|
| toolbar-left | 工具栏左侧 |
| toolbar-right | 工具栏右侧 |
| empty | 空数据时显示 |
| [slot] | 自定义列内容 |

## Expose Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| getTableRef | 获取表格实例 | - |
| getSelectionRows | 获取选中行 | - |
| clearSelection | 清空选中 | - |
| toggleRowSelection | 切换行选中状态 | row, selected |
| toggleAllSelection | 切换全选 | - |
| setCurrentRow | 设置当前行 | row |
| clearSort | 清空排序 | - |
| toggleRowExpansion | 展开行 | row, expanded |
