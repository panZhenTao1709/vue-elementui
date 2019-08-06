<template>
<!-- v-if="companies.length>1" -->
  <el-dropdown  v-if="companies.length>1" trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <span class-name="international-icon" >{{ $t('header.SwitchCo') }}<i class="el-icon-arrow-down el-icon--right"/></span>
    </div>
    <el-dropdown-menu slot="dropdown" >
      <el-dropdown-item :disabled="companyId===com.id"  v-for="(com,index) in companies" :command="com.id" :key="index">{{ com.name }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>

export default {
  computed: {
    companyId() {
      return this.$store.state.user.companyId
    },
    companies() {
      return this.$store.state.user.companies
    }
  },
 
  methods: {
    handleSetLanguage(companyId) {
      this.$store.dispatch('delAllViews')
      this.$store.dispatch('SelectCompany', companyId).then(res => {
      this.$router.replace({
        path: '/',
        query: {
          t: Date.now()
        }
      })
      })
      // this.$message({
      //   message: '切换公司成功',
      //   type: 'success'
      // })
    }
  }
}
</script>


