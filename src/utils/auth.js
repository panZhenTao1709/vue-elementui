 import Cookies from 'js-cookie'

 const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: 1 })
  } else return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const CompanyId = 'coId'
// export function getToken() { 
//   return localStorage.getItem(TokenKey)
// }

// export function setToken(token, rememberMe) { 
//   return localStorage.setItem(TokenKey, token)
// }

// export function removeToken() { 
//   return localStorage.removeItem(TokenKey)
// }
export function setCompanyId(coId) { 
  return localStorage.setItem(CompanyId, coId)
}
export function getCompanyId() { 
  return localStorage.getItem(CompanyId)
}
export function removeCompanyId() { 
  return localStorage.removeItem(CompanyId)
}