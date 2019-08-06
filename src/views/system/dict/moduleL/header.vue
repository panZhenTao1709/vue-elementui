<template>
  <div class="head-container">
    <!-- 
{{ $t('btn.search') }} -->
    <el-input v-model="query.value" clearable :placeholder="this.$t('table.enterNameSearch')" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button-group>
    <el-tooltip :content="this.$t('btn.search')"  placement="top" effect="light">
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery" />>
    </el-tooltip>
    <!-- 新增 -->
    <el-tooltip :content="this.$t('table.newlyIncreased')"  placement="top" effect="light">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="$refs.form.dialog = true" />
    </el-tooltip>
    </el-button-group>
      <eForm ref="form" :is-add="true" :sup_this="sup_this"/>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
      downloadLoading: false
    }
  },
  methods: {
    toQuery() {
      this.$parent.page = 0
      this.$parent.init()
    }
  }
}
</script>
