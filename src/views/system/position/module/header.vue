<template>
  <div class="head-container">
    <!--{{ $t('btn.search') }}-->
    <!--<el-input v-model="query" clearable :placeholder="this.$t('table.enterKeywordSearch')" style="width: 200px;"-->
              <!--class="filter-item" @keyup.enter.native="toQuery"/>-->
    <!--<el-select v-model="query.type" clearable :placeholder="this.$t('table.type')" class="filter-item" style="width: 130px">-->
    <!--<el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>-->
    <!--</el-select>-->
    <!--<el-select v-model="query.enabled" clearable :placeholder="this.$t('table.status')" class="filter-item" style="width: 90px" @change="toQuery">-->
    <!--<el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>-->
    <!--</el-select>-->
    <el-input
      v-model="query.posName"
      clearable
      :placeholder="this.$t('table.enterNameSearch')"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="toQuery"/>
    <el-button-group>
      <el-tooltip :content="this.$t('table.search')" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="info" icon="el-icon-search" @click="toQuery"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('table.newlyIncreased')" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="add"/>
      </el-tooltip>
      <el-tooltip :content="this.$t('table.edit')" placement="top" effect="light">
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-edit" @click="edit" />
      </el-tooltip>
       <el-tooltip :content="this.$t('table.delete')" placement="top" effect="light">
       <el-button  v-popover:delPop class="filter-item" size="mini" type="danger" icon="el-icon-delete"  :loading="delLoading"/>
      </el-tooltip>
      <!-- 导出 -->
      <el-tooltip :content="this.$t('table.execlExport')" placement="top" effect="light">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="icon iconfont icon-icon_execl"
          @click="download"></el-button>
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
    <eForm ref="form" :is-add="isadd" :dicts="dicts" :sup_this="sup_this" />
  </div>
</template>

<script>
  import {parseTime} from '@/utils/index'
  import eForm from './form'
  import { del } from '@/api/position'

  // 查询条件
  export default {
    components: {eForm},
    props: {
      // query: {
      //   type: Object,
      //   required: true
      // },
      mutiSelection:{
        type: Array,
        default: null
      },
      sup_this: {
        type: Object,
        required: true
      },
      dicts: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
         delLoading:false,
        downloadLoading: false,
        query: {
          posName: ''
        },
        isadd: true
      }
    },
    methods: {
      edit() {
        if (this.sup_this.mutiSelection.length == 0) {
          this.$message({
            message: '未选择角色,请选择一个角色!',
            type: 'warning'
          })
          return
        }
        if (this.sup_this.mutiSelection.length > 1) {
          this.$message({
            message: '选择的角色过多,请选择一个角色!',
            type: 'warning'
          })
          return
        }
        this.$refs.form.dialog = true
        let role = this.sup_this.mutiSelection[0]; //赋值
        this.isadd = false
        const _this = this.$refs.form
        const id = role.id
        /**
         * 回显
         */
       
        _this.form = {
          id: role.id,
          posName: role.posName,
          posEname: role.posEname,
          orgId: role.orgId
          //organization: role.organization.orgName
        }
        /**
         * 获取部门信息
         * 获取公司信息
         */
        _this.getOrg(id)
        _this.dialog = true
      },
      add() {
        this.isadd = true
        this.$refs.form.getOrg()
        this.$refs.form.dialog = true
      },
      // 去查询
      toQuery() {
        this.sup_this.page = 0
        this.sup_this.init(this.query)
      },
      del(){
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
        let position = this.sup_this.mutiSelection[0];
        //调用后台删除方法
        let _this = this
        del(position.id).then(res => {
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
         this.$refs.delPop.doClose() 
          _this.sup_this.init()
        }).catch(err => {
          this.$notify({
            title: err.response.data.message,
            type: 'failed',
            duration: 2500
          })
          this.downloadLoading = false
        })
    },
      // 导出
      download() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['ID','岗位名称', '职位英文名', '头像地址', '公司', '部门']
          const filterVal = ['id','posName', 'posEname', 'orgId', 'company', 'organization']
          const data = this.formatJson(filterVal, this.sup_this.data)
          console.log(this.sup_this.data);
          console.log(data);
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
        let id = 0;
        return jsonData.map(v => filterVal.map(j => {
          if(j === 'id'){
            return ++id
          }
          if(j === 'organization') {
            return v[j].orgName
          }
          if (j === 'company') {
            return v[j].coName
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
