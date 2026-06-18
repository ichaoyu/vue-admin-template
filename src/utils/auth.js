const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TOKEN_EXPIRE_KEY = 'token_expire'

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const setRefreshToken = (token) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const getTokenExpire = () => {
  const expire = localStorage.getItem(TOKEN_EXPIRE_KEY)
  return expire ? Number(expire) : null
}

export const setTokenExpire = (expire) => {
  localStorage.setItem(TOKEN_EXPIRE_KEY, String(expire))
}

export const removeTokenExpire = () => {
  localStorage.removeItem(TOKEN_EXPIRE_KEY)
}

export const isTokenExpired = () => {
  const expire = getTokenExpire()
  if (!expire) return true
  return Date.now() > expire
}

export const clearAuth = () => {
  removeToken()
  removeRefreshToken()
  removeTokenExpire()
}
