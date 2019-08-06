import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

import { getToken,removeToken } from '@/utils/auth' // getToken from cookie
import { buildMenus } from '@/api/menu'
import { filterAsyncRouter } from './store/modules/permission'
import { MessageBox } from 'element-ui'


NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login','/cas']// no redirect whitelist

router.beforeEach((to, from, next) => {
  if (to.path === '/cas'){//cas 登录
      removeToken()
     const token = to.query.token
     if(token){
        store.dispatch('autoLogin',token).then(res => { // 拉取user_info
            // 动态路由，拉取菜单
            loadMenus(next, to)
            next({ path: '/' })
          }).catch((err) => {
            alert(err)
            next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
            NProgress.done()
          })
          
     }
  }
  
  if (to.meta.title) {
    document.title = to.meta.title + ' - 微服务系统'
  }
  NProgress.start() // start progress bar
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
        // loadMenus(next, to)
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch((err) => {
          console.log(err)
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      // 登录时未拉取 菜单，在此处拉取
      } else
      if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus').then(res => {})
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    if (res.status === 40301) {
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
    }
    const asyncRouter = filterAsyncRouter(res)
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
      router.addRoutes(asyncRouter) // 动态添加可访问路由表
      next({ ...to, replace: true })// hack方法 确保addRoutes已完成
    })
  })
}

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
