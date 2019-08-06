<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
           v-model="deptName" 
           clearable :placeholder="$t('table.enterDepartmentNameSearch')" 
           prefix-icon="el-icon-search" 
           style="width: 100%;" 
           class="filter-item" 
           v-if="checkPermission('查询-列表',sup_this)"
           @input="getDeptDatas"/>
        </div>
        <el-tree :data="depts" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick"/>
      </el-col>
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <eHeader :query="query" :sup_this="sup_this"   :multipleSelection="multipleSelection"/>
        <!--分页组件-->
        <el-pagination
          :total="total"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>
        <el-table  tooltip-effect="dark"  ref="multipleTable" highlight-current-row  :data="data" :loading="addloading" @row-click="handleCurrentChange" size="small" border style="width: 100%;"  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column sortable prop="userName" :label="$t('table.userName')"/>
          <el-table-column :label="$t('table.headPortrait')" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" class="el-avatar">
            </template>
          </el-table-column>
          <el-table-column sortable prop="email" :label="$t('table.email')"/> 
          <el-table-column sortable prop="phone" :label="$t('table.contactWay')"/>
          <el-table-column sortable prop="area" :label="$t('table.area')"/>
          <el-table-column sortable prop="name" :label="$t('table.name')"/>
          <el-table-column sortable :label="$t('table.company')">
            <template slot-scope="scope">
              <span  v-if = "scope.row.company">{{ scope.row.company.coName }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable :label="$t('table.position')">
            <template slot-scope="scope">
              <span v-if = "scope.row.position">{{ scope.row.position.posName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.operation')" width="125" align="center">
            <template slot-scope="scope">
              <edit  :data="scope.row" :sup_this="sup_this"/>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>{{$t('table.deleteData')}}</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">
                      {{ $t('btn.cancel') }}</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">{{$t('table.confirm')}}</el-button>
                </div>
                <el-button v-if="checkPermission('删除',sup_this)" slot="reference" :title="$t('btn.del')" type="danger" icon="el-icon-delete" size="mini"/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {checkPermission} from '@/checkPermission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/user'
import { getDepts } from '@/api/organization'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData, initDict],
  data() {
    return {
      addloading: true,
      currentUser:null,
      height: document.documentElement.clientHeight - 180 + 'px;',
      delLoading: false, sup_this: this, deptName: '', depts: [], orgId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      multipleSelection:[]
    }
  },
  created() {
    /**获取部门树及列表信息 */
    this.getDeptDatas()
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'cloud-admin/user'
      const sort = 'id,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      const enabled = query.enabled
      this.params = { page: this.page, size: this.size, sort: sort}
      this.params["orgId"] = this.orgId
      if (type && value) { this.params[type] = value }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    subDelete(id) {
      /**列表删除 */
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
         if(this.data.length===1&& this.page>0){
          this.page=this.page-1
          }
        this.init()
        this.$notify({
          title: this.$t('table.delSuccess'),
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    getDeptDatas() {
      /**获取部门树 */
      const params = { coId: this.$store.state.user.companyId }
      if (this.deptName) { params['orgName'] = this.deptName }
      getDepts(params).then(res => {
        this.depts = [{ name:this.$t('table.allcompanyoverview'), parentid: 0, children:res.data }]
      })
    },
    handleNodeClick(data) {
       /**点击节点渲染列表 */
      this.orgId = data.id
      this.init()
    },
     /** table页行选中回调 */
    handleCurrentChange(user) {
      const arr = []
      if(user) {
        this.currentUser = user
        arr.push(user)
        this.handleSelectionChange(arr)
        this.toggleSelection(arr)
      }
    }, 
      /**
       * 多选框 
       */
    handleSelectionChange(val) {
         this.multipleSelection = val;
         
      },
     
      /**根据row信息选中有该row的项 */
       toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      }
  }

}
</script>

<style scoped>
</style>
