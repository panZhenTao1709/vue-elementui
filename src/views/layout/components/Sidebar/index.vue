<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" >
    <el-menu
      :unique-opened="true"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuWrapBg"
      :text-color="variables.textColor"
      :active-text-color="variables.activeTextColor"
      mode="vertical"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  data() {
    return {
      openeds: ['1'],
      uniqueOpened: false
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {

  }
  // mounted() {
  //   for (var i = 0; i < this.permission_routers.length; i++) {
  //     console.log(this.permission_routers[i].path, i, this.permission_routers[i].name)
  //   }
  // }
}
</script>
