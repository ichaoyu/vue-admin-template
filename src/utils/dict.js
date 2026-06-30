import { DICT_DEL_FLAG, DICT_SEX, DICT_SHOW_HIDE, DICT_STATUS, DICT_YES_NO } from '@/constants'

// #region 核心工具方法

/**
 * 比较两个字典值是否相等
 * 支持数字和字符串类型的自动转换比较
 * 解决数字0被误判为空的问题
 *
 * @param {*} value1 - 第一个值
 * @param {*} value2 - 第二个值
 * @returns {boolean} 是否相等
 */
export function isDictEqual(value1, value2) {
  // 完全相等直接返回
  if (value1 === value2) return true

  // 处理空值情况
  if (value1 === null || value1 === undefined || value1 === '') {
    return value2 === null || value2 === undefined || value2 === ''
  }
  if (value2 === null || value2 === undefined || value2 === '') {
    return false
  }

  // 转换为数字后比较，支持 '0' === 0 的情况
  return Number(value1) === Number(value2)
}

/**
 * 判断字典值是否为空
 * 注意：数字0不是空值，会被正确识别
 *
 * @param {*} value - 要判断的值
 * @returns {boolean} 是否为空
 */
export function isDictEmpty(value) {
  return value === null || value === undefined || value === ''
}

/**
 * 判断字典值是否不为空
 *
 * @param {*} value - 要判断的值
 * @returns {boolean} 是否不为空
 */
export function isDictNotEmpty(value) {
  return !isDictEmpty(value)
}

/**
 * 将字典值转换为数字类型
 * 空值默认返回0
 *
 * @param {*} value - 要转换的值
 * @returns {number} 转换后的数字
 */
export function toDictNumber(value) {
  if (value === null || value === undefined || value === '') return 0
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

// #endregion

// #region 状态判断便捷方法

/**
 * 判断状态是否为正常
 *
 * @param {*} status - 状态值
 * @returns {boolean} 是否正常
 */
export function isStatusNormal(status) {
  return isDictEqual(status, DICT_STATUS.NORMAL)
}

/**
 * 判断状态是否为停用
 *
 * @param {*} status - 状态值
 * @returns {boolean} 是否停用
 */
export function isStatusDisabled(status) {
  return isDictEqual(status, DICT_STATUS.DISABLED)
}

/**
 * 判断是否为"是"
 *
 * @param {*} value - 值
 * @returns {boolean} 是否为"是"
 */
export function isYes(value) {
  return isDictEqual(value, DICT_YES_NO.YES)
}

/**
 * 判断是否为"否"
 *
 * @param {*} value - 值
 * @returns {boolean} 是否为"否"
 */
export function isNo(value) {
  return isDictEqual(value, DICT_YES_NO.NO)
}

/**
 * 判断是否为显示状态
 *
 * @param {*} value - 值
 * @returns {boolean} 是否显示
 */
export function isShow(value) {
  return isDictEqual(value, DICT_SHOW_HIDE.SHOW)
}

/**
 * 判断是否为隐藏状态
 *
 * @param {*} value - 值
 * @returns {boolean} 是否隐藏
 */
export function isHide(value) {
  return isDictEqual(value, DICT_SHOW_HIDE.HIDE)
}

/**
 * 判断是否已删除
 *
 * @param {*} delFlag - 删除标志
 * @returns {boolean} 是否已删除
 */
export function isDeleted(delFlag) {
  return isDictEqual(delFlag, DICT_DEL_FLAG.DELETED)
}

/**
 * 判断是否存在（未删除）
 *
 * @param {*} delFlag - 删除标志
 * @returns {boolean} 是否存在
 */
export function isExist(delFlag) {
  return isDictEqual(delFlag, DICT_DEL_FLAG.EXIST)
}

// #endregion
