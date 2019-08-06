<template>
  <div class="head-container">
    <el-tooltip :content="this.$t('table.refresh')" placement="top" effect="light">
    <el-button class="filter-item" size="mini" type="success" icon="icon iconfont icon-shuaxin" @click="refresh"></el-button>
    </el-tooltip>
  </div>
</template>

<script>
  import { refresh } from '@/api/route.js'
  // 查询条件
  export default {
    props: {
      sup_this: {
        type: Object,
        required: true
      }
    },
    methods: {
      refresh() {
        this.sup_this.getData()
      }
    }
  }
</script>
