<template>
  <div class="menu-container">
    <!-- #region 表格 -->
    <pro-table
      ref="tableRef"
      :data="filteredMenuList"
      :columns="columns"
      :loading="loading"
      :show-pagination="false"
      :default-expand-all="expandedAll"
      :key="tableKey"
      :default-sort="{ prop: 'orderNum', order: 'ascending' }"
      row-key="id"
      :tree-props="{ children: 'children' }"
      @sort-change="handleSortChange"
      @refresh="handleRefresh"
    >
      <template #toolbar-left>
        <el-input
          v-model="searchForm.menuName"
          placeholder="搜索菜单名称"
          clearable
          :prefix-icon="Search"
          style="width: 240px"
        />
        <DictSelect
          v-model="searchForm.status"
          dict-type="sys_normal_disable"
          placeholder="菜单状态"
          clearable
          style="width: 120px"
        />
        <!-- 新增按钮：需要 system:menu:add 权限 -->
        <el-button v-permission="['system:menu:add']" :icon="Plus" type="primary" @click="handleAdd"> 新增 </el-button>
        <el-button :icon="Expand" @click="toggleExpand">
          {{ expandedAll ? '折叠' : '展开' }}
        </el-button>
      </template>

      <!-- 菜单名称 -->
      <template #menuName="{ row }">
        <AppIcon v-if="row.icon" :name="row.icon" class="menu-icon" />
        <span>{{ row.menuName }}</span>
      </template>

      <!-- 类型 -->
      <template #menuType="{ row }">
        <DictTag :value="row.menuType" dict-type="sys_menu_type" />
      </template>

      <!-- 状态 -->
      <template #status="{ row }">
        <DictTag :value="row.status" dict-type="sys_normal_disable" />
      </template>

      <!-- 操作 -->
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
          v-if="row.menuType !== 2"
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
    <!-- #endregion -->

    <!-- #region 新增/编辑弹窗 -->
    <pro-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      content-height="450px"
      :confirm-loading="submitLoading"
      @confirm="handleSubmit"
    >
      <el-form ref="menuFormRef" :model="menuForm" :rules="menuRules" label-width="100px">
        <!-- 上级菜单 -->
        <el-form-item label="上级菜单:" prop="parentId">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuTree"
            :props="{ value: 'id', label: 'menuName', children: 'children' }"
            placeholder="请选择上级菜单"
            clearable
            check-strictly
            style="width: 100%"
          />
        </el-form-item>

        <!-- 菜单类型 -->
        <el-form-item label="菜单类型:" prop="menuType">
          <DictSelect v-model="menuForm.menuType" dict-type="sys_menu_type" style="width: 100%" />
        </el-form-item>

        <!-- 菜单图标 -->
        <el-form-item v-if="menuForm.menuType !== 2" label="菜单图标:" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" clearable />
        </el-form-item>

        <!-- 菜单名称 -->
        <el-form-item label="菜单名称:" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" clearable />
        </el-form-item>

        <!-- 路由地址 -->
        <el-form-item v-if="menuForm.menuType !== 2" label="路由地址:" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" clearable />
        </el-form-item>

        <!-- 组件路径 -->
        <el-form-item v-if="menuForm.menuType !== 2" label="组件路径:" prop="component">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" clearable />
        </el-form-item>

        <!-- 权限标识 -->
        <el-form-item label="权限标识:" prop="perms">
          <el-input v-model="menuForm.perms" placeholder="请输入权限标识" clearable />
        </el-form-item>

        <!-- 显示排序 -->
        <el-form-item label="显示排序:" prop="orderNum">
          <el-input-number v-model="menuForm.orderNum" :min="0" style="width: 100%" />
        </el-form-item>

        <!-- 是否外链 -->
        <el-form-item v-if="menuForm.menuType !== 2" label="是否外链:" prop="isFrame">
          <el-radio-group v-model="menuForm.isFrame">
            <el-radio :value="0">是</el-radio>
            <el-radio :value="1">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 是否缓存 -->
        <el-form-item v-if="menuForm.menuType === 1" label="是否缓存:" prop="isCache">
          <el-radio-group v-model="menuForm.isCache">
            <el-radio :value="0">缓存</el-radio>
            <el-radio :value="1">不缓存</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 是否可见 -->
        <el-form-item v-if="menuForm.menuType !== 2" label="是否可见:" prop="visible">
          <el-radio-group v-model="menuForm.visible">
            <el-radio :value="0">显示</el-radio>
            <el-radio :value="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 菜单状态 -->
        <el-form-item label="菜单状态:" prop="status">
          <DictSelect v-model="menuForm.status" dict-type="sys_normal_disable" />
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="menuForm.remark" type="textarea" placeholder="请输入备注" :rows="2" />
        </el-form-item>
      </el-form>
    </pro-dialog>
    <!-- #endregion -->
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Search, Expand } from '@element-plus/icons-vue'
import { getMenuTreeAPI, createMenuAPI, updateMenuAPI, deleteMenuAPI } from '@/api/menu'
import ProTable from '@/components/Table/index.vue'
import ProDialog from '@/components/Dialog/index.vue'
import DictSelect from '@/components/DictSelect/index.vue'
import DictTag from '@/components/DictTag/index.vue'

defineOptions({
  name: 'SystemMenuIndex',
})

// #region 数据定义

const tableRef = ref(null)
const tableKey = ref(0)
const searchForm = reactive({
  menuName: '',
  status: '',
})

const menuList = ref([])
const menuTree = ref([])
const dialogVisible = ref(false)
const dialogTitle = computed(() => (menuForm.id ? '修改菜单' : '新增菜单'))
const submitLoading = ref(false)
const loading = ref(false)
const expandedAll = ref(false)

const menuFormRef = ref(null)
const menuForm = reactive({
  id: '',
  parentId: '0',
  menuType: 0,
  menuName: '',
  icon: '',
  path: '',
  component: '',
  redirect: '',
  perms: '',
  orderNum: 0,
  isFrame: 1,
  isCache: 0,
  visible: 1,
  status: 1,
  remark: '',
})

const menuRules = {
  menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
  menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
}

// 表格列配置
const columns = [
  { prop: 'menuName', label: '菜单名称', minWidth: 220, slot: 'menuName' },
  { prop: 'component', label: '组件路径', minWidth: 200 },
  { prop: 'perms', label: '权限标识', minWidth: 180 },
  {
    prop: 'orderNum',
    label: '排序',
    width: 80,
    align: 'center',
    sortable: true,
  },
  { prop: 'menuType', label: '类型', width: 100, align: 'center', slot: 'menuType' },
  { prop: 'status', label: '状态', width: 80, align: 'center', slot: 'status' },
  { prop: 'operation', label: '操作', width: 240, align: 'center', fixed: 'right', slot: 'operation' },
]

// #endregion

// #region 计算属性

const filteredMenuList = computed(() => {
  let result = menuList.value

  if (searchForm.menuName) {
    const filterName = searchForm.menuName.toLowerCase()
    const filterMenu = (menus) => {
      return menus
        .filter((menu) => {
          if (menu.menuName.toLowerCase().includes(filterName)) {
            return true
          }
          if (menu.children && menu.children.length > 0) {
            menu.children = filterMenu(menu.children)
            return menu.children.length > 0
          }
          return false
        })
        .map((menu) => ({ ...menu }))
    }
    result = filterMenu(JSON.parse(JSON.stringify(result)))
  }

  if (searchForm.status) {
    const filterStatus = (menus) => {
      return menus
        .filter((menu) => {
          if (menu.status === searchForm.status) {
            return true
          }
          if (menu.children && menu.children.length > 0) {
            menu.children = filterStatus(menu.children)
            return menu.children.length > 0
          }
          return false
        })
        .map((menu) => ({ ...menu }))
    }
    result = filterStatus(JSON.parse(JSON.stringify(result)))
  }

  return result
})

// #endregion

// #region 数据获取

const getMenuData = async () => {
  loading.value = true
  try {
    const data = await getMenuTreeAPI()
    menuList.value = data || []
    menuTree.value = [{ id: '0', menuName: '主目录', children: data || [] }]
  } catch (error) {
    console.error('获取菜单数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 刷新
const handleRefresh = () => {
  getMenuData()
}

// #endregion

// #region 排序处理

const handleSortChange = ({ column, prop, order }) => {
  console.log('排序变化:', { column, prop, order })
}

// #endregion

// #region 新增/编辑操作

const handleAdd = (row = null) => {
  resetForm()
  if (row) {
    menuForm.parentId = row.id
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  Object.assign(menuForm, {
    id: row.id,
    parentId: row.parentId || '0',
    menuType: row.menuType,
    menuName: row.menuName,
    icon: row.icon || '',
    path: row.path || '',
    component: row.component || '',
    redirect: row.redirect || '',
    perms: row.perms || '',
    orderNum: row.orderNum || 0,
    isFrame: row.isFrame || 1,
    isCache: row.isCache || 0,
    visible: row.visible || 0,
    status: row.status || 0,
    remark: row.remark || '',
  })
  dialogVisible.value = true
}

// 构建提交数据
const buildSubmitData = () => {
  const data = { ...menuForm }

  // 目录类型：component 设为 Layout
  if (data.menuType === 0) {
    data.component = 'Layout'
  }

  // 按钮类型：清空不需要的字段
  if (data.menuType === 2) {
    data.path = ''
    data.component = ''
    data.icon = ''
    data.redirect = ''
    data.isFrame = 1
    data.isCache = 0
    data.visible = 0
  }

  return data
}

const handleSubmit = async () => {
  if (!menuFormRef.value) return

  await menuFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      const submitData = buildSubmitData()
      if (submitData.id) {
        await updateMenuAPI(submitData.id, submitData)
        ElMessage.success('修改成功')
      } else {
        await createMenuAPI(submitData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      getMenuData()
    } catch (error) {
      console.error('提交失败:', error)
    } finally {
      submitLoading.value = false
    }
  })
}

const resetForm = () => {
  Object.assign(menuForm, {
    id: '',
    parentId: '0',
    menuType: 0,
    menuName: '',
    icon: '',
    path: '',
    component: '',
    redirect: '',
    perms: '',
    orderNum: 0,
    isFrame: 1,
    isCache: 0,
    visible: 1,
    status: 1,
    remark: '',
  })
}

// #endregion

// #region 删除操作

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认要删除菜单"${row.menuName}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteMenuAPI(row.id)
      ElMessage.success('删除成功')
      getMenuData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  })
}

// #endregion

// #region 展开/折叠

const toggleExpand = () => {
  expandedAll.value = !expandedAll.value
  // 通过改变 key 强制重新渲染表格
  tableKey.value++
}

// #endregion

// #region 生命周期

onMounted(() => {
  getMenuData()
})

// #endregion
</script>

<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.menu-icon {
  margin-right: 8px;
  vertical-align: middle;
}
</style>
