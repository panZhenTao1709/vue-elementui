
import request from '@/utils/request'

export function selectCompany(token, coId) {
  return request({
    url: '/cloud-auth/jwt/token',
    method: 'post',
    data: {
      token,
      coId
    }
  })
}
