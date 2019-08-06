<template>
  <div class="app-container">
    <el-card class="box-card" shadow="never">
      <eHeader :menus="menus" :query="query" :sup_this="sup_this" />
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
      
      <el-table-column
        sortable
        prop="name"
        :label ="this.$t('table.resoureName')"
        />
      <el-table-column

        prop="serviceId"
        :label="this.$t('table.belongsToTheService')"/>
      <el-table-column
        prop="href"
        :label="this.$t('table.chainedAddress')"
        />
      <el-table-column
        prop="method"
        :label="this.$t('table.requestWay')"
       />
        <el-table-column v-if="this.query.isMenu"
        prop="component"
        :label="this.$t('table.componentPath')"
      />
        <el-table-column
        prop="menuType"
        :label="this.$t('table.type')"
      />
      <el-table-column v-if="this.query.isMenu"
        prop="icon"
        :label="this.$t('table.icon')"
      >
        <template  slot-scope="scope">
          <span v-if="scope.row.icon">
              <svg-icon :icon-class="scope.row.icon" />
           </span>
        </template>
      </el-table-column>
      <el-table-column :label="this.$t('table.operation')" width="150px" align="center">
        <template slot-scope="scope">
          <edit  :menus="menus" :data="scope.row" :sup_this="sup_this" :is-menu="query.isMenu"/>

            <el-popover

              :ref="scope.row.id"
              placement="top"
              width="200">
              <p>{{$t('table.AredeleteIfoperationcannotbeundone')}}</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">
  {{ $t('btn.cancel') }}</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete"></el-button>
            </el-popover>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>
<script>
import {del} from '@/api/menu'
import edit from './module/edit'
import { initData } from '@/api/data'
import eHeader from './module/header'
export default {
  components: { eHeader, edit },
  data() {
    return {
      tableData: [],
      mutiSelection:[],
      columns: [
        {
          text: '名称',
          value: 'name'
        }
      ],
      delLoading: false,
      menus: [],
      query: {isMenu: true},
      sup_this: this
    }
  },
  created() {
   this.init()
  },
  methods: {
    load(tree, treeNode, resolve) {
      initData('cloud-admin/resource/list', {parentId: tree.id ,isMenu: this.query.isMenu}).then(res => {
        resolve(res)
      })
    },
    subDelete(id){
    this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()

        this.init()
        this.$router.replace({
          path: this.$router.path,
          query: {
            t: Date.now()
          }
        })
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
    init(){
      initData('cloud-admin/resource/list',{isMenu: this.query.isMenu,name:this.query.value}).then(res => {
        this.tableData = res
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
