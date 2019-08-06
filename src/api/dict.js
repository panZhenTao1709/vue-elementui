import request from '@/utils/requestformdata.js'

export function add(data) {
  return request({
    url: 'cloud-admin/dict',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'cloud-admin/dict/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request.put(
    'cloud-admin/dict',
    data)
}

export function get(id) {
  return request({
    url: 'cloud-admin/dict/' + id,
    method: 'get'
  })
}

export function children(data) {
  return request({
    url: 'cloud-admin/dict/children',
    method: 'get',
    params: data
  })
}
