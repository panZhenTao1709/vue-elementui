<template>
  <div class="head-container">
    <eForm ref="form" :is-add="isAdd" :sup_this="sup_this"/>
    <user ref="user" :sup_this="sup_this" :roleName="roleName" />
    <!-- 搜索 -->
    <el-input
      v-model="query.orgName"
      clearable
      :placeholder="this.$t('table.enterNameSearch')"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"/>

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
      <el-tooltip content="删除" placement="top" effect="light">
       <el-button  v-popover:delPop class="filter-item" size="mini" type="danger" icon="el-icon-delete"  :loading="delLoading"/>
      </el-tooltip>
      <el-tooltip content="分配用户" placement="top"  effect="light">
        <el-button  class="filter-item" size="mini" type="success"   icon="el-icon-user"  @click="userPop"/>
      </el-tooltip>
    </el-button-group>
    <!--删除时的弹出提示-->
    <el-popover placement="bottom" width="180" ref="delPop">
      <p>确定删除本条数据吗？</p>
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
  import {del} from '@/api/organization'
  // 查询条件
  export default {
    components: {eForm,user},
    props: {
      sup_this: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
         downloadLoading: false,
        delLoading: false,
        isAdd: true, //添加还是编辑
        query: { //查询条件
          orgName: ''
        },
         roleName: null
      }
    },
    methods: {
      toQuery() {
        this.sup_this.init(this.query)
      },
      add() {
        this.$refs.form.dialog = true
        this.isAdd = true
        // this.$refs.form.form = {}
        this.$refs.form.getOrganization()
      },
      edit() {
        if (this.sup_this.mutiSelection.length == 0) {
          this.$message({
            message: '未选择部门,请选择一个部门!',
            type: 'warning'
          })
          return
        }
        if (this.sup_this.mutiSelection.length > 1) {
          this.$message({
            message: '选择的部门过多,请选择一个部门!',
            type: 'warning'
          })
          return
        }
        this.$refs.form.dialog = true
        this.isAdd = false
        this.$refs.form.getOrganization()
        //赋值
        let organization = this.sup_this.mutiSelection[0];
        this.$refs.form.form = {
          id: organization.id,
          orgName: organization.orgName,
          orgCode: organization.orgCode,
          orgLevel: organization.orgLevel,
          parentId: organization.parentId,
        }
      },
      del() {
        if (this.sup_this.mutiSelection.length == 0) {
          this.$message({
            message: '未选择部门,请选择一个部门!',
            type: 'warning'
          })
          return
        }
        if (this.sup_this.mutiSelection.length > 1) {
          this.$message({
            message: '选择的部门过多,请选择一个部门!',
            type: 'warning'
          })
          return
        }
        //赋值
        let organization = this.sup_this.mutiSelection[0];
        //调用后台删除方法
        let _this = this
        del(organization.id).then(res => {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
          //懒加载调用sup_this.init()只能作用于第一次初始化的数据，嵌套子数据init（）无法更改，局部刷新不适用，改用全局刷新
          _this.$router.replace({
            path: this.$router.path,
            query: {
              t: Date.now()
            }
          })
           _this.$refs.delPop.doClose() 
        }).catch(err => {
          this.$notify({
            title: err.response.data.message,
            type: 'failed',
            duration: 2500
          })
          console.log(err.response)
        })
      },
      /*
弹出用户分配弹窗
 */
      userPop() {
        if(this.sup_this.mutiSelection.length === 0){
          this.$message({
            message: '未选择部门,请选择一个部门!',
            type: 'warning'
          })
          return
        }
        if(this.sup_this.mutiSelection.length > 1){
          this.$message({
            message: '选择的部门过多,请选择一个部门!',
            type: 'warning'
          })
          return
        }
        //赋值
        let org = this.sup_this.mutiSelection[0];
        this.roleName = org
        //弹窗初始化
        this.$refs.user.init(org)
      }
    }
  }
</script>
