export interface UserLoginType {
  username: string;
  password: string;
}
export interface UserType {
  username: string;
  password: string;
  role: string;
  roleId: string;
}

export interface UserState {
  userInfo?: UserType;
  tokenKey: string;
  token: string;
  roleRouters?: string[] | AppCustomRouteRecordRaw[];
  rememberMe: boolean;
  loginInfo?: UserLoginType;
  menuRoutes?: AppRouteRecordRaw[];
}
