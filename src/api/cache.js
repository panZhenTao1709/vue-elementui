import request from '@/utils/request'
import ajax from '@/utils/requestformdata'
export function getCach(params) {
  return request({
    url: 'cloud-admin/cache',
    method: 'get',
    params
  })
}
export function add(query) {
  return ajax({
    url: '/cloud-admin/cache',
    method: 'post',
    data: query
  })
}

export function del(key) {
  return request({
    url: '/cloud-admin/cache/' + key,
    method: 'delete'
  })
}


export function edit(query) {
  return ajax({
    url: '/cloud-admin/cache',
    method: 'put',
    data: query
  })
}
