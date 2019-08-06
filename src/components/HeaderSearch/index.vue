<template>
  <div :class="{'show':show}" class="header-search" style="margin-bottom: 12px">
    <svg-icon class-name="search-icon" icon-class="search" style="font-weight:800" @click="click"/>
  </div>
</template>

<script>
import path from 'path'


export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    }
  },
  methods:{
    click:function(){

    }
  }

}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  margin-bottom:13px!important;
  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
