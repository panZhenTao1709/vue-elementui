<template>
  <el-dialog v-dialogDrag :visible.sync="dialog" :title="isAdd ? '新增缓存' : '查看缓存'" append-to-body width="400px" style="height:100%;overflow:hidden;">
    <el-form ref="form" :inline="true" :model="form" size="small" label-width="100px">

      <el-form-item prop="key" label="缓存Key">
        <el-input v-model="form.key"/>
      </el-form-item>
      <el-form-item prop="value" label="缓存Value">
        <el-input v-model="form.value"/>
      </el-form-item>
      <el-form-item prop="outOfTime" label="缓存过期时间">
        <el-input v-model="form.outOfTime"/>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>

import { add, edit } from '@/api/cache'
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
      dialog: false, loading: false, form: { key: '', value: '' ,outOfTime: ''},
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
  },
  methods: {
    cancel() {
      this.resetForm()
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
        } else {
          return false
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
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
      this.form = {  key: '', value: '' }

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
