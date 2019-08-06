import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/cloud-auth/jwt/token',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token, coId) {
  return request({
    url: '/cloud-auth/jwt/token',
    method: 'post',
    data: {
      token,
      coId
    }
  })
}
// export function login(username, password) {
//   return request({
//     url: 'auth/login',
//     method: 'post',
//     data: {
//       username,
//       password
//     }
//   })
// }

// export function getInfo() {
//   return request({
//     url: 'auth/info',
//     method: 'get'
//   })
// }
