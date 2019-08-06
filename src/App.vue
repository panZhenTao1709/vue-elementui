<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import $ from 'jquery'
import '@/assets/icon/iconfont.css' //引入阿里巴巴下载的图标
export default {
  name: 'App',
  created() {
    const theme = this.$store.state.user.theme
    const http=window.location.origin
    $('#style').attr('href', http+"/plugins/theme"+theme+".css?v=1.11") // 实现将主题保存在内存中刷新浏览器不改变
  }
}
</script>
