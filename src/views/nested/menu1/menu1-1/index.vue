<template>
  <div>
    <el-button @click="tapShow">弹出框</el-button>
    <el-dialog
      :visible.sync="centerDialogVisible4"
      append-to-body
      width="530px"
      title="选择、解绑终端可视化界面"
      center>
      <p>选择、解绑终端可视化界面</p>
      <el-main style="overflow:hidden;width:100%">
        <table style="float:left;width:50%">
          <tr> <th>已选终端</th></tr>
          <tr v-for="(item,i) in arr1" :key="i"> <td>{{ item }}</td></tr>
        </table>
        <table style="float:right;width:50%">
          <tr> <th>未选终端</th></tr>
          <tr v-for="(item,i) in arr2" :key="i">  <td>{{ item }}</td></tr>
        </table>
      </el-main>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="dosubmitBind">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      centerDialogVisible4: false,
      arr1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      arr2: ['z', 'x', 'c', 'v', 'b', 'n', 'a', 's', 'f', 'g']
    }
  },
  methods: {
    tapShow: function() {
      this.centerDialogVisible4 = true
    },
    dosubmitBind() {
      this.centerDialogVisible4 = false
    }
  }
}
</script>
<style scoped>
   table tr th,table tr td { border:1px solid #000;cursor: pointer;width:100%; }
        table { width: 200px; min-height: 25px; line-height: 25px; text-align: center; border-collapse: collapse;}

</style>
