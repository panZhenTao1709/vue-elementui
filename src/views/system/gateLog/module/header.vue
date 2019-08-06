<template>
  <div class="head-container">
    <!--
{{ $t('btn.search') }} -->
    <el-input
      v-model="query.value"
      clearable
      :placeholder="this.$t('table.inputActionMethodSearch')"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"/>
    <el-button-group>
      <el-tooltip :content="this.$t('table.search')" placement="top" effect="light">
      <el-button  class="filter-item" size="mini" type="info" icon="el-icon-search"  @click="toQuery"/>
      </el-tooltip>
      <!-- <el-tooltip :content="this.$t('table.newlyIncreased')" placement="top"  effect="light">
      <el-button  class="filter-item" size="mini" type="success"  icon="el-icon-plus"  @click="add"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('table.edit')" placement="top"  effect="light">
      <el-button  class="filter-item" size="mini" type="primary"  icon="el-icon-edit"  @click="edit"/>
      </el-tooltip>
      <el-tooltip :content="$t('btn.del')" placement="top" effect="light">
        <el-button  v-popover:delPop class="filter-item" size="mini" type="danger" icon="el-icon-delete"  :loading="delLoading"/>
      </el-tooltip> -->
    </el-button-group>
    <!--删除时的弹出提示-->
    <el-popover placement="top" width="180" ref="delPop">
      <p>{{$t('table.deleteData')}}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="$refs.delPop.doClose()">取消</el-button>
        <el-button type="primary" size="mini" @click="del">确定</el-button>
      </div>
    </el-popover>
  </div>
</template>

<script>
  import { checkPermission } from '@/checkPermission'
  import eForm from './form'
  // 查询条件
  export default {
    components: { eForm },
    props: {
      query: {
        type: Object,
        required: true
      },
      sup_this: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        downloadLoading: false,
        delLoading: false,
      }
    },
    methods: {
      checkPermission,
      toQuery() {
        this.sup_this.page = 0
        this.sup_this.init()
      },
       add() {
      this.$refs.form.getCompany()
      this.$refs.form.dialog = true
      this.isAdd = true
      this.$refs.form.form = {}
    },
    edit() {
      if(this.sup_this.mutiSelection.length == 0){
        this.$message({
          message: '未选择角色,请选择一个角色!',
          type: 'warning'
        })
        return
      }
      if(this.sup_this.mutiSelection.length > 1){
        this.$message({
          message: '选择的角色过多,请选择一个角色!',
          type: 'warning'
        })
        return
      }
      this.$refs.form.dialog = true
      this.isAdd = false
      //赋值
      let role = this.sup_this.mutiSelection[0];
      this.$refs.form.form = { name: role.name, roleType: role.roleType, isDisable: role.isDisable, id: role.id}
    },
      del() {
      if(this.sup_this.mutiSelection.length == 0){
        this.$message({
          message: '未选择角色,请选择一个角色!',
          type: 'warning'
        })
        return
      }
      if(this.sup_this.mutiSelection.length > 1){
        this.$message({
          message: '选择的角色过多,请选择一个角色!',
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
          title: '删除成功',
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
        console.log(err.response)
      })
    },
    }
  }
</script>
