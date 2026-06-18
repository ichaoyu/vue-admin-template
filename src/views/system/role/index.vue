<template>
  <div class="role-container">
    <!-- #region 表格 -->
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
      @selection-change="handleSelectionChange"
    >
      <template #toolbar-left>
        <el-input v-model="queryParams.roleName" placeholder="角色名称" clearable style="width: 200px" />
        <el-input v-model="queryParams.roleKey" placeholder="权限字符" clearable style="width: 200px" />
        <DictSelect
          v-model="queryParams.status"
          dict-type="sys_normal_disable"
          placeholder="角色状态"
          style="width: 120px"
        />
        <!-- 新增按钮：需要 system:role:add 权限 -->
        <el-button v-permission="['system:role:add']" type="primary" :icon="Plus" @click="handleAdd"> 新增 </el-button>
        <!-- 批量删除按钮 -->
        <el-button
          v-permission="['system:role:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <StatusSwitch v-model="row.status" :id="row.id" :api="updateRoleAPI" />
      </template>

      <!-- 操作 -->
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
        <ConfirmButton
          v-permission="['system:role:delete']"
          type="danger"
          size="small"
          link
          text="删除"
          :message="`确认要删除角色'${row.roleName}'吗？`"
          :on-confirm="() => handleDelete(row)"
          success-message="删除成功"
        />
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="750px"
      content-height="500px"
      :confirm-loading="submitLoading"
      @confirm="handleSubmit"
      @closed="handleDialogClosed"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色名称:" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限字符:" prop="roleKey">
              <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
              <div class="form-tip">
                <el-icon><InfoFilled /></el-icon>
                控制器中定义的权限字符，如：@RequiresRoles("")
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="显示顺序:" prop="roleSort">
              <el-input-number v-model="form.roleSort" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:" prop="status">
              <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <!-- 菜单权限 -->
        <el-form-item label="菜单权限:">
          <div class="menu-tree-container">
            <div class="tree-toolbar">
              <div class="toolbar-left">
                <el-checkbox v-model="treeExpandAll" @change="handleExpandAll">展开/折叠</el-checkbox>
                <el-checkbox v-model="treeCheckAll" @change="handleCheckAll">全选/全不选</el-checkbox>
                <el-checkbox v-model="treeCheckStrictly">父子联动</el-checkbox>
              </div>
              <div class="toolbar-right">
                <span class="stat-item"
                  >已选菜单：<el-tag type="success">{{ selectedMenuCount }}</el-tag></span
                >
                <span class="stat-item"
                  >已选权限：<el-tag type="primary">{{ selectedPermsCount }}</el-tag></span
                >
              </div>
            </div>
            <el-tree
              ref="treeRef"
              :data="menuTreeData"
              :props="treeProps"
              show-checkbox
              node-key="id"
              :default-expand-all="true"
              :check-strictly="!treeCheckStrictly"
              class="menu-tree"
              @check="handleTreeCheck"
            >
              <template #default="{ node, data }">
                <span class="tree-node">
                  <span class="node-label">{{ data.menuName }}</span>
                  <span v-if="data.perms" class="node-permission">
                    <el-tag size="small" type="info" effect="plain">{{ data.perms }}</el-tag>
                  </span>
                </span>
              </template>
            </el-tree>
            <div v-if="selectedNode" class="perms-quick-select">
              <div class="perms-select-title">快速选择权限类型：</div>
              <div class="perms-checkbox-group">
                <el-checkbox
                  v-for="perm in commonPerms"
                  :key="perm.value"
                  :label="perm.label"
                  :checked="hasPerm(selectedNode.perms, perm.value)"
                  @change="handlePermChange($event, selectedNode, perm.value)"
                />
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Plus, Edit, InfoFilled } from '@element-plus/icons-vue'
import { nextTick } from 'vue'
import { useTable } from '@/hooks'
import { getRoleListAPI, createRoleAPI, updateRoleAPI, deleteRoleAPI, batchDeleteRolesAPI, getRoleDetailAPI } from '@/api/role'
import { getMenuTreeAPI } from '@/api/menu'
import { formatDateTime } from '@/utils/date'
import { roleRules } from '@/utils/validator'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import ConfirmButton from '@/components/ConfirmButton/index.vue'

defineOptions({
  name: 'SystemRoleIndex',
})

// #region 表格数据

const { tableData, loading, total, queryParams, getData, handlePageChange, handleSizeChange, handleRefresh } = useTable(
  getRoleListAPI,
  {
    defaultParams: { roleName: '', roleKey: '', status: '' },
  }
)

const selectedIds = ref([])

// #endregion

// #region 表单数据

const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)
const treeRef = ref(null)
const menuTreeData = ref([])

// 树形配置
const treeProps = {
  children: 'children',
  label: 'menuName',
}
const treeExpandAll = ref(true)
const treeCheckAll = ref(false)
const treeCheckStrictly = ref(true)

// 当前选中的节点
const selectedNode = ref(null)

// 常用权限类型
const commonPerms = [
  { label: '查看', value: 'view' },
  { label: '新增', value: 'add' },
  { label: '修改', value: 'edit' },
  { label: '删除', value: 'delete' },
  { label: '导出', value: 'export' },
  { label: '导入', value: 'import' },
  { label: '审核', value: 'audit' },
  { label: '其他', value: 'other' },
]

// 表单数据
const form = ref({
  id: '',
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: 1,
  remark: '',
  menuIds: [],
})

const dialogTitle = computed(() => (form.value.id ? '修改角色' : '新增角色'))
const rules = roleRules

// 统计信息
const selectedMenuCount = computed(() => {
  const checkedKeys = treeRef.value?.getCheckedKeys(false) || []
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
  return checkedKeys.length + halfCheckedKeys.length
})

const selectedPermsCount = computed(() => {
  const checkedNodes = treeRef.value?.getCheckedNodes(false) || []
  const halfCheckedNodes = treeRef.value?.getHalfCheckedNodes() || []
  const allNodes = [...checkedNodes, ...halfCheckedNodes]
  let count = 0
  allNodes.forEach((node) => {
    if (node.perms) {
      const perms = node.perms.split(',')
      count += perms.length
    }
  })
  return count
})

// #endregion

// #region 菜单树操作

/**
 * 获取菜单树数据
 */
const loadMenuTree = async () => {
  try {
    const res = await getMenuTreeAPI()
    menuTreeData.value = res || []
  } catch (error) {
    console.error('获取菜单树失败:', error)
    menuTreeData.value = []
  }
}

/**
 * 展开/折叠所有节点
 */
const handleExpandAll = (val) => {
  const nodes = treeRef.value?.store?.nodesMap
  if (nodes) {
    Object.values(nodes).forEach((node) => {
      node.expanded = val
    })
  }
}

/**
 * 全选/全不选
 */
const handleCheckAll = (val) => {
  if (val) {
    treeRef.value?.setCheckedNodes(menuTreeData.value)
  } else {
    treeRef.value?.setCheckedKeys([])
  }
}

/**
 * 获取选中的菜单 ID 列表
 */
const getCheckedMenuIds = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys(false) || []
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
  return [...checkedKeys, ...halfCheckedKeys]
}

/**
 * 树节点选中事件处理
 */
const handleTreeCheck = (data, checked) => {
  selectedNode.value = data
}

/**
 * 判断是否包含某个权限
 */
const hasPerm = (perms, permValue) => {
  if (!perms) return false
  return perms.includes(permValue)
}

/**
 * 权限变更处理
 */
const handlePermChange = (checked, node, permValue) => {
  if (!node.perms) {
    node.perms = permValue
  } else {
    const perms = node.perms.split(',')
    if (checked) {
      if (!perms.includes(permValue)) {
        perms.push(permValue)
      }
    } else {
      const index = perms.indexOf(permValue)
      if (index > -1) {
        perms.splice(index, 1)
      }
    }
    node.perms = perms.filter((p) => p.trim()).join(',')
  }
}

// #endregion

// #region 新增/编辑

/**
 * 重置表单
 */
const resetForm = () => {
  form.value = {
    id: '',
    roleName: '',
    roleKey: '',
    roleSort: 0,
    status: 1,
    remark: '',
    menuIds: [],
  }
  treeCheckAll.value = false
  treeCheckStrictly.value = true
  treeExpandAll.value = true
  selectedNode.value = null
}

/**
 * 新增角色
 */
const handleAdd = () => {
  resetForm()
  loadMenuTree()
  dialogVisible.value = true
}

/**
 * 编辑角色
 * @param {Object} row - 行数据
 */
const handleEdit = async (row) => {
  resetForm()
  submitLoading.value = true
  try {
    // 先加载菜单树
    await loadMenuTree()

    // 再加载角色详情
    const detailRes = await getRoleDetailAPI(row.id)

    // 判断是否是超级管理员（权限为 *:*:* 或角色标识为 admin）
    const isAdmin =
      detailRes.roleKey === 'admin' ||
      (detailRes.permissions && (detailRes.permissions.includes('*:*:*') || detailRes.permissions.includes('*')))

    let menuIds = []
    if (isAdmin) {
      // 超级管理员，获取所有菜单的id
      const getAllMenuIds = (menus) => {
        let ids = []
        menus.forEach((menu) => {
          ids.push(menu.id)
          if (menu.children && menu.children.length > 0) {
            ids = ids.concat(getAllMenuIds(menu.children))
          }
        })
        return ids
      }
      menuIds = getAllMenuIds(menuTreeData.value)
    } else {
      // 普通角色，使用返回的菜单id
      menuIds = detailRes.menus?.map((item) => item.id) || []
    }

    // 填充表单数据
    form.value = {
      id: detailRes.id,
      roleName: detailRes.roleName,
      roleKey: detailRes.roleKey,
      roleSort: detailRes.roleSort || 0,
      status: detailRes.status || 0,
      remark: detailRes.remark || '',
      menuIds,
    }
    dialogVisible.value = true

    // 等待 DOM 更新后设置树的勾选状态
    await nextTick()

    // 确保树已经渲染完成
    if (treeRef.value && form.value.menuIds && form.value.menuIds.length > 0) {
      setTimeout(() => {
        treeRef.value.setCheckedKeys(form.value.menuIds)
      }, 300)
    }
  } catch (error) {
    console.error('获取角色详情失败:', error)
    ElMessage.error('获取角色详情失败')
  } finally {
    submitLoading.value = false
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      const menuIds = getCheckedMenuIds()

      // 将 menuIds 添加到表单数据中
      const submitData = {
        ...form.value,
        menuIds: menuIds,
      }

      if (form.value.id) {
        // 编辑：更新角色（包含 menuIds）
        await updateRoleAPI(form.value.id, submitData)
        ElMessage.success('修改成功')
      } else {
        // 新增：创建角色（包含 menuIds）
        await createRoleAPI(submitData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      getData()
    } catch (error) {
      console.error('提交失败:', error)
      ElMessage.error(error.response?.data?.message || '操作失败')
    } finally {
      submitLoading.value = false
    }
  })
}

/**
 * 弹窗关闭时重置
 */
const handleDialogClosed = () => {
  resetForm()
  formRef.value?.resetFields()
}

// #endregion

// #region 删除

/**
 * 删除角色
 * @param {Object} row - 行数据
 */
const handleDelete = async (row) => {
  await deleteRoleAPI(row.id)
  getData()
}

/**
 * 批量删除角色
 */
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的角色')
    return
  }
  ElMessageBox.confirm(`确认要删除选中的 ${selectedIds.value.length} 个角色吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await batchDeleteRolesAPI(selectedIds.value)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      console.error('批量删除失败:', error)
    }
  })
}

// #endregion

// #region 列配置

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'roleName', label: '角色名称', minWidth: 150 },
  { prop: 'roleKey', label: '权限字符', minWidth: 150 },
  { prop: 'roleSort', label: '显示顺序', width: 100, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  {
    prop: 'createTime',
    label: '创建时间',
    minWidth: 180,
    formatter: (row) => formatDateTime(row.createTime),
  },
  {
    prop: 'operation',
    label: '操作',
    width: 180,
    align: 'center',
    fixed: 'right',
    slot: 'operation',
  },
]

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map((item) => item.id)
}

// #endregion
</script>

<style scoped>
.role-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

/* 表单提示文字 */
.form-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

/* 菜单权限区域 */
.menu-tree-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.tree-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 10px;
}

.toolbar-left {
  display: flex;
  gap: 20px;
}

.toolbar-right {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.menu-tree {
  width: 100%;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.node-label {
  flex: 1;
}

.node-permission {
  margin-left: 8px;
}

/* 权限快速选择区域 */
.perms-quick-select {
  margin-top: 12px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
}

.perms-select-title {
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.perms-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.perms-checkbox-group .el-checkbox {
  margin-right: 0;
}
</style>
