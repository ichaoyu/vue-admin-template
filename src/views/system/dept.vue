<template>
  <div class="dept-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="filteredDeptList"
      :columns="columns"
      :loading="loading"
      :show-pagination="false"
      :default-expand-all="expandedAll"
      :key="tableKey"
      row-key="id"
      :tree-props="{ children: 'children' }"
      @refresh="handleRefresh"
    >
      <template #toolbar-left>
        <el-input
          v-model="searchForm.deptName"
          placeholder="搜索部门名称"
          clearable
          :prefix-icon="Search"
          style="width: 200px"
        />
        <DictSelect
          v-model="searchForm.status"
          dict-type="sys_normal_disable"
          placeholder="部门状态"
          clearable
          style="width: 120px"
        />
        <el-button type="primary" :icon="Plus" @click="handleAdd()">新增</el-button>
        <el-button :icon="Expand" @click="toggleExpand">{{ expandedAll ? '折叠' : '展开' }}</el-button>
      </template>

      <template #deptName="{ row }">
        <span>{{ row.deptName }}</span>
      </template>

      <template #status="{ row }">
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="handleStatusChange(row)" />
      </template>

      <template #operation="{ row }">
        <el-button type="primary" size="small" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
        <el-button type="success" size="small" link :icon="Plus" @click="handleAdd(row)">新增</el-button>
        <el-button type="danger" size="small" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
      </template>
    </pro-table>
    <!-- #endregion -->

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      content-height="400px"
      :confirm-loading="submitLoading"
      @confirm="onSubmit"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="上级部门:" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="deptTreeSelect"
            :props="{ value: 'id', label: 'deptName', children: 'children' }"
            placeholder="请选择上级部门"
            clearable
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="部门名称:" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门名称" clearable />
        </el-form-item>
        <el-form-item label="显示排序:" prop="orderNum">
          <el-input-number v-model="form.orderNum" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="负责人:" prop="leader">
          <el-input v-model="form.leader" placeholder="请输入负责人" clearable />
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" clearable />
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <DictSelect v-model="form.status" dict-type="sys_normal_disable" style="width: 100%" />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Search, Expand } from '@element-plus/icons-vue'
import { useTable } from '@/hooks'
import { getDeptTreeAPI, createDeptAPI, updateDeptAPI, deleteDeptAPI } from '@/api/dept'
import { formatDateTime } from '@/utils/date'
import { filterTree } from '@/utils/common'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'

defineOptions({
  name: 'SystemDeptIndex',
})

// #region 数据定义

const tableRef = ref(null)
const tableKey = ref(0)
const expandedAll = ref(true)

const searchForm = reactive({
  deptName: '',
  status: '',
})

const dialogVisible = ref(false)
const dialogTitle = computed(() => (form.value.id ? '编辑部门' : '新增部门'))
const submitLoading = ref(false)
const formRef = ref(null)

const formDefaults = {
  id: '',
  parentId: '0',
  deptName: '',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: 1,
}

const form = ref({ ...formDefaults })

const rules = {
  deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
  orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
}

const columns = [
  { prop: 'deptName', label: '部门名称', minWidth: 200, slot: 'deptName' },
  { prop: 'orderNum', label: '排序', width: 100, align: 'center' },
  { prop: 'leader', label: '负责人', minWidth: 120 },
  { prop: 'phone', label: '联系电话', minWidth: 140 },
  { prop: 'email', label: '邮箱', minWidth: 180 },
  { prop: 'status', label: '状态', width: 100, align: 'center', slot: 'status' },
  { prop: 'createTime', label: '创建时间', minWidth: 180, formatter: (row) => formatDateTime(row.createTime) },
  { prop: 'operation', label: '操作', width: 220, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 数据获取

const {
  tableData: deptList,
  loading,
  getData,
} = useTable(getDeptTreeAPI, {
  immediate: true,
  afterFetch: (res) => {
    // 树形数据不分页，直接返回数组
    return { list: res || [], total: 0 }
  },
})

const deptTreeSelect = computed(() => {
  return [{ id: '0', deptName: '主部门', children: deptList.value }]
})

const filteredDeptList = computed(() => {
  let result = deptList.value

  if (searchForm.deptName) {
    const filterName = searchForm.deptName.toLowerCase()
    result = filterTree(result, (dept) => dept.deptName.toLowerCase().includes(filterName))
  }

  if (searchForm.status) {
    result = filterTree(result, (dept) => dept.status === searchForm.status)
  }

  return result
})

const handleRefresh = () => {
  getData()
}

// #endregion

// #region 新增/编辑

const handleAdd = (row = null) => {
  form.value = { ...formDefaults }
  if (row) {
    form.value.parentId = row.id
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  form.value = {
    id: row.id,
    parentId: row.parentId || '0',
    deptName: row.deptName,
    orderNum: row.orderNum || 0,
    leader: row.leader || '',
    phone: row.phone || '',
    email: row.email || '',
    status: row.status || 0,
  }
  dialogVisible.value = true
}

const onSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  try {
    if (form.value.id) {
      await updateDeptAPI({ ...form.value })
      ElMessage.success('修改成功')
    } else {
      await createDeptAPI(form.value)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getData()
  } catch (error) {
    // 错误由 axios 拦截器处理
  } finally {
    submitLoading.value = false
  }
}

// #endregion

// #region 删除

const handleDelete = (row) => {
  if (row.children && row.children.length > 0) {
    ElMessage.warning('存在子部门，不能删除')
    return
  }
  ElMessageBox.confirm(`确认要删除部门"${row.deptName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteDeptAPI(row.id)
      ElMessage.success('删除成功')
      getData()
    } catch (error) {
      // 错误由 axios 拦截器处理
    }
  })
}

// #endregion

// #region 状态切换

const handleStatusChange = async (row) => {
  const deptId = row.id || row.deptId
  if (!deptId) {
    row.status = row.status === 0 ? 1 : 0
    return
  }
  try {
    await updateDeptAPI({ id: deptId, status: row.status })
    ElMessage.success('状态更新成功')
  } catch (error) {
    row.status = row.status === 0 ? 1 : 0
  }
}

// #endregion

// #region 展开/折叠

const toggleExpand = () => {
  expandedAll.value = !expandedAll.value
  tableKey.value++
}

// #endregion
</script>

<style scoped>
.dept-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
</style>
