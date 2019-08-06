import axios from 'axios'  //引入axios
import router from '@/router'  //引入路由
import { Notification, MessageBox } from 'element-ui'   //引入element-ui的消息提示和弹窗
import store from '../store'  //引入vuex
import { getToken } from '@/utils/auth'  //获取token方法引入
import Cookies from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 900000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    config.headers['Accept-Language'] = Cookies.get('language') || (navigator.language || navigator.browserLanguage).substr(0,2)
    return config
  },
  error => {
    // Do something with request error
    //如果token不对则报错
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.data.status
    //验证请求返回的状态码
    if (code < 200 || code > 300) { //如果请求错误  提示相应的错误信息
      Notification.error({
        title: response.data.message
      })
      return Promise.reject('error')
    } else { //请求正确返回的请求数据
      return response.data
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.data.status
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
      router.push({ path: '/401' })
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
export default service
