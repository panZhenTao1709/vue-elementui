<template>
  <el-dialog v-dialogDrag :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增部门' : '编辑部门'" width="500px"
             style="height:100%;overflow:hidden;">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="orgName">
        <el-input v-model="form.orgName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="编号" prop="orgCode">
        <el-input v-model="form.orgCode" style="width: 370px;"/>
      </el-form-item>
      <!--<el-form-item label="英文名称" prop="orgEname">-->
      <!--<el-input v-model="form.orgEname" style="width: 370px;"/>-->
      <!--</el-form-item>-->
      <el-form-item label="等级" prop="orgLevel">
        <el-input v-model="form.orgLevel" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="上级部门">
        <treeselect v-model="form.parentId"  :options="depts" style="width: 370px;"
                    placeholder="选择上级部门"/>
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
  import {isOverLength, isEnname} from '@/utils/validate'
  import {add, edit, getDepts} from '@/api/organization'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {initData} from '@/api/data'
  import {filterlistOrg} from '@/utils/treeselectdata'
  import {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'

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
      }
    },
    data() {
      const validname = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入部门名称'))
        }
        else if (!isOverLength(value)) {
          callback(new Error('请输入长度1-20位的部门名称'))
        } else {
          callback()
        }
      }
      const validEnname = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入部门英文名称'))
        }
        else if (!isEnname(value)) {
          callback(new Error('请输入长度2-20位的部门英文名称'))
        } else {
          callback()
        }
      }
      return {
        loading: false, dialog: false, depts: [],
        form: {
          id: '',
          orgName: '',
          orgCode: '',
          orgEname: '',
          orgLevel: '',
          parentId: null
        },
        rules: {
          orgName: [
            {required: true, trigger: 'blur', validator: validname}
          ],
          orgEname: [
            {trigger: 'blur', validator: validEnname}
          ]
        }
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
            } else this.doEdit()
            /*else {
              this.$message({
                message: '上级部门不能为空',
                type: 'warning'
              })
            }*/
          }
        })
      },
      doAdd() {
        delete this.form.id
        add(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
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
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields()
        this.form = {
          id: '',
          orgName: '',
          orgCode: '',
          orgEname: '',
          orgLevel: '',
          parentId: ''
        }
      },
      getOrganization() {
        initData('cloud-admin/organization/tree').then(res => {
          console.log(res)
          this.depts = filterlistOrg(res)
        })
      },
      loadOptions({action, parentNode, callback}) {
        if (action === LOAD_CHILDREN_OPTIONS) {
          initData('cloud-admin/organization/children', {parentId: parentNode.id}).then(res => {
            parentNode.children = filterOrganization(res)
            callback()
            if (parentNode.id) {
              this.form.parentId = parentNode.id
            }
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>

