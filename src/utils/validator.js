/**
 * 表单验证规则
 *
 * 提供常用的表单验证规则，支持自定义消息
 */

/**
 * 创建验证规则
 * @param {Object} rule - 规则配置
 * @returns {Object} 验证规则
 */
const createRule = (rule) => rule

// #region 基础验证规则

/**
 * 必填验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const required = (message = '此项为必填项', trigger = 'blur') =>
  createRule({
    required: true,
    message,
    trigger,
  })

/**
 * 长度范围验证
 * @param {number} min - 最小长度
 * @param {number} max - 最大长度
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const length = (min, max, message, trigger = 'blur') =>
  createRule({
    min,
    max,
    message: message || `长度在 ${min} 到 ${max} 个字符`,
    trigger,
  })

/**
 * 最小长度验证
 * @param {number} min - 最小长度
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const minLength = (min, message, trigger = 'blur') =>
  createRule({
    min,
    message: message || `长度不能少于 ${min} 个字符`,
    trigger,
  })

/**
 * 最大长度验证
 * @param {number} max - 最大长度
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const maxLength = (max, message, trigger = 'blur') =>
  createRule({
    max,
    message: message || `长度不能超过 ${max} 个字符`,
    trigger,
  })

// #endregion

// #region 格式验证规则

/**
 * 手机号验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const phone = (message = '请输入正确的手机号码', trigger = 'blur') =>
  createRule({
    pattern: /^1[3-9]\d{9}$/,
    message,
    trigger,
  })

/**
 * 邮箱验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const email = (message = '请输入正确的邮箱地址', trigger = 'blur') =>
  createRule({
    type: 'email',
    message,
    trigger,
  })

/**
 * 身份证号验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const idCard = (message = '请输入正确的身份证号码', trigger = 'blur') =>
  createRule({
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message,
    trigger,
  })

/**
 * URL 验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const url = (message = '请输入正确的 URL 地址', trigger = 'blur') =>
  createRule({
    type: 'url',
    message,
    trigger,
  })

/**
 * IP 地址验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const ip = (message = '请输入正确的 IP 地址', trigger = 'blur') =>
  createRule({
    pattern: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    message,
    trigger,
  })

/**
 * 数字验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const number = (message = '请输入数字', trigger = 'blur') =>
  createRule({
    pattern: /^\d+$/,
    message,
    trigger,
  })

/**
 * 整数验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const integer = (message = '请输入整数', trigger = 'blur') =>
  createRule({
    pattern: /^-?\d+$/,
    message,
    trigger,
  })

/**
 * 正整数验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const positiveInteger = (message = '请输入正整数', trigger = 'blur') =>
  createRule({
    pattern: /^[1-9]\d*$/,
    message,
    trigger,
  })

/**
 * 金额验证（最多两位小数）
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const money = (message = '请输入正确的金额', trigger = 'blur') =>
  createRule({
    pattern: /^((0)|([1-9]\d*))(\.\d{1,2})?$/,
    message,
    trigger,
  })

/**
 * 密码强度验证
 * @param {Object} options - 配置选项
 * @param {number} options.minLength - 最小长度，默认 6
 * @param {boolean} options.requireNumber - 是否要求数字
 * @param {boolean} options.requireLetter - 是否要求字母
 * @param {boolean} options.requireSpecial - 是否要求特殊字符
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const password = (options = {}, message = '密码格式不正确', trigger = 'blur') => {
  const { minLength = 6, requireNumber = false, requireLetter = false, requireSpecial = false } = options

  let pattern = `^.{${minLength},}$`

  if (requireNumber || requireLetter || requireSpecial) {
    const parts = []
    if (requireLetter) parts.push('(?=.*[a-zA-Z])')
    if (requireNumber) parts.push('(?=.*\\d)')
    if (requireSpecial) parts.push('(?=.*[!@#$%^&*])')

    pattern = `^${parts.join('')}.{${minLength},}$`
  }

  return createRule({
    pattern: new RegExp(pattern),
    message,
    trigger,
  })
}

/**
 * 用户名验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const username = (message = '用户名只能包含字母、数字、下划线', trigger = 'blur') =>
  createRule({
    pattern: /^[a-zA-Z0-9_]+$/,
    message,
    trigger,
  })

/**
 * 中文验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const chinese = (message = '请输入中文', trigger = 'blur') =>
  createRule({
    pattern: /^[\u4e00-\u9fa5]+$/,
    message,
    trigger,
  })

/**
 * 英文验证
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const english = (message = '请输入英文', trigger = 'blur') =>
  createRule({
    pattern: /^[a-zA-Z]+$/,
    message,
    trigger,
  })

// #endregion

// #region 自定义验证器

/**
 * 自定义验证器
 * @param {Function} validator - 验证函数
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const custom = (validator, trigger = 'blur') =>
  createRule({
    validator,
    trigger,
  })

/**
 * 确认密码验证
 * @param {string} passwordField - 密码字段名
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const confirmPassword = (passwordField = 'password', message = '两次输入的密码不一致', trigger = 'blur') =>
  createRule({
    validator: (rule, value, callback, source) => {
      if (value !== source[passwordField]) {
        callback(new Error(message))
      } else {
        callback()
      }
    },
    trigger,
  })

/**
 * 数值范围验证
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {string} message - 错误消息
 * @param {string} trigger - 触发方式
 * @returns {Object} 验证规则
 */
export const range = (min, max, message, trigger = 'blur') =>
  createRule({
    type: 'number',
    min,
    max,
    message: message || `数值范围应在 ${min} 到 ${max} 之间`,
    trigger,
    transform: (value) => Number(value),
  })

// #endregion

// #region 预设规则集合

/**
 * 常用验证规则集合
 */
export const validators = {
  required,
  length,
  minLength,
  maxLength,
  phone,
  email,
  idCard,
  url,
  ip,
  number,
  integer,
  positiveInteger,
  money,
  password,
  username,
  chinese,
  english,
  custom,
  confirmPassword,
  range,
}

/**
 * 用户表单验证规则
 */
export const userRules = {
  userName: [required('请输入用户名'), username(), minLength(3), maxLength(20)],
  password: [required('请输入密码'), password({ minLength: 6 })],
  phone: [phone()],
  email: [email()],
  nickName: [required('请输入昵称'), minLength(2), maxLength(20)],
}

/**
 * 角色表单验证规则
 */
export const roleRules = {
  roleName: [required('请输入角色名称'), minLength(2), maxLength(20)],
  roleKey: [required('请输入权限字符'), minLength(2), maxLength(20)],
  roleSort: [required('请输入显示顺序'), positiveInteger()],
}

/**
 * 部门表单验证规则
 */
export const deptRules = {
  deptName: [required('请输入部门名称'), minLength(2), maxLength(20)],
  orderNum: [required('请输入排序'), positiveInteger()],
}

/**
 * 岗位表单验证规则
 */
export const postRules = {
  postCode: [required('请输入岗位编码'), minLength(2), maxLength(20)],
  postName: [required('请输入岗位名称'), minLength(2), maxLength(20)],
  postSort: [required('请输入排序'), positiveInteger()],
}

// #endregion

export default validators
