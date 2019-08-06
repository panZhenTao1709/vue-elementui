<template>
  <div>
    <el-dialog
    v-dialogDrag
      :visible.sync="centerDialogVisible"
      :append-to-body="true"
      title="分配用户"
      width="80%"
      style="height:100%;overflow:hidden;">
      <div class="app-container" style="width:100%">
        <!--分页组件-->
            <el-pagination
              :total="total"
              style="margin-top: 8px;"
              layout="total, prev, pager, next, sizes"
              @size-change="sizeChange"
              @current-change="pageChange"/>
            <el-table ref="userTable" :data="data" size="small"  style="width: 100%;" @selection-change="handleSelectionChange">
              <el-table-column type="selection"/>
              <el-table-column sortable prop="userName" label="用户名"/>
              <el-table-column  label="头像">
                <template slot-scope="scope">
                  <img :src="scope.row.avatar" class="el-avatar">
                </template>
              </el-table-column>
              <el-table-column sortable prop="email" label="邮箱"/>
              <el-table-column sortable prop="phone" label="联系方式"/>
              <el-table-column sortable prop="area" label="区域"/>
              <el-table-column sortable prop="name" label="姓名"/>
              <el-table-column sortable label="公司">
                <template slot-scope="scope">
                  <span v-if="scope.row.company">{{ scope.row.company.coName }}</span>
                </template>
              </el-table-column>
              <el-table-column sortable label="职位">
                <template slot-scope="scope">
                  <span v-if="scope.row.position">{{ scope.row.position.posName }}</span>
                </template>
              </el-table-column>
            </el-table>
            
        <el-button type="primary" @click="saveUser" >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { getJudgedUser, saveUser } from '@/api/role'

export default {
  mixins: [initData, initDict],
  props: {
    sup_this: {
      type: Object,
      required: true
    },
    roleName: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      height: document.documentElement.clientHeight - 180 + 'px;',
      mutiSelection: []
    }
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    init(role) {
      this.centerDialogVisible = true
      const sort = 'id,desc'
      var _this = this
      getJudgedUser({ page: this.page, size: this.size, sort: sort, id: role?role.id:this.roleName.id }).then(res => {
        _this.total = res.data.totalElements
        _this.data = res.data.content
        _this.$nextTick(() => {
          _this.data.forEach(obj => {
            if (obj.isCheck) {
              _this.$refs.userTable.toggleRowSelection(obj, true)
            }
          })
        })
      })
    },
    /**
     * 获取选中的用户
     * @param val
     */
    handleSelectionChange(val) {
      this.mutiSelection = val
    },
    /**
     * 设置是否选中
     * @param rows
     */
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    /**
     * 保存用户
     */
    saveUser() {
      const checkedList = []
      this.mutiSelection.forEach(user => {
        checkedList.push(user.id)
      })
      const delList = []
      this.data.forEach(user => {
        delList.push(user.id)
      })
      const data = { roleId: this.roleName.id, checkedList: checkedList.toString(),delList: delList.toString() }
      saveUser(data).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.centerDialogVisible = false
      }).catch(err => {
        console.log(err.res.data.message)
        this.centerDialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
  div{
    display: inline-block;
    margin-right: 3px;
  }
  .el-table{
    max-height: 450px;
    overflow: auto;
  }
</style>
