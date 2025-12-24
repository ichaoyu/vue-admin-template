// 分类管理相关类型定义

// 创建分类请求参数
export interface CreateCategoryDto {
  name: string;
  parentId?: string;
  modelId: number;
  type?: number;
  sort?: number;
  status?: number;
  description?: string;
  template?: string;
  listTemplate?: string;
  detailTemplate?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

// 更新分类请求参数
export interface UpdateCategoryDto extends CreateCategoryDto {
  id: string;
}

// 查询分类列表请求参数
export interface QueryCategoryDto {
  name?: string;
  modelId?: number;
  status?: number;
  parentId?: string;
  page?: number;
  pageSize?: number;
}

// 分类详情响应
export interface CategoryVO {
  id: string;
  name: string;
  parentId?: string;
  modelId: number;
  type: number;
  sort: number;
  status: number;
  description?: string;
  template?: string;
  listTemplate?: string;
  detailTemplate?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  children?: CategoryVO[];
  createTime: string;
  updateTime: string;
}

// 分类列表响应
export interface CategoryListVO {
  list: CategoryVO[];
  total: number;
  page: number;
  pageSize: number;
}