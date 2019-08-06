<template>
  <div class="app-container">

    <el-card class="box-card" shadow="never">
      <eHeader id="eheader" :sup_this ="sup_this" :query="query" :style="style"/>
      <el-table ref="multipleTable" @selection-change="handleSelectionChange" @row-click="handleCurrentChange" highlight-current-row :data="data" highlight-current-row size="small" border style="width: 100%;" >
         <el-table-column type="selection" width="45" align="center" />
        <el-table-column prop="menu" :label="this.$t('table.menuName')"/>
        <el-table-column prop="opt" :label="this.$t('table.operationalApproach')"/>
        <el-table-column prop="uri" :label="this.$t('table.resourcesPath')"/>
        <el-table-column prop="method" :label="this.$t('table.httpWay')"/>
        <el-table-column prop="crtTime" :label="this.$t('table.operationTime')"/>
        <el-table-column prop="crtUser" :label="this.$t('table.operationId')"/>
        <el-table-column prop="crtName" :label="this.$t('table.operatioUsername')"/>
        <el-table-column prop="crtHost" :label="this.$t('table.operationMainEngineIp')"/>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/>
    </el-card>
  </div>
</template>

<script>
import {checkPermission} from '@/checkPermission'
import initData from '@/mixins/initData'
import scrollEvent from '@/mixins/scrollEvent'
import initDict from '@/mixins/initDict'
import { getGateLog } from '@/api/gateLog'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData, initDict,scrollEvent],
  data() {
    return {
      addloading: true,
      height: document.documentElement.clientHeight - 180 + 'px;',
      delLoading: false,
      sup_this:this,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      sup_this: this
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      // 加载数据字典
      // this.getDict('user_status')
    })
  },
 
  methods: {
    parseTime,
   checkPermission,
    beforeInit() {
      this.url = 'cloud-admin/gateLog'
      const sort = 'id,desc'
      const query = this.query
      const value = query.value
      const enabled = query.enabled
      this.params = { page: this.page, size: this.size, sort: sort }
      if ( value) { this.params['opt'] = value }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
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

    handleNodeClick(data) {
      if (data.pid === 0) {
        this.gateLogeId = null
      } else {
        this.gateLogeId = data.id
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
  @media only screen and (min-width: 1200px) {
    .company .el-col-lg-20 {
      width: 100%!important;
    }
  }
  @media only screen and (min-width: 768px){}

.company .el-col-sm-18 {
    width: 100%;
}
</style>
