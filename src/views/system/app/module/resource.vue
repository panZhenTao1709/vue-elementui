<template>
  <div>
    <el-dialog :visible.sync="dialog" title="权限分配" append-to-body width="500px" style="height:100%;overflow:hidden;">
      <input ref="input" clearable placeholder="输入名称搜索" style="width: 200px;padding:0 10px!important" class="el-input__inner" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">
        {{ $t('btn.search') }}</el-button>
      <el-tree
        style="margin-top:30px;"
        ref="resource"
        :data="[]"
        :load="loadResource"
        :props="defaultProps"
        check-strictly
        lazy
        show-checkbox
        node-key="id"/>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="saveResource">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {initData} from '@/api/data'
  import {getJudgedResource, saveResource} from '@/api/app'

  export default {
    data() {
      return {
        app:{},
        dialog: false,
        allList: [], // 当前已加载的资源
        checkList: [],// 当前已加载的资源中被选中的节点
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'isLeaf'
        }
      }
    },
    methods: {
      /**
       * 弹框初始化
       */
      init(app) {
        this.app = app
        this.dialog = true
        const _this = this
        if(this.$refs.resource){
          this.$refs.resource.setCheckedKeys([])
          this.$refs.resource.remove()
          this.allList = []
          this.loadResource(null,null)
        }
      },
      cancel() {
        this.dialog = false
      },

      /**
       * 懒加载资源
       */
      loadResource(node,resolve,name) {
        const _this = this
        const nodes = []
        let checkedKeys = []
        getJudgedResource({parentId: node != null?node.key:null, appId: this.app.id,name:name}).then(res => {
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
        const addList = this.$refs.resource.getCheckedKeys().concat(this.$refs.resource.getHalfCheckedKeys())
        const data = {appId: this.app.id, delList: this.allList.toString(),addList:addList.toString()}
        saveResource(data).then(res => {
          this.$notify({
            title: '保存成功',
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
  .el-input__inner {
    height: 27px;
    line-height: 27px;
  }
</style>
