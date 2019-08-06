import request from '@/utils/request'

export function initData(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}
import ajax from '@/utils/requestformdata'
export function initDataFormData(url, params) {
  return ajax({
    url: url,
    method: 'get',
    params:params
  })
}