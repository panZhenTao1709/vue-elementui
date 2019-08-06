<template >
  <el-container style="height: 600px; border: 1px solid #eee">
    <el-container>
      <el-header
        style="text-align: center
      ; font-size: 12px">
        行政区域select

      </el-header>

      <el-main>
        <el-select v-model="value1" placeholder="请选择" @change="indexSelect01">
          <el-option
            v-for="item in params.res"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
        <el-select v-if="loading" v-model="value2" placeholder="请选择" @change="indexSelect02">
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.name"
            :value="item.id+','+item.name"/>
        </el-select>
      </el-main>
    </el-container>
  </el-container>
</template>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .el-dropdown {
    vertical-align: top;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
<script>
import { initData } from '@/api/data'
export default {
  props: {
    params: {
      type: Object,

      required: true
    }
  },
  data() {
    return {
      value1: '',
      value2: '',
      loading: true,
      list: {}
    }
  },
  mounted() {
    // initData('api/district/getChildren', { id: this.params[0].address }).then(res => {
    //   console.log(res)
    //   this.loading = true
    // })
  },
  methods: {

    indexSelect01: function() {
      this.loading = false
      initData('api/district/getChildren', { id: this.value1 }).then(res => {
        this.list = res
        this.value2 = ''
        this.loading = true
      })
    },
    indexSelect02: function() {
      alert('您所选择的区域是' + this.value1 + this.value2.split(',')[1])
      initData('api/district/getChildren', { id: this.value2.split(',')[0] }).then(res => {
      })
    }
  }
}
</script>
