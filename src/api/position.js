import request from '@/utils/request'
import ajax from '@/utils/requestformdata'

export function add(query) {
  return ajax({
    url: '/cloud-admin/position',
    method: 'post',
    data: query
  })
}

export function getCom(id){
  return ajax({
    url:'/cloud-admin/position/company',
    method:'get',
    params:id
  })
}

export function getOrg(id){
  return ajax({
    url:'/cloud-admin/position/organization',
    method:'get',
    params:id

  })
}




export function del(id) {
  return request({
    url: '/cloud-admin/position/' + id,
    method: 'delete'
  })
}

export function edit(query) {
  return ajax({
    url: '/cloud-admin/position',
    method: 'put',
    data: query
  })
}

export function validPass(password) {
  const data = {
    password: password
  }
  return ajax({
    url: '/cloud-admin/user/validPass',
    method: 'post',
    data: data
  })
}

export function updatePass(password) {
  const data = {
    password: password
  }
  return ajax({
    url: '/cloud-admin/user/updatePass ',
    method: 'put',
    data: data
  })
}

export function updateEmail(code, data) {
  return request({
    url: 'api/users/updateEmail/' + code,
    method: 'post',
    data
  })
}

export function getInfo() {
  return ajax({
    url: 'cloud-admin/user/info',
    method: 'get'
  })
}

