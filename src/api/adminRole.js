import request from '@/utils/requestformdata.js'


export function add(data) {
  return request({
    url: 'cloud-admin/adminRole',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: 'cloud-admin/adminRole/' + id,
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: 'cloud-admin/adminRole/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'cloud-admin/adminRole',
    method: 'put',
    data
  })
}

/*
获取当前登录人拥有的资源,并标志该资源是否被当前角色所拥有
 */
export function getJudgedResource(data) {
  return request({
    url: 'cloud-admin/adminRole/resource',
    method: 'get',
    params: data
  })
}
/*
保存当前角色拥有的资源
 */
export function saveResource(data) {
  return request.put(
    'cloud-admin/adminRole/roleResource',
    data
  )
}

/*
获取当前登录人所属公司的用户,并标志是否与当前角色关联
 */
export function getJudgedUser(data) {
  return request({
    url: 'cloud-admin/adminRole/user',
    method: 'get',
    params: data
  })
}
/*
保存当前角色拥有的用户
 */
export function saveUser(data) {
  return request.put(
    'cloud-admin/adminRole/roleUser',
    data
  )
}
/*
获取公司信息
 */
export function getCompany() {
  return request({
    url: 'cloud-admin/adminRole/company',
    method: 'get'
  })
}

export function getChildren(data) {
  return request({
    url: 'cloud-admin/adminRole/children',
    method: 'get',
    params: data
  })
}
export function getRoleTree(data) {
  return request({
    url: 'cloud-admin/adminRole/tree',
    method: 'get',
    params: data
  })
}

