<template>
  <el-dialog v-dialogDrag :visible.sync="dialog" :title="isAdd ? this.$t('table.addnewuser') : this.$t('table.edittheuser')" append-to-body width="570px"
             style="height:100%;overflow:hidden;">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item :label="this.$t('table.userName')" prop="userName">
        <el-input v-model="form.userName"/>
      </el-form-item>
      <el-form-item prop="email" :label="this.$t('table.email')">
        <el-input v-model="form.email"/>
      </el-form-item>
      <el-form-item prop="phone" :label="this.$t('table.contactWay')">
        <el-input v-model="form.phone"/>
      </el-form-item>
      <el-form-item prop="area" :label="this.$t('table.area')">
        <el-input v-model="form.area"/>
      </el-form-item>
      <el-form-item prop="name" :label="this.$t('table.name')">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item prop="password" :label="this.$t('table.password')">
        <el-input v-model="form.password"/>
      </el-form-item>
      <!-- <el-form-item style="margin-bottom: 0px;" label="角色">
        <treeselect :multiple="true" v-model="form.roleIdsList" :options="roles" style="width: 370px;"
          placeholder="选择角色" />
      </el-form-item> -->
      <el-form-item prop="coIdsList" :label="this.$t('table.company')" style="margin-top:20px;">
        <treeselect :multiple="true" :show-count="true" :flat="true" v-model="form.coIdsList" :options="comps"
                    style="width: 370px;" :placeholder="this.$t('table.selectCompany')"/>
      </el-form-item>
    </el-form>
    <div style="width:100%;padding:0 20px;overflow:hidden;">
      <div style="float:right;">
        <el-button type="text" @click="cancel">
          {{ $t('btn.cancel') }}
        </el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">
          {{ $t('btn.comfirm') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {isvalidatPassword, isvalidatUsername, isvalidPhone, isOverLength, isEnname} from '@/utils/validate'
  import {filterlistConame, filterCheck} from '@/utils/treeselectdata'
  import {add, edit, getCompany, getCompanyInfo, getAdminRole, getAdminRoleInfo} from '@/api/userAdmin'
  import {getDepts} from '@/api/organization'
  import {getAll, getLevel} from '@/api/role'
  import {getAllJob} from '@/api/job'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    components: {Treeselect},
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

    },
    data() {
      const validPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('table.Penterphone')))
        } else if (!isvalidPhone(value)) {
          callback(new Error(this.$t('table.penterthecorrectnumber')))
        } else {
          callback()
        }
      }
      const validPassword = (rule, value, callback) => {
        if (value&&!isvalidatPassword(value)) {
          callback(new Error(this.$t('table.penter6_20bits')))
        } else {
          callback()
        }
      }

      const validUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('table.Penterusername')))
        } else if (!isvalidatUsername(value)) {
          callback(new Error(this.$t('table.pentermorethenfour')))
        } else {
          callback()
        }
      }
      const validenname = (rule, value, callback) => {
        if (!isEnname(value)) {
          callback(new Error(this.$t('table.pen')))
        } else {
          callback()
        }
      }

      return {
        dialog: false,
        loading: false,
        comps: [],
        form: {
          userName: '',
          email: '',
          phone: '',
          area: '',
          name: null,
          password: '',
          coIdsList: null,
          roleIdsList: null
        },
        roles: [],
        depts: [],
        deptId: null,
        jobId: null,
        jobs: [],
        style: 'width: 184px',
        level: 3,
        rules: {
          userName: [
            {required: true, trigger: 'blur', validator: validUsername}
          ],
          email: [
            {required: true, message: this.$t('table.penteremail'), trigger: 'blur'},
            {type: 'email', message: this.$t('table.pentersureemail'), trigger: 'blur'}
          ],
          phone: [
            {required: true, trigger: 'blur', validator: validPhone}
          ],
          password: [
            {required: false, trigger: 'blur', validator: validPassword}
          ],
          name: [
            {required: false, trigger: 'blur', message: this.$t('table.pentername1_20'), max: 20, min: 1}
          ],

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
          this.dialog = false
          return
        } else {
          this.resetForm()
        }
  
      },
      doSubmit() {
        console.log(this.form)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
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
       // this.form.roleIds = this.form.roleIdsList.toString()
        this.form.coIds = this.form.coIdsList.toString()
        add(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: this.$t('table.addsuccess'),
            // message: '默认密码：123456',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.sup_this.init()
        }).catch(err => {
          this.loading = false
          this.$notify({
            title: err.response.data.message,
            type: 'failed',
            duration: 2500
          })
          console.log(err)
        })
      },
      doEdit() {
       // this.form.roleIds = this.form.roleIdsList.toString()
        this.form.coIds = this.form.coIdsList.toString()
        this.form.id = this.data.id
        edit(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: this.$t('table.modifysuccess'),
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.sup_this.init()
        }).catch(err => {
          this.loading = false
          this.$notify({
            title: err.response.data.message,
            type: 'failed',
            duration: 2500
          })
          console.log(err.response.data.message)
        })
      },
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields()
        this.deptId = null
        this.jobId = null
        this.form = {
          userName: '',
          email: '',
          phone: '',
          area: '',
          name: null,
          password: '',
          coIdsList: [],
          roleIdsList: []
        }
      },

      selectFun(node, instanceId) {
        this.getJobs(node.id)
      },
      getCompany1() {
        const _this = this
        getCompany().then(res => {
          _this.form.coIdsList = []
          _this.form.coIdsList = filterCheck(res)
          this.comps = filterlistConame(res)
        })
      },
      //公司信息
      getCompanyInfo(id) {
        var _this = this
        const param = {id: id}
        getCompany(param).then(res => {
          _this.form.coIdsList = []
          _this.form.coIdsList = filterCheck(res)
          this.comps = filterlistConame(res)
        })
      },
      //角色信息
      getAdminRoleInfo(id) {
        var _this = this
        const param = {id: id}
        getAdminRole(param).then(res => {
          if(!res){res = []}
          _this.form.roleIdsList = []
          res.map(role => {
            if (role.hasChecked) {
              _this.form.roleIdsList.push(role.id)
            }
            _this.roles.push({id: role.id, label: role.name})
          })
        })
      },
      getAdminRole() {
        var _this = this
        getAdminRole().then(res => {
          _this.roles = []
          if(!res){res = []}
          res.map(role => {
            _this.roles.push({id: role.id, label: role.name})
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
