import request from '@/utils/request'
import ajax from '@/utils/requestformdata'
export function getCompany(params) {
  return request({
    url: 'cloud-admin/company',
    method: 'get',
    params
  })
}
export function add(query) {
  return ajax({
    url: '/cloud-admin/company',
    method: 'post',
    data: query
  })
}

export function del(id) {
  return request({
    url: '/cloud-admin/company/' + id,
    method: 'delete'
  })
}

export function edit(query) {
  return ajax({
    url: '/cloud-admin/company',
    method: 'put',
    data: query
  })
}
