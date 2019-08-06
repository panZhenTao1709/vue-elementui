import Vue from 'vue'
import '@/utils/directive.js'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import '@/icons' // icon
import {checkPermission} from './checkPermission' // permission control
import './permission' // permission control

// import BaiduMap from 'vue-baidu-map'


Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// Vue.use(BaiduMap, {
//   ak: 'bWD5XmNMRrEdv7eDuIrNeA8ar7D9dbTu'
// })
Vue.use(mavonEditor)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false  //阻止启动生产消息

// 注册一个全局自定义指令用于判断权限 `v-check`
Vue.directive('check', {
  // 当被绑定的元素插入到 DOM 中时……
  bind: function (el,binding) {
    // 聚焦元素
    let flag = checkPermission(el.innerText,binding.value)
    if(!flag){
      el.parentNode.removeChild(el);
      return
    }
    el.innerText = el.innerText.split("-")[0]
  }
})



new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
