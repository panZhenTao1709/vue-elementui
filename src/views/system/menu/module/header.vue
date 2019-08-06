<template>
  <div class="head-container center-class">
    <!--
{{ $t('btn.search') }} -->
    <el-input v-model="query.value" clearable :placeholder="this.$t('table.enterNameSearch')" style="width: 200px;" class="" @keyup.enter.native="toQuery"/>
    <el-switch v-model="query.isMenu" :active-text="this.$t('table.menu')" :inactive-text="this.$t('table.port')" class="switchover"
               active-color="#409EFF" inactive-color="#13ce66" @change="toQuery"/>
  <el-button-group class="center-class">
    <el-tooltip :content="this.$t('table.search')" placement="top" effect="light">
      <el-button  class="filter-item" size="mini" type="info" icon="el-icon-search"  @click="toQuery"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('table.newlyIncreased')" placement="top"  effect="light">
      <el-button  class="filter-item" size="mini" type="success"  icon="el-icon-plus"  @click="add"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.edit')" placement="top"  effect="light">
        <el-button  class="filter-item" size="mini" type="primary"  icon="el-icon-edit"  @click="edit"/>
      </el-tooltip>
       <el-tooltip :content="$t('btn.del')" placement="top" effect="light">
        <el-button  v-popover:delPop class="filter-item" size="mini" type="danger" icon="el-icon-delete"  :loading="delLoading"/>
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
    <!-- 新增 -->
    <div  style="display: inline-block;margin: 0px 2px;">
      <!-- <el-button
        class="add"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="add">{{$t('table.newlyIncreased')}}</el-button> -->
      <eForm ref="form" :is-add="isadd" :is-menu="query.isMenu" />
    </div>

  </div>
</template>

<script>
import { del } from '@/api/menu'
import eForm from './form'
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
      isadd: true,
      delLoading: false,
    }
  },
  methods: {
    toQuery() {
      this.$parent.$parent.init()
    },
    add() {
      this.isadd = true
      this.$refs.form.getMenus()
      this.$refs.form.getNacosService()
      this.$refs.form.dialog = true
    },
    expand() {
      this.$parent.expand = !this.$parent.expand
      // this.$parent.init()
    },
      edit() {
      this.isadd = false
      const _this = this.$refs.form
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
      let role = this.sup_this.mutiSelection[0]; //赋值
      // _this.form = { id: this.data.id, component: this.data.component, name: this.data.name, sort: this.data.sort, pid: this.data.pid, path: this.data.path, iframe: this.data.iframe.toString(), roles: [], icon: this.data.icon }
      _this.form = {  //传参
        code:role.code, 
        id: role.id, 
        name: role.name, 
        icon: role.icon, 
        menuType: role.menuType, 
        href: role.href, 
        serviceId: role.serviceId, 
        permissionCode: role.permissionCode, 
        method: role.method, 
        isShow: role.isShow, 
        }
      _this.getNacosService()
    },
    del(){
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
        // _this.sup_this.init()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
  .head-container{
    margin: 0 0 10px 0;
  }
  .search{
    margin-left:5px;
  }
   .add{
        margin-left:5px;
   }
   .switchover{
     margin: 0 5px 0 10px;
   }
  .center-class{
    height: 30px!important;
  }
</style>
