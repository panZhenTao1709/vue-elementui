<template>
  <div class="head-container">

    <el-input 
    v-model="query.value" 
    clearable :placeholder="this.$t('table.enterKeywordSearch')" 
    style="width: 200px;" class="filter-item" 
    v-if="checkPermission('查询',sup_this)"
    @keyup.enter.native="toQuery"/>
    <el-select v-if="checkPermission('查询',sup_this)" v-model="query.type" clearable :placeholder="this.$t('table.type')" class="filter-item" style="width: 130px">
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
      <eForm ref="form" :sup_this="sup_this" :is-add="true" :dicts="dicts" :data="data"/>
    </div>
   
    <div style="display: inline-block;">
      <el-button
      
        :loading="downloadLoading"
        size="mini"
        class="filter-item"
        type="warning"
         icon="icon iconfont icon-icon_execl"
        @click="download"> {{$t('table.execlExport')}}</el-button>
    </div>
 -->


    <el-button-group>
     <el-tooltip :content="this.$t('btn.search')" placement="top"  effect="light">
       <el-button  class="filter-item" size="mini" type="info" icon="el-icon-search"  @click="toQuery"/>
     </el-tooltip>
     <el-tooltip :content="this.$t('btn.add')" placement="top"  effect="light">
        <el-button  class="filter-item" size="mini" type="success"  icon="el-icon-plus"  @click="add"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.edit')" placement="top"  effect="light">
          <edit   :multipleSelection="multipleSelection" :sup_this="sup_this"  />
      </el-tooltip>
      <el-tooltip :content="this.$t('btn.batchRemove')" placement="top"  effect="light">
       <el-button  v-popover:delPop class="filter-item" size="mini" type="danger" icon="el-icon-delete"  :loading="delLoading"/>
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


    <eForm ref="form" :sup_this="sup_this" :is-add="true"  />

  </div>
</template>

<script>
import edit from './edit'
import { checkPermission } from '@/checkPermission'
import { parseTime } from '@/utils/index'
import eForm from './form'
import {del} from '@/api/user'
// 查询条件
export default {
  components: { eForm,edit },
  props: {
    multipleSelection:{
      type:Array,
      default:null,
    },
    currentUser:{
      type:Object,
      default:null,
    },
    query: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    
  },
  data() {
    return {
      data: null,
      delLoading:false,
      downloadLoading: false,
      queryTypeOptions: [
        { key: 'userName', display_name: this.$t('table.userName') },
        { key: 'name', display_name: this.$t('table.name') }
       ]
      //  ,
      // enabledTypeOptions: [
      //   { key: 'true', display_name: '激活' },
      //   { key: 'false', display_name: '锁定' }
      // ]
    }
  },
  methods: {
    checkPermission,
    add() {
      this.$refs.form.getOrgs()
      this.$refs.form.getRoles()
      this.$refs.form.dialog = true
      this.$parent.addloading = false
      setTimeout(() => {
        this.$parent.addloading = true
      }, 1000)
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
        const tHeader = ['ID', this.$t('table.userName'), this.$t('table.email'), this.$t('table.headPortraitAddress'), this.$t('table.status'), this.$t('table.registrationDate'), this.$t('table.lastchangepassword')]
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
          return parseTime(v[j]) ? this.$t('table.startuse') : this.$t('table.forbidden')
        } else {
          return v[j]
        }
      }))
    },
    //
    del() {
      if(this.sup_this.multipleSelection.length == 0){
        this.$message({
          message: this.$t('table.selectLess'),
          type: 'warning'
        })
        return
      }
      if(this.sup_this.multipleSelection.length > 1){
        this.$message({
          message: this.$t('table.selectMore'),
          type: 'warning'
        })
        return
      }
      //赋值
      let role = this.sup_this.multipleSelection[0];
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
        console.log(err.response)
      })


    },
  }
}
</script>
