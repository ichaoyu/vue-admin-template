import { defineStore } from 'pinia'
import { getDictDataByTypeAPI } from '@/api/system/dict-data'
import { isDictEqual, toDictNumber } from '@/utils/dict'

/**
 * 字典数据管理 Store
 * 提供字典数据的缓存、预加载、查询等功能
 * 支持持久化存储，避免重复请求
 */
export const useDictStore = defineStore('dict', {
  state: () => ({
    // 字典数据映射表，key为字典类型，value为字典数据数组
    dictMap: {},
    // 加载状态映射表，key为字典类型，value为是否正在加载
    loadingMap: {},
    // 最后更新时间映射表，key为字典类型，value为时间戳
    lastUpdateTime: {},
    // 缓存过期时间（毫秒），默认5分钟
    cacheExpiry: 5 * 60 * 1000,
  }),

  getters: {
    /**
     * 获取指定类型的字典数据
     * @param {string} dictType - 字典类型
     * @returns {Array} 字典数据数组
     */
    getDictData: (state) => (dictType) => {
      return state.dictMap[dictType] || []
    },

    /**
     * 根据字典值获取字典标签
     * 支持数字和字符串类型的自动转换
     * @param {string} dictType - 字典类型
     * @param {number|string} value - 字典值
     * @returns {string} 字典标签
     */
    getDictLabel: (state) => (dictType, value) => {
      const dictData = state.dictMap[dictType] || []
      const item = dictData.find((d) => {
        const dictValue = toDictNumber(d.dictValue ?? d.value)
        return isDictEqual(dictValue, value)
      })
      return item?.dictLabel ?? item?.label ?? String(value)
    },

    /**
     * 根据字典标签获取字典值
     * @param {string} dictType - 字典类型
     * @param {string} label - 字典标签
     * @returns {number} 字典值（数字类型）
     */
    getDictValue: (state) => (dictType, label) => {
      const dictData = state.dictMap[dictType] || []
      const item = dictData.find((d) => d.dictLabel === label || d.label === label)
      return toDictNumber(item?.dictValue ?? item?.value)
    },

    /**
     * 获取字典选项列表，用于下拉选择组件
     * @param {string} dictType - 字典类型
     * @param {boolean} includeDisabled - 是否包含禁用的选项，默认 false
     * @returns {Array} 选项数组，格式为 [{ label, value, disabled }]
     */
    getDictOptions:
      (state) =>
      (dictType, includeDisabled = false) => {
        const dictData = state.dictMap[dictType] || []
        const options = dictData.map((item) => ({
          label: item.dictLabel || item.label,
          value: toDictNumber(item.dictValue ?? item.value),
          disabled: toDictNumber(item.status) === 0,
        }))

        if (!includeDisabled) {
          return options.filter((item) => !item.disabled)
        }

        return options
      },

    /**
     * 判断字典是否已加载
     * @param {string} dictType - 字典类型
     * @returns {boolean} 是否已加载
     */
    isDictLoaded: (state) => (dictType) => {
      return !!state.dictMap[dictType]
    },

    /**
     * 判断字典是否正在加载
     * @param {string} dictType - 字典类型
     * @returns {boolean} 是否正在加载
     */
    isDictLoading: (state) => (dictType) => {
      return !!state.loadingMap[dictType]
    },
  },

  actions: {
    // #region 字典加载方法

    /**
     * 加载指定类型的字典数据
     * 支持缓存和防重复加载
     * @param {string} dictType - 字典类型
     * @param {boolean} forceRefresh - 是否强制刷新
     * @returns {Promise<Array>} 字典数据数组
     */
    async loadDict(dictType, forceRefresh = false) {
      if (!dictType) return []

      // 检查缓存是否有效
      if (!forceRefresh && this.dictMap[dictType]) {
        const lastUpdate = this.lastUpdateTime[dictType]
        if (lastUpdate && Date.now() - lastUpdate < this.cacheExpiry) {
          return this.dictMap[dictType]
        }
      }

      // 防止重复加载，等待已有请求完成
      if (this.loadingMap[dictType]) {
        return new Promise((resolve) => {
          const checkLoading = setInterval(() => {
            if (!this.loadingMap[dictType]) {
              clearInterval(checkLoading)
              resolve(this.dictMap[dictType] || [])
            }
          }, 100)
        })
      }

      this.loadingMap[dictType] = true

      try {
        const res = await getDictDataByTypeAPI(dictType)
        const data = Array.isArray(res) ? res : res?.list || []

        this.dictMap[dictType] = data
        this.lastUpdateTime[dictType] = Date.now()

        return data
      } catch (error) {
        console.error(`加载字典数据失败 [${dictType}]:`, error)
        return []
      } finally {
        this.loadingMap[dictType] = false
      }
    },

    /**
     * 批量加载多个字典类型
     * @param {Array<string>} dictTypes - 字典类型数组
     * @param {boolean} forceRefresh - 是否强制刷新
     */
    async loadDicts(dictTypes, forceRefresh = false) {
      if (!Array.isArray(dictTypes) || dictTypes.length === 0) return

      const promises = dictTypes.map((type) => this.loadDict(type, forceRefresh))
      await Promise.all(promises)
    },

    /**
     * 预加载常用字典数据
     * 在应用启动时调用，提升用户体验
     */
    async preloadCommonDicts() {
      const commonDictTypes = ['sys_normal_disable', 'sys_user_sex', 'sys_menu_type', 'sys_yes_no', 'sys_action_type']

      try {
        await this.loadDicts(commonDictTypes)
      } catch (error) {
        console.error('[字典预加载] 失败:', error)
      }
    },

    // #endregion

    // #region 字典刷新方法

    /**
     * 刷新指定类型的字典数据
     * @param {string} dictType - 字典类型
     * @returns {Promise<Array>} 字典数据数组
     */
    refreshDict(dictType) {
      return this.loadDict(dictType, true)
    },

    /**
     * 刷新所有已加载的字典数据
     * @returns {Promise<void>}
     */
    refreshAllDicts() {
      const dictTypes = Object.keys(this.dictMap)
      return this.loadDicts(dictTypes, true)
    },

    // #endregion

    // #region 字典清理方法

    /**
     * 清除字典缓存
     * @param {string} [dictType] - 字典类型，不传则清除所有
     */
    clearDict(dictType) {
      if (dictType) {
        delete this.dictMap[dictType]
        delete this.lastUpdateTime[dictType]
      } else {
        this.dictMap = {}
        this.lastUpdateTime = {}
      }
    },

    /**
     * 设置缓存过期时间
     * @param {number} expiry - 过期时间（毫秒）
     */
    setCacheExpiry(expiry) {
      this.cacheExpiry = expiry
    },

    // #endregion
  },

  // 持久化配置
  persist: {
    key: 'dict-store',
    pick: ['dictMap', 'lastUpdateTime'],
  },
})
