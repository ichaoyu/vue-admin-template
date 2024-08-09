export interface DictTypeType {
  /**
   * '主键'232  226.8
   */
  id?: number;

  /**
   * '字典名称'
   */
  dictName?: string;

  /**
   * '字典类型'
   */
  dictType?: string;

  /**
   * '状态（0正常 1停用）'
   */
  status?: string;

  /**
   * '备注'
   */
  remark?: string;

  /**
   * '创建者'
   */
  createBy?: string;

  /**
   * '创建时间'
   */
  createTime?: Date;

  /**
   * '更新者'
   */
  updateBy?: string;

  /**
   * '更新时间'
   */
  updateTime?: Date;
}

export interface DictDataType {
  /**
   * 创建者
   */
  createBy?: string;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 字典标签
   */
  dictLabel?: string;
  /**
   * 显示顺序
   */
  dictSort?: number;
  /**
   * 字典类型
   */
  dictType?: string;
  /**
   * 字典键值
   */
  dictValue?: string;
  /**
   * 主键
   */
  id?: number;
  /**
   * 是否默认（Y是 N否）
   */
  isDefault?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态（0正常 1停用）
   */
  status?: string;
  /**
   * 更新者
   */
  updateBy?: string;
  /**
   * 更新时间
   */
  updateTime?: Date;
}
