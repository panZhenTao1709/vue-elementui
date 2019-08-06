<template>
  <div class="app-container  organization">
    <el-card class="box-card" shadow="never">
      <eHeader :sup_this="sup_this"/>
      <el-table
        :data="data"
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        style="width: 100%"
        row-key="id"
        border
        lazy
        ref="multipleTable"
        tooltip-effect="dark"
        highlight-current-row 
        @row-click="handleCurrentChange"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection"/>
        <el-table-column sortable prop="orgName" :label="this.$t('table.departmentName')"/>
        <el-table-column prop="orgCode" :label="this.$t('table.departmentNumber')"/>
        <el-table-column prop="orgLevel" :label="this.$t('table.departmentLevel')"/>
        <el-table-column prop="crtTime" :label="this.$t('table.dateCreated')"/>
        <el-table-column :label="this.$t('table.operation')" width="125" align="center">
          <template slot-scope="scope">
            <edit v-if="checkPermission('编辑',sup_this)" :dicts="dicts" :data="scope.row" :sup_this="sup_this"/>
            <el-popover
              v-if="checkPermission('删除',sup_this)"
              :ref="scope.row.id"
              placement="top"
              width="180">
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">
                  {{ $t('btn.cancel') }}</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button  slot="reference" title="删除" type="danger" icon="el-icon-delete" size="mini"/>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {checkPermission} from '@/checkPermission'
  import { initData } from '@/api/data'
  import initDict from '@/mixins/initDict'
  import { del } from '@/api/organization'
  import { parseTime } from '@/utils/index'
  import eHeader from './module/header'
  import edit from './module/edit'
  export default {
    components: { eHeader, edit },
    mixins: [initDict],
    data() {
      return {
        data:[],//表单数据
        mutiSelection: [],//选中的部门
        addloading: true,
        height: document.documentElement.clientHeight - 180 + 'px;',
        delLoading: false, sup_this: this, coName: '', companys: [], companyId: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created() {
      this.init()
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
      init(query){
        let _this = this
        query = query == null?{}:query
        initData('cloud-admin/organization/children',query).then(res => {
          _this.data = res
        })
      },
      load(tree, treeNode, resolve) {
        initData('cloud-admin/organization/children', {parentId: tree.id}).then(res => {
          resolve(res)
        })
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
          this.companyId = null
        } else {
          this.companyId = data.id
        }
        this.init()
      }
    }
  }
</script>

<style scoped>
  @media only screen and (min-width: 1200px) {
    .organization .el-col-lg-20 {
      width: 100%!important;
    }
  }
  @media only screen and (min-width: 768px){}

  .organization .el-col-sm-18 {
    width: 100%;
  }
</style>
