<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? $t('table.newRole') : $t('table.editingtherole')" append-to-body width="500px"
             style="height:100%;overflow:hidden;">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item :label="$t('table.characterName')" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item :label="$t('table.typesofrole')" prop="roleType">
        <el-select v-model="form.roleType" style="width: 370px" :placeholder="this.$t('table.typesofrole')">
          <el-option
            v-for="obj in type"
            :key="obj.value"
            :label="obj.label"
            :value="obj.value"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('table.statusofrole')" prop="isDisable">
        <el-select v-model="form.isDisable" style="width: 370px" :placeholder="$t('table.statusofrole')">
          <el-option
            v-for="obj in status"
            :key="obj.value"
            :label="obj.label"
            :value="obj.value"/>
        </el-select>
      </el-form-item>

      <el-form-item v-if="isAdd"  label="上级类目" prop="parentId">
        <treeselect v-model="form.parentId"  style="width: 370px;" :options="roles" placeholder="选择上级类目" />
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
  import {isOverLength} from '@/utils/validate'
  import {getDepts} from '@/api/organization'
  import {add, edit ,getParentRole} from '@/api/role'
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
    import {filterlistComname} from '@/utils/treeselectdata'

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
      },
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
        status: [{'value': 0, 'label': '启用'}, {'value': 1, 'label': '禁用'}],
        type: [{'value': 'global', 'label': '全局'}, {'value': 'public', 'label': '公共'}, {
          'value': 'private',
          'label': '私有'
        }],
        roles:[],
        loading: false, dialog: false, depts: [], deptIds: [],
        form: {name: '', roleType: 'private', isDisable: 0,parentId:null},
        rules: {
          name: [
            {required: true, trigger: 'blur', validator:validcnname}
          ],
          roleType:[
            {required:true,trigger:'blur',message:"请选择角色类型"}
          ],
          isDisable:[
            {required:true,trigger:'blur',message:"请选择角色状态"}
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
        if (this.form.dataScope === '自定义' && this.deptIds.length === 0) {
          this.$message({
            message: '自定义数据权限不能为空',
            type: 'warning'
          })
        } else {
          this.form.depts = []
          if (this.form.dataScope === '自定义') {
            // for (let i = 0; i < this.deptIds.length; i++) {
            //   this.form.depts.push({
            //     id: this.deptIds[i]
            //   })
            // }
            this.deptIds.map(o=>{
               this.form.depts.push(o)
            })
          }
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
        }
      },
      doAdd() {
        add(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
            //懒加载调用sup_this.init()只能作用于第一次初始化的数据，嵌套子数据init（）无法更改，局部刷新不适用，改用全局刷新
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
            title: '修改成功',
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
            type: 'failed',
            duration: 2500
          })
          console.log(err.response.data.message)
        })
      },
      resetForm() {
        this.dialog = false
        this.$refs['form'].resetFields()
        this.form = {name: '', depts: [], remark: '', dataScope: '本级', level: 3}
      },
      getDepts() {
        getDepts({enabled: true}).then(res => {
          this.depts = res.content
        })
      },
      
      getParentRole(){
        getParentRole().then(res=>{
            this.roles = filterlistComname(res.data)
        })
      },
      changeScope() {
        if (this.form.dataScope === '自定义') {
          this.getDepts()
        }
      }
    }


  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
