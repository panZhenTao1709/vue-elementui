import request from '@/utils/requestformdata.js'
// 获取所有的Role
export function getAll() {
  return request({
    url: 'cloud-admin/role/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'cloud-admin/role',
    method: 'post',
    data
  })
}
export function getParentRole(){
  return request({
    url:'cloud-admin/role/tree',
    method:'get'
  })
}

export function get(id) {
  return request({
    url: 'cloud-admin/role/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: 'cloud-admin/role/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'cloud-admin/role',
    method: 'put',
    data
  })
}
/*
获取当前登录人拥有的资源,并标志该资源是否被当前角色所拥有
 */
export function getJudgedResource(data) {
  return request({
    url: 'cloud-admin/role/resource',
    method: 'get',
    params: data
  })
}
/*
保存当前角色拥有的资源
 */
export function saveResource(data) {
  return request.put(
    'cloud-admin/role/roleResource',
    data
  )
}

/*
获取当前登录人所属公司的用户,并标志是否与当前角色关联
 */
export function getJudgedUser(data) {
  return request({
    url: 'cloud-admin/role/user',
    method: 'get',
    params: data
  })
}
/*
保存当前角色拥有的用户
 */
export function saveUser(data) {
  return request.put(
    'cloud-admin/role/roleUser',
    data
  )
}
