<template>
  <el-dropdown trigger="click" class="international international1" @command="handleSetTheme">

    <div>
    <svg-icon icon-class="theme" style="font-size:20px"/></div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="theme==='1'" command="1">{{$t('Theme.a')}}</el-dropdown-item>
      <el-dropdown-item :disabled="theme==='2'" command="2">{{$t('Theme.b')}}</el-dropdown-item>
      <el-dropdown-item :disabled="theme==='3'" command="3">{{$t('Theme.c')}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import $ from 'jquery'
export default {
   computed: {
    theme() {
      return this.$store.state.user.theme
    }
   },
  methods: {
    handleSetTheme(theme) {
        const http=window.location.origin
        $("#style").attr("href",http+"/plugins/theme"+theme+".css?v=1.11");
        localStorage.setItem("theme",theme)
        this.$store.commit('SET_THEME', theme)
    }
  }
}
</script>
<style>
.international1{
  margin-bottom:13px!important;
}
</style>
