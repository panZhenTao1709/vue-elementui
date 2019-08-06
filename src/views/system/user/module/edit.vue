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
    multipleSelection:{
      type: Array,
      default: null
    },
    data: {
      type: Object,
      default: null
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
      if(!this.data){
        const checkArray = this.multipleSelection
        
         if(checkArray.length>1){
           this.$message({
          message: this.$t('table.selectMore'),
          type: 'warning'
        })
           return
         
          }
          if(checkArray.length==0){
             this.$message({
              message: this.$t('table.selectLess'),
              type: 'warning'
            })
            return
          }
          if(checkArray.length==1){
            const check = checkArray[0]
           this.data = check
            const id = check.id
          /**
           * 回显
           */
        
            _this.form = {
              id:check.id,
              userName:check.userName,
              email:check.email,
              phone:check.phone,
              area:check.area,
              name:check.name,
              password:check.password,
            
            }
            /**
           * 获取部门信息
           * 获取角色信息
           */
      
            _this.getOrgs(id)
            _this.getRoles(id)
          }
      }else{
     
          
          const id = this.data.id
          /**
           * 回显
           */
        
            _this.form = {
              id: this.data.id,
              userName:this.data.userName,
              email:this.data.email,
              phone:this.data.phone,
              area:this.data.area,
              name:this.data.name,
              password:this.data.password,
            
            }
            /**
           * 获取部门信息
           * 获取角色信息
           */
      
            _this.getOrgs(id)
            _this.getRoles(id)
          }
          
      
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{display: inline-block;margin-right: 3px;}
</style>
