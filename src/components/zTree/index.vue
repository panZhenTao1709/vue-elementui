
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

<script>
import { initData } from '@/api/data'
import $ from 'jquery'
export default {
  methods: {
    freshArea: function() {
      $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes)
    },
    zTreeOnClick: function(event, treeId, treeNode, clickFlag) {
      this.loading = false
      console.log(treeNode.id)
      initData('api/district/getChildren', { id: treeNode.id }).then(res => {
        console.log(res)
        this.loading = true
      })
      this.tableData = [{
        date: treeNode.tId,
        name: treeNode.name,
        address: treeNode.id
      }]
    },
    zTreeOnCheck: function(event, treeId, treeNode) {
      console.log(treeNode.tId + ', ' + treeNode.name + ',' + treeNode.checked)
    },
    beforeClick: function(treeId, treeNode, clickFlag) {

    }

  }
}
</script>
<style>
    #areaTree{
        border:1px solid #e5e5e5;    margin-bottom: 2px;border-radius: 4px;overflow: hidden;
    }
    .box-title{
            border-radius: 3px 3px 0 0;background-color: #f5f5f5;
    }
    .box-title a{
            color: #2fa4e7;
             text-decoration: none;font-size:14px;    display: block;
    padding: 8px 15px;cursor: pointer;
    }
    .box-title .fa{
        float:right;line-height: 20px;
    }

</style>
