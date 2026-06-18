import { useDictStore } from '@/store/dict'
import { computed, onMounted } from 'vue'

export const useDict = (dictType, options = {}) => {
  const { immediate = true } = options

  const dictStore = useDictStore()

  const dictData = computed(() => {
    if (!dictType) return []
    return dictStore.getDictData(dictType)
  })

  const loading = computed(() => {
    if (!dictType) return false
    return dictStore.isDictLoading(dictType)
  })

  const loadDict = async () => {
    if (!dictType) return

    // 检查字典数据是否已经存在且未过期
    const dictData = dictStore.getDictData(dictType)
    const lastUpdate = dictStore.lastUpdateTime[dictType]

    if (dictData.length > 0 && lastUpdate && Date.now() - lastUpdate < dictStore.cacheExpiry) {
      return
    }

    await dictStore.loadDict(dictType)
  }

  const refreshDict = async () => {
    if (!dictType) return
    await dictStore.refreshDict(dictType)
  }

  const getDictLabel = (value) => {
    if (!dictType || !value) return value
    return dictStore.getDictLabel(dictType, value)
  }

  const getDictValue = (label) => {
    if (!dictType || !label) return label
    return dictStore.getDictValue(dictType, label)
  }

  const getOptions = (includeDisabled = false) => {
    if (!dictType) return []
    return dictStore.getDictOptions(dictType, includeDisabled)
  }

  if (immediate) {
    onMounted(() => {
      loadDict()
    })
  }

  return {
    dictData,
    loading,
    loadDict,
    refreshDict,
    getDictLabel,
    getDictValue,
    getOptions,
  }
}

export const useDicts = (dictTypes = []) => {
  const dictStore = useDictStore()

  const loadDicts = async () => {
    if (!Array.isArray(dictTypes) || dictTypes.length === 0) return

    // 筛选出需要加载的字典类型（数据不存在或已过期）
    const dictTypesToLoad = dictTypes.filter((type) => {
      const dictData = dictStore.getDictData(type)
      const lastUpdate = dictStore.lastUpdateTime[type]
      return dictData.length === 0 || !lastUpdate || Date.now() - lastUpdate >= dictStore.cacheExpiry
    })

    if (dictTypesToLoad.length > 0) {
      await dictStore.loadDicts(dictTypesToLoad)
    }
  }

  const refreshDicts = async () => {
    if (!Array.isArray(dictTypes) || dictTypes.length === 0) return
    await dictStore.loadDicts(dictTypes, true)
  }

  const result = {
    loadDicts,
    refreshDicts,
  }

  dictTypes.forEach((type) => {
    result[`${type}Data`] = computed(() => dictStore.getDictData(type))
    result[`${type}Options`] = computed(() => dictStore.getDictOptions(type))
    result[`${type}Loading`] = computed(() => dictStore.isDictLoading(type))

    // 增加获取包含禁用选项的方法
    result[`get${type.charAt(0).toUpperCase() + type.slice(1)}Options`] = (includeDisabled = false) => {
      return dictStore.getDictOptions(type, includeDisabled)
    }
  })

  onMounted(() => {
    loadDicts()
  })

  return result
}

export default useDict
