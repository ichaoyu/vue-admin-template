# 前后端 API 集成指南

> 最后更新：2026-06-23

本文档描述 vue-admin 前端与 base-server-nest 后端 API 的对接规范和约定。

---

## 1. API 基础配置

### 1.1 基础地址

| 环境 | 前端地址 | API 代理 |
|---|---|---|
| 开发 | `http://localhost:7000` | Vite 代理 `/api` → `http://localhost:3000` |
| 生产 | 部署地址 | Nginx 代理 `/api` → 后端服务 |

**前端 Axios 配置**（`src/utils/axios.js`）：

```javascript
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
});
```

**Vite 开发代理**（`vite.config.js`）：

```javascript
server: {
  port: 7000,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
    '/ws': {
      target: 'http://localhost:3000',
      ws: true,
    },
  },
}
```

### 1.2 请求头规范

所有 API 请求自动携带以下请求头：

```
Authorization: Bearer <jwt-token>
Content-Type: application/json;charset=UTF-8
```

Token 由 Axios 请求拦截器从 `useUserStore` 自动注入，无需手动设置。

---

## 2. 统一响应格式

### 2.1 成功响应

```json
{
  "code": 200,
  "message": "请求成功",
  "data": "<payload>"
}
```

前端 Axios 响应拦截器自动解包：当 `code === 200` 时，直接返回 `data` 字段，业务代码无需再检查 `code`。

### 2.2 错误响应

```json
{
  "code": 2001,
  "message": "认证已过期"
}
```

错误响应不含 `data` 字段。前端根据 `code` 展示错误提示。

### 2.3 分页响应

```json
{
  "code": 200,
  "message": "请求成功",
  "data": {
    "list": [...],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

分页数据在 `data` 中包含 `list`（数据数组）和 `total`（总记录数）。`page` 和 `pageSize` 为请求参数的回显。

---

## 3. 分页请求约定

### 3.1 请求参数

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `page` | number | 1 | 当前页码 |
| `pageSize` | number | 10 | 每页数量 |
| `orderBy` | string? | - | 排序字段 |
| `order` | string? | - | 排序方向（ASC/DESC） |

其他参数为业务筛选字段，如 `userName`、`status` 等。

### 3.2 前端请求示例

```javascript
// GET /api/system/user?page=1&pageSize=10&userName=admin&status=1
export const getUserListAPI = (params) => api.get('/system/user', { params });
```

---

## 4. CRUD 接口约定

### 4.1 标准 CRUD 端点

| 操作 | HTTP 方法 | URL | 请求体 | 说明 |
|---|---|---|---|---|
| 列表查询 | GET | `/{module}/{resource}` | - | 参数通过 Query 传递 |
| 详情查询 | GET | `/{module}/{resource}/{id}` | - | ID 在 URL 路径中 |
| 创建 | POST | `/{module}/{resource}` | JSON | 完整字段 |
| 更新 | **PATCH** | `/{module}/{resource}` | JSON（含 id） | ⚠️ ID 在请求体中，非 URL |
| 删除 | DELETE | `/{module}/{resource}/{id}` | - | ID 在 URL 路径中 |
| 批量删除 | DELETE | `/{module}/{resource}` | `{ ids: [...] }` | IDs 在请求体中 |

### 4.2 前端 API 函数模板

```javascript
import api from '@/utils/axios'

// 列表查询
export const getXxxListAPI = (params) => api.get('/module/xxx', { params })

// 详情查询
export const getXxxDetailAPI = (id) => api.get(`/module/xxx/${id}`)

// 创建
export const createXxxAPI = (data) => api.post('/module/xxx', data)

// 更新（注意：PATCH，ID 在请求体中）
export const updateXxxAPI = (data) => api.patch('/module/xxx', data)

// 删除
export const deleteXxxAPI = (id) => api.delete(`/module/xxx/${id}`)

// 批量删除
export const batchDeleteXxxAPI = (ids) => api.delete('/module/xxx', { data: { ids } })
```

### 4.3 更新接口重要说明

⚠️ **更新接口统一使用 `@Patch()`，ID 在请求体中传递，不在 URL 中。**

```javascript
// ✅ 正确
export const updateUserAPI = (data) => api.patch('/system/user', data)
// 调用：updateUserAPI({ id: '123', userName: 'newName', ... })

// ❌ 错误
export const updateUserAPI = (id, data) => api.patch(`/system/user/${id}`, data)
```

前端 `useCrud` Hook 的 `handleSubmit` 方法会根据 `form.value.id` 是否存在自动判断新增/更新：

- 有 `id` → 调用 `apiMap.update(form)`
- 无 `id` → 调用 `apiMap.create(form)`

---

## 5. 错误码对照表

### 5.1 业务错误码

| 错误码范围 | 分类 | 常见码 |
|---|---|---|
| `1000-1999` | 基础错误 | 1000=未知错误, 1001=参数错误, 1002=资源不存在, 1003=方法不允许 |
| `2000-2999` | 认证授权 | 2000=未认证, 2001=认证过期, 2002=Token 无效, 2003=无权限, 2004=账户禁用, 2005=账户锁定 |
| `3000-3999` | 校验错误 | 3000=校验失败, 3001=参数缺失, 3002=参数格式错误 |
| `4000-4999` | 业务错误 | 4000=用户已存在, 4001=用户不存在, 4002=密码错误, 4003=验证码错误, 4004=验证码过期, 4005=数据已存在, 4006=操作失败, 4007=请求过于频繁 |
| `5000-5999` | 服务器错误 | 5000=服务器内部错误, 5001=数据库错误, 5002=缓存错误, 5003=第三方服务错误, 5005=网络错误 |

### 5.2 前端错误处理

前端 Axios 拦截器自动处理以下情况：

| HTTP 状态码 | 前端行为 |
|---|---|
| 401 | 弹出"登录过期"提示，跳转登录页 |
| 403 | 弹出"无权限"提示 |
| 404 | 弹出"请求的资源不存在"提示 |
| 422 | 弹出校验错误信息 |
| 429 | 弹出"请求过于频繁"提示 |
| 500 | 弹出"服务器内部错误"提示 |

---

## 6. 前端 Hook 与后端 API 配合

### 6.1 useTable — 分页列表

`useTable` 用于分页列表数据获取，自动管理分页状态和加载状态。

**基本用法：**

```vue
<script setup>
import { useTable } from '@/hooks/useTable'
import { getUserListAPI } from '@/api/system/user'

const {
  loading,
  tableData,
  total,
  page,
  limit,
  getData,
  handleSearch,
  resetQuery,
} = useTable(getUserListAPI, {
  defaultParams: { status: 1 },  // 默认筛选参数
  defaultPageSize: 10,
})
</script>

<template>
  <ProTable
    :data="tableData"
    :loading="loading"
    :total="total"
    v-model:page="page"
    v-model:limit="limit"
  />
</template>
```

**与后端 API 的映射：**

| 前端 | 后端 |
|---|---|
| `fetchAPI(params)` | `GET /api/{module}/{resource}?page&pageSize&...` |
| `params.page` | `page` 查询参数 |
| `params.pageSize` | `pageSize` 查询参数 |
| 响应 `tableData` | 后端 `data.list` |
| 响应 `total` | 后端 `data.total` |

**参数转换：**

```javascript
const { getData } = useTable(getUserListAPI, {
  beforeFetch: (params) => {
    // 发送前转换参数
    if (params.dateRange) {
      params.startDate = params.dateRange[0]
      params.endDate = params.dateRange[1]
      delete params.dateRange
    }
    return params
  },
  afterFetch: (response) => {
    // 接收后转换响应
    return response
  },
})
```

### 6.2 useCrud — 完整 CRUD

`useCrud` 集成了 `useTable` + 新增/编辑/删除对话管理，适合标准管理页面。

**基本用法：**

```vue
<script setup>
import { useCrud } from '@/hooks/useCrud'
import {
  getUserListAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
  batchDeleteUsersAPI,
} from '@/api/system/user'

const {
  // 来自 useTable
  loading, tableData, total, page, limit, getData,
  // CRUD 扩展
  form, dialogVisible, submitLoading, selectedIds,
  handleAdd, handleEdit, handleSubmit, handleDelete,
  handleBatchDelete, handleSelectionChange,
} = useCrud(
  getUserListAPI,
  {
    create: createUserAPI,
    update: updateUserAPI,
    delete: deleteUserAPI,
    batchDelete: batchDeleteUsersAPI,  // 可选
  },
  {
    nameField: 'userName',  // 删除确认弹窗显示的字段
    formDefaults: { status: 1 },  // 表单默认值
  },
)
</script>

<template>
  <!-- 列表 -->
  <ProTable :data="tableData" :loading="loading" :total="total" />

  <!-- 新增/编辑对话框 -->
  <ProDialog v-model="dialogVisible">
    <el-form :model="form">
      <!-- 表单字段 -->
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button :loading="submitLoading" @click="handleSubmit(formRef)">确定</el-button>
    </template>
  </ProDialog>
</template>
```

**与后端 API 的映射：**

| 前端操作 | Hook 方法 | 后端 API |
|---|---|---|
| 页面加载 | `useTable(getListAPI)` | `GET /api/{module}/{resource}` |
| 点击新增 | `handleAdd()` → 打开空表单 | - |
| 提交新增 | `handleSubmit()` → `apiMap.create(form)` | `POST /api/{module}/{resource}` |
| 点击编辑 | `handleEdit(row)` → 填充表单 | - |
| 提交编辑 | `handleSubmit()` → `apiMap.update(form)` | `PATCH /api/{module}/{resource}` |
| 单条删除 | `handleDelete(row)` → `apiMap.delete(id)` | `DELETE /api/{module}/{resource}/{id}` |
| 批量删除 | `handleBatchDelete()` → `apiMap.batchDelete(ids)` | `DELETE /api/{module}/{resource}` body: `{ids}` |

**关键：新增/更新自动判断**

`handleSubmit` 通过 `form.value.id` 是否存在判断操作类型：

```javascript
// form 无 id → 新增
handleSubmit() → createAPI({ name: 'xxx', status: 1 })

// form 有 id → 更新
handleSubmit() → updateAPI({ id: '123', name: 'xxx', status: 1 })
```

**表单数据转换：**

```javascript
const { ... } = useCrud(getListAPI, apiMap, {
  // 编辑时，将行数据转换为表单格式
  formatFormData: (row) => ({
    ...row,
    deptId: row.dept?.id,  // 解构嵌套对象
  }),

  // 提交时，将表单数据转换为 API 请求格式
  formatSubmitData: (form) => ({
    ...form,
    dept: { id: form.deptId },  // 重构嵌套对象
  }),
})
```

### 6.3 useDict — 字典数据加载

`useDict` 从后端加载字典数据，用于下拉选择、标签展示等场景。

**基本用法：**

```vue
<script setup>
import { useDict } from '@/hooks/useDict'

const { dictData: statusDict, dictOptions: statusOptions } = useDict('sys_normal_disable')
</script>

<template>
  <!-- 下拉选择 -->
  <el-select v-model="form.status">
    <el-option
      v-for="item in statusOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>

  <!-- 标签展示 -->
  <DictTag :options="statusDict" :value="row.status" />
</template>
```

**与后端 API 的映射：**

| 前端 | 后端 |
|---|---|
| `useDict('sys_normal_disable')` | `GET /api/system/dict-data/type/sys_normal_disable` |
| `dictData` | 后端 `data: [{ dictLabel, dictValue, status }]` |
| `dictOptions` | 自动转换为 `[{ label, value, disabled }]` |

**批量加载字典：**

```vue
<script setup>
import { useDicts } from '@/hooks/useDict'

const { sys_normal_disableData, sys_user_sexData } = useDicts([
  'sys_normal_disable',
  'sys_user_sex',
])
</script>
```

**字典缓存：**

- 字典数据缓存在 Pinia store 中，5 分钟 TTL
- 使用 localStorage 持久化，页面刷新不重新加载
- 预加载常用字典：`sys_normal_disable`, `sys_user_sex`, `sys_menu_type`, `sys_yes_no`, `sys_action_type`

### 6.4 useForm — 独立表单

`useForm` 用于非 CRUD 场景的表单管理（如搜索表单、设置页面）。

```vue
<script setup>
import { useForm } from '@/hooks/useForm'

const { form, rules, validate, resetForm } = useForm({
  defaultValues: { keyword: '', status: undefined },
  rules: {
    keyword: [{ required: true, message: '请输入关键词' }],
  },
})
</script>
```

---

## 7. 认证流程

### 7.1 登录

```javascript
// 1. 获取验证码
const captcha = await getCaptchaAPI()
// → GET /api/auth/captcha → { img: 'data:image/svg+xml...', id: 'xxx' }

// 2. 提交登录
const token = await loginAPI({ userName, password, captchaId, captchaCode })
// → POST /api/auth/login → token 字符串

// 3. Token 自动存储到 useUserStore
userStore.setToken(token)
```

### 7.2 Token 管理

- 登录成功后 Token 存储在 Pinia `useUserStore`
- Axios 请求拦截器自动从 store 读取并设置 `Authorization: Bearer <token>`
- 401 响应时自动弹出登录过期提示，清除 Token，跳转登录页

### 7.3 获取用户信息

```javascript
// 登录后获取用户信息（菜单、角色、权限）
const userInfo = await getUserInfoAPI()
// → GET /api/auth/getUserInfo → { menus, roles, permissions, user }
```

---

## 8. 文件上传

文件上传使用 `multipart/form-data` 格式：

```javascript
export const uploadFileAPI = (data) => api.post('/file/upload', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
```

---

## 9. 常见问题

### Q: 为什么更新接口用 PATCH 而不是 PUT？

后端约定标准 CRUD 更新一律使用 `@Patch()`，ID 在请求体中。`@Put()` 仅保留给全量替换/导入/同步操作。前端需使用 `api.patch()` 而非 `api.put()`。

### Q: 如何处理嵌套对象的表单数据？

使用 `useCrud` 的 `formatFormData` 和 `formatSubmitData` 进行转换：

```javascript
// 后端返回嵌套对象 { dept: { id: 1, name: '技术部' } }
formatFormData: (row) => ({ ...row, deptId: row.dept?.id })

// 前端提交需要重构
formatSubmitData: (form) => ({ ...form, dept: { id: form.deptId } })
```

### Q: 分页参数为什么是 page/pageSize 而不是 offset/limit？

后端 `PaginationDto` 使用 `page`（页码）和 `pageSize`（每页数量），前端 `useTable` 已适配此约定。`page` 从 1 开始。

### Q: 生产环境如何配置 API 地址？

生产环境需要通过 Nginx 反向代理将 `/api` 路径转发到后端服务：

```nginx
location /api {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 相关文档

- [后端架构概览](../../base-server-nest/docs/architecture-overview.md)
- [后端认证权限使用指南](../../base-server-nest/docs/auth-guide.md)
- [后端缓存系统使用指南](../../base-server-nest/docs/cache-guide.md)
