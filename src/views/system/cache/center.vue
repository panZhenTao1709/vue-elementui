<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>公司信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <el-upload
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :headers="headers"
                :action="updateAvatarApi"
                class="avatar-uploader">
                <img v-if="user.avatar" :src="user.avatar" title="点击上传头像" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"/>
              </el-upload>
            </div>
            <ul class="user-info">
              <li><svg-icon icon-class="parentId" /> 上级公司id <div class="user-right">{{ company.parentId }}</div></li>
              <li><svg-icon icon-class="coName" /> 公司名称 <div class="user-right">{{ company.coName }}</div></li>
              <li><svg-icon icon-class="coAbbr" /> 公司简称 <div class="user-right">{{ company.coAbbr }}</div></li>
              <li><svg-icon icon-class="coCode" /> 公司编码 <div class="user-right"> {{ company.coCode }}</div></li>
              <li><svg-icon icon-class="coAddr" /> 公司地址 <div class="user-right">{{ company.coAddr }}</div></li>
              <li><svg-icon icon-class="zipCode" /> 邮编 <div class="user-right">{{ company.zipCode }}</div></li>
              <li><svg-icon icon-class="legalName" /> 法人名称 <div class="user-right">{{ company.legalName }}</div></li>
              <li><svg-icon icon-class="legalRep" /> 法定代表人 <div class="user-right">{{ company.legalRep }}</div></li>
              <li><svg-icon icon-class="taxId" /> 税号 <div class="user-right">{{ company.taxId }}</div></li>
              <li><svg-icon icon-class="tel" /> 电话 <div class="user-right">{{ company.tel }}</div></li>
              <li><svg-icon icon-class="bankName" /> 开户银行名称 <div class="user-right">{{ company.bankName }}</div></li>
              <li><svg-icon icon-class="bankAcct" /> 开户银行账号 <div class="user-right">{{ company.bankAcct }}</div></li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                  <a @click="$refs.email.dialog = true">修改邮箱</a>
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>操作日志</span>
            <div style="display:inline-block;float: right;cursor: pointer" @click="refresh"><i :class="ico"/></div>
          </div>
          <log ref="log"/>
        </el-card>
      </el-col>
    </el-row>
    <updateEmail ref="email" :email="user.email"/>
    <updatePass ref="pass"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { regEmail } from '@/utils/index'
import updatePass from './center/updatePass'
import updateEmail from './center/updateEmail'
import log from './center/log'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { parseTime } from '@/utils/index'
export default {
  name: 'Center',
  components: { updatePass, updateEmail, log },
  data() {
    return {
      ico: 'el-icon-refresh',
      headers: {
        'Authorization': 'Bearer ' + getToken()
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'updateAvatarApi'
    ])
  },
  created() {
    store.dispatch('GetInfo').then(() => {})
  },
  methods: {
    parseTime,
    formatEmail(mail) {
      return regEmail(mail)
    },
    handleSuccess(response, file, fileList) {
      this.$notify({
        title: '头像修改成功',
        type: 'success',
        duration: 2500
      })
      store.dispatch('GetInfo').then(() => {})
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
    li{
      border-bottom: 1px solid #F0F3F4;
      border-top: 1px solid #F0F3F4;
      padding: 11px 0px;
      font-size: 13px;
    }
    .user-right {
      float: right;

      a{
        color: #317EF3;
      }
    }
  }
</style>
