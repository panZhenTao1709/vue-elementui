<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{$t('table.personalinformation')}}</span>
      </div>
      <div>
        <div  style="text-align: center">
          <el-upload
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-error="handleError"
            :headers="headers"
            :action="updateAvatarApi"
            class="avatar-uploader">
            <img v-if="info.avatar"  :src="http+avatar" :title="this.$t('table.updateheader')" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </div>
        <ul class="user-info">
          <li>
            <svg-icon icon-class="user2"/>
            {{$t('table.usern')}}
            <div class="user-right">{{info.name}}</div>
          </li>
          <li>
            <svg-icon icon-class="phone"/>
            {{$t('table.phonenumber')}}
            <div class="user-right">{{info.phone}}</div>
          </li>
          <li>
            <svg-icon icon-class="email"/>
            {{$t('table.useremail')}}
            <div class="user-right">{{info.email }}</div>
          </li>
          <li>
            <svg-icon icon-class="idcard"/>
            {{$t('table.Idcard')}}
            <div class="user-right"> {{ info.idCardNo }}</div>
          </li>
          <li>
            <svg-icon icon-class="sys-tools"/>
            {{$t('table.Affiliatedcompany')}}
            <div class="user-right" v-if="info.company"> {{ info.company.coName }}</div>
          </li>
          <li>
            <svg-icon icon-class="dept"/>
            {{$t('table.departmentin')}}
            <div class="user-right" v-if="info.organization"> 
              <span v-for="item in info.organization" >/{{item.orgName }} </span>
            
            </div>
          </li>
           <li>
            <svg-icon icon-class="dept"/>
            {{$t('table.position')}}
            <div class="user-right" v-if="info.position"> 
             {{info.position.posName}}
            </div>
          </li>
          <li>
            <svg-icon icon-class="date"/>
            {{$t('table.dateCreated')}}
            <div class="user-right">{{ info.crtTime }}</div>
          </li>
          <li>
            <svg-icon icon-class="anq"/>
            {{$t('table.safeset')}}
            <div class="user-right">
              <a @click="$refs.pass.dialog = true">{{$t('table.changepassword')}}</a>
              <!--<a @click="$refs.email.dialog = true">修改邮箱</a>-->
            </div>
          </li>
        </ul>
      </div>
    </el-card>

    <updateEmail ref="email" :email="user.email"/>
    <updatePass ref="pass"/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {regEmail} from '@/utils/index'
  import updatePass from './center/updatePass'
  import updateEmail from './center/updateEmail'
  import log from './center/log'
  import {getToken} from '@/utils/auth'
  import {getInfo} from '@/api/user'
  import store from '@/store'
  import {parseTime} from '@/utils/index'
  import $ from 'jquery'

  export default {
    name: 'Center',
    components: {updatePass, updateEmail, log},
    data() {
      return {
        http:'',
        ico: 'el-icon-refresh',
        headers: {},
        info: ''
      }
    },
    computed: {
      ...mapGetters([
        'user',
        'updateAvatarApi',
        'avatar',
      ])
    },
    created() {
      this.headers = {
         'Authorization': getToken()
      }
      this.http = 'http://'
      this.getInfo()
      const style = localStorage.getItem('style')
      if (style) {
        $('#style').attr('href', style) // 实现将主题保存在内存中刷新浏览器不改变
      }

    },
    methods: {
      parseTime,
      formatEmail(mail) {
        return regEmail(mail)
      },
      handleSuccess(response, file, fileList) {
        
        this.$notify({
          title: this.$t('table.headerchangesuccess'),
          type: 'success',
          duration: 2500
        })
       
          this.$store.dispatch('GetInfo').then(() => {
            //保存完状态重新获取token
             this.headers = {
              'Authorization': getToken()
            }
          })
      },
      // 监听上传失败
      handleError(e, file, fileList) {
        const msg = JSON.parse(e.message)
        this.$notify({
          title: msg.message,
          type: 'error',
          duration: 2500
        })
      },
      refresh() {
        this.ico = 'el-icon-loading'
        this.$refs.log.init()
        setTimeout(() => {
          this.ico = 'el-icon-refresh'
        }, 300)
      },
      getInfo() {
        getInfo().then(res => {
          this.info = res.data
          console.log(this.info)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .avatar-uploader-icon {
    font-size: 28px;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
    border-radius: 50%
  }

  .user-info {
    padding-left: 0px;
    list-style: none;
    li {
      border-bottom: 1px solid #F0F3F4;
      border-top: 1px solid #F0F3F4;
      padding: 11px 0px;
      font-size: 13px;
    }
    .user-right {
      float: right;

      a {
        color: #317EF3;
      }
    }
  }
</style>
