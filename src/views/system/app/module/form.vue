<template>
  <el-dialog v-dialogDrag :visible.sync="dialog" :title="isAdd ? '新增应用' : '编辑应用'" append-to-body width="530px" style="height:100%;overflow:hidden;">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="应用名称" prop="appid">
        <el-input v-model="form.appid" style="width: 370px;"  placeholder="请输入应用名称" />
      </el-form-item>
      <el-form-item label="应用密码" prop="secret">
        <el-input v-model="form.secret" style="width: 370px" placeholder="请输入应用密码" />
      </el-form-item>
      <el-form-item label="有效期" prop="expireTime">
        <el-input v-model="form.expireTime" style="width: 370px" placeholder="请输入token有效时间（单位秒）"/>
      </el-form-item>
      <!--<el-form-item label="可访问应用" prop="scope">-->
        <!--<treeselect :multiple="true" v-model="form.scope" :options="services" style="width: 370px;" placeholder="选择应用" />-->
      <!--</el-form-item>-->
      <el-form-item label="是否重复" prop="isOnly">
        <el-select v-model="form.isOnly" placeholder="请选择">
          <el-option
            v-for="item in isOnlySelects"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" autosize v-model="form.remark" style="width: 370px" placeholder="请输入备注"/>
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
import { add, edit, nacosServices } from '@/api/app'
import {isNumber,isvalidatPassword} from '@/utils/validate'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
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
    const validateNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入过期时间'))
      } else if(!isNumber(value)) {
        callback(new Error('请输入数字'))
      } else{
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入应用密码'))
      } else if(!isvalidatPassword(value)) {
        callback(new Error('请输入正确格式的应用密码，由数字及大小写字母组成，长度6-20位'))
      } else{
        callback()
      }
    }
    return {
      services:[],
      isOnlySelects: [{label:"允许",value:true},{label:"不允许",value:false}],
      loading: false, dialog: false,
      formAdd:{},
      form: { appid: '', secret: '', id: '',remark: '',isOnly: null,expireTime: null,scope: null},
      rules: {
        appid: [
          { required: true, message: '请输入长度1-20位的应用名称', trigger: 'blur',max:20,min:1 }
        ],
        secret: [
          { required: true, trigger: 'blur',validator:validatePassword }
        ],
        expireTime: [
          {required: false,trigger:'blur',validator:validateNumber}
        ]
      }
    }
  },
  methods: {
    cancel() {
      if(this.isAdd){
        this.dialog = false
      } else {
       this.resetForm()
      }
         
        },

    doSubmit() {
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
      /**新增不点击确定和取消按钮下次新增回显上次内容 */
      this.formAdd = this.form
      // this.form.scope = this.form.scope.toString()
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      // this.form.scope = this.form.scope.toString()
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { id: '', appid: '', secret: '' }
    },
    getNacosService() {
      var _this = this
      nacosServices().then(res => {
        _this.services = []
        res.data.data.forEach(service => {
          _this.services.push({ id: service,label: service })
        })
      })
    }
        },
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
