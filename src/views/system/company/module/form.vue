<template>
  <el-dialog v-dialogDrag :visible.sync="dialog" :title="isAdd ? '新增公司' : '编辑公司'" append-to-body width="650px"
             style="height:100%;overflow:hidden;">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
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
      <el-form-item  label="上级公司">
        <treeselect v-model="form.parentId" :load-options="loadOptions" :options="comps" style="width: 460px;"
                    placeholder="选择上级公司"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">
        {{ $t('btn.cancel') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">
        {{ $t('btn.comfirm') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {isOverLength,isPostalcode} from '@/utils/validate'
  import {add, edit} from '@/api/company'
  import {getDepts} from '@/api/organization'
  import {getAll} from '@/api/role'
  import {getAllJob} from '@/api/job'
  import Treeselect from '@riophae/vue-treeselect'
  import {filterCompany} from '@/utils/treeselectdata'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
  import {initData} from '@/api/data'

  export default {
    components: {Treeselect},
    props: {
      isAdd: {
        type: Boolean,
        required: true
      },
      sup_this: {
        type: Object,
        default: null
      },
    },
    data() {
      const validname = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入公司名称'))
        }
        else if (!isOverLength(value)) {
          callback(new Error('请输入长度1-20位的公司名称'))
        } else {
          callback()
        }
      }
      const validCode = (rule, value, callback) => {
     if (value&&!isPostalcode(value)) {
          callback(new Error('请输入正确格式的邮编'))
        } else {
          callback()
        }
      }
      return {
        dialog: false,
        loading: false,
        form: {
          parentId: null,
          coName: '',
          coAbbr: '',
          coCode: '',
          coAddr: '',
          zipCode: '',
          legalName: '',
          legalRep: '',
          taxId: '',
          tel: '',
          bankName: '',
          bankAcct: ''
        },
        comps:[],
        rules: {
          coName: [
            {required: true, trigger: 'blur', validator: validname},
          ],
          zipCode:[
            {required:false,trigger:'blur',validator:validCode}
          ]
        }
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

    methods: {
      cancel() {
        if(this.isAdd){
          this.dialog = false;
          return
        } else {  this.resetForm()}
      
      },
      doSubmit() {
        // this.form.dept.id = this.deptId
        // this.form.job.id = this.jobId
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else {
              this.doEdit()
            }
          } else {
            return false
          }
        })
        let _this = this
        _this.sup_this.init()
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
      getCompanys() {
        initData('cloud-admin/company/children').then(res => {
          this.comps = filterCompany(res)
        })
      },
      loadOptions({action, parentNode, callback}) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          initData('cloud-admin/company/children', {parentId: parentNode.id}).then(res => {
            parentNode.children = filterCompany(res)
            callback()
            if (parentNode.id) {
              this.form.parentId = parentNode.id
            }
          })
        }
      },
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields()
        // this.deptId = null
        // this.jobId = null
        // this.roleIds = []
        this.form = {
          parentId: '',
          coName: '',
          coAbbr: '',
          coCode: '',
          coAddr: '',
          zipCode: '',
          legalName: '',
          legalRep: '',
          taxId: '',
          tel: '',
          bankName: '',
          bankAcct: ''
        }
      },
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
