<template>
  <div>
    <el-button size="mini" type="primary" @click="to" icon="el-icon-edit"/>
    <eForm ref="form" :menus="menus" :sup_this="sup_this" :is-add="false" :is-menu="isMenu"/>
  </div>
</template>
<script>
import eForm from './form'
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    isMenu: {
      type: Boolean,
      required: true
    },
    menus: {
      type: Array,
      required: true
    }
  },
  methods: {
    to() {
      const _this = this.$refs.form
      console.log(this.data);
      // _this.form = { id: this.data.id, component: this.data.component, name: this.data.name, sort: this.data.sort, pid: this.data.pid, path: this.data.path, iframe: this.data.iframe.toString(), roles: [], icon: this.data.icon }
      _this.form = {
        code:this.data.code, 
        id: this.data.id, 
        component: this.data.component, 
        name: this.data.name, 
        enName: this.data.enName, 
        icon: this.data.icon, 
        menuType: this.data.menuType, 
        href: this.data.href, 
        serviceId: this.data.serviceId, 
        scop: this.data.scop, 
        permissionCode: this.data.permissionCode, 
        method: this.data.method, 
        isShow: this.data.isShow, 
        isDisable: this.data.isDisable, 
        ordNum: this.data.ordNum }
     _this.getNacosService()
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{
    display: inline-block;
    margin-right: 3px;
  }
</style>
