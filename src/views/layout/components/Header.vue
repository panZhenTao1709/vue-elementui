<template>
  <header class="header" style="height:40px;width:100%;overflow:hidden" >
    <div id="logo-group" style="float:left">
      <span id="logo"> <img src="@/assets/images/logo.png" alt="JoyongAdmin"> </span>
    </div>
    <switch-company class="switch-company" />
    <!-- <search-globel class="search-globel"/> -->
    <div class="project-context hidden-xs">

				<span class="label">{{$t('login.currentCo')}}</span><br/>
				<span class="project-selector dropdown-toggle" data-toggle="dropdown" aria-expanded="false">{{company.name}}</span>
			</div>
    <div class="right-menu" style="float:right">

      <template v-if="device!=='mobile'">
        <search class="right-menu-item" />
        <lang-select class="right-menu-item hover-effect" style="margin-bottom: 10px;font-size:22px"/>

        <theme-picker class="right-menu-item hover-effect" style="margin-bottom: 12px;"/>

        <screenfull class="screenfull right-menu-item"/>

      </template>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
        <img  :src="http+avatar" class="user-avatar" onerror="this.onerror=null;this.src='http://172.31.11.41:9501/group1/M00/00/00/rB8LKV0r81yAbzreAAA9oSaK9Hw416.jpg'"> 
          <!-- <img src="@/assets/images/photo.jpg" class="user-avatar"> -->
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/userindex/center">
            <el-dropdown-item>
              {{ $t('route.avatarUpload') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">
              {{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>
<script>
import { mapGetters } from 'vuex'
import ThemePicker from '@/components/ThemePicker'
// import SearchGlobel from '@/components/SearchGlobel'
import SwitchCompany from '@/components/SwitchCompany'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import { logout } from '@/api/user'

export default {
  data(){
    return {
       http:'http://'
    }
  },
  components: {
    Screenfull,
    LangSelect,
    SwitchCompany,
    Search,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'company'
    ])
  },
  methods: {
    logout() {
       logout().then(res=>{
        const url = res
        this.$store.dispatch('LogOut').then(() => {
           location.href = url
        })
         // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.switch-company{
    -moz-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
    // position: absolute;
    // top: 10px;
    // left: 220px;
    // cursor:pointer;
    // background:#474544;
    // border-radius: 5px;
    // padding:5px;
    // color:#fff;
    // font-weight: 800;
    bottom: 3px;
    margin-left: 50px;
    cursor: pointer;
    background: #474544;
    border-radius: 5px;
    padding: 5px;
    color: #fff;
    font-weight: 800;
}
.right-menu-item{
-moz-user-select:none;
-webkit-user-select:none;
-ms-user-select:none;
user-select:none;
}

 .project-context {
   font-size:12px;
   margin-left:30px;
    color:rgb(191, 203, 217);
    display: inline-block;
    padding: 7px 13px 0;
    position: relative;
}
.label{
  color:#bfbfbf;
  font-weight: 700;
}
.search-globel{
  position:absolute;
  top:10px;
  left: 400px;
}
.avatar-wrapper{
  cursor: pointer;
}
.user-avatar{
  cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
 .screenfull {
    height: 34px!important
}
.header{
    z-index:2000;
    display: block;
    height: 40px;
    margin: 0;
    position: absolute;
    top:0;
    left:0;
    padding: 0 13px 0 0;
    background-color: #f3f3f3;
    background-image: -moz-linear-gradient(top,#f3f3f3,#e2e2e2);
    background-image: -webkit-gradient(linear,0 0,0 100%,from(#f3f3f3),to(#e2e2e2));
    background-image: -webkit-linear-gradient(top,#f3f3f3,#e2e2e2);
    background-image: -o-linear-gradient(top,#f3f3f3,#e2e2e2);
    background-image: linear-gradient(to bottom,#f3f3f3,#e2e2e2);
    background-repeat: repeat-x;
 }
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container{
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 40px;
      display: flex!important;
      align-items: center!important;
      &:focus{
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        // margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international{
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 12px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    #logo{
   width: 175px;
 }
 #logo img{
    width: 150px;
    height: auto;
    padding-left: 3px;
    margin-top: 10px;
    margin-left:20px;
 }
</style>
