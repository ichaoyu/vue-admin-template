/**
 * 常量定义
 *
 * 统一管理项目中的常量值
 */

// #region 状态常量

/**
 * 通用状态
 */
export const STATUS = {
  ENABLE: '0',
  DISABLE: '1',
}

export const STATUS_OPTIONS = [
  { label: '正常', value: STATUS.ENABLE },
  { label: '停用', value: STATUS.DISABLE },
]

/**
 * 性别
 */
export const GENDER = {
  MALE: '0',
  FEMALE: '1',
  UNKNOWN: '2',
}

export const GENDER_OPTIONS = [
  { label: '男', value: GENDER.MALE },
  { label: '女', value: GENDER.FEMALE },
  { label: '未知', value: GENDER.UNKNOWN },
]

/**
 * 是否
 */
export const YES_NO = {
  YES: '1',
  NO: '0',
}

export const YES_NO_OPTIONS = [
  { label: '是', value: YES_NO.YES },
  { label: '否', value: YES_NO.NO },
]

// #endregion

// #region 菜单常量

/**
 * 菜单类型
 */
export const MENU_TYPE = {
  DIRECTORY: 'M',
  MENU: 'C',
  BUTTON: 'F',
}

export const MENU_TYPE_OPTIONS = [
  { label: '目录', value: MENU_TYPE.DIRECTORY },
  { label: '菜单', value: MENU.MENU },
  { label: '按钮', value: MENU_TYPE.BUTTON },
]

/**
 * 是否外链
 */
export const IS_EXTERNAL = {
  YES: '1',
  NO: '0',
}

export const IS_EXTERNAL_OPTIONS = [
  { label: '是', value: IS_EXTERNAL.YES },
  { label: '否', value: IS_EXTERNAL.NO },
]

/**
 * 是否缓存
 */
export const IS_CACHE = {
  YES: '0',
  NO: '1',
}

export const IS_CACHE_OPTIONS = [
  { label: '缓存', value: IS_CACHE.YES },
  { label: '不缓存', value: IS_CACHE.NO },
]

/**
 * 是否显示
 */
export const IS_VISIBLE = {
  YES: '0',
  NO: '1',
}

export const IS_VISIBLE_OPTIONS = [
  { label: '显示', value: IS_VISIBLE.YES },
  { label: '隐藏', value: IS_VISIBLE.NO },
]

// #endregion

// #region 字典常量

/**
 * 字典类型
 */
export const DICT_TYPE = {
  SYS_NORMAL_DISABLE: 'sys_normal_disable',
  SYS_USER_SEX: 'sys_user_sex',
  SYS_MENU_MENUTYPE: 'sys_menu_menutype',
  SYS_JOB_STATUS: 'sys_job_status',
  SYS_NOTICE_TYPE: 'sys_notice_type',
  SYS_NOTICE_STATUS: 'sys_notice_status',
}

// #endregion

// #region 操作常量

/**
 * 操作类型
 */
export const OPERATION_TYPE = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
}

/**
 * 操作结果
 */
export const OPERATION_RESULT = {
  SUCCESS: 'success',
  FAIL: 'fail',
}

// #endregion

// #region HTTP 常量

/**
 * HTTP 状态码
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

/**
 * HTTP 方法
 */
export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
}

// #endregion

// #region 分页常量

/**
 * 分页配置
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 20, 50, 100],
  PAGE_SIZE_OPTIONS: [
    { label: '10 条/页', value: 10 },
    { label: '20 条/页', value: 20 },
    { label: '50 条/页', value: 50 },
    { label: '100 条/页', value: 100 },
  ],
}

// #endregion

// #region 表格常量

/**
 * 表格尺寸
 */
export const TABLE_SIZE = {
  LARGE: 'large',
  DEFAULT: 'default',
  SMALL: 'small',
}

export const TABLE_SIZE_OPTIONS = [
  { label: '大', value: TABLE_SIZE.LARGE },
  { label: '默认', value: TABLE_SIZE.DEFAULT },
  { label: '小', value: TABLE_SIZE.SMALL },
]

// #endregion

// #region 日期常量

/**
 * 日期格式
 */
export const DATE_FORMAT = {
  DATE: 'YYYY-MM-DD',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATETIME_MINUTE: 'YYYY-MM-DD HH:mm',
  MONTH: 'YYYY-MM',
  YEAR: 'YYYY',
}

// #endregion

// #region 存储键常量

/**
 * 本地存储键
 */
export const STORAGE_KEY = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRE: 'token_expire',
  USER_INFO: 'user_info',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATUS: 'sidebar_status',
}

// #endregion

// #region 其他常量

/**
 * 文件大小限制（字节）
 */
export const FILE_SIZE_LIMIT = {
  IMAGE: 2 * 1024 * 1024, // 2MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
}

/**
 * 文件类型
 */
export const FILE_TYPE = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENT: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  EXCEL: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
}

/**
 * 颜色
 */
export const COLOR = {
  PRIMARY: '#409EFF',
  SUCCESS: '#67C23A',
  WARNING: '#E6A23C',
  DANGER: '#F56C6C',
  INFO: '#909399',
}

// #endregion
