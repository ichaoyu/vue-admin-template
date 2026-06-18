/**
 * 通用工具函数
 *
 * 提供防抖、节流、深拷贝、树形数据处理等通用功能
 */

// #region 防抖和节流

/**
 * 防抖函数
 *
 * 在事件被触发 n 毫秒后再执行回调，如果在这 n 毫秒内又被触发，则重新计时
 * 适用于搜索输入、窗口 resize 等场景
 *
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒），默认 300ms
 * @param {boolean} immediate - 是否立即执行，默认 false
 * @returns {Function} 防抖后的函数
 *
 * @example
 * ```javascript
 * const debouncedSearch = debounce((keyword) => {
 *   console.log('搜索:', keyword)
 * }, 300)
 *
 * input.addEventListener('input', (e) => {
 *   debouncedSearch(e.target.value)
 * })
 * ```
 */
export const debounce = (fn, delay = 300, immediate = false) => {
  let timer = null

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }

    if (immediate && !timer) {
      fn.apply(this, args)
    }

    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(this, args)
      }
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 *
 * 规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效
 * 适用于滚动加载、按钮重复点击等场景
 *
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 延迟时间（毫秒），默认 300ms
 * @returns {Function} 节流后的函数
 *
 * @example
 * ```javascript
 * const throttledScroll = throttle(() => {
 *   console.log('滚动事件触发')
 * }, 300)
 *
 * window.addEventListener('scroll', throttledScroll)
 * ```
 */
export const throttle = (fn, delay = 300) => {
  let lastTime = 0

  return function (...args) {
    const now = Date.now()

    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

// #endregion

// #region 深拷贝

/**
 * 深拷贝
 *
 * 递归拷贝对象的所有属性，支持对象、数组、Date、RegExp 等类型
 *
 * @param {*} obj - 需要拷贝的对象
 * @param {WeakMap} cache - 缓存，用于处理循环引用
 * @returns {*} 拷贝后的对象
 *
 * @example
 * ```javascript
 * const original = { a: 1, b: { c: 2 } }
 * const copied = deepClone(original)
 * copied.b.c = 3
 * console.log(original.b.c) // 2
 * ```
 */
export const deepClone = (obj, cache = new WeakMap()) => {
  // 处理 null 和非对象类型
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // 处理循环引用
  if (cache.has(obj)) {
    return cache.get(obj)
  }

  // 处理 Date
  if (obj instanceof Date) {
    return new Date(obj)
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }

  // 处理 Set
  if (obj instanceof Set) {
    const clonedSet = new Set()
    cache.set(obj, clonedSet)
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, cache))
    })
    return clonedSet
  }

  // 处理 Map
  if (obj instanceof Map) {
    const clonedMap = new Map()
    cache.set(obj, clonedMap)
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, cache), deepClone(value, cache))
    })
    return clonedMap
  }

  // 处理 Array 和 Object
  const cloned = Array.isArray(obj) ? [] : {}
  cache.set(obj, cloned)

  Object.keys(obj).forEach((key) => {
    cloned[key] = deepClone(obj[key], cache)
  })

  // 处理 Symbol 属性
  const symbolKeys = Object.getOwnPropertySymbols(obj)
  symbolKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], cache)
  })

  return cloned
}

// #endregion

// #region 树形数据处理

/**
 * 树形数据扁平化
 *
 * 将树形结构数据转换为扁平数组
 *
 * @param {Array} tree - 树形数据
 * @param {Object} options - 配置选项
 * @param {string} options.childrenKey - 子节点键名，默认 'children'
 * @param {boolean} options.keepChildren - 是否保留 children 属性，默认 false
 * @returns {Array} 扁平化后的数组
 *
 * @example
 * ```javascript
 * const tree = [
 *   { id: 1, children: [{ id: 2 }] }
 * ]
 * const flat = flattenTree(tree)
 * // [{ id: 1 }, { id: 2 }]
 * ```
 */
export const flattenTree = (tree, options = {}) => {
  const { childrenKey = 'children', keepChildren = false } = options
  const result = []

  const flatten = (nodes) => {
    nodes.forEach((node) => {
      const item = { ...node }
      if (!keepChildren) {
        delete item[childrenKey]
      }
      result.push(item)

      if (node[childrenKey] && node[childrenKey].length > 0) {
        flatten(node[childrenKey])
      }
    })
  }

  flatten(tree)
  return result
}

/**
 * 在树形数据中查找节点
 *
 * @param {Array} tree - 树形数据
 * @param {Function|Object} predicate - 查找条件，可以是函数或对象
 * @param {Object} options - 配置选项
 * @param {string} options.childrenKey - 子节点键名，默认 'children'
 * @returns {Object|null} 找到的节点，未找到返回 null
 *
 * @example
 * ```javascript
 * const tree = [{ id: 1, children: [{ id: 2 }] }]
 * const node = findInTree(tree, { id: 2 })
 * // { id: 2 }
 * ```
 */
export const findInTree = (tree, predicate, options = {}) => {
  const { childrenKey = 'children' } = options

  const isMatch = (node) => {
    if (typeof predicate === 'function') {
      return predicate(node)
    }
    return Object.keys(predicate).every((key) => node[key] === predicate[key])
  }

  const find = (nodes) => {
    for (const node of nodes) {
      if (isMatch(node)) {
        return node
      }

      if (node[childrenKey] && node[childrenKey].length > 0) {
        const found = find(node[childrenKey])
        if (found) {
          return found
        }
      }
    }

    return null
  }

  return find(tree)
}

/**
 * 获取树形数据中节点的所有父节点
 *
 * @param {Array} tree - 树形数据
 * @param {string|number} nodeId - 目标节点 ID
 * @param {Object} options - 配置选项
 * @param {string} options.idKey - ID 键名，默认 'id'
 * @param {string} options.childrenKey - 子节点键名，默认 'children'
 * @returns {Array} 父节点数组，从根节点到直接父节点
 *
 * @example
 * ```javascript
 * const tree = [{ id: 1, children: [{ id: 2, children: [{ id: 3 }] }] }]
 * const parents = getTreeParents(tree, 3)
 * // [{ id: 1 }, { id: 2 }]
 * ```
 */
export const getTreeParents = (tree, nodeId, options = {}) => {
  const { idKey = 'id', childrenKey = 'children' } = options
  const parents = []

  const find = (nodes, targetId, path = []) => {
    for (const node of nodes) {
      if (node[idKey] === targetId) {
        parents.push(...path)
        return true
      }

      if (node[childrenKey] && node[childrenKey].length > 0) {
        if (find(node[childrenKey], targetId, [...path, node])) {
          return true
        }
      }
    }

    return false
  }

  find(tree, nodeId)
  return parents
}

// #endregion

// #region 数据转换

/**
 * 对象转 URL 查询字符串
 *
 * @param {Object} obj - 对象
 * @param {boolean} skipEmpty - 是否跳过空值，默认 true
 * @returns {string} 查询字符串
 *
 * @example
 * ```javascript
 * objectToQueryString({ a: 1, b: 2 })
 * // 'a=1&b=2'
 * ```
 */
export const objectToQueryString = (obj, skipEmpty = true) => {
  return Object.keys(obj)
    .filter((key) => {
      if (skipEmpty) {
        return obj[key] !== '' && obj[key] !== null && obj[key] !== undefined
      }
      return true
    })
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

/**
 * URL 查询字符串转对象
 *
 * @param {string} queryString - 查询字符串
 * @returns {Object} 对象
 *
 * @example
 * ```javascript
 * queryStringToObject('a=1&b=2')
 * // { a: '1', b: '2' }
 * ```
 */
export const queryStringToObject = (queryString) => {
  if (!queryString) return {}

  return queryString
    .replace(/^\?/, '')
    .split('&')
    .reduce((acc, pair) => {
      const [key, value] = pair.split('=')
      acc[decodeURIComponent(key)] = decodeURIComponent(value || '')
      return acc
    }, {})
}

/**
 * 数组转对象
 *
 * @param {Array} arr - 数组
 * @param {string} keyField - 作为键的字段名
 * @param {string} valueField - 作为值的字段名，不传则使用整个对象
 * @returns {Object} 对象
 *
 * @example
 * ```javascript
 * arrayToObject([{ id: 1, name: 'a' }], 'id', 'name')
 * // { 1: 'a' }
 * ```
 */
export const arrayToObject = (arr, keyField, valueField = null) => {
  return arr.reduce((acc, item) => {
    acc[item[keyField]] = valueField ? item[valueField] : item
    return acc
  }, {})
}

// #endregion

// #region 其他工具

/**
 * 生成唯一 ID
 *
 * @param {number} length - ID 长度，默认 8
 * @returns {string} 唯一 ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 判断是否为空
 *
 * @param {*} value - 需要判断的值
 * @returns {boolean} 是否为空
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 休眠函数
 *
 * @param {number} ms - 休眠时间（毫秒）
 * @returns {Promise} Promise
 *
 * @example
 * ```javascript
 * await sleep(1000)
 * ```
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 复制文本到剪贴板
 *
 * @param {string} text - 需要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const result = document.execCommand('copy')
    document.body.removeChild(textarea)
    return result
  }
}

// #endregion
