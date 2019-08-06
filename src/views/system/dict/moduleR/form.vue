<template>
  <el-dialog  v-dialogDrag :visible.sync="dialog" :title="isAdd ? this.$t('table.newdictionarydetails') : this.$t('table.editdictionarydetails')" append-to-body width="500px" style="height:100%;overflow:hidden;">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item :label="this.$t('table.dictionarylabel')" prop="label">
        <el-input v-model="form.label" style="width: 370px;"/>
      </el-form-item>
      <el-form-item :label="this.$t('table.dictionaryvalue')" prop="value">
        <el-input v-model="form.value" style="width: 370px;"/>
      </el-form-item>
      <el-form-item :label="this.$t('table.sort')" prop="sort">
        <el-input v-model="form.sort" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">
{{ $t('btn.cancel') }}</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">
{{ $t('btn.comfirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { add, edit } from '@/api/dict'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: { label: '', description: ''},
      rules: {
        label: [
          { required: true, message: this.$t('table.Pentername'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.form.parentId = this.sup_this.query.parentId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      const _this = this
      add(this.form).then(res => {
        _this.resetForm()
        _this.$notify({
          title: this.$t('table.addsuccess'),
          type: 'success',
          duration: 2500
        })
        _this.loading = false
        _this.sup_this.init()
      }).catch(err => {
        _this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      const _this = this
      edit(this.form).then(res => {
        _this.resetForm()
        _this.$notify({
          title: this.$t('table.modifysuccess'),
          type: 'success',
          duration: 2500
        })
        _this.loading = false
        _this.sup_this.init()
      }).catch(err => {
        _this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { label: '', value: '',sort:1,parentId:this.parentId}
    }
  }
}
</script>

