<template>
  <div style="padding:30px;oveflow:hidden;">
    <template >

      <div id="areaTree" style="width:20%;float:left;">
        <div class="box-title">
          <a href="#"><i class="fa  fa-refresh" style="margin-left:80%;" @click="freshArea"><svg-icon icon-class="refresh" /> </i></a>
        </div>
        <div class="tree-box" style="height: 565px;overflow-y:auto;">
          <div class="zTreeDemoBackground left">
            <ul id="treeDemo" class="ztree"/>
          </div>
        </div>
      </div>
    </template>
    <Table v-if="loading" :params="tableData" style="width:80%;float:right"/>
  </div>

</template>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>

<script >
import $ from 'jquery'
import Table from './table'
import { getTreeNodes } from '@/api/administrativeDivision'
import { initData } from '@/api/data'
export default{
  name: 'AreaTree',
  components: { Table },
  data: function() {
    return {
      ress: {},
      loading: true,
      tableData: {},
      setting: {

        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeClick: this.beforeClick,
          onClick: this.zTreeOnClick
        }
      },
      zNodes: []

    }
  },
  mounted() {
    getTreeNodes().then(res => {
      this.ress = Object.assign({}, { res: res })
      this.zNodes = this.ress.res
      $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes).expandAll(true)
    })
  },
  methods: {
    freshArea: function() {
      $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes)
    },
    zTreeOnClick: function(event, treeId, treeNode, clickFlag) {
      this.loading = false
      // console.log(treeNode.id)
      initData('api/district/getChildren', { id: treeNode.id }).then(res => {
        this.tableData = Object.assign({}, { res: res })
        this.loading = true
      })
    },
    zTreeOnCheck: function(event, treeId, treeNode) {
    },
    beforeClick: function(treeId, treeNode, clickFlag) {

    }
  }
}

</script>
<style scope>
  .tree-box,.zTreeDemoBackground {
    width:100%
  }
</style>
