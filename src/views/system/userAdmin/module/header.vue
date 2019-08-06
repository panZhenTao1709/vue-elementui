<template>
  <div class="head-container">
    <!-- 
{{ $t('btn.search') }} -->
    <el-input
    v-model="query.value"
    clearable :placeholder="this.$t('table.enterKeywordSearch')"
    style="width: 200px;"
    class="filter-item"
    v-if="checkPermission('查询',sup_this)"
    @keyup.enter.native="toQuery"/>
    <el-select
    v-model="query.type"
    clearable :placeholder="this.$t('table.type')"
    class="filter-item"
    v-if="checkPermission('查询',sup_this)"
    style="width: 130px">
      <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
    </el-select>

    <!-- <el-button v-if="checkPermission('查询',sup_this)" class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">
{{ $t('btn.search') }}</el-button>
    <div style="display: inline-block;margin: 0px 2px;" v-if="checkPermission('新增',sup_this)">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="add">{{$t('table.newlyIncreased')}}</el-button>
    
    </div>


    <div style="display: inline-block;">
      <el-button
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
        icon="icon iconfont icon-icon_execl"
        @click="download"> {{$t('table.execlExport')}}</el-button>
    </div> -->
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
    </el-button-group>
      <eForm ref="form" :sup_this="sup_this" :is-add="isAdd"  :data="data"/>
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
import { checkPermission } from '@/checkPermission'
import { parseTime } from '@/utils/index'
import eForm from './form'
import { del } from '@/api/user'
// 查询条件
export default {
  components: { eForm },
  props: {
    userInfo:{
      type:Array,
      default:null
    },
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
      isAdd: true, //判断添加还是编辑
      data: {},
      downloadLoading: false,
      queryTypeOptions: [
        { key: 'userName', display_name: '用户名' },
        { key: 'name', display_name: '姓名' }
      ],
      delLoading: false,
      // ,
      // enabledTypeOptions: [
      //   { key: 'true', display_name: '激活' },
      //   { key: 'false', display_name: '锁定' }
      // ]
    }
  },
  methods: {
    checkPermission,
    add() {
      // this.$refs.form.getDepts()
      // this.$refs.form.getCompanyInfo()
      this.$refs.form.getAdminRole()
      this.$refs.form.getCompany1()
      this.$refs.form.dialog = true
      this.$parent.addloading = false
      setTimeout(() => {
        this.$parent.addloading = true
      }, 1000)
    },
    //删除功能
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
    edit() { //编辑页面
      if(this.userInfo.length == 0){
        this.$message({
          message: this.$t('table.selectLess'),
          type: 'warning'
        })
        return
      }
      if(this.userInfo.length > 1){
        this.$message({
          message: this.$t('table.selectMore'),
          type: 'warning'
        })
        return
      }
      this.data = this.userInfo[0]
      this.$refs.form.dialog = true
      this.isAdd = false
      //赋值
      this.data = this.userInfo[0]
      let role = this.userInfo[0];
      this.$refs.form.form = {
        id: role.id,
        userName:role.userName,
        email:role.email,
        phone:role.phone,
        area:role.area,
        name:role.name,
        password:role.password,
       
      }
      this.$refs.form.getCompanyInfo(role.id)
      this.$refs.form.getAdminRoleInfo(role.id)
    },
    // 去查询
    toQuery() {
      this.sup_this.page = 0
      this.sup_this.init()
    },
    // 导出
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户名', '邮箱', '头像地址', '状态', '注册日期', '最后修改密码日期']
        const filterVal = ['id', 'username', 'email', 'avatar', 'enabled', 'createTime', 'lastPasswordResetTime']
        const data = this.formatJson(filterVal, this.sup_this.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
