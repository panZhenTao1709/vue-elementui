<template>
  <div>
    <el-dialog
      :visible.sync="centerDialogVisible"
      append-to-body
      width="530px"
      title="绑定行政区域"
      center>
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="66px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;"/>
        </el-form-item>
        <el-form-item style="margin-top: -10px;" label="描述">
          <el-input v-model="form.remark" style="width: 370px;" rows="5" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" >
{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" >
{{ $t('btn.comfirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {

  },
  data() {
    return {
      loading: false, dialog: false,
      form: { name: '', permissions: [], remark: '' },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  }
}
</script>
<style scope>
   #edit{
     position:absolute;
     top:500px;
     left:500px;
   }
</style>
