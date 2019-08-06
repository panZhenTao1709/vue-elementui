<template>
  <div class="head-container">
    <eForm ref="form" :is-add="isAdd" :sup_this="sup_this" :id="id" />
    <user ref="user" :sup_this="sup_this"/>
    <resource ref="resource" :sup_this="sup_this"/>
    <!-- 搜索 -->
    <el-input
    v-model="query.name"
    clearable
    :placeholder="this.$t('table.enterNameSearch')"
    style="width: 200px;"
    class="filter-item"
    @keyup.enter.native="toQuery"/>

    <el-button-group>
      <el-tooltip :content="this.$t('btn.search')" placement="top"  effect="light">
        <el-button  class="filter-item" size="mini" type="info" icon="el-icon-search"  @click="toQuery"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.add')" placement="top"  effect="light">
        <el-button  class="filter-item" size="mini" type="success"  icon="el-icon-plus"  @click="add"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.edit')" placement="top"  effect="light">
        <el-button  class="filter-item" size="mini" type="primary"  icon="el-icon-edit"  @click="edit"/>
      </el-tooltip>
       <el-tooltip :content="$t('btn.del')" placement="top" effect="light">
        <el-button  v-popover:delPop class="filter-item" size="mini" type="danger" icon="el-icon-delete"  :loading="delLoading"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.Userallocation')" placement="top"  effect="light">
        <el-button  class="filter-item" size="mini" type="success"   icon="el-icon-user"  @click="userPop"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.permissionassignment')" placement="top"  effect="light">
        <el-button  class="filter-item" size="mini" type="primary"   icon="el-icon-key"  @click="resourcePop"/>
      </el-tooltip>
    </el-button-group>
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

import eForm from './form'
import user from './user'
import resource from './resource'
import { del } from '@/api/adminRole'
// 查询条件
export default {
  components: { eForm,user,resource },
  props: {
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAdd : true, //添加还是编辑
      query: { //查询条件
        name: ''
      },
      id:'',
      delLoading: false,
      roleName: null
    }
  },
  methods: {
    toQuery() {
      this.sup_this.init(this.query)
    },
    add() {
      this.$refs.form.getCompany()
      this.$refs.form.dialog = true
      this.isAdd = true
      // this.$refs.form.form = {}
    },
    edit() {
      if(this.sup_this.mutiSelection.length == 0){
        this.$message({
          message: this.$t('table.selectLess'),
          type: 'warning'
        })
        return
      }
      if(this.sup_this.mutiSelection.length > 1){
        this.$message({
          message: this.$t('table.selectMore'),
          type: 'warning'
        })
        return
      }
      this.$refs.form.dialog = true
      this.isAdd = false
      //赋值
      
      let role = this.sup_this.mutiSelection[0];
      this.$refs.form.getCompany()
      this.id = role.id
      this.$refs.form.form = { name: role.name, roleType: role.roleType, isDisable: role.isDisable, id: role.id,companyId:role.companyId}
    },
    del() {
      if(this.sup_this.mutiSelection.length == 0){
        this.$message({
          message:  this.$t('table.selectLess'),
          type: 'warning'
        })
        return
      }
      if(this.sup_this.mutiSelection.length > 1){
        this.$message({
          message: this.$t('table.selectMore'),
          type: 'warning'
        })
        return
      }
      //赋值
      let role = this.sup_this.mutiSelection[0];
      //调用后台删除方法
      let _this = this
      del(role.id).then(res => {
        this.$notify({
          title: this.$t('table.delSuccess'),
          type: 'success',
          duration: 2500
        })
        _this.$router.replace({
          path: this.$router.path,
          query: {
            t: Date.now()
          }
        })
        _this.sup_this.init()
      }).catch(err => {
        debugger
        console.log(err.response)
      })


    },
    /*
    弹出用户分配弹窗
     */
    userPop() {
      if(this.sup_this.mutiSelection.length == 0){
        this.$message({
          message: this.$t('table.selectLess'),
          type: 'warning'
        })
        return
      }
      if(this.sup_this.mutiSelection.length > 1){
        this.$message({
          message: this.$t('table.selectMore'),
          type: 'warning'
        })
        return
      }
      //赋值
      let role = this.sup_this.mutiSelection[0];
      //弹窗初始化
      this.$refs.user.init(role)
    },
    /*
    弹出资源分配弹窗
     */
    resourcePop() {
      if(this.sup_this.mutiSelection.length == 0){
        this.$message({
          message:  this.$t('table.selectLess'),
          type: 'warning'
        })
        return
      }
      if(this.sup_this.mutiSelection.length > 1){
        this.$message({
          message:  this.$t('table.selectMore'),
          type: 'warning'
        })
        return
      }
      //赋值
      let role = this.sup_this.mutiSelection[0];
      //弹窗初始化
      this.$refs.resource.init(role)
    }
  }
}
</script>
