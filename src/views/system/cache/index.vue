<template>
  <div class="app-container  company">
  
        <eHeader :query="query" :sup_this="sup_this" :dicts="dicts" :style="style"/>
        <el-table :data="data" :loading="addloading" size="small" border style="width: 100%;">
          <el-table-column prop="key" :label="this.$t('table.cacheKey')"/>
          <el-table-column prop="value" :label="this.$t('table.cacheValue')"/>
          <el-table-column prop="outOfTime" :label="this.$t('table.cacheExpirationTime')"/>
          <el-table-column :label="this.$t('table.operation')" width="125" align="center">
            <template slot-scope="scope">
              <edit :dicts="dicts" :data="scope.row" :sup_this="sup_this"/>
              <el-popover

                :ref="scope.row.key"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.key].doClose()">
{{ $t('btn.cancel') }}</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.key)">确定</el-button>
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
    
  </div>
</template>

<script>
// import checkPermission from '@/utils/permission'
import initData from '@/mixins/cacheData'
import initDict from '@/mixins/initDict'
import { getCach,del } from '@/api/cache'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import scrollEvent from '@/mixins/scrollEvent'

export default {
  components: { eHeader, edit },
  mixins: [initData, initDict,scrollEvent],
  data() {
    return {
      addloading: true,
      height: document.documentElement.clientHeight - 180 + 'px;',
      delLoading: false, sup_this: this, key: '', sysCaches: [], companyId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    parseTime,
    // checkPermission,
    beforeInit() {
      this.url = 'cloud-admin/cache'
      const sort = 'id,desc'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size}
      this.params.coId=this.$store.state.user.company.id 
      if (value) { this.params.pattern = value }
      return true
    },
    subDelete(key) {
      this.delLoading = true
      del(key).then(res => {
        this.delLoading = false
        if(this.data.length===1&& this.page>0){
          this.page=this.page-1
          }
        this.$refs[key].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[key].doClose()
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

</style>
