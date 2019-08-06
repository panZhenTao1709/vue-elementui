<template>
  <el-dialog v-dialogDrag :visible.sync="dialog" :title="isAdd ? this.$t('table.newRole') : this.$t('table.editingtherole')" append-to-body width="500px"
             style="height:100%;overflow:hidden;">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item :label="this.$t('table.characterName')" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item v-if="isAdd" :label="this.$t('table.typesofrole')" prop="roleType">
        <el-select v-model="form.roleType" style="width: 370px" :placeholder="this.$t('table.typesofrole')" >
          <el-option
            v-for="obj in type"
            :key="obj.value"
            :label="obj.label"
            :value="obj.value"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="this.$t('table.statusofrole')" prop="isDisable">
        <el-select v-model="form.isDisable" style="width: 370px" :placeholder="this.$t('table.statusofrole')" >
          <el-option
            v-for="obj in status"
            :key="obj.value"
            :label="obj.label"
            :value="obj.value"/>
        </el-select>
      </el-form-item>

        <el-form-item  prop="companyId" :label="this.$t('table.company')" >
          <treeselect v-model="form.companyId" :options="comps" :disabled="!isRoleType"
                      style="width: 370px;"  :placeholder="this.$t('table.selectCompany')"/>
        </el-form-item>

      <el-form-item v-if="roles.length>0 && isRoleType &&isAdd" :label="this.$t('table.thesuperiorrole')" prop="parentId">
        <treeselect v-model="form.parentId" style="width: 370px;" :options="roles" 
                    :placeholder="this.$t('table.selectsuperiorrole')"/>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">{{ $t('btn.cancel') }}</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">{{ $t('btn.comfirm') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>

  import {add, edit, getChildren, getRoleTree} from '@/api/adminRole'
  import {getCompany} from '@/api/adminRole'
  import {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect' //tree插件
  import Treeselect from '@riophae/vue-treeselect' //tree插件
  import '@riophae/vue-treeselect/dist/vue-treeselect.css' //tree插件
  import {filterlist, filterlistConame, filterlistRoles} from '@/utils/treeselectdata' //tree插件
  import {initData} from '@/api/data'
  import {isOverLength} from '@/utils/validate';

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
      id:{
        type:String,
        default:null
      }
    },
    data() {
      const validcnname = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('table.enterrolename')))
        }
        else if (!isOverLength(value)) {
          callback(new Error(this.$t('table.enter1_20character')))
        } else {
          callback()
        }
      }
      return {
        status: [{'value': 0, 'label': this.$t('table.startuse')}, {'value': 1, 'label': this.$t('table.forbidden')}],
        type: [{'value': 'global', 'label': this.$t('table.global')}, {'value': 'public', 'label': this.$t('table.public')}, {
          'value': 'private',
          'label': this.$t('table.private')
        }],
        loading: false, dialog: false, roles: [],isRoleType:false,
        form: {name: '', roleType: 'global', isDisable: 0, parentId: null, companyId: null,},
        comps: [],
        rules: {
          name: [
            {required: true, trigger: 'blur', validator: validcnname}
          ],
          roleType: [
            {required: true, trigger: 'change', message: this.$t('table.roletype')}
          ],
          isDisable: [
            {required: true, trigger: 'change', message: this.$t('table.rolestatus')}
          ]
        }
      }
    },
    created() {
    },
    watch: {
      'form.companyId':
        function () {
        const _this=this
          _this.roles = []
          if (_this.form.companyId) {
            _this.getRoleTree({companyId: _this.form.companyId})
          }
        },
      'form.roleType': function () {
        const _this = this
        if (_this.form.roleType === 'private') {
          _this.isRoleType = true
        } else {
          _this.isRoleType = false
          //角色类型不是private，重置公司id和pid
          _this.form={name: _this.form.name, roleType: _this.form.roleType, isDisable: _this.form.isDisable,companyId:null,parentId:null}
        }
      }
    },
    methods: {
      cancel() {
        if (this.isAdd) {
          this.dialog = false
          return
        } else {this.resetForm()
        }
      },
      getRoleTree(param) {
        const _this = this
        getRoleTree(param).then(res => {
          if (res.data.length > 0) {
            _this.form.parentId = null
            _this.roles = filterlistRoles(res.data)
          }
        })
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
          console.log(err.response.data.message)
        })
      },
      doEdit() {
        this.form.id = this.id
        edit(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: this.$t('table.modifysuccess'),
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$router.replace({
            path: this.$router.path,
            query: {
              t: Date.now()
            }
          })
          
        }).catch(err => {
          this.loading = false
          this.$notify({
            title: err.response.data.message,
            type: 'fail',
            duration: 2500
          })
        })
      },
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields()
        this.form = {name: '', roleType: 'private', isDisable: 0}
      },
      getCompany() {
        const _this = this
        getCompany().then(res => {
          _this.comps = filterlistConame(res.data)
        })
      },
      loadOptions({action, parentNode, callback}) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          initData('cloud-admin/adminRole/children', {parentId: parentNode.id}).then(res => {
            parentNode.children = filterlist(res)
            callback()
            if (parentNode.id) {
              this.form.parentId = parentNode.id
            }
          })
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
  .ss{
    color: red!important;
    text-decoration:line-through!important;
  }
</style>
