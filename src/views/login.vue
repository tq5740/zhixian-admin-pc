<template>
  <transition name="fade">
    <div class="login" v-if="!$store.state.userInfo">
      <div class="login">
        <div class="login-1"></div>
        <div class="login-panel" v-loading="fullscreenLoading" element-loading-text="登录中...">
          <div class="login-2"></div>
          <el-form :inline="false" v-if="!showFind">
            <p>
              <span style="font-size:20px;color:#337ab7">欢迎 </span>
              <span style="font-size:12px;color:#888;"> Welcome</span>
              <a class="fr" style="cursor: pointer;margin-top: 8px;color:#888;" @click="register">没有账号？企业注册</a>
            </p>
            <div v-if="showQRcode" id="login_container">
              <img src="" alt="">
            </div>
            <div v-else>
              <p>
                <el-input v-model="loginObj.phone" type="text" placeholder="请输入手机号码或身份证号码" size="large" @change="is_verifyCode = false"></el-input>
              </p>
              <p>
                <el-input v-model="loginObj.password" type="password" auto-complete="new-password" size="large" placeholder="请输入登录密码"></el-input>
              </p>
              <p v-if="is_verifyCode">
                <el-input style="width:180px;" v-model="loginObj.answerCode" type="text" size="large" placeholder="输入图形验证码"></el-input>
                <img class="imgVer pointer" :src="$store.state.configData.imgDomain+imgVerifyCode" alt="图片验证码" @click="getVerifycode(loginObj.phone)">
              </p>
              <p>
                <el-checkbox v-model="isSave" @change="removeLocalPhone" style="color:#888;">记住账号</el-checkbox>
                <a class="fr" style="cursor: pointer;" @click="forgot">忘记密码？</a>
              </p>
              <p>
                <input type="submit" @click.stop.prevent="login" class="loginBtn el-button el-button--primary el-button--large" value="登 录" />
              </p>
            </div>
            
            <!-- <p style="text-align: center; margin-bottom: 0"><a style="cursor: pointer;" @click="QRcode">{{showQRcode ? "账号密码登录" : "扫描二维码登录"}}</a></p> -->
          </el-form>
          <el-form :inline="true" v-if="showFind">
            <p>
              <span style="font-size:20px;color:#337ab7">找回密码 </span>
              <!-- <span style="font-size:12px;color:#888;"> Forgot password</span> -->
            </p>
            <p>
              <el-input v-model="resetObj.phone" type="text" placeholder="请输入手机号码" size="large"></el-input>
            </p>
            <p>
              <el-input :style="isGetCode ? 'width:200px' : 'width:210px'" v-model="resetObj.authCode" type="text" size="large" placeholder="请输入验证码">
              </el-input>
              <el-button :style="isGetCode ? 'width:123px' : 'width:113px'" type="primary" class="fr" @click="getCode" :disabled="isGetCode">
                {{codeText}}</el-button>
            </p>
            <p>
              <el-input v-model="resetObj.password" type="password" auto-complete="new-password" size="large" placeholder="请输入新密码"></el-input>
            </p>
            <p style="text-align: right;">
              <a style="cursor: pointer;" @click="backLogin">返回登录页面</a>
            </p>
            <p>
              <input type="submit" @click.stop.prevent="saveBtn" class="loginBtn el-button el-button--primary el-button--large" value="确 认" />
            </p>
          </el-form>
        </div>
      </div>
      <el-dialog :close-on-click-modal="false" width="50%" v-if="showRegister" title="企业注册" :visible.sync="showRegister">
        <register @close="closeRegister"></register>
      </el-dialog>
      <div id="allmap"></div>
    </div>
  </transition>
</template>
<script lang="ts">
/*
 module:
    login.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-7:login
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import { setStorage, getStorage, getAppVersion, mobileReg } from "@utils/index";
import User from "@api/user";
import Publics from "@api/message";
import md5 from "md5";
import { debounce } from "typescript-debounce-decorator";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    register: () => import("./register.vue")
  }
})
export default class Login extends Vue {
  fullscreenLoading: boolean = false;
  isSave: boolean = false;
  is_verifyCode: boolean = false;
  loginObj: {
    phone: string;
    password: string;
    answerCode?: string;
  } = {
    phone: "",
    password: "",
    answerCode: ""
  };
  localPhone: {
    phone: string;
    flag: boolean;
  } = {
    phone: "",
    flag: false
  };
  imgVerifyCode: string = "";
  showFind: boolean = false;
  showRegister: boolean = false;
  // address: any = {};
  resetObj: {
    phone: string;
    password: string;
    authCode?: string;
  } = {
    phone: "",
    password: "",
    authCode: ""
  };
  showCodeTime: boolean = false;
  codeText: string = "获取验证码";
  isGetCode: boolean = false;
  countdown: number = 60;
  zm: any[] = ["P", "Q", "W", "E", "R", "T", "Y", "U", "I", "O"];
  
  showQRcode: boolean = false;

  created() {
    this.localPhone = getStorage("phone");
    // this.address = JSON.parse(window.localStorage.getItem("locationData"));
    if (this.localPhone) {
      this.loginObj.phone = this.localPhone.phone;
      this.isSave = this.localPhone.flag;
    }
  }

  @debounce(200, { leading: false })
  getVerifycode() {
    User.getImageCode({
      data: {
        phone: this.loginObj.phone
      }
    }).then(res => {
      this.imgVerifyCode = res.data.url;
    });
  }

  @debounce(200, { leading: false })
  removeLocalPhone() {
    if (!this.isSave && this.localPhone) localStorage.removeItem("phone");
  }
  async login() {
    if (!this.loginObj.phone || !this.loginObj.password) {
      this.$notify({
        title: "错误",
        message: "请输入完整的内容",
        type: "error"
      });
      return;
    }
    this.fullscreenLoading = true;
    let data = {
      phone: this.loginObj.phone,
      answerCode: this.loginObj.answerCode,
      password: md5(this.loginObj.password).toUpperCase(),
      device: getAppVersion() === "pc" ? 2 : 1
      // lat: this.address ? this.address.latitude : "30.657349",
      // lng: this.address ? this.address.longitude : "104.065837"
    };
    try {
      if (!this.imgVerifyCode) {
        let imageRes = await User.getImageCode({
          data: {
            phone: this.loginObj.phone
          }
        });
        if (imageRes.data.url) {
          this.$notify({
            title: "错误",
            message: "密码错误超过5次,请输入验证码登录！",
            type: "error"
          });
          this.is_verifyCode = true;
          this.imgVerifyCode = imageRes.data.url;
          return;
        } else {
          this.is_verifyCode = false;
        }
      }

      let userRes = await User.userLogin({ data });
      if (userRes.code === 0) {
        this.imgVerifyCode = "";
        if (userRes.data.isAdmin) {
          this.$store.commit("setUserInfo", userRes.data);
          setStorage("admin_token", userRes.data.token);
          await this.$store.dispatch("getMethodTree");
          if (this.isSave) {
            setStorage("phone", { phone: this.loginObj.phone, flag: true });
          }
          // this.$store.state.permissionList.shift();
          this.$router.replace(this.$store.state.init3rdMenu);
          return;
        } else {
          this.$notify({
            title: "错误",
            message: `请使用管理员账号登录!`,
            type: "error"
          });
        }
      } else if (userRes.code == 3069 || userRes.code == 3070) {
        this.is_verifyCode = true;
      }
    } finally {
      this.fullscreenLoading = false;
    }
  }
  forgot() {
    this.showFind = true;
  }
  backLogin() {
    this.resetObj = {
      phone: "",
      password: "",
      authCode: ""
    };
    this.showFind = false;
    this.showQRcode = false;
  }
  @debounce(200, { leading: false })
  saveBtn() {
    if (
      !this.resetObj.phone ||
      !this.resetObj.password ||
      !this.resetObj.authCode
    ) {
      this.$notify({
        title: "错误",
        message: "请输入完整的内容",
        type: "error"
      });
      return;
    }
    this.fullscreenLoading = true;
    let data = {
      phone: this.resetObj.phone,
      authCode: this.resetObj.authCode,
      password: md5(this.resetObj.password).toUpperCase()
    };
    User.forget_password({ data })
      .then(res => {
        if (res.code === 0) {
          if (res.data.state == 1) {
            this.$notify({
              title: "提示",
              message: `${res.data.exception}`,
              type: "error"
            });
            this.resetObj.authCode = "";
            return;
          }
          if (res.data.state == 4) {
            this.$notify({
              title: "提示",
              message: "密码重置成功！请使用新密码登录",
              type: "success"
            });
          }
          this.backLogin();
        }
      })
      .finally(res => {
        this.fullscreenLoading = false;
      });
  }
  @debounce(200, { leading: false })
  getCode() {
    if (!mobileReg(this.resetObj.phone)) {
      this.$notify({
        title: "错误",
        message: "请输入正确的手机号",
        type: "error"
      });
      return;
    }
    let phone = this.resetObj.phone
      .replace(/1/g, "Q")
      .replace(/2/g, "W")
      .replace(/3/g, "E")
      .replace(/4/g, "R")
      .replace(/5/g, "T")
      .replace(/6/g, "Y")
      .replace(/7/g, "U")
      .replace(/8/g, "I")
      .replace(/9/g, "O")
      .replace(/0/g, "P");
    let num = parseInt(Math.random() * (11 + 1), 10);
    let data = {
      phone: phone.substr(0, num) + "HFDQBCWQAEQ" + phone.substr(num, 11)
    };
    Publics.send_authCode({ data })
      .then(res => {
        if (res.code == 0) {
          this.showCodeTime = true;
          setTimeout(() => {
            this.countdown = 60;
            this.settime();
          }, 1000);
        }
      })
      .finally(res => {});
  }
  settime() {
    let _this = this;
    if (this.countdown < 1) {
      this.isGetCode = false;
      this.codeText = "获取验证码";
      this.countdown = 60;
      return false;
    } else {
      this.countdown--;
      this.isGetCode = true;
      this.codeText = `重新发送(${this.countdown})`;
    }
    setTimeout(() => {
      _this.settime();
    }, 1000);
  }
  register() {
    this.showRegister = true;
  }
  closeRegister() {
    this.showRegister = false;
  }
  QRcode() {
    if (this.showQRcode) {
      this.showQRcode = false;
    } else {
      this.showQRcode = true;
      let url = encodeURI("https://admin.cdwork.cn/index/index")
      let obj = new WxLogin({
        self_redirect:true,
        id:"login_container", 
        appid: "wx0ff213c824cfca1f", 
        scope: "snsapi_login", 
        redirect_uri: url,
        state: "",
        style: "",
        href: ""
      });
    }
  }
}
</script>
<style lang="scss" scoped>
  .fade-enter-active {
    transition: opacity 0.7s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .login {
    width: 100%;
    height: 100%;
    background: radial-gradient(#01abdd 8%, #017aaf 70%);
    display: flex;
    align-items: center;
    justify-content: center;
    .loginBtn {
      width: 100%;
    }
    p {
      margin-bottom: 20px;
    }
    .imgVer {
      height: 33px;
      float: right;
      margin-right: 43px;
      margin-top: 5px;
    }
    .login-1 {
      position: absolute;
      left: 50%;
      top: 45%;
      background-repeat: no-repeat;
    }
    .login-1 {
      width: 714px;
      height: 469px;
      background-image: url("../img/login/b1.png");
      margin-left: -357px;
      margin-top: -234px;
    }
    .login-2 {
      position: absolute;
      left: 50%;
      bottom: -187px;
      background-image: url("../img/login/b2.png");
      background-repeat: no-repeat;
      width: 1280px;
      height: 800px;
      margin-left: -640px;
      z-index: -1;
    }
    .login-panel {
      width: 400px;
      max-height: 370px;
      background: #fff;
      padding: 30px 30px;
      border-radius: 4px;
      box-shadow: 0 0 20px rgba(156, 184, 212, 0.3);
      z-index: 1;
      position: relative;
    }
    /deep/ {
      .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #337ab7 !important;
        border-color: #337ab7 !important;
      }
      .el-button--primary {
        background-color: #337ab7 !important;
        border-color: #337ab7 !important;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #337ab7 !important;
      }
      .el-button.is-disabled,
      .el-button.is-disabled:focus,
      .el-button.is-disabled:hover {
        color: #999 !important;
        cursor: not-allowed;
        background-image: none;
        background-color: #eee !important;
        border-color: #dcdfe6 !important;
      }
      .el-loading-mask {
        border-radius: 4px;
      }
    }
  }
</style>
