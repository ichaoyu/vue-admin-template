export interface operLogType {
  /**
   * 主键
   */
  id?: string;

  /**
   * 操作模块
   */
  title: string;

  /**
   * 业务类型
   */
  bizType: string;

  /**
   * 请求方法
   */
  method: string;

  /**
   * 请求方式
   */
  requestMethod: string;

  /**
   * 请求地址
   */
  requestUrl: string;

  /**
   * 请求参数
   */
  requestParams: string;

  /**
   * 请求结果
   */
  requestResult: string;

  /**
   * 操作人员
   */
  operName: string;

  /**
   * 部门名称
   */
  deptName: string;

  /**
   * 操作地址
   */
  operIp: string;

  /**
   * 操作地点
   */
  operLocation: string;

  /**
   * 操作状态
   */
  status: string;

  /**
   * 错误消息
   */
  errorMsg: string;

  /**
   * 操作时间
   */
  operTime: Date;

  /**
   * 消耗时间
   */
  costTime: number;
}
