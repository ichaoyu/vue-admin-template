// 友情链接管理相关类型定义

// 创建友情链接请求参数
export interface CreateFriendlinkDto {
  name: string;
  url: string;
  logo?: string;
  sort?: number;
  status?: number;
  description?: string;
}

// 更新友情链接请求参数
export interface UpdateFriendlinkDto extends CreateFriendlinkDto {
  id: string;
}

// 查询友情链接列表请求参数
export interface QueryFriendlinkDto {
  name?: string;
  status?: number;
  page?: number;
  pageSize?: number;
}

// 友情链接详情响应
export interface FriendlinkVO {
  id: string;
  name: string;
  url: string;
  logo?: string;
  sort: number;
  status: number;
  description?: string;
  createTime: string;
  updateTime: string;
}

// 友情链接列表响应
export interface FriendlinkListVO {
  list: FriendlinkVO[];
  total: number;
  page: number;
  pageSize: number;
}