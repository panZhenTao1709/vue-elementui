import request from '@/utils/requestformdata.js'


export function refresh() {
  return request({
    url: 'route/refresh',
    method: 'post'
  })
}

export function routes() {
  return request({
    url: 'route/routes',
    method: 'get'
  })
}

