<template>
  <div>
    <el-dialog v-dialogDrag :visible.sync="dialog" :title="this.$t('table.PermissionAssignment')" append-to-body width="500px" style="height:100%;overflow:hidden;">
      <input  ref="input" clearable :placeholder="this.$t('table.enterNameSearch')" style="width: 200px;padding:0 10px!important" class="el-input__inner" @keyup.enter.native="toQuery"/>
      <el-button  class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">{{ $t('btn.search') }}</el-button>
      <el-tree
        style="margin-top:30px;"
        ref="resource"
        :data="[]"
        :load="loadResource"
        :props="defaultProps"
        lazy
        show-checkbox
        node-key="id" />
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="canceldialog">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="saveResource">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import initData from '@/mixins/initData'
  import initDict from '@/mixins/initDict'
  import {getJudgedResource, saveResource} from '@/api/adminRole'

  export default {
    mixins: [initDict,initData],
    props: {
      sup_this: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        dialog: false,
        role:{},//选中的角色
        allList: [], // 当前已加载的资源
        checkList: [],// 当前已加载的资源中被选中的节点
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf'
        },
        height: document.documentElement.clientHeight - 180 + 'px;'
      }
    },
    mounted: function() {
      const that = this
      window.onresize = function temp() {
        that.height = document.documentElement.clientHeight - 180 + 'px;'
      }
    },
    methods: {
      canceldialog(){
        this.dialog = false
      },
      /**
       * 弹框初始化
       */
      init(role) {
        this.role = role
        this.dialog = true
        if(this.$refs.resource){
          this.$refs.resource.setCheckedKeys([])
          this.$refs.resource.remove()
          this.allList = []
          this.loadResource(null,null)
        }
      },
      /**
       * 懒加载资源
       */
      loadResource(node,resolve,name) {
        const _this = this
        const nodes = []
        let checkedKeys = []
        getJudgedResource({parentId: node != null?node.key:null, roleId: this.role.id,name:name}).then(res => {
          _this.$refs.resource.checkStrictly = true //加载时使父子不关联
          checkedKeys = _this.$refs.resource.getCheckedKeys() //获取被选中的节点信息
          res.data.forEach(obj => {
            let temp = {id: obj.id, name: obj.name, children: [], isLeaf: !obj.hasChildren}
            //根节点调用此方法加载
            if(node == null){
              _this.$refs.resource.append(temp,null)
            }
            nodes.push(temp)
            if(obj.hasChecked){
              checkedKeys.push(obj.id)
            }
            this.allList.push(obj.id)
          })
          //其它节点使用懒加载
          if(node != null){
            resolve(nodes)
          }
        }).then(res=>{
          //懒加载完成后使父子关联
          _this.$refs.resource.checkStrictly = false
          _this.$refs.resource.setCheckedKeys(checkedKeys)
        })
      },
      /**
       *  保存角色和资源的关联关系
       */
      saveResource() {
        const checkedList = this.$refs.resource.getCheckedKeys().concat(this.$refs.resource.getHalfCheckedKeys())
        const data = {roleId: this.role.id, delList: this.allList.toString(),checkedList:checkedList.toString()}
        saveResource(data).then(res => {
          this.$notify({
            title: this.$t('table.success'),
            type: 'success',
            duration: 1500
          })
          this.dialog = false
        }).catch(err => {
          console.log(err.res.data.message)
          this.dialog = false
        })
      },
      toQuery() {
        this.dialog = false
        this.loadResource(null, null,this.$refs.input.value)
        this.dialog= true
      }
    }
  }
</script>
<style scoped>
  .el-card {
    width: 450px;

  }
 .el-dialog{
   margin-top: 10vh!important
 }
  .el-input__inner {
    height: 27px;
    line-height: 27px;
  }
  .el-tree{
    max-height: 414px;
    overflow-y: auto;
  }
  .el-table{
    max-height: 450px;
    overflow: auto;
  }
</style>
