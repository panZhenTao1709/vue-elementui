<template>
  <div>
    <el-button  size="mini" type="primary" icon="el-icon-edit" @click="to"/>
    <eForm ref="form" :sup_this="sup_this" :is-add="false" :dicts="dicts"/>
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
      dicts: {
        type: Array,
        required: true
      }
    },
    methods: {
      checkPermission,
      to() {
        const _this = this.$refs.form
        const id=this.data.id
        /**
         * 回显
         */

        _this.form = {
          id: this.data.id,
          posName:this.data.posName,
          posEname:this.data.posEname,
          orgId:this.data.orgId
        }
        /**
         * 获取部门信息
         */
        _this.getOrg(id)
        _this.dialog = true
      }
    }
  }
</script>

<style scoped>
  div{display: inline-block;margin-right: 3px;}
</style>
