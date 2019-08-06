import request from '@/utils/request'
// 行政区域ztree
export function getTreeNodes() {
  return request({
    url: 'api/district/getDistrictTree',
    method: 'get'
  })
}
// 获取行政区域子节点
export function getChildren(params) {
  return request({
    url: 'api/district/getChildren',
    method: 'get',
    params
  })
}
// 获取行政区域省份节点
export function getProvinces() {
  return request({
    url: 'api/district/getProvinces',
    method: 'get'
  })
}
// 获取销售区域ztree
export function getSalesTreeNodes() {
  return request({
    url: 'api/sellerArea/getTree',
    method: 'get'

  })
}
// 新增销售区域节点
export function addSalesTreeNodes(data) {
  return request({
    url: 'api/sellerArea',
    method: 'post',
    data
  })
}
// 删除销售区域节点
export function delSalesTreeNodes(params) {
  return request({
    url: 'api/sellerArea',
    method: 'delete',
    params
  })
}
// 修改销售区域节点
export function editSalesTreeNodes(data) {
  return request({
    url: 'api/sellerArea',
    method: 'put',
    data
  })
}
// 查询销售区域列表
export function querySalesTreeNodes() {
  return request({
    url: 'api/sellerArea',
    method: 'get'

  })
}
// 销售区域及行政区域绑定
export function sellerAreabind(params) {
  return request({
    url: 'api/sellerArea/relevance',
    method: 'post',
    params
  })
}
// 根据销售区域节点信息查询该销售区域所绑定的行政区域
export function queryRelevacnceList(params) {
  return request({
    url: 'api/sellerArea/relevanceList',
    method: 'get',
    params
  })
}
// 树形节点拖动
export function dragUpdateSort(params) {
  return request({
    url: 'api/sellerArea/updateSort',
    method: 'put',
    params
  })
}

// 销售区域行政区域绑定修改
export function updateRelevance(params) {
  return request({
    url: 'api/sellerArea/updateRelevance',
    method: 'put',
    params
  })
}

// 销售区域行政区域绑定修改
export function deleteRelevance(params) {
  return request({
    url: 'api/sellerArea/deleteRelevance',
    method: 'delete',
    params
  })
}
// 修改树形结构的字段，增加一个name字段匹配ztree
export const filterlist = (lists) => {
  let newList = lists.filter(list => {
    if (list.sellareaname) {
      let name = list.sellareaname
      Object.assign(list, { name: name })
    }
    if (list.parentid) {
      let pid = list.parentid
      Object.assign(list, { pid: pid })
    }
    if (list.children && list.children.length) {
      list.children = filterlist(list.children)
    }
    return true
  })
  return newList
}
