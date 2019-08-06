<template>
  <div>
    <el-dialog
      v-dialogDrag
      :visible.sync="centerDialogVisible"
      :append-to-body="true"
      :title="this.$t('table.Distributionoftheuser')"
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
        <el-button type="primary" @click="saveUser" >{{$t('table.save')}}</el-button>
            <el-table ref="userTable" :data="data" size="small"  style="width: 100%;" @selection-change="handleSelectionChange">
              <el-table-column type="selection"/>
              <el-table-column sortable prop="userName" :label="this.$t('table.userName')"/>
              <el-table-column  :label="this.$t('table.headPortrait')">
                <template slot-scope="scope">
                  <img :src="scope.row.avatar" class="el-avatar">
                </template>
              </el-table-column>
              <el-table-column sortable prop="email" :label="this.$t('table.email')"/>
              <el-table-column sortable prop="phone" :label="this.$t('table.contactWay')"/>
              <el-table-column sortable prop="area" :label="this.$t('table.area')"/>
              <el-table-column sortable prop="name" :label="this.$t('table.name')"/>
              <el-table-column sortable :label="this.$t('table.company')">
                <template slot-scope="scope">
                  <span v-if="scope.row.company">{{ scope.row.company.coName }}</span>
                </template>
              </el-table-column>
              <el-table-column sortable :label="this.$t('table.position')">
                <template slot-scope="scope">
                  <span v-if="scope.row.position">{{ scope.row.position.posName }}</span>
                </template>
              </el-table-column>
            </el-table>

      </div>
    </el-dialog>
  </div>
</template>
<script>

import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { getJudgedUser, saveUser } from '@/api/adminRole'

export default {
  mixins: [initData, initDict],
  props: {
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      height: document.documentElement.clientHeight - 180 + 'px;',
      mutiSelection: [],
      role:{}
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
      this.role = role
      this.centerDialogVisible = true
      const sort = 'id,desc'
      var _this = this
      getJudgedUser({ page: this.page, size: this.size, sort: sort, id: this.role.id }).then(res => {
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
      const data = { roleId: this.role.id, checkedList: checkedList.toString(),delList: delList.toString() }
      saveUser(data).then(res => {
        this.$notify({
          title: this.$t("table.success"),
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
