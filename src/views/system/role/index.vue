<template>
  <div class="app-container">

    <el-card class="box-card" shadow="never">
      <eHeader :sup_this="sup_this"/>
      <el-table
        :data="tableData"
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
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column sortable prop="name" :label="this.$t('table.designation')"/>
        <el-table-column sortable prop="roleType" :label="this.$t('table.typeOfRole')">
          <template slot-scope="scope">
            {{getDictLabel(scope.row.roleType,'role-type')}}
          </template>
        </el-table-column>
        <el-table-column sortable prop="isDisable" :label="this.$t('table.statusOfRole')">
          <template slot-scope="scope">
            {{getDictLabel(scope.row.isDisable,'role-status')}}
          </template>
        </el-table-column>
        <el-table-column sortable :show-overflow-tooltip="true" prop="crtTime" :label="this.$t('table.dateCreated')">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column sortable prop="crtName" :label="this.$t('table.creator')"/>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { initData } from '@/api/data'
  import {parseTime} from '@/utils/index'
  import eHeader from './module/header'
  import initDict from '@/mixins/initDict'

  export default {
    components: {eHeader},
    mixins:[initDict],
    data() {
      return {
        tableData: [], //表单数据
        sup_this: this,
        mutiSelection: [] //选中的角色
      }
    },
    created() {
      this.init()
      // 加载数据字典
      this.initDicts('role-status','role-type')
    },
    methods: {
      parseTime,
      init(query){
        let _this = this
        query = query == null?{}:query
        initData('cloud-admin/role/children',query).then(res => {
          _this.tableData = res
        })
      },
      load(tree, treeNode, resolve) {
        initData('cloud-admin/role/children', {parentId: tree.id}).then(res => {
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
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;
    color: #303133;
    font-size: 15px;
  }

</style>
