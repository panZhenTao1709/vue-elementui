<template>
  <el-card class="box-card" shadow="never">
    <eHeader :query="query" :sup_this="sup_this"/>
    <div slot="header" class="clearfix">
      <span class="role-span">{{$t('table.theDictionaryList')}}</span>
    </div>
    <el-table :data="data" highlight-current-row size="small" style="width: 100%;" border @row-click="handleCurrentChange">
      <el-table-column prop="label" :label="this.$t('table.designation')"/>
      <el-table-column prop="description" :label="this.$t('table.description')"/>
      <el-table-column :label="this.$t('table.operation')" width="130px" align="center">
        <template slot-scope="scope">
          <edit :data="scope.row" :sup_this="sup_this"/>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>{{$t('table.deleteData')}}</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">
{{ $t('btn.cancel') }}</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定
              </el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
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
  </el-card>
</template>

<script>
  import initData from '@/mixins/initData'
  import {del} from '@/api/dict'
  import eHeader from './header'
  import edit from './edit'

  export default {
    components: {eHeader, edit},
    props:{
      root: {
        type: Object,
        required: true
      }
    },
    mixins: [initData],
    data() {
      return {
        delLoading: false, // 是否正在删除
        current: null, // 记录当前被选中行
        sup_this: this
      }
    },
    created() {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      beforeInit() {
        this.url = 'cloud-admin/dict'
        const query = this.query
        const value = query.value
        this.params = {page: this.page, size: this.size}
        if (value) {
          this.params['label'] = value
        }
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
      //记录当前被选中行
      handleCurrentChange(current) {
        if (current) {
          this.root.getChildren(current.id);
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
