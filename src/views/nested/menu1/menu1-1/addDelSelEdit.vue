<template>
  <div class="app-container">
    <eHeader :roles="roles" :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" border style="width: 100%;">
      <el-table-column prop="username" label="用户名"/>
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" class="el-avatar">
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.enabled ? '激活':'锁定' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <edit v-if="checkPermission(['ADMIN','USER_ALL','USER_EDIT'])" :data="scope.row" :roles="roles" :sup_this="sup_this"/>
          <el-popover
            v-if="checkPermission(['ADMIN','USER_ALL','USER_DELETE'])"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">
{{ $t('btn.cancel') }}</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <!-- <el-pagination
      :total="total"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/> -->
    <el-pagination
      :total="total"
      :current-page="5"
      :page-size="5"
      :page-sizes="[5, 10, 20, 30]"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
import eHeader from '@/views/system/user/module/header'
import edit from '@/views/system/user/module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      roles: [], delLoading: false, sup_this: this
    }
  },
  created() {
    this.init()
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/users'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      console.log(this.params)
      return true
    }

  }
}
</script>

<style scoped>

</style>
