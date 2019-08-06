<template>
  <div class="login">
    <el-form style="height:350px!important" ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px" class="login-form">
      <h3 class="title"> {{ $t('login.title') }}</h3>
      <lang-select class="set-language" />
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" :placeholder="$t('login.username')" type="text" auto-complete="off">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon" style="height: 39px;width: 13px;margin-left: 2px;" />
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input :type="passwordType" v-model="loginForm.password" :placeholder="$t('login.password')" auto-complete="off" @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon" style="height: 39px;width: 13px;margin-left: 2px;" />
        </el-input>
        <span class="show-pwd" style="position:absolute;right:10px;top:0px;" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" style="height: 20px;width: 13px;" />
        </span>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 8px 0px;">{{ $t('login.rememberpwd') }}</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          <span v-if="!loading">{{ $t('login.logIn') }}</span>
          <span v-else>{{ $t('login.logining') }}</span>
        </el-button>
      </el-form-item>
      
      <el-button class="thirdparty-button" type="primary" @click="showDialog=true">
        {{ $t('login.thirdparty') }}
      </el-button>
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" center>
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
    <div class="footer small-font-size" style="position: absolute;bottom: 30px;font-size: 12px;">
		<div style="text-align:center;">
			<span>
				<span>系统支持:</span>
				<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=2804232040&amp;site=qq&amp;menu=yes">QQ交谈</a>
				<span> | </span>
				<a target="_blank" href="http://wp.qq.com/wpa/qunwpa?idkey=a7ceba748c55928408395fd673a257c819a805d1ca1b0d5bf2f85a1103b973af">加入QQ群1</a>
				<span> | </span>
				<a target="_blank" href="http://wp.qq.com/wpa/qunwpa?idkey=a7ceba748c55928408395fd673a257c819a805d1ca1b0d5bf2f85a1103b973af">加入QQ群2</a>
				<span> | </span>
				<span class="wx-tip wx_company">企业号</span>
				<span> | </span>
 				<span class="wx-tip wx_official">官方微信</span>
				<span> | </span>
				<a href="javascript:;"><span class="downloadLink">下载客户端</span></a>
			</span>
		</div>
		<div   style="text-align:center;">
			<span>Powered by </span>
			<a href="http://soa.joyoung.com">九阳协同平台</a>
			<span> | </span>
			<span>服务电话:0571-81639125</span>
			<span> | </span>
			<span>Copyright © 2010~2019 九阳JOYOUNG</span>
			<span> | </span>
			<span class="beian"></span>
			<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37010402000117">鲁公网安备 37010402000117号 鲁ICP备10015959号</a>
			
		</div>
	</div>
  </div>
  
</template>

<script>
import SocialSign from './socialsignin'
import LangSelect from '@/components/LangSelect'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  components: {
    LangSelect,
    SocialSign
  },
  data() {
    return {
      showDialog: false,
      passwordType: 'password',
      md5Pwd: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: this.$t('message.name') }],
        password: [{ required: true, trigger: 'blur', message: this.$t('message.pwd') }]
      },
      loading: false,
      redirect: undefined
    }
  },

  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  beforeCreate(){
     //window.location.href = 'http://172.31.11.41:8765/cloud-auth/cas'
  },
  created() {
    this.getCookie()
  },
  
  methods: {
    // 控制密码的显示与隐藏
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.loginForm = {
        username: username === undefined ? '' : username,
        password: password === undefined ? '' : password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        const pass = this.loginForm.password
        const user = { username: this.loginForm.username, password: pass, rememberMe: this.loginForm.rememberMe }
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('username', user.username, { expires: 1 })
            Cookies.set('password', user.password, { expires: 1 })
            Cookies.set('rememberMe', user.rememberMe, { expires: 1 })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store.dispatch('Login', user).then(() => {
            this.loading = false
            console.log(this.$store)
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image:url(	http://soa.joyoung.com/cas/images/swipe_1.jpg) ;
    background-size:cover;
    height: 90%;
  }
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #707070;
  }
   .set-language{
     position:absolute;
     top:10px;
     right:30px;
   }
  .login-form {
    right: 50px;
    position:absolute;
    border-radius: 6px;
    background: #ffffff;
    width: 365px;
    padding: 25px 25px 31px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
  }
  .thirdparty-button {
    position: absolute;
    right: 10px;
    bottom: 6px;
  }
  .login-tip {
    font-size: 13px;
    text-align: left;
    color: #bfbfbf;
  }
  .footer a{
    color:#666;
  }

</style>
