import request from '@/utils/requestformdata.js'
import ajax from '@/utils/requestformdata'

export function getDepts(params) {
  return request({
    url: 'cloud-admin/organization/tree',
    method: 'get',
    params
  })
}

export function add(data) {
  return ajax({
    url: 'cloud-admin/organization',
    method: 'post',
    data
  })
}
/*
获取当前登录人所属公司的用户,并标志是否与当前部门关联
 */
export function getJudgedUser(data) {
  return request({
    url: 'cloud-admin/organization/user',
    method: 'get',
    params: data
  })
}
/*
保存当前部门拥有的用户
 */
export function saveUser(data) {
  return request.put(
    'cloud-admin/organization/orgUser',
    data
  )
}

export function del(id) {
  return request({
    url: 'cloud-admin/organization/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return ajax({
    url: 'cloud-admin/organization',
    method: 'put',
    data
  })
}
