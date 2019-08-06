<template>
  <div class="head-container">
    <!-- 
{{ $t('btn.search') }} -->
    <el-input v-model="query.value" clearable :placeholder="this.$t('table.enterKeywordSearch')" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button-group>
      <el-tooltip :content="this.$t('btn.search')" placement="top"  effect="light">
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery"></el-button>
      </el-tooltip>
      <!-- 新增 -->
      <el-tooltip :content="this.$t('btn.add')" placement="top"  effect="light">
          <el-button
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="add"></el-button>
      </el-tooltip>
      <!-- 导出 -->
      <el-tooltip :content="this.$t('table.execlExport')" placement="bottom"  effect="light">

          <el-button
            :loading="downloadLoading"
            size="mini"
            class="filter-item"
            type="warning"
          icon="icon iconfont icon-icon_execl"
            @click="download"></el-button>
      </el-tooltip>
    </el-button-group>
    <eForm ref="form" :sup_this="sup_this" :is-add="true" :dicts="dicts" :data="data"/>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
  props: {
    query: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      data: {},
      downloadLoading: false,
      queryTypeOptions: [
        { key: 'key', display_name: '缓存Key' },
        { key: 'value', display_name: '缓存Value' },
        { key: 'outOfTime', display_name: '缓存的过期时间' }
      ],
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ]
    }
  },
  methods: {
    add() {
      this.$refs.form.dialog = true
      this.$parent.addloading = false
      setTimeout(() => {
        this.$parent.addloading = true
      }, 1000)
    },
    // 去查询
    toQuery() {
      this.sup_this.page = 0
      this.sup_this.init()
    },
    // 导出
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ["ID",'缓存Key值', '缓存value值', '缓存的过期时间']
        const filterVal = ['id','key', 'value', 'outOfTime']
        const data = this.formatJson(filterVal, this.sup_this.data)
        console.log(this.sup_this.data);
        console.log(data);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      let id = 0;
      return jsonData.map(v => filterVal.map(j => {
        if(j === 'id'){
          return ++id
        }
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
