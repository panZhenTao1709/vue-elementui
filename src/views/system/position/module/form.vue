<template>
  <el-dialog v-dialogDrag :visible.sync="dialog" :title="isAdd ? '新增岗位' : '编辑岗位'" append-to-body width="570px" style="height:100%;overflow:hidden;">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="66px">
      <el-form-item label="岗位名称" prop="posName">
        <el-input v-model="form.posName"/>
      </el-form-item>
      <el-form-item label="英文名称" prop="posEname">
        <el-input v-model.number="form.posEname" />
      </el-form-item>
      <!--<el-form-item prop="" label="公司">
        <treeselect
          :multiple="true"
          :options="companys"
          placeholder="选择公司"
          style="width: 370px;"
          :show-count="true" :flat="true"
          v-model="form.companysList"
        />
      </el-form-item>-->
      <el-form-item prop="" label="部门">
        <treeselect
          :options="organizations"
          placeholder="选择部门"
          style="width: 370px;"
          v-model="form.orgId"
        />
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
import {filterlistConame,filterlistOrg,filterCheck} from '@/utils/treeselectdata'
import { add, edit,getOrg} from '@/api/position'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: {Treeselect},
  data() {
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    const validPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (!isvalidatPassword(value)) {
        callback(new Error('请输入8位密码'))
      } else {
        callback()
      }
    }

    const validUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else if (!isvalidatUsername(value)) {
        callback(new Error('用户名至少四位，不能是纯数字或包含中文及特殊符号 '))
      } else {
        callback()
      }
    }

    const validcnname = (rule, value, callback) => {
      if (!ischina(value)) {
        callback(new Error('请输入中文名称'))
      } else {
        callback()
      }
    }
    const validenname = (rule, value, callback) => {
      if (!isEnname(value)) {
        callback(new Error('请输入英文名称'))
      } else {
        callback()
      }
    }

    return {
      organizations: [],
      dialog: false,
      loading: false,
      form: {posName: '', posEname: '', orgId:null},
      rules: {
        posName: [
          { required: true, message: '请输入岗位名称', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    },
    dicts: {
      type: Array,
      required: true
    },
    
  },
  created() {
    const explorer = navigator.userAgent
    if (explorer.indexOf('Chrome') >= 0) {
      this.style = 'width: 184px'
    } else {
      this.style = 'width: 172px'
    }
  },

  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      const _this = this.sup_this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else {
            this.doEdit()
          }
          this.loading = false
          this.$nextTick(() => {
            _this.init()
          })
        } else {
          return false
        }
      })
      
    },
    doAdd() {
      /**
       * v-model Array类型数据（rolesList：角色，rolesList：部门）toString()转换为字符串后传参
       *
       *
       */
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
      }).catch(err => {
        this.$notify({
          title: '请输入正确的英文名，允许中间有空格，长度1-30位',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        console.log(err.message)
      })
    },
    doEdit() {
      /**
       * v-model Array类型数据（rolesList：角色，rolesList：部门）toString()转换为字符串后传参
       *
       *
       */
      
    
      
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {posName: '', posEname: ''}
    },
    selectFun(node, instanceId) {
      this.getJobs(node.id)
    },
    /**获取部门信息 */
    getOrg(id){
      const _this=this
      const params={id:id}
      getOrg(params).then(res => {
        _this.organizations = filterlistOrg(res.data)
      
      })
    }
  }
}
</script>

<style scoped>

</style>
