<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group v-if="shouldShow" name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="index">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ generateTitle(item.meta.title) }}</span>
        <!-- <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a> -->
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { generateTitle } from '@/utils/i18n'

export default {
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    shouldShow: function() {
      return this.levelList.filter(function(item) {
        return item.meta.title
      })
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => {
        if (item.name) {
          return true
        }
      })
      const first = matched[0]
      if (first && first.name !== '首页') {
        matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched)
      }
      this.levelList = matched
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },
    generateTitle
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #fff;
      cursor: text;
    }
  }
  .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link{
    color:#fff!important;
  }
</style>
