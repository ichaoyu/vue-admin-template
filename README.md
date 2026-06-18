# Vue Admin 后台管理系统

基于 Vue3 + Element Plus + Pinia 的后台管理系统模板，封装了一系列通用的 Hooks、组件和工具函数，旨在提高开发效率，减少重复代码。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5+ | 渐进式 JavaScript 框架 |
| Vue Router | 5.0+ | Vue.js 官方路由 |
| Pinia | 3.0+ | Vue.js 状态管理 |
| Element Plus | 2.13+ | Vue 3 组件库 |
| Axios | 1.14+ | HTTP 请求库 |
| Vite | 8.0+ | 下一代前端构建工具 |
| wangEditor | 5.1+ | 富文本编辑器 |

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

## 目录

- [Hooks](#hooks)
  - [useTable](#usetable)
  - [useCrud](#usecrud)
  - [useForm](#useform)
  - [useDict](#usedict)
- [组件](#组件)
  - [ProTable](#protable)
  - [ProDialog](#prodialog)
  - [RichTextEditor](#richtexteditor)
  - [StatusSwitch](#statusswitch)
  - [DictSelect](#dictselect)
  - [ConfirmButton](#confirmbutton)
- [工具函数](#工具函数)
  - [common.js](#commonjs)
  - [validator.js](#validatorjs)
  - [date.js](#datejs)
- [常量](#常量)

---

## Hooks

### useTable

表格数据管理 Hook，提供表格数据的获取、分页、刷新等通用功能。

#### 基础用法

```javascript
import { useTable } from '@/hooks'

// 在组件中使用
const { tableData, loading, total, queryParams, getData, handlePageChange, handleSizeChange } = useTable(
  getUserListAPI,
  {
    defaultParams: { userName: '', status: '' },
    defaultPageSize: 10,
  }
)
```

#### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| fetchAPI | Function | - | 获取数据的 API 函数（必填） |
| options.defaultParams | Object | {} | 默认查询参数 |
| options.defaultPageSize | Number | 10 | 默认每页条数 |
| options.immediate | Boolean | true | 是否立即执行 |
| options.beforeFetch | Function | null | 请求前的数据处理函数 |
| options.afterFetch | Function | null | 请求后的数据处理函数 |
| options.onError | Function | null | 错误处理函数 |

#### 返回值

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| loading | Ref\<Boolean\> | 加载状态 |
| tableData | Ref\<Array\> | 表格数据 |
| total | Ref\<Number\> | 数据总数 |
| queryParams | Reactive\<Object\> | 查询参数（包含 pageNum、pageSize 等） |
| getData | Function | 获取数据方法 |
| handlePageChange | Function | 页码改变处理 |
| handleSizeChange | Function | 每页条数改变处理 |
| handleRefresh | Function | 刷新数据（保持当前页） |
| handleSearch | Function | 搜索（回到第一页） |
| resetQuery | Function | 重置查询参数 |

---

### useCrud

CRUD 操作管理 Hook，提供增删改查的通用操作。

#### 基础用法

```javascript
import { useCrud } from '@/hooks'

const { form, dialogVisible, handleAdd, handleEdit, handleSubmit, handleDelete, handleStatusChange } = useCrud(
  {
    create: createUserAPI,
    update: updateUserAPI,
    delete: deleteUserAPI,
  },
  {
    nameField: 'userName', // 用于删除确认提示
  }
)

// 新增
handleAdd({ status: '0' })

// 编辑
handleEdit(row, { phone: 'phonenumber' }) // 字段映射

// 提交
await handleSubmit(formData, formRef, getData)

// 删除
await handleDelete(row, getData)

// 状态切换
await handleStatusChange(row, 'status', getData)
```

#### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| api.create | Function | - | 创建 API |
| api.update | Function | - | 更新 API |
| api.delete | Function | - | 删除 API |
| options.nameField | String | 'name' | 名称字段，用于删除确认提示 |
| options.afterCreate | Function | null | 创建成功回调 |
| options.afterUpdate | Function | null | 更新成功回调 |
| options.afterDelete | Function | null | 删除成功回调 |

#### 返回值

| 属性/方法 | 类型 | 说明 |
|-----------|------|------|
| form | Ref\<Object\> | 表单数据 |
| dialogVisible | Ref\<Boolean\> | 弹窗显示状态 |
| submitLoading | Ref\<Boolean\> | 提交加载状态 |
| handleAdd | Function | 打开新增弹窗 |
| handleEdit | Function | 打开编辑弹窗 |
| handleSubmit | Function | 提交表单 |
| handleDelete | Function | 删除数据 |
| handleStatusChange | Function | 切换状态 |
| handleBatchDelete | Function | 批量删除 |

---

### useForm

表单管理 Hook，提供表单的状态管理、验证、重置等功能。

#### 基础用法

```javascript
import { useForm } from '@/hooks'
import { required, phone, email } from '@/utils/validator'

const { form, formRef, rules, validate, resetForm, setFormData } = useForm({
  defaultValues: { name: '', phone: '', email: '' },
  rules: {
    name: [required('请输入姓名')],
    phone: [phone()],
    email: [email()],
  },
})

// 验证
const isValid = await validate()

// 重置
resetForm()

// 设置数据
setFormData(rowData)
```

---

### useDict

字典数据管理 Hook，提供字典数据的获取和缓存功能。

#### 基础用法

```javascript
import { useDict, useDicts } from '@/hooks'

// 单个字典
const { dictData, getDictLabel, getDictValue, getOptions } = useDict('sys_normal_disable')

// 批量加载
const { statusOptions, typeOptions } = useDicts(['sys_normal_disable', 'sys_user_sex'])
```

---

## 组件

### ProTable

高级表格组件，封装了分页、工具栏、列设置等功能。

#### 基础用法

```vue
<template>
  <pro-table
    ref="tableRef"
    :data="tableData"
    :columns="columns"
    :loading="loading"
    :total="total"
    :page="queryParams.page"
    :limit="queryParams.pageSize"
    @page-change="handlePageChange"
    @size-change="handleSizeChange"
    @refresh="handleRefresh"
  >
    <template #toolbar-left>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </template>
    
    <template #status="{ row }">
      <el-tag :type="row.status === 0 ? 'success' : 'danger'">{{ row.status === 0 ? '正常' : '停用' }}</el-tag>
    </template>
  </pro-table>
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | Array | [] | 表格数据 |
| columns | Array | [] | 列配置 |
| loading | Boolean | false | 加载状态 |
| total | Number | 0 | 数据总数 |
| page | Number | 1 | 当前页码 |
| limit | Number | 10 | 每页条数 |
| showToolbar | Boolean | true | 是否显示工具栏 |
| showPagination | Boolean | true | 是否显示分页 |

---

### ProDialog

弹窗组件，封装了确认按钮 loading 状态。

#### 基础用法

```vue
<template>
  <pro-dialog
    v-model="dialogVisible"
    title="新增"
    width="600px"
    content-height="400px"
    :confirm-loading="submitLoading"
    @confirm="handleSubmit"
  >
    <el-form>...</el-form>
  </pro-dialog>
</template>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | Boolean | false | 是否显示 |
| title | String | '' | 标题 |
| width | String | '50%' | 宽度 |
| contentHeight | String | 'auto' | 内容高度 |
| confirmLoading | Boolean | false | 确认按钮加载状态 |

---

### RichTextEditor

富文本编辑器组件，基于 wangEditor 封装。

#### 基础用法

```vue
<template>
  <RichTextEditor 
    v-model="content" 
    :height="300" 
    placeholder="请输入内容..." 
  />
</template>

<script setup>
import RichTextEditor from '@/components/RichTextEditor/index.vue'
const content = ref('')
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String | '' | 编辑器内容 |
| height | Number | 300 | 编辑器高度 |
| placeholder | String | '请输入内容...' | 占位文本 |
| disabled | Boolean | false | 是否禁用 |

---

### StatusSwitch

状态开关组件，封装状态切换逻辑。

#### 基础用法

```vue
<template>
  <!-- 基础用法 -->
  <StatusSwitch v-model="row.status" :id="row.id" :api="updateUserAPI" />

  <!-- 自定义值 -->
  <StatusSwitch
    v-model="row.status"
    :id="row.id"
    :api="updateUserAPI"
    active-value="1"
    inactive-value="0"
    active-text="启用"
    inactive-text="禁用"
  />
</template>

<script setup>
import StatusSwitch from '@/components/StatusSwitch/index.vue'
import { updateUserAPI } from '@/api/user'
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String/Number/Boolean | '' | 绑定值 |
| id | String/Number | '' | 数据 ID |
| api | Function | null | 更新状态的 API 函数 |
| activeValue | String/Number/Boolean | '0' | 激活状态值 |
| inactiveValue | String/Number/Boolean | '1' | 非激活状态值 |
| activeText | String | '' | 激活状态文本 |
| inactiveText | String | '' | 非激活状态文本 |
| successMessage | String | '状态更新成功' | 成功提示消息 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| change | value | 状态改变时触发 |
| success | value | 更新成功时触发 |
| error | error | 更新失败时触发 |

---

### DictSelect

字典选择组件，自动加载字典数据。

#### 基础用法

```vue
<template>
  <!-- 使用字典类型 -->
  <DictSelect v-model="form.status" dict-type="sys_normal_disable" />

  <!-- 使用静态选项 -->
  <DictSelect
    v-model="form.type"
    :options="[
      { label: '类型1', value: '1' },
      { label: '类型2', value: '2' },
    ]"
  />

  <!-- 多选 -->
  <DictSelect v-model="form.types" dict-type="sys_user_sex" multiple collapse-tags />
  
  <!-- 显示禁用选项 -->
  <DictSelect v-model="form.status" dict-type="sys_normal_disable" :showDisabled="true" />
</template>

<script setup>
import DictSelect from '@/components/DictSelect/index.vue'
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | String/Number/Array | '' | 绑定值 |
| dictType | String | '' | 字典类型 |
| options | Array | null | 静态选项 |
| placeholder | String | '请选择' | 占位文本 |
| clearable | Boolean | true | 是否可清空 |
| disabled | Boolean | false | 是否禁用 |
| size | String | 'default' | 尺寸 |
| multiple | Boolean | false | 是否多选 |
| collapseTags | Boolean | false | 是否折叠标签 |
| collapseTagsTooltip | Boolean | false | 折叠标签时是否显示 tooltip |
| filterable | Boolean | false | 是否可搜索 |
| width | String | '100%' | 宽度 |
| valueField | String | 'value' | 值字段名 |
| labelField | String | 'label' | 标签字段名 |
| showDisabled | Boolean | false | 是否显示禁用的选项 |

### DictTag

字典标签组件，用于显示字典值对应的文本。

#### 基础用法

```vue
<template>
  <!-- 显示状态标签 -->
  <DictTag :value="row.status" dict-type="sys_normal_disable" />
  
  <!-- 显示性别标签 -->
  <DictTag :value="user.sex" dict-type="sys_user_sex" />
  
  <!-- 自定义标签类型 -->
  <DictTag :value="row.status" dict-type="sys_normal_disable" tag-type="success" />
</template>

<script setup>
import DictTag from '@/components/DictTag/index.vue'
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| value | String/Number | - | 字典值 |
| dictType | String | - | 字典类型 |
| size | String | 'default' | 标签尺寸 |
| effect | String | 'light' | 标签效果 |
| showTag | Boolean | true | 是否显示为标签 |
| tagType | String | '' | 标签类型 |
| customClass | String | '' | 自定义类名 |

---

### ConfirmButton

确认按钮组件，提供点击确认功能。

#### 基础用法

```vue
<template>
  <ConfirmButton
    type="danger"
    text="删除"
    message="确认删除该数据吗？"
    :on-confirm="handleDelete"
    success-message="删除成功"
  />
</template>

<script setup>
import ConfirmButton from '@/components/ConfirmButton/index.vue'

const handleDelete = async () => {
  await deleteAPI(id)
}
</script>
```

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | String | '' | 按钮文本 |
| message | String | '确认执行此操作吗？' | 确认提示消息 |
| title | String | '提示' | 弹窗标题 |
| type | String | 'default' | 按钮类型 |
| onConfirm | Function | null | 确认回调 |
| successMessage | String | '' | 成功提示消息 |

---

## 工具函数

### common.js

通用工具函数库。

```javascript
import { debounce, throttle, deepClone, flattenTree, findInTree, copyToClipboard } from '@/utils/common'

// 防抖
const debouncedFn = debounce((value) => {
  console.log(value)
}, 300)

// 节流
const throttledFn = throttle(() => {
  console.log('scroll')
}, 300)

// 深拷贝
const cloned = deepClone(original)

// 树形数据扁平化
const flatList = flattenTree(treeData)

// 树形数据查找
const node = findInTree(treeData, { id: 1 })

// 复制到剪贴板
await copyToClipboard('text')
```

### validator.js

表单验证规则库。

```javascript
import { required, phone, email, password, userRules } from '@/utils/validator'

// 单独使用
const rules = {
  userName: [required('请输入用户名'), minLength(3), maxLength(20)],
  phone: [phone()],
  email: [email()],
  password: [password({ minLength: 6, requireNumber: true })],
}

// 使用预设规则
const rules = {
  ...userRules,
}
```

### date.js

日期处理工具。

```javascript
import { formatDate, formatDateTime, formatDateOnly, formatRelativeTime } from '@/utils/date'

formatDateTime('2023-08-19T00:32:40.000Z') // '2023-08-19 00:32:40'
formatDateOnly('2023-08-19T00:32:40.000Z') // '2023-08-19'
formatRelativeTime(new Date()) // '刚刚'
```

---

## 常量

```javascript
import { STATUS, GENDER, DICT_TYPE, PAGINATION, COLOR } from '@/constants'

// 使用状态常量
const statusOptions = STATUS_OPTIONS // [{ label: '正常', value: '0' }, { label: '停用', value: '1' }]

// 使用分页配置
const defaultPageSize = PAGINATION.DEFAULT_PAGE_SIZE // 10
```

---

## 完整示例

```vue
<template>
  <div class="user-container">
    <pro-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      :page="queryParams.pageNum"
      :limit="queryParams.pageSize"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
      @refresh="handleRefresh"
    >
      <template #toolbar-left>
        <el-input v-model="queryParams.userName" placeholder="用户账号" clearable style="width: 200px" />
        <DictSelect v-model="queryParams.status" dict-type="sys_normal_disable" placeholder="用户状态" style="width: 120px" />
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      </template>

      <template #status="{ row }">
        <StatusSwitch v-model="row.status" :id="row.id" :api="updateUserAPI" />
      </template>

      <template #operation="{ row }">
        <el-button type="primary" size="small" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
        <ConfirmButton
          type="danger"
          size="small"
          link
          text="删除"
          :message="`确认删除用户"${row.userName}"吗？`"
          :on-confirm="() => deleteUserAPI(row.id)"
          success-message="删除成功"
          @confirm="getData"
        />
      </template>
    </pro-table>
  </div>
</template>

<script setup>
import { Plus, Edit } from '@element-plus/icons-vue'
import { useTable, useCrud } from '@/hooks'
import { getUserListAPI, createUserAPI, updateUserAPI, deleteUserAPI } from '@/api/user'
import { formatDateTime } from '@/utils/date'
import { userRules } from '@/utils/validator'
import ProTable from '@/components/Table/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import ConfirmButton from '@/components/ConfirmButton/index.vue'

// 表格
const { tableData, loading, total, queryParams, getData, handlePageChange, handleSizeChange, handleRefresh } = useTable(
  getUserListAPI,
  { defaultParams: { userName: '', status: '' } }
)

// CRUD
const { form, dialogVisible, handleAdd, handleEdit, handleSubmit, handleStatusChange } = useCrud(
  { create: createUserAPI, update: updateUserAPI, delete: deleteUserAPI },
  { nameField: 'userName' }
)

// 列配置
const columns = [
  { prop: 'userName', label: '用户账号', minWidth: 120 },
  { prop: 'nickName', label: '用户昵称', minWidth: 120 },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'operation' },
]
</script>
```

---

## 目录结构

```
src/
├── api/                 # API 接口
│   ├── cms/             # CMS 模块接口
│   ├── monitor/         # 监控模块接口
│   ├── system/          # 系统模块接口
│   └── auth.js          # 认证接口
├── assets/              # 静态资源
│   └── css/             # 样式文件
├── components/          # 通用组件
│   ├── Table/           # 表格组件
│   ├── Dialog/          # 弹窗组件
│   ├── RichTextEditor/  # 富文本编辑器
│   ├── StatusSwitch/    # 状态开关组件
│   ├── DictSelect/      # 字典选择组件
│   └── ConfirmButton/   # 确认按钮组件
├── hooks/               # 自定义 Hooks
│   ├── useTable.js      # 表格 Hook
│   ├── useCrud.js       # CRUD Hook
│   ├── useForm.js       # 表单 Hook
│   ├── useDict.js       # 字典 Hook
│   └── index.js         # 导出入口
├── layout/              # 布局组件
├── router/              # 路由配置
├── store/               # 状态管理
├── utils/               # 工具函数
│   ├── axios.js         # HTTP 请求封装
│   ├── auth.js          # 认证相关
│   ├── date.js          # 日期处理
│   ├── common.js        # 通用工具函数
│   └── validator.js     # 表单验证规则
├── constants/           # 常量定义
└── views/               # 页面组件
    ├── cms/             # CMS 模块
    ├── monitor/         # 监控模块
    ├── system/          # 系统管理
    └── dashboard/       # 仪表盘
```
