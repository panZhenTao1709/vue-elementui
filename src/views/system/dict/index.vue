<template>
  <div class="app-container">
    <el-row :gutter="12">
      <el-col :span="12">
        <left :root="root"></left>
      </el-col>
      <el-col :span="12">
        <right ref="right"></right>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import left from './moduleL/left'
  import right from './moduleR/right'

  export default {
    components: {left,right},
    data() {
      return {
        root:this
      }
    },
    methods: {
      getChildren(id){
        this.$refs.right.query.parentId = id
        this.$refs.right.init()
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
