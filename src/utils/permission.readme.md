# 权限系统说明

## 问题现象
超级管理员（admin 账号）登录后，很多操作按钮没有显示。

## 根本原因
权限判断逻辑中，没有对超级管理员角色进行特殊处理，导致即使 admin 账号拥有所有权限，也需要后端返回具体的权限列表才能显示按钮。

## 解决方案

### 1. 超级管理员自动拥有所有权限
已修改以下三个文件，添加超级管理员自动授权逻辑：

#### `src/utils/permission.js`
```javascript
// 超级管理员角色标识
const SUPER_ADMIN_ROLE = 'admin'

export const hasPermission = (permission) => {
  const userStore = useUserStore()
  const roles = userStore.roles || []
  
  // 超级管理员自动拥有所有权限
  if (roles.includes(SUPER_ADMIN_ROLE)) {
    return true
  }
  
  // 普通用户继续原有权限判断逻辑
  const permissions = userStore.permissions || []
  // ... 原有逻辑
}
```

#### `src/directives/permission.js`
```javascript
// 超级管理员角色标识
const SUPER_ADMIN_ROLE = 'admin'

export const permission = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const roles = userStore.roles || []
    
    // 超级管理员自动拥有所有权限，直接返回不隐藏元素
    if (roles.includes(SUPER_ADMIN_ROLE)) {
      return
    }
    
    // 普通用户继续原有权限判断逻辑
    // ... 原有逻辑
  }
}
```

#### `src/components/Permission/index.vue`
```vue
<script setup>
// 超级管理员角色标识
const SUPER_ADMIN_ROLE = 'admin'

const hasPermission = computed(() => {
  const roles = userStore.roles || []
  
  // 超级管理员自动拥有所有权限
  if (roles.includes(SUPER_ADMIN_ROLE)) {
    return true
  }
  
  // 普通用户继续原有权限判断逻辑
  // ... 原有逻辑
})
</script>
```

## 权限标识说明

### 菜单权限（perms 字段）
数据库 `sys_menu` 表中的 `perms` 字段定义了权限标识：

```sql
-- 菜单权限示例
INSERT INTO `sys_menu` VALUES (100, '用户管理', ..., 'system:user:list', ...);
INSERT INTO `sys_menu` VALUES (101, '角色管理', ..., 'system:role:list', ...);

-- 按钮权限示例
INSERT INTO `sys_menu` VALUES (1001, '用户新增', ..., 'system:user:add', ...);
INSERT INTO `sys_menu` VALUES (1002, '用户修改', ..., 'system:user:edit', ...);
INSERT INTO `sys_menu` VALUES (1003, '用户删除', ..., 'system:user:remove', ...);
```

### 常见权限标识

#### 用户管理
- `system:user:list` - 查看用户列表
- `system:user:add` - 新增用户
- `system:user:edit` - 修改用户
- `system:user:remove` - 删除用户
- `system:user:resetPwd` - 重置密码
- `system:user:forceOffline` - 强制下线

#### 角色管理
- `system:role:list` - 查看角色列表
- `system:role:add` - 新增角色
- `system:role:edit` - 修改角色
- `system:role:remove` - 删除角色

#### 菜单管理
- `system:menu:list` - 查看菜单列表
- `system:menu:add` - 新增菜单
- `system:menu:edit` - 修改菜单
- `system:menu:remove` - 删除菜单

## 使用示例

### 1. v-permission 指令（推荐）
```vue
<template>
  <!-- 单个权限 -->
  <el-button v-permission="['system:user:add']">新增</el-button>
  
  <!-- 多个权限（满足任一即可） -->
  <el-button v-permission="['system:user:edit', 'system:user:delete']">操作</el-button>
</template>
```

### 2. Permission 组件
```vue
<template>
  <Permission perms="['system:user:add']">
    <el-button>新增</el-button>
  </Permission>
</template>

<script setup>
import Permission from '@/components/Permission/index.vue'
</script>
```

### 3. 工具函数
```vue
<template>
  <el-button v-if="hasPermission('system:user:add')">新增</el-button>
</template>

<script setup>
import { hasPermission } from '@/utils/permission'
</script>
```

## 权限判断流程

```
用户请求页面
    ↓
获取用户信息（包含 roles 和 permissions）
    ↓
判断是否为超级管理员（role === 'admin'）
    ↓
是 → 显示所有按钮（自动拥有全部权限）
否 → 根据 permissions 数组判断具体权限
```

## 验证方法

1. 使用 admin 账号登录
2. 访问用户管理、角色管理、菜单管理等页面
3. 检查新增、编辑、删除等操作按钮是否正常显示
4. 打开浏览器控制台，查看用户信息：
   ```javascript
   // 在控制台执行
   console.log(window.__VUE_DEVTOOLS_GLOBAL_HOOK__)
   // 或通过 Vue Devtools 查看 userStore 中的 roles 和 permissions
   ```

## 注意事项

1. **超级管理员角色标识**：默认为 `admin`，如果后端返回的角色标识不同，需要修改 `SUPER_ADMIN_ROLE` 常量
2. **权限标识格式**：统一使用 `模块：功能：操作` 格式，如 `system:user:add`
3. **后端配合**：确保后端返回的用户信息中包含正确的 `roles` 数组

## 相关文件

- 权限工具函数：[`src/utils/permission.js`](file://d:\_code\project\_template\vue-admin\src\utils\permission.js)
- 权限指令：[`src/directives/permission.js`](file://d:\_code\project\_template\vue-admin\src\directives\permission.js)
- 权限组件：[`src/components/Permission/index.vue`](file://d:\_code\project\_template\vue-admin\src\components\Permission\index.vue)
- 用户 Store：[`src/store/user.js`](file://d:\_code\project\_template\vue-admin\src\store\user.js)
