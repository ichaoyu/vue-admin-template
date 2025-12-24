// 消息管理相关类型定义

// 创建消息请求参数
export interface CreateMessageDto {
  userId?: string;
  content: string;
  contact?: string;
  status?: number;
  type?: number;
}

// 更新消息请求参数
export interface UpdateMessageDto {
  id: string;
  content?: string;
  contact?: string;
  status?: number;
  type?: number;
}

// 查询消息列表请求参数
export interface QueryMessageDto {
  content?: string;
  status?: number;
  type?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// 消息详情响应
export interface MessageVO {
  id: string;
  userId?: string;
  content: string;
  contact?: string;
  status: number;
  type: number;
  createTime: string;
  updateTime: string;
  userInfo?: {
    username?: string;
    avatar?: string;
  };
}

// 消息列表响应
export interface MessageListVO {
  list: MessageVO[];
  total: number;
  page: number;
  pageSize: number;
}