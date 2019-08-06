<template>
  <div class="app-container">
    <eHeader :sup_this="sup_this" />
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="box-card" shadow="never">
          <el-table  tooltip-effect="dark"  
          ref="multipleTable" 
          highlight-current-row  
          :data="data" 
          @row-click="handleCurrentChange" 
          size="small" 
          border 
          style="width: 100%;"  
          @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="appid" label="应用名称"/>
            <el-table-column prop="secret" label="密码"/>
            <el-table-column prop="scope" label="可访问应用"/>
            <el-table-column prop="remark" label="备注"/>
            <el-table-column :show-overflow-tooltip="true" prop="crtTime" label="创建日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.crtTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column sortable prop="crtName" :label="this.$t('table.creator')"/>
          </el-table>
          <!--分页组件-->
          <el-pagination
            :total="total"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {checkPermission} from '@/checkPermission'
import resource from './module/resource'
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
export default {
  components: { eHeader, resource },
  mixins: [initData],
  data() {
    return {
      sup_this: this,
      mutiSelection:[]
    }
  },
  created() {
    this.init()
  },
  methods: {
    parseTime,
    checkPermission,
    /**
     * 加载应用
     */
    beforeInit() {
      this.url = 'cloud-admin/app'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size}
      if (value) { this.params['appid'] = value }
      return true
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

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>
