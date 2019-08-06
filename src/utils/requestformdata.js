import axios from 'axios'
import Qs from 'qs'
import store from '../store'
import { getToken } from '@/utils/auth'
import { Notification, MessageBox } from 'element-ui'   //引入element-ui的消息提示和弹窗
import Cookies from 'js-cookie'


// 创建axios实例
const ajax = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 900000 // 请求超时时间
})

// 设置请求拦截器
ajax.interceptors.request.use(config => {
  // 参数转换为表单模式
  if (config.data) {
    config.data = Qs.stringify(config.data)
  }
  // 设置请求头
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded', // 模拟form表单方式提交请求
    'Authorization': store.getters.token === undefined ? '' : getToken(), // 设置token
    'Accept-Language': Cookies.get('language') || (navigator.language || navigator.browserLanguage).substr(0,2)
  }
  return config
}, error => {
  console.log('这里错了');
  console.log(error) // for debug
  Promise.reject(error)
})



// response 拦截器
ajax.interceptors.response.use(
  response => {
    const code = response.status
    //验证请求返回的状态码
    if (code < 200 || code > 300) { //如果请求错误  提示相应的错误信息
     
      return Promise.reject('error')
    } else { //请求正确返回的请求数据
      return response
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.status
    } catch (e) {
      if (error.toString().indexOf('timeout')) {
        Notification.error({
          title: '请求超时',
          duration: 2500
        })
        return Promise.reject(error)
      }
    }
    if (code === 40301) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 403) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }else if (code === 500) {
      Notification.error({
        title: '服务器异常',
        duration: 2500
      })
    }
    else {
      
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 2500
        })
      }
    }
    return Promise.reject(error)
  }
)

export default ajax
