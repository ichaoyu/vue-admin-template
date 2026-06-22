<template>
  <div class="role-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :total="total"
      v-model:page="page"
      v-model:limit="limit"
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
        <el-button v-permission="['system:role:add']" type="primary" :icon="Plus" @click="onAdd">新增</el-button>
        <el-button
          v-permission="['system:role:delete']"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除(已选{{ selectedIds.length }}项)
        </el-button>
      </template>

      <template #status="{ row }">
        <StatusSwitch v-model="row.status" :id="row.id" :api="updateRoleAPI" />
      </template>

      <template #operation="{ row }">
        <el-button
          v-permission="['system:role:edit']"
          type="primary"
          size="small"
          link
          :icon="Edit"
          @click="onEdit(row)"
          >编辑</el-button
        >
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
      @confirm="onSubmit"
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
import { Plus, Edit, InfoFilled } from '@element-plus/icons-vue'
import { nextTick } from 'vue'
import { useCrud } from '@/hooks'
import {
  getRoleListAPI,
  createRoleAPI,
  updateRoleAPI,
  deleteRoleAPI,
  batchDeleteRolesAPI,
  getRoleDetailAPI,
} from '@/api/role'
import { getMenuTreeAPI } from '@/api/menu'
import { formatDateTime } from '@/utils/date'
import { roleRules } from '@/utils/validator'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import StatusSwitch from '@/components/StatusSwitch/index.vue'
import ConfirmButton from '@/components/ConfirmButton/index.vue'

defineOptions({
  name: 'SystemRoleIndex',
})

// #region 数据定义

const formRef = ref(null)
const treeRef = ref(null)
const menuTreeData = ref([])

const formDefaults = {
  id: '',
  roleName: '',
  roleKey: '',
  roleSort: 0,
  status: 1,
  remark: '',
  menuIds: [],
}

const {
  tableData,
  loading,
  total,
  queryParams,
  page,
  limit,
  getData,
  handlePageChange,
  handleSizeChange,
  handleRefresh,
  form,
  dialogVisible,
  submitLoading,
  selectedIds,
  resetForm,
  handleAdd,
  handleEdit,
  handleSubmit,
  handleDelete,
  handleSelectionChange,
  handleBatchDelete,
} = useCrud(
  getRoleListAPI,
  { create: createRoleAPI, update: updateRoleAPI, delete: deleteRoleAPI, batchDelete: batchDeleteRolesAPI },
  {
    nameField: 'roleName',
    formDefaults,
    defaultParams: { roleName: '', roleKey: '', status: '' },
    formatSubmitData: (formData) => ({
      ...formData,
      menuIds: getCheckedMenuIds(),
    }),
  }
)

const dialogTitle = computed(() => (form.value.id ? '修改角色' : '新增角色'))
const rules = roleRules

// 树形配置
const treeProps = { children: 'children', label: 'menuName' }
const treeExpandAll = ref(true)
const treeCheckAll = ref(false)
const treeCheckStrictly = ref(true)
const selectedNode = ref(null)

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
      count += node.perms.split(',').length
    }
  })
  return count
})

const columns = [
  { type: 'selection', width: 55, align: 'center' },
  { prop: 'roleName', label: '角色名称', minWidth: 150 },
  { prop: 'roleKey', label: '权限字符', minWidth: 150 },
  { prop: 'roleSort', label: '显示顺序', width: 100, align: 'center' },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 180, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 菜单树操作

const loadMenuTree = async () => {
  try {
    const res = await getMenuTreeAPI()
    menuTreeData.value = res || []
  } catch (error) {
    menuTreeData.value = []
  }
}

const handleExpandAll = (val) => {
  const nodes = treeRef.value?.store?.nodesMap
  if (nodes) {
    Object.values(nodes).forEach((node) => {
      node.expanded = val
    })
  }
}

const handleCheckAll = (val) => {
  if (val) {
    treeRef.value?.setCheckedNodes(menuTreeData.value)
  } else {
    treeRef.value?.setCheckedKeys([])
  }
}

const getCheckedMenuIds = () => {
  const checkedKeys = treeRef.value?.getCheckedKeys(false) || []
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys() || []
  return [...checkedKeys, ...halfCheckedKeys]
}

const handleTreeCheck = (data) => {
  selectedNode.value = data
}

const hasPerm = (perms, permValue) => {
  if (!perms) return false
  return perms.includes(permValue)
}

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

const onAdd = () => {
  handleAdd()
  treeCheckAll.value = false
  treeCheckStrictly.value = true
  treeExpandAll.value = true
  selectedNode.value = null
  loadMenuTree()
}

const onEdit = async (row) => {
  submitLoading.value = true
  try {
    await loadMenuTree()
    const detailRes = await getRoleDetailAPI(row.id)

    const isAdmin =
      detailRes.roleKey === 'admin' ||
      (detailRes.permissions && (detailRes.permissions.includes('*:*:*') || detailRes.permissions.includes('*')))

    let menuIds = []
    if (isAdmin) {
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
      menuIds = detailRes.menus?.map((item) => item.id) || []
    }

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

    await nextTick()
    if (treeRef.value && form.value.menuIds && form.value.menuIds.length > 0) {
      setTimeout(() => {
        treeRef.value.setCheckedKeys(form.value.menuIds)
      }, 300)
    }
  } catch (error) {
    // 错误由 axios 拦截器处理
  } finally {
    submitLoading.value = false
  }
}

const onSubmit = () => {
  handleSubmit(formRef.value)
}

const handleDialogClosed = () => {
  resetForm()
  treeCheckAll.value = false
  treeCheckStrictly.value = true
  treeExpandAll.value = true
  selectedNode.value = null
  formRef.value?.resetFields()
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

.form-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.4;
}

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
