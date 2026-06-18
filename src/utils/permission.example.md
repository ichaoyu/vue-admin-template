# 权限使用示例文档

本文档介绍如何在 Vue Admin 项目中使用权限控制功能。

## 目录

- [权限控制方式](#权限控制方式)
- [v-permission 指令](#v-permission-指令)
- [Permission 组件](#permission-组件)
- [hasPermission/hasRole 工具函数](#haspermissionhasrole-工具函数)
- [实际示例](#实际示例)

---

## 权限控制方式

本项目提供三种权限控制方式：

| 方式 | 适用场景 | 说明 |
|------|----------|------|
| `v-permission` 指令 | 按钮级别权限控制 | 用于控制按钮、操作链接等元素的显示/隐藏 |
| `Permission` 组件 | 区块级别权限控制 | 用于控制整个区块内容的显示/隐藏 |
| `hasPermission`/`hasRole` 工具函数 | 编程式权限判断 | 用于在 JavaScript 代码中进行权限判断 |

---

## v-permission 指令

### 用法

`v-permission` 是一个自定义指令，用于根据用户权限控制元素的显示。当用户没有相应权限时，元素会被从 DOM 中移除。

### 语法

```vue
<!-- 单个权限 -->
<el-button v-permission="['system:user:add']">新增</el-button>

<!-- 多个权限（满足任一即可） -->
<el-button v-permission="['system:user:add', 'system:user:edit']">操作</el-button>
```

### 参数说明

- 权限值：字符串或字符串数组，对应后端返回的权限标识（perms）
- 支持单个权限或多个权限（数组形式，满足任一即可显示）

### 示例

```vue
<template>
  <div>
    <!-- 新增按钮：需要 system:user:add 权限 -->
    <el-button v-permission="['system:user:add']" type="primary" @click="handleAdd">
      新增
    </el-button>
    
    <!-- 编辑按钮：需要 system:user:edit 权限 -->
    <el-button v-permission="['system:user:edit']" type="primary" @click="handleEdit">
      编辑
    </el-button>
    
    <!-- 删除按钮：需要 system:user:delete 权限 -->
    <el-button v-permission="['system:user:delete']" type="danger" @click="handleDelete">
      删除
    </el-button>
    
    <!-- 导出按钮：需要 system:user:export 权限 -->
    <el-button v-permission="['system:user:export']" type="success" @click="handleExport">
      导出
    </el-button>
  </div>
</template>
```

---

## Permission 组件

### 用法

`Permission` 组件用于控制整个区块内容的显示/隐藏。当用户没有相应权限时，组件内的内容不会渲染。

### 语法

```vue
<!-- 单个权限 -->
<permission perms="system:user:add">
  <el-button type="primary">新增</el-button>
</permission>

<!-- 多个权限（满足任一即可） -->
<permission perms="['system:user:add', 'system:user:edit']">
  <el-button type="primary">操作</el-button>
</permission>
```

### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| perms | String / Array | '' | 权限标识，支持单个或数组 |

### 示例

```vue
<template>
  <div>
    <!-- 整个操作区域：需要 system:user:manage 权限 -->
    <permission perms="system:user:manage">
      <div class="operation-area">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </permission>
    
    <!-- 导入导出区域：需要 system:user:import 或 system:user:export 权限 -->
    <permission perms="['system:user:import', 'system:user:export']">
      <div class="import-export-area">
        <el-button type="success" @click="handleImport">导入</el-button>
        <el-button type="success" @click="handleExport">导出</el-button>
      </div>
    </permission>
  </div>
</template>

<script setup>
import Permission from '@/components/Permission/index.vue'
</script>
```

---

## hasPermission/hasRole 工具函数

### 用法

在 JavaScript 代码中进行权限判断，适用于复杂的业务逻辑场景。

### 导入方式

```javascript
// 方式一：按需导入
import { hasPermission, hasRole } from '@/utils/permission'

// 方式二：导入整个对象
import permissionUtils from '@/utils/permission'
```

### API 说明

#### hasPermission(permission)

判断用户是否拥有指定权限。

**参数：**
- `permission`: String / Array - 权限标识

**返回值：** Boolean

**示例：**
```javascript
import { hasPermission } from '@/utils/permission'

// 单个权限判断
if (hasPermission('system:user:add')) {
  // 用户有新增权限
  handleAdd()
}

// 多个权限判断（满足任一）
if (hasPermission(['system:user:add', 'system:user:edit'])) {
  // 用户有新增或编辑权限
  handleOperation()
}
```

#### hasRole(role)

判断用户是否拥有指定角色。

**参数：**
- `role`: String / Array - 角色标识

**返回值：** Boolean

**示例：**
```javascript
import { hasRole } from '@/utils/permission'

// 单个角色判断
if (hasRole('admin')) {
  // 用户是管理员
  handleAdminOperation()
}

// 多个角色判断（满足任一）
if (hasRole(['admin', 'super_admin'])) {
  // 用户是管理员或超级管理员
  handleSpecialOperation()
}
```

### 组合使用示例

```javascript
import { hasPermission, hasRole } from '@/utils/permission'

// 同时判断权限和角色
const canDelete = hasPermission('system:user:delete') && hasRole('admin')

if (canDelete) {
  handleDelete()
}

// 复杂权限判断
const canExport = hasPermission(['system:user:export', 'system:dept:export'])

if (canExport) {
  handleExport()
}
```

---

## 实际示例

### 用户管理页面示例

```vue
<template>
  <div class="user-container">
    <pro-table>
      <!-- 工具栏 -->
      <template #toolbar-left>
        <!-- 新增按钮：需要 system:user:add 权限 -->
        <el-button v-permission="['system:user:add']" type="primary" :icon="Plus" @click="handleAdd">
          新增
        </el-button>
      </template>
      
      <!-- 操作列 -->
      <template #operation="{ row }">
        <!-- 编辑按钮：需要 system:user:edit 权限 -->
        <el-button
          v-permission="['system:user:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="handleEdit(row)"
        >
          编辑
        </el-button>
        
        <!-- 删除按钮：需要 system:user:delete 权限 -->
        <el-button
          v-permission="['system:user:delete']"
          type="danger"
          size="small"
          link
          :icon="Delete"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
        
        <!-- 重置密码按钮：需要 system:user:resetPwd 权限 -->
        <el-button
          v-permission="['system:user:resetPwd']"
          type="warning"
          size="small"
          link
          :icon="Key"
          @click="handleResetPassword(row)"
        >
          重置密码
        </el-button>
      </template>
    </pro-table>
  </div>
</template>

<script setup>
import { Plus, Edit, Delete, Key } from '@element-plus/icons-vue'
import ProTable from '@/components/Table/index.vue'
</script>
```

### 角色管理页面示例

```vue
<template>
  <div class="role-container">
    <pro-table>
      <!-- 工具栏 -->
      <template #toolbar-left>
        <!-- 新增按钮：需要 system:role:add 权限 -->
        <el-button v-permission="['system:role:add']" type="primary" :icon="Plus" @click="handleAdd">
          新增
        </el-button>
      </template>
      
      <!-- 操作列 -->
      <template #operation="{ row }">
        <!-- 编辑按钮：需要 system:role:edit 权限 -->
        <el-button
          v-permission="['system:role:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="handleEdit(row)"
        >
          编辑
        </el-button>
        
        <!-- 删除按钮：需要 system:role:delete 权限 -->
        <el-button
          v-permission="['system:role:delete']"
          type="danger"
          size="small"
          link
          :icon="Delete"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
      </template>
    </pro-table>
  </div>
</template>

<script setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import ProTable from '@/components/Table/index.vue'
</script>
```

### 菜单管理页面示例

```vue
<template>
  <div class="menu-container">
    <pro-table>
      <!-- 工具栏 -->
      <template #toolbar-left>
        <!-- 新增按钮：需要 system:menu:add 权限 -->
        <el-button v-permission="['system:menu:add']" :icon="Plus" type="primary" @click="handleAdd">
          新增
        </el-button>
      </template>
      
      <!-- 操作列 -->
      <template #operation="{ row }">
        <!-- 编辑按钮：需要 system:menu:edit 权限 -->
        <el-button
          v-permission="['system:menu:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="handleEdit(row)"
        >
          编辑
        </el-button>
        
        <!-- 新增子菜单按钮：需要 system:menu:add 权限 -->
        <el-button
          v-permission="['system:menu:add']"
          type="success"
          size="small"
          link
          :icon="Plus"
          @click="handleAdd(row)"
        >
          新增
        </el-button>
        
        <!-- 删除按钮：需要 system:menu:delete 权限 -->
        <el-button
          v-permission="['system:menu:delete']"
          type="danger"
          size="small"
          link
          :icon="Delete"
          @click="handleDelete(row)"
        >
          删除
        </el-button>
      </template>
    </pro-table>
  </div>
</template>

<script setup>
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import ProTable from '@/components/Table/index.vue'
</script>
```

### 编程式权限判断示例

```vue
<template>
  <div>
    <el-button @click="handleSpecialOperation">特殊操作</el-button>
  </div>
</template>

<script setup>
import { hasPermission, hasRole } from '@/utils/permission'
import { ElMessage } from 'element-plus'

// 使用工具函数进行权限判断
const handleSpecialOperation = () => {
  // 判断是否有特殊操作权限
  if (!hasPermission('system:user:special')) {
    ElMessage.error('没有操作权限')
    return
  }
  
  // 判断是否是管理员
  if (!hasRole(['admin', 'super_admin'])) {
    ElMessage.error('只有管理员才能执行此操作')
    return
  }
  
  // 执行特殊操作
  doSpecialOperation()
}

// 在计算属性中使用
const canDelete = computed(() => {
  return hasPermission('system:user:delete')
})

// 在方法中使用
const checkPermission = () => {
  if (hasPermission(['system:user:add', 'system:user:edit'])) {
    console.log('用户有新增或编辑权限')
  }
}
</script>
```

---

## 最佳实践

### 1. 权限命名规范

权限标识建议使用以下格式：`模块：资源：操作`

```
system:user:add      # 系统模块 - 用户资源 - 新增操作
system:user:edit     # 系统模块 - 用户资源 - 编辑操作
system:user:delete   # 系统模块 - 用户资源 - 删除操作
system:user:export   # 系统模块 - 用户资源 - 导出操作
system:menu:list     # 系统模块 - 菜单资源 - 列表操作
```

### 2. 选择合适的权限控制方式

- **按钮级别**：使用 `v-permission` 指令
- **区块级别**：使用 `Permission` 组件
- **逻辑判断**：使用 `hasPermission`/`hasRole` 工具函数

### 3. 避免常见错误

```vue
<!-- ❌ 错误：权限值使用变量时未正确绑定 -->
<el-button v-permission="permissionValue">按钮</el-button>

<!-- ✅ 正确：使用数组包裹 -->
<el-button v-permission="[permissionValue]">按钮</el-button>

<!-- ❌ 错误：空数组导致权限始终显示 -->
<el-button v-permission="[]">按钮</el-button>

<!-- ✅ 正确：确保权限值有效 -->
<el-button v-permission="['system:user:add']">按钮</el-button>
```

### 4. 性能优化

```vue
<!-- ❌ 不推荐：在模板中频繁调用函数 -->
<template>
  <div v-if="hasPermission('system:user:add')">
    <el-button>新增</el-button>
  </div>
</template>

<!-- ✅ 推荐：使用计算属性 -->
<script setup>
import { computed } from 'vue'
import { hasPermission } from '@/utils/permission'

const canAdd = computed(() => hasPermission('system:user:add'))
</script>

<template>
  <div v-if="canAdd">
    <el-button>新增</el-button>
  </div>
</template>
```

---

## 常见问题

### Q1: 权限数据从哪里来？

权限数据来自后端接口，在用户登录成功后通过 `getUserInfo` 接口获取，存储在 Pinia 的 `userStore` 中。

### Q2: 如何查看当前用户的权限？

可以在浏览器控制台执行以下代码：

```javascript
// 查看当前用户的所有权限
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
console.log('权限列表:', userStore.permissions)
console.log('角色列表:', userStore.roles)
```

### Q3: 权限不生效怎么办？

1. 检查后端返回的权限标识是否正确
2. 检查前端使用的权限标识是否与后端一致
3. 检查用户是否已登录并获取到权限信息
4. 检查权限指令是否正确注册

### Q4: 如何实现动态权限？

对于需要动态判断的权限，建议使用 `hasPermission` 工具函数，可以在运行时根据业务逻辑进行权限判断。

---

## 相关文件

- 权限指令：`src/directives/permission.js`
- Permission 组件：`src/components/Permission/index.vue`
- 权限工具函数：`src/utils/permission.js`
- 用户 Store：`src/store/user.js`

---

## 更新记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-04-16 | v1.0.0 | 初始版本 |
