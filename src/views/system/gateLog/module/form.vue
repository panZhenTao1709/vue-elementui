<template>
  <el-dialog v-dialogDrag :visible.sync="dialog" :title="isAdd ? '新增公司' : '编辑公司'" append-to-body width="570px">
    <el-form ref="form" :inline="true" :model="form" size="small" label-width="66px">
     <!-- <el-form-item label="上级公司id" prop="parentId">
        <el-input v-model="form.parentId"/>
      </el-form-item>-->
      <el-form-item prop="coName" label="公司名称">
        <el-input v-model="form.coName"/>
      </el-form-item>
      <el-form-item prop="coAbbr" label="公司简称">
        <el-input v-model="form.coAbbr"/>
      </el-form-item>
      <el-form-item prop="coCode" label="公司编码">
        <el-input v-model="form.coCode"/>
      </el-form-item>
      <el-form-item prop="coAddr" label="公司地址">
        <el-input v-model="form.coAddr"/>
      </el-form-item>
      <el-form-item prop="zipCode" label="邮编">
        <el-input v-model="form.zipCode"/>
      </el-form-item>
      <el-form-item prop="legalName" label="法人名称">
        <el-input v-model="form.legalName"/>
      </el-form-item>
      <el-form-item prop="legalRep" label="法定代表人">
        <el-input v-model="form.legalRep"/>
      </el-form-item>
      <el-form-item prop="taxId" label="税号">
        <el-input v-model="form.taxId"/>
      </el-form-item>
      <el-form-item prop="tel" label="电话">
        <el-input v-model="form.tel"/>
      </el-form-item>
      <el-form-item prop="bankName" label="开户银行名称">
        <el-input v-model="form.bankName"/>
      </el-form-item>

      <el-form-item prop="bankAcct" label="开户银行账号">
        <el-input v-model="form.bankAcct"/>
      </el-form-item>
      <!-- <el-form-item label="岗位">
        <el-select v-model="jobId" :style="style" placeholder="请先选择部门">
          <el-option
            v-for="(item, index) in jobs"
            :key="item.name + index"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item style="margin-bottom: 0px;" label="角色">
        <el-select v-model="roleIds" style="width: 450px;" multiple placeholder="请选择">
          <el-option
            v-for="(item, index) in roles"
            :disabled="level !== 1 && item.level <= level"
            :key="item.name + index"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item> -->
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

import { add, edit } from '@/api/company'
import { getDepts } from '@/api/organization'
import { getAll } from '@/api/role'
import { getAllJob } from '@/api/job'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    // const validPhone = (rule, value, callback) => {
    //   if (!value) {
    //     callback(new Error('请输入电话号码'))
    //   } else if (!this.isvalidPhone(value)) {
    //     callback(new Error('请输入正确的11位手机号码'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      dialog: false, loading: false, form: { parentId: '', coName: '', coAbbr: '', coCode: '', coAddr: '', zipCode: '', legalName: '', legalRep: '', taxId: '', tel: '', bankName: '' , bankAcct: '' },
      // rules: {
      //   username: [
      //     { required: true, message: '请输入用户名', trigger: 'blur' },
      //     { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
      //   ],
      //   email: [
      //     { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      //     { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      //   ],
      //   phone: [
      //     { required: true, trigger: 'blur', validator: validPhone }
      //   ],
      //   enabled: [
      //     { required: true, message: '状态不能为空', trigger: 'blur' }
      //   ]
      // }
    }
  },
  created() {
    const explorer = navigator.userAgent
    if (explorer.indexOf('Chrome') >= 0) {
      this.style = 'width: 184px'
    } else {
      this.style = 'width: 172px'
    }
  },
  mounted() {
    console.log(this.data)
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      console.log(this.form)
      // this.form.dept.id = this.deptId
      // this.form.job.id = this.jobId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          // this.form.roles = []
          // const _this = this
          // this.roleIds.forEach(function(data, index) {
          //   const role = { id: data }
          //   _this.form.roles.push(role)
          // })
          if (this.isAdd) {
            console.log('add')
            this.doAdd()
          } else {
            console.log('edit')
            this.doEdit()
          }
        } else {
          return false
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        console.log('------------------', res, '------------------')
        this.resetForm()
        this.$notify({
          title: '添加成功',
          // message: '默认密码：123456',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.sup_this.init()
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    doEdit() {
      this.form.id = this.data.id
      console.log(this.form)
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
      // this.deptId = null
      // this.jobId = null
      // this.roleIds = []
      this.form = { parentId: '', coName: '', coAbbr: '', coCode: '', coAddr: '', zipCode: '', legalName: '', legalRep: '', taxId: '', tel: '', bankName: '' , bankAcct: '' }

    },
    // getRoles() {
    //   getAll().then(res => {
    //     this.roles = res
    //   }).catch(err => {
    //     console.log(err.response.data.message)
    //   })
    // },
    // getJobs(id) {
    //   getAllJob(id).then(res => {
    //     this.jobs = res.content
    //   }).catch(err => {
    //     console.log(err.response.data.message)
    //   })
    // },
    // getDepts() {
    //   getDepts({ enabled: true }).then(res => {
    //     this.depts = res.content
    //   })
    // },
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    },
    selectFun(node, instanceId) {
      this.getJobs(node.id)
    }
  }
}
</script>

<style scoped>

</style>
