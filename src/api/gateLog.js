import request from '@/utils/request'
export function getGateLog(params) {
  return request({
    url: 'cloud-admin/gateLog',
    method: 'get',
    params
  })
}

