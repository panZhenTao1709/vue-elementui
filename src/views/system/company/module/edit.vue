<template>
  <div>
    <el-button size="mini" type="primary" icon="el-icon-edit" @click="to"/>
    <eForm ref="form" :sup_this="sup_this" :is-add="false" :data="data" :dicts="dicts"/>
  </div>
</template>
<script>
  import eForm from './form'

  export default {
    components: {eForm},
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
      to() {
        const _this = this.$refs.form
        _this.form = {
          id:this.data.id,
          coName: this.data.coName,
          parentId: this.data.parentId,
          coAbbr: this.data.coAbbr,
          coCode: this.data.coCode,
          coAddr: this.data.coAddr,
          zipCode: this.data.zipCode,
          legalName: this.data.legalName,
          legalRep: this.data.legalRep,
          taxId: this.data.taxId,
          tel: this.data.tel,
          bankName: this.data.bankName,
          bankAcct: this.data.bankAcct
        }
        _this.dialog = true
        _this.getCompanys()
      }
    }
  }
</script>

<style scoped>
  div {
    display: inline-block;
    margin-right: 3px;
  }
</style>
