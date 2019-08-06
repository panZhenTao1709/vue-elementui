import request from '@/utils/request'
import ajax from '@/utils/requestformdata'

// 获取所有的菜单树
export function getMenusTree(data) {
  return request({
    url: 'cloud-admin/resource/list',
    method: 'get',
    data: data
  })
}
export function buildMenus() {
  return request({
    url: 'api/admin/resource/build',
    method: 'get'
  })
}

// export function buildMenus() {
//   return request({
//     url: 'api/menus/build',
//     method: 'get'
//   })
// }

export function add(data) {
  return ajax({
    url: '/cloud-admin/resource',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/cloud-admin/resource/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return ajax({
    url: '/cloud-admin/resource',
    method: 'put',
    data
  })
}
