<template >
  <div id="wrapper" style="padding:30px;oveflow:hidden;">
    <div id="areaTree" style="width:20%;float:left">
      <div class="box-title" >
        <a href="#" style="cursor:default" ><i class="fa  fa-refresh" @click="freshArea"><svg-icon icon-class="refresh" /> </i></a>
      </div>
      <div class="tree-box" >
        <div id = "left" class="zTreeDemoBackground left" style="position:relative">
          <ul id="treeDemo" class="ztree" style="width:100%;height: 565px;overflow-y:auto;padding-bottom:100px"/>
          <div id="rMenu" style="position:absolute;display:none;background-color: #fff;border:1px solid #c9caca;padding: 2px 0;z-index: 999;">
            <ul>
              <button id="addBtn" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="left" title="添加下级" @click="add()"><i class="fa fa-plus"/>添加下级</button>
              <button class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="left" title="修改区域" @click="edit()"><i class="fa fa-edit"/>修改区域</button>
              <button class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="删除区域" @click="del()"><i class="fa fa-trash-o"/>删除区域</button>
              <button id="bindeBtn" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="绑定行政区域" @click="bindArea()"><i class="fa fa-trash-o"/>绑定行政区域</button>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <Table v-if="loading" :paramss="tableData" style="width:80%;float:right" />
    <!-- 销售区域修改 -->
    <el-dialog
      :visible.sync="centerDialogVisible1"
      append-to-body
      width="530px"
      title="销售区域修改"
      center>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">

        <el-form-item label="区域名字" prop="name">
          <el-input v-model="form.name" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="区域编码" prop="areaCode">
          <el-input v-model="form.areaCode" style="width: 370px;"/>
        </el-form-item>
        <el-form-item style="margin-top: -10px;" label="描述">
          <el-input v-model="form.remark" style="width: 370px;" rows="5" type="textarea"/>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="dosubmitEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 销售区域新增 -->
    <el-dialog
      :visible.sync="centerDialogVisible2"
      append-to-body
      width="530px"
      title="销售区域新增"
      center>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="上级区域" prop="name">
          <el-input v-model="form.name" style="width: 370px;" readonly="readonly"/>
        </el-form-item>
        <el-form-item label="区域名字" prop="addname">
          <el-input v-model="form.addname" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="区域编码" prop="areaCode">
          <el-input v-model="form.areaCode" style="width: 370px;"/>
        </el-form-item>
        <el-form-item style="margin-top: -10px;" label="描述">
          <el-input v-model="form.remark" style="width: 370px;" rows="5" type="textarea"/>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dosubmitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 销售区域删除 -->
    <el-dialog
      :visible.sync="centerDialogVisible3"
      append-to-body
      width="530px"
      title="销售区域删除"
      center>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">

        <el-form-item label="区域名字" prop="name">
          <el-input v-model="form.name" style="width: 370px;" readonly="readonly"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 370px;" readonly="readonly"/>
        </el-form-item>
        <el-form-item label="区域编码" prop="areaCode">
          <el-input v-model="form.areaCode" style="width: 370px;" readonly="readonly"/>
        </el-form-item>
        <el-form-item style="margin-top: -10px;" label="描述">
          <el-input v-model="form.remark" style="width: 370px;" rows="5" type="textarea"/>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="dosubmitDel">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 绑定行政区域 -->
    <el-dialog
      :visible.sync="centerDialogVisible4"
      append-to-body
      width="530px"
      title="绑定行政区域"
      center>
      <p>选择行政区域</p>
      <el-main>
        <el-select v-model="province" placeholder="省" style="width: 435px;" @change="indexSelectProvince">
          <el-option
            v-for="item in selectProvince"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-select v-model="city" placeholder="市" style="width: 435px;" @change="indexSelectCity">
          <el-option
            v-for="item in selectCity"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-select v-model="area" placeholder="区" style="width: 435px;" @change="indexSelectArea">
          <el-option
            v-for="item in selectArea"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-select v-if="loading" v-model="street" placeholder="街道" style="width: 435px;" @change="indexSelectStreet">
          <el-option
            v-for="item in selectStreet"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-main>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="dosubmitBind">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Table from './module/table'
import Edit from './module/edit'
import $ from 'jquery'
import { initData } from '@/api/data'
// addSalesTreeNodes, delSalesTreeNodes, editSalesTreeNodes, querySalesTreeNodes
import { querySalesTreeNodes, sellerAreabind, getProvinces, dragUpdateSort, editSalesTreeNodes, filterlist, addSalesTreeNodes, delSalesTreeNodes } from '@/api/administrativeDivision'
export default {
  components: {
    Edit,
    Table
  },

  data: function() {
    return {
      log: '', className: 'dark', curDragNodes: [], autoExpandNode: {},
      districtId: '',
      sellerAreaId: '',
      selectProvince: [], selectCity: [], selectArea: [], selectStreet: [],
      selectParams: '',
      tableData: {},
      province: '', city: '', area: '', street: '',
      form: { name: '', permissions: [], remark: '', sort: '', areaCode: '', id: '', addname: '' },
      rules: {
        // name: [
        //   { required: true, message: '请输入名称', trigger: 'blur' }
        // ]
      },
      centerDialogVisible1: false,
      centerDialogVisible2: false,
      centerDialogVisible3: false,
      centerDialogVisible4: false,
      loading: true,
      treeId: '',
      treeName: '',
      treeNodes: {},
      setting: {
        edit: {
          drag: {
            autoExpandTrigger: true,
            prev: this.dropPrev,
            inner: this.dropInner,
            next: this.dropNext
          },
          enable: true,
          showRemoveBtn: false,
          showRenameBtn: false
        },
        check: {
          enable: false,
          nocheckInherit: false,
          chkboxType: { 'Y': 'p', 'N': 's' }
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeClick: this.beforeClick,
          onClick: this.zTreeOnClick,
          onRightClick: this.zTreeOnRightClick,
          onDrag: this.onDrag,
          onDrop: this.onDrop
        }
      },
      zNodes: [
      ]

    }
  },
  mounted() {
    this.bind()
    this.loadData()
  },
  methods: {
    bind: function() {
      $('#wrapper').bind(// 鼠标点击事件不在节点上时隐藏右键菜单
        'mousedown',
        function(event) {
          if (!(event.target.id === 'rMenu' || $(event.target)
            .parents('#rMenu').length > 0)) {
            $('#rMenu').hide()
          }
        })
    },
    loadData: function() {
      querySalesTreeNodes().then(res => {
        this.treeNodes = Object.assign({}, { res: res })
        this.zNodes = [{ name: '九阳豆业', id: 0, parentid: 0, children: filterlist(this.treeNodes.res.content) }]
        $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes).expandAll(true)
      })
    },
    freshArea: function() {
      querySalesTreeNodes().then(res => {
        this.treeNodes = Object.assign({}, { res: res })
        this.zNodes = [{ name: '九阳豆业', id: 0, parentid: 0, children: filterlist(this.treeNodes.res.content) }]
        $.fn.zTree.init($('#treeDemo'), this.setting, this.zNodes)
      })
    },
    zTreeOnClick: function(event, treeId, treeNode) {
      this.loading = false
      this.tableData = Object.assign({}, { sellerAreaId: treeNode.id })
      setTimeout(() => {
        this.loading = true
      }, 500)
    },

    beforeClick: function(treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj('treeDemo')
      zTree.checkNode(treeNode, !treeNode.checked, true, true) // 第二个参数!treeNode.checked和"",省略此参数效果等同，则根据对此节点的勾选状态进行 toggle 切换，第三个参数设置为true时候进行父子节点的勾选联动操作 ，第四个参数true 表示执行此方法时触发 beforeCheck & onCheck 事件回调函数；false 表示执行此方法时不触发事件回调函数
    },
    zTreeOnRightClick: function(event, treeId, treeNode) {
      // console.log(event)
      if (treeNode && !treeNode.noR) { // noR属性为true表示禁止右键菜单
        this.showRMenu(treeNode.parentid, treeNode.id, treeNode.sellareaname, treeNode.sellareacode, treeNode.remarks, treeNode.seq, event.offsetX, event.pageY)
        if (treeNode.children != null) {
          $('#bindeBtn').hide()
        }
        if (treeNode.pathlevel === 3) {
          $('#addBtn').hide()
        } else {
          $('#bindeBtn').hide()
        }
      }
    },
    showRMenu: function(parentid, id, name, sellareacode, remarks, sort, x, y) {
      this.form.id = id
      this.sellerAreaId = id
      this.form.parentid = parentid
      this.form.areaCode = sellareacode
      this.form.remark = remarks
      this.form.sort = sort
      this.form.name = name
      // name: '', permissions: [], remark: '', sort: '', areaCode: '', id: ''
      const scrollTop = $('#areaTree').scrollTop()
      $('#rMenu ul').show()
      if (id === 0) {
        $('#rMenu button:nth-child(2)').hide()
        $('#rMenu button:nth-child(3)').hide()
      } else {
        $('#rMenu button').show()
      }
      $('#rMenu').css({ 'top': y + scrollTop - 125 - 50 + 'px', 'left': x + 15 + 'px', 'display': 'block' })
    },
    edit: function() {
      $('#rMenu').hide()
      this.centerDialogVisible1 = true
    },
    add: function() {
      $('#rMenu').hide()
      this.centerDialogVisible2 = true
    },
    del: function() {
      $('#rMenu').hide()
      this.centerDialogVisible3 = true
    },
    bindArea: function() {
      $('#rMenu').hide()
      getProvinces().then(res => {
        this.selectProvince = res
      })
      this.centerDialogVisible4 = true
    },
    dosubmitEdit: function() {
      const params = {
        parentid: this.form.parentid,
        id: this.form.id,
        sellareacode: this.form.areaCode,
        sellareaname: this.form.name,
        remarks: this.form.remark,
        seq: this.form.sort
      }
      editSalesTreeNodes(params).then(res => {
        this.loadData()
        this.centerDialogVisible1 = false
      })
    },
    dosubmitAdd: function() {
      const params = {
        parentid: this.form.id,
        sellareacode: this.form.areaCode,
        sellareaname: this.form.addname,
        remarks: this.form.remark,
        seq: this.form.sort
      }
      addSalesTreeNodes(params).then(res => {
        this.loadData()
        this.centerDialogVisible2 = false
      })
    },
    dosubmitDel: function() {
      const params = {
        parentid: this.form.parentid,
        id: this.form.id,
        sellareacode: this.form.areaCode,
        sellareaname: this.form.name,
        remarks: this.form.remark,
        seq: this.form.sort
      }
      delSalesTreeNodes(params).then(res => {
        this.loadData()
        this.centerDialogVisible3 = false
      })
    },

    // 销售区域绑定行政区域
    indexSelectProvince: function() {
      initData('api/district/getChildren', { id: this.province }).then(res => {
        this.selectCity = res
      })
    },
    indexSelectCity: function() {
      initData('api/district/getChildren', { id: this.city }).then(res => {
        this.selectArea = res
      })
    },
    indexSelectArea: function() {
      initData('api/district/getChildren', { id: this.area }).then(res => {
        this.selectStreet = res
      })
    },
    indexSelectStreet: function() {
      this.districtId = this.street
    },
    dosubmitBind: function() {
      this.loading = false
      this.centerDialogVisible4 = false
      sellerAreabind({ sellerAreaId: this.sellerAreaId, districtId: this.districtId }).then(res => {
        this.loadData()

        this.loading = true
      })
      // 数据初始化
      this.selectProvince = null
      this.selectCity = null
      this.selectArea = null
      this.selectStreet = null
      this.province = null
      this.city = null
      this.area = null
      this.street = null
    },
    // 控制tree节点拖拽 1.只允许最后一级节点的拖拽 2.相同父节点的子节点的拖拽可实现排序
    dropPrev: function(treeId, nodes, targetNode) {
      if (nodes && targetNode && targetNode.pathlevel > nodes[0].pathlevel) {
        return false
      }
      if (nodes && targetNode && targetNode.parentid !== nodes[0].parentid) {
        return false
      }
      var pNode = targetNode.getParentNode()
      if (pNode && pNode.dropInner === false) {
        return false
      } else {
        for (var i = 0, l = this.curDragNodes.length; i < l; i++) {
          var curPNode = this.curDragNodes[i].getParentNode()
          if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
            return false
          }
        }
      }

      return true
    },
    dropInner: function(treeId, nodes, targetNode) {
      // console.log(nodes[0].pathlevel, targetNode.pathlevel)
      if (nodes && targetNode && targetNode.pathlevel === nodes[0].pathlevel) {
        return false
      }
      // if (nodes && targetNode && targetNode.pathlevel > nodes[0].pathlevel) {
      //   return false
      // }
      if (nodes && targetNode && nodes[0].pathlevel - targetNode.pathlevel !== 1) {
        return false
      }
      return true
    },
    dropNext: function(treeId, nodes, targetNode) {
      if (nodes && targetNode && targetNode.pathlevel > nodes[0].pathlevel) {
        return false
      }
      if (nodes && targetNode && targetNode.parentid !== nodes[0].parentid) {
        return false
      }
      var pNode = targetNode.getParentNode()
      if (pNode && pNode.dropInner === false) {
        return false
      } else {
        for (var i = 0, l = this.curDragNodes.length; i < l; i++) {
          var curPNode = this.curDragNodes[i].getParentNode()
          if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
            return false
          }
        }
      }
      return true
    },
    onDrag: function(event, treeId, treeNodes) {
      // console.log(treeId, treeNodes)
      this.className = (this.className === 'dark' ? '' : 'dark')
    },
    onDrop: function(event, treeId, treeNodes, targetNode, moveType, isCopy) {
      // console.log(treeNodes, '----', targetNode, '----', moveType)
      this.className = (this.className === 'dark' ? '' : 'dark')
      if (moveType === 'inner') {
        const data = {
          updateId: treeNodes[0].id,
          oldId: targetNode.id
        }
        dragUpdateSort(data)
      }
    }
  }
}
</script>
<style scope>
    #areaTree{
        border:1px solid #e5e5e5;    margin-bottom: 2px;border-radius: 4px;overflow: hidden;
    }
    .box-title{
            border-radius: 3px 3px 0 0;background-color: #f5f5f5;
    }
    .box-title a{
            color: #2fa4e7;
             text-decoration: none;font-size:14px;    display: block;

    height: 27px;
    line-height: 27px;
    padding: 5px 15px;
    }
    .box-title .fa{
        float:right;line-height: 20px;
        cursor:pointer
    }

    p, span, ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
}
   .btn{
     display:block;
     font-size:14px;
     cursor:pointer;
     width:100%;
   }
.el-form-item--small.el-form-item {
    margin-bottom: 33px;
}
.tree-box,.zTreeDemoBackground {
    width:100%
  }
  .el-select{
    margin-bottom:5px;
  }
</style>
