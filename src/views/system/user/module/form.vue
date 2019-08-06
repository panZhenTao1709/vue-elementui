<template>
  <el-dialog v-dialogDrag :visible.sync="dialog" :title="isAdd ? '新增用户' : '编辑用户'" append-to-body width="570px"
             style="height:100%;overflow:hidden;">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="70px">
      <el-form-item :label="this.$t('table.userName')" prop="userName">
        <el-input v-model="form.userName"/>
      </el-form-item>
      <el-form-item prop="password" :label="this.$t('table.password')">
        <el-input v-model="form.password"/>
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
      <el-form-item prop="" :label="this.$t('table.department')">
        <treeselect
          :multiple="true"
          :options="organizations"
          :placeholder="this.$t('table.selectdepartment')"
          style="width: 370px;"
          :show-count="true" :flat="true"
          v-model="form.organizationsList"
        />
        <!-- <treeselect :multiple="true" :show-count="true" :flat="true" v-model="id" :options="organizations" style="width: 179px;" placeholder="选择部门" /> -->
      </el-form-item>
      <el-form-item prop="" :label="this.$t('table.Role')">
        <treeselect :multiple="true" v-model="form.rolesList" :options="roles"  :show-count="true" :flat="true" style="width: 370px;"
                    :placeholder="this.$t('table.selectRole')"/>
      </el-form-item>
    </el-form>
    <el-button type="text" @click="cancel">
      {{ $t('btn.cancel') }}
    </el-button>
    <el-button :loading="loading" type="primary" @click="doSubmit">
      {{ $t('btn.comfirm') }}
    </el-button>
  </el-dialog>
</template>

<script>
  import {isvalidatPassword, isvalidatUsername, isvalidPhone, isOverLength, isEnname} from '@/utils/validate'
  import {filterlistRoles, filterlistOrg, filterCheck} from '@/utils/treeselectdata'
  import {add, edit, getRoles, getOrgs} from '@/api/user'
  import {getDepts} from '@/api/organization'
  import {getAll, getLevel} from '@/api/role'
  import {getAllJob} from '@/api/job'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    components: {Treeselect},
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
        // if (!value) {
        //   callback(new Error('请输入密码'))
        // } else
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
          callback(new Error(this.$t('table.user4_20')))
        } else {
          callback()
        }
      }

      // const validcnname = (rule, value, callback) => {
      //   if (!isOverLength(value)) {
      //     callback(new Error('请输入1-20位的姓名'))
      //   } else {
      //     callback()
      //   }
      // }
      const validenname = (rule, value, callback) => {
        if (!isEnname(value)) {
          callback(new Error(this.$t('table.engname1_30')))
        } else {
          callback()
        }
      }

      return {
        organizations: [],
        dialog: false,
        loading: false,
        form: {
          userName: '',
          email: '',
          phone: '',
          area: '',
          name: null,
          password: '',
          roleIds: '',
          orgIds: '',
          rolesList: [],
          organizationsList: []
        },
        roleIds: [],
        roles: [],
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
            {  trigger: 'blur', validator: validPassword }
          ],
          name: [
            {required: false, trigger: 'blur', message: this.$t('table.pentername1_20'),max:20,min:1}
          ],

        },
        style: 'width: 184px',
        level: 3,
      }
    },
    props: {
      isAdd: {
        type: Boolean,
        required: true
      },
      data: {
        type: Object,
        default: null
      },
      sup_this: {
        type: Object,
        default: null
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
        if(this.isAdd){
          this.dialog = false
          return 
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
            } else {
              this.doEdit()
            }
            this.loading = false
            this.sup_this.init()
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

        this.form.roleIds = this.form.rolesList.toString()
        this.form.orgIds = this.form.organizationsList.toString()
        add(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: this.$t('table.addsuccess'),
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
        /**
         * v-model Array类型数据（rolesList：角色，rolesList：部门）toString()转换为字符串后传参
         *
         *
         */
        this.form.roleIds = this.form.rolesList.toString()
        this.form.orgIds = this.form.organizationsList.toString()
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
        this.roleIds = []
        this.form = {userName: '', email: '', phone: '', area: '', name: null, password: ''}
      },
      selectFun(node, instanceId) {
        this.getJobs(node.id)
      },
      /**获取部门信息 */
      getOrgs(id) {
        const _this = this
        const params = {id: id}
        getOrgs(params).then(res => {
          _this.organizations = filterlistOrg(res.data)
          _this.form.organizationsList = filterCheck(res.data)
        })
      }
      ,
      /**获取角色信息 */
      getRoles(id) {
        const _this = this
        const params = {id: id}
        getRoles(params).then(res => {
          _this.roles = filterlistRoles(res.data)
          _this.form.rolesList = filterCheck(res.data)
        })
      },

    }
  }
</script>

<style scoped>

</style>
