import request from '@/utils/requestformdata.js'

/**
 *  删除资源
 * @param id
 */
export function del(id) {
  return request({
    url: 'cloud-admin/app/' + id,
    method: 'delete'
  })
}

/**
 * 根据父节点获取资源
 * @param data
 */
export function getResource(data) {
  return request({
    url: 'cloud-admin/resource/apiList',
    method: 'get',
    params: data
  })
}

/**
 * 获取当前app拥有的资源
 * @param data
 */
export function getOwnResource(id) {
  return request({
    url: 'cloud-admin/app/resource?id=' + id,
    method: 'get'
  })
}

/**
 * 根据父节点获取资源,并判断当前app是否拥有该资源
 * @param data
 */
export function getJudgedResource(data) {
  return request({
    url: 'cloud-admin/app/resource',
    method: 'get',
    params: data
  })
}

/**
 * 为app绑定资源
 * @param data
 */
export function saveResource(data) {
  return request({
    url: 'cloud-admin/app/resource',
    method: 'put',
    data
  })
}


/**
 * 修改app账号信息
 * @param data
 */
export function edit(data) {
  return request({
    url: 'cloud-admin/app',
    method: 'put',
    params: data
  })
}

/**
 * 新增app账号信息
 * @param data
 */
export function add(data) {
  return request({
    url: 'cloud-admin/app',
    method: 'post',
    params: data
  })
}

export function nacosServices() {
  return request({
    url: 'cloud-admin/nacos/nacosServices',
    method: 'get',
  })
}
