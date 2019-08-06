<template>
  <div class="app-container">
    <eHeader :sup_this="sup_this"/>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="role-span">{{$t('table.routingManagement')}}</span>
        </div>
        <el-table  :data="data" highlight-current-row size="small" border style="width: 100%;" >
          <el-table-column sortable prop="route_id" :label="this.$t('table.routeId')"/>
          <el-table-column sortable  :label="this.$t('table.routingInformation')">
            <template slot-scope="scope">
              <span>{{ scope.row.route_definition }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  </div>
</template>

<script>

import eHeader from './module/header'
import { routes,refresh } from '@/api/route.js'

export default {
  components: { eHeader},
  data() {
    return {
      delLoading: false, // 是否正在删除角色
      current: null, // 记录当前被选中的角色
      sup_this: this,
      data:[]
    }
  },
  created() {
    // this.$nextTick(() => {
    //   this.init()
    // })
  },
  mounted(){
    this.getData()
  },
  methods: {
    getData() {
      let _this = this
      refresh().then(res=>{
        return routes()
      }).then(res=>{
        _this.data = res.data
      })
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
