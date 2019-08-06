<template>
  <div class="head-container">
    <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button-group>
      <el-tooltip content="搜索" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="info" icon="el-icon-search" @click="toQuery"/>
      </el-tooltip>
      <el-tooltip content="增加" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="add"/>
      </el-tooltip>
      <el-tooltip content="编辑" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="edit"/>
      </el-tooltip>
      <el-tooltip :content="$t('btn.del')" placement="top" effect="light">
        <el-button  v-popover:delPop class="filter-item" size="mini" type="danger" icon="el-icon-delete"  :loading="delLoading"/>
      </el-tooltip>
      <el-tooltip content="关联权限" placement="top"  effect="light">
        <el-button  class="filter-item" icon="el-icon-lock" size="mini" type="success"  @click="resourcePop"/>
      </el-tooltip>
    </el-button-group>
    <eForm ref="form" :is-add="isAdd" :sup_this="sup_this"/>
    <resource ref="resource" :sup_this="sup_this"/>
    <!--删除时的弹出提示-->
    <el-popover placement="bottom" width="180" ref="delPop">
      <p>{{$t('table.deleteData')}}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="$refs.delPop.doClose()">取消</el-button>
        <el-button type="primary" size="mini" @click="del">确定</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>

  import {checkPermission} from '@/checkPermission'
  import eForm from './form'
  import resource from './resource'
  import {del} from '@/api/app'
  // 查询条件
  export default {
    components: {eForm, resource},
    props: {
      sup_this: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        isAdd:true,
        downloadLoading: false,
        delLoading: false,
        query:{value:''}
      }
    },
    methods: {
      checkPermission,
      toQuery() {
        this.sup_this.page = 0
        this.sup_this.query = this.query
        this.$parent.init()
      },
      add() {
        this.isAdd = true
        
        this.$refs.form.getNacosService()
        /**新增不点击确定和取消按钮下次新增回显上次内容 */
        this.$refs.form.form =  this.$refs.form.formAdd
        this.$refs.form.dialog = true
      },
      edit() {
        if (this.sup_this.mutiSelection.length == 0) {
          this.$message({
            message: '未选择应用,请选择一个应用!',
            type: 'warning'
          })
          return
        }
        if (this.sup_this.mutiSelection.length > 1) {
          this.$message({
            message: '选择的应用过多,请选择一个应用!',
            type: 'warning'
          })
          return
        }
        
        this.isAdd = false
        //赋值
        let app = this.sup_this.mutiSelection[0];
        this.$refs.form.form = {id: app.id, appid: app.appid,secret:app.secret,expireTime:app.expireTime,isOnly:app.isOnly,remark:app.remark }
        this.$refs.form.dialog = true
     },
      del(id) {
        if (this.sup_this.mutiSelection.length == 0) {
          this.$message({
            message: '未选择应用,请选择一个应用!',
            type: 'warning'
          })
          return
        }
        if (this.sup_this.mutiSelection.length > 1) {
          this.$message({
            message: '选择的应用过多,请选择一个应用!',
            type: 'warning'
          })
          return
        }
        //赋值
        let app = this.sup_this.mutiSelection[0];
        const _this = this
        _this.delLoading = true
        del(app.id).then(res => {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
          _this.delLoading = false
          _this.$router.replace({
            path: this.$router.path,
            query: {
              t: Date.now()
            }
          })
          _this.sup_this.init()
        }).catch(err => {
          _this.delLoading = false
          console.log(err.response)
        })
      },
      /*
       弹出用权限关联弹窗
        */
      resourcePop() {
        if (this.sup_this.mutiSelection.length == 0) {
          this.$message({
            message: '未选择应用,请选择一个应用!',
            type: 'warning'
          })
          return
        }
        if (this.sup_this.mutiSelection.length > 1) {
          this.$message({
            message: '选择的应用过多,请选择一个应用!',
            type: 'warning'
          })
          return
        }
        //赋值
        let app = this.sup_this.mutiSelection[0];
        //弹窗初始化
        this.$refs.resource.init(app)
      },
    }
  }
</script>
