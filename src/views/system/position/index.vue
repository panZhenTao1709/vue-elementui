<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable :placeholder="this.$t('table.enterDepartmentNameSearch')"
                    prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @input="getDeptDatas"/>
        </div>
        <!--<el-tree-->
        <!--:data="depts"-->
        <!--node-key="id"-->
        <!--default-expand-all-->
        <!--draggable-->
        <!--/>-->

        <el-tree :data="depts" :props="defaultProps" :expand-on-click-node="false" default-expand-all
                 @node-click="handleNodeClick"/>
      </el-col>
      <el-col :xs="17" :sm="18" :md="20" :lg="20" :xl="20">
        <eHeader :query="query" :sup_this="sup_this" :dicts="dicts" />
        <el-table
          :data="data"
          size="small"
          border style="width: 100%;"
          row-key="id"
          ref="multipleTable"
          tooltip-effect="dark"
          highlight-current-row
          @row-click="handleCurrentChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="posName" :label="$t('table.positionName')"/>
          <el-table-column :label="$t('table.headPortrait')" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" class="el-avatar">
            </template>
          </el-table-column>
          <el-table-column prop="posEname" :label="$t('table.englishPosition')"/>
          <el-table-column sortable :label="$t('table.company')">
            <template slot-scope="scope">
              <span v-if="scope.row.company">{{ scope.row.company.coName }}</span>
            </template>
          </el-table-column>
          <el-table-column sortable :label="$t('table.department')">
            <template slot-scope="scope">
              <span v-if="scope.row.organization">{{ scope.row.organization.orgName }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('table.operation')" width="125" align="center">
            <template slot-scope="scope">
                
                  <edit :dicts="dicts" :data="scope.row" :sup_this="sup_this" />    
      
              <el-popover

                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">
                    {{ $t('btn.cancel') }}
                  </el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定
                  </el-button>
                </div>
                       <el-button slot="reference" title="删除" type="danger" icon="el-icon-delete" size="mini"/>

              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          :total="total"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission'
  import initData from '@/mixins/initData'
  // import { initData } from '@/api/data'
  import initDict from '@/mixins/initDict'
  import {del} from '@/api/position'
  import {getDepts} from '@/api/organization'
  import {parseTime} from '@/utils/index'
  import eHeader from './module/header'
  import edit from './module/edit'

  export default {
    components: {eHeader, edit},
    mixins: [initData, initDict],
    data() {
      return {
        height: document.documentElement.clientHeight - 180 + 'px;',
        delLoading: false, sup_this: this, deptName: '', depts: [], deptId: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        dicts: ['锁定', '未锁定'],
        mutiSelection: [] //选中的角色
      }
    },
    created() {
      this.getDeptDatas()
      this.$nextTick(() => {
        this.init()
      })
    },
    mounted: function () {
      const that = this
      window.onresize = function temp() {
        that.height = document.documentElement.clientHeight - 180 + 'px;'
      }
    },
    methods: {
      parseTime,
      checkPermission,
      beforeInit() {
        this.url = 'cloud-admin/position'
        const sort = 'id,desc'
        const query = this.query
        const type = query.type
        const value = query.value
        const enabled = query.enabled
        this.params = {page: this.page, size: this.size, sort: sort, deptId: this.deptId}
        if (type && value) {
          this.params[type] = value
        }
        if (enabled !== '' && enabled !== null) {
          this.params['enabled'] = enabled
        }
        return true
      },
      subDelete(id) {
        this.delLoading = true
        del(id).then(res => {
          this.delLoading = false

          this.$refs[id].doClose()
          if (this.data.length === 1 && this.page > 0) {
            this.page = this.page - 1
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
      getDeptDatas() {
        /**获取部门树 */
        const params = {coId: this.$store.state.user.companyId}
        if (this.deptName) {
          params['orgName'] = this.deptName
        }
        getDepts(params).then(res => {

          this.depts = [{label: '九阳集团', name: '九阳集团', parentid: 0, children: res.data}]
        })
      },
      handleNodeClick(data) {
        this.orgId = data.id
        this.init({orgId:this.orgId})
      },
      /** table页行选中回调 */
      handleCurrentChange(user) {
        const arr = []
        if (user) {
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
