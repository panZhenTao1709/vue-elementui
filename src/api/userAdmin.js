import request from '@/utils/request'
import ajax from '@/utils/requestformdata'
export function add(query) {
  return ajax({
    url: '/cloud-admin/userAdmin',
    method: 'post',
    data: query
  })
}

export function del(id) {
  return request({
    url: '/cloud-admin/userAdmin/' + id,
    method: 'delete'
  })
}

export function edit(query) {
  return ajax({
    url: '/cloud-admin/userAdmin',
    method: 'put',
    data: query
  })
}

export function validPass(pass) {
  return request({
    url: 'api/users/validPass/' + pass,
    method: 'get'
  })
}

export function updatePass(pass) {
  return request({
    url: 'api/users/updatePass/' + pass,
    method: 'get'
  })
}

export function updateEmail(code, data) {
  return request({
    url: 'api/users/updateEmail/' + code,
    method: 'post',
    data
  })
}
export function getCompany(data) {
  return request({
    url: '/cloud-admin/userAdmin/company' ,
    method: 'get',
    params:data
  })
}

export function getCompanyInfo(id) {
  return request({
    url: '/cloud-admin/userAdmin/company/'+id ,
    method: 'get'
  })
}
export function getAdminRole(data) {
  return request({
    url: 'cloud-admin/userAdmin/role',
    method: 'get',
    params:data
  })
}
export function getAdminRoleInfo(id) {
  return request({
    url: '/cloud-admin/userAdmin/role/'+id ,
    method: 'get'
  })
}


