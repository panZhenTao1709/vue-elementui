<template>
  <div class="app-container">
        <eHeader :query="query" :sup_this="sup_this"  :userInfo="mutiSelection" :style="style"/>
        <el-table 
        :data="data" 
        :loading="addloading" 
        size="small" 
        border 
        style="width: 100%;"
        row-key="id"
        ref="multipleTable"
        tooltip-effect="dark"
        highlight-current-row 
        @row-click="handleCurrentChange"
        @selection-change="handleSelectionChange"
        >
                   <el-table-column type="selection" width="45" align="center" />
          <el-table-column sortable prop="userName" :label="this.$t('table.userName')"/>
          <el-table-column :label="this.$t('table.headPortrait')" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" class="el-avatar">
            </template>
          </el-table-column>
          <el-table-column sortable  prop="email" :label="this.$t('table.email')"/>
          <el-table-column sortable prop="phone" :label="this.$t('table.contactWay')"/>
          <el-table-column sortable prop="area" :label="this.$t('table.area')"/>
          <el-table-column sortable prop="name" :label="this.$t('table.name')"/>
          <el-table-column sortable width="200" prop="coIdsList" :label="this.$t('table.company')">
            <template slot-scope="scope" >
              <el-tag v-for="company in scope.row.companyList" v-bind:key="company.id">{{ company.coName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="this.$t('table.operation')" width="125" align="center">
            <template slot-scope="scope">
              <edit  :data="scope.row" :sup_this="sup_this"/>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">
                     {{ $t('btn.cancel') }}
                     </el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                </div>
                <el-button v-if="checkPermission('删除',sup_this)" slot="reference" title="删除" type="danger" icon="el-icon-delete" size="mini"/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :total="total"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>

  </div>
</template>

<script>
import { checkPermission }  from '@/checkPermission'
import initData from '@/mixins/initData'
import { del,getCompany,getCompanyInfo} from '@/api/userAdmin'
import { getDepts } from '@/api/organization'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import scrollEvent from '@/mixins/scrollEvent'

export default {
  components: { eHeader, edit },
  mixins: [initData,scrollEvent],
  data() {
    return {
      addloading: true,
      height: document.documentElement.clientHeight - 180 + 'px;',
      delLoading: false, sup_this: this, deptName: '', depts: [], deptId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      mutiSelection: []
    }
  },
  created() {
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
      this.url = 'cloud-admin/userAdmin'
      const sort = 'id,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      const enabled = query.enabled
      this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      if (type && value) { this.params[type] = value }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    /**删除 */
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
         if(this.data.length===1&& this.page>0){
          this.page=this.page-1
          }
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    /**获取部门数据 */
    getDeptDatas() {
      const params = { coId: this.$store.state.user.company.id  }
      getDepts(params).then(res => {
        this.depts = res
      })
    },
    /**部门树节点事件 */
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.deptId = null
      } else {
        this.deptId = data.id
      }
      this.init()
    },
          /** table页行选中回调 */
    handleCurrentChange(user) {
      const arr = []
      if(user) {
        arr.push(user)
        this.handleSelectionChange(arr)
        this.toggleSelection(arr)
      }
    }, 
      /**
       * 多选框 
       */
    handleSelectionChange(val) {
         this.mutiSelection = val;
         
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
