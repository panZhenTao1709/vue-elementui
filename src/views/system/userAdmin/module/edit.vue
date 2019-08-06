<template>
  <div>
    <el-button v-if="checkPermission('编辑',sup_this)" size="mini" type="primary" icon="el-icon-edit" @click="to"/>
    <eForm ref="form" :sup_this="sup_this" :is-add="false" :data="data" />
  </div>
</template>
<script>
import { checkPermission } from '@/checkPermission'
import eForm from './form'
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    // index.vue 的this 可用于刷新数据
    sup_this: {
      type: Object,
      required: true
    },
  },
  methods: {
    checkPermission,
    to() {
      const _this = this.$refs.form
      const id=this.data.id
      // _this.getAdminRole()
      // _this.getCompany1()
      _this.getCompanyInfo(id)
      _this.getAdminRoleInfo(id)
      _this.form = {
        id: this.data.id,
        userName:this.data.userName,
        email:this.data.email,
        phone:this.data.phone,
        area:this.data.area,
        name:this.data.name,
        password:this.data.password,
       
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{display: inline-block;margin-right: 3px;}
</style>
