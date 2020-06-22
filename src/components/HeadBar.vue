<template>
  <div id="head-bar">
    <el-row>
      <div>
        <div class="user-box">
          <el-dropdown size="medium" trigger="click">
            <span class="el-dropdown-link">
              <svg class="icon-left" aria-hidden="true">
                <use xlink:href="#icon-caozuoshouce"></use>
              </svg>
              <span class="user-name" v-if="$store.state.userInfo">操作手册</span>
            </span>
            <el-dropdown-menu slot="dropdown" class="text-content">
              <el-row class="text">
                <p>为了让用户在第一次使用时可以很快上手操作，特地编写此用户操作手册，为用户提供便利，解决在使用本产品时碰到的一系列疑问。</p>
                <p>如有任何问题请拨打电话：<b>028-87702737</b></p>
              </el-row>
              <el-row class="button">
                <el-dropdown-item>
                  <el-button type="primary" icon="plus" @click.native="downLoad">下载手册</el-button>
                </el-dropdown-item>
              </el-row>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown size="medium" trigger="click">
            <span class="el-dropdown-link">
              <span class="user-name" v-if="$store.state.userInfo">{{$store.state.userInfo.name}}</span>
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="centerDialogVisible = true">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-row>

    <el-dialog title="修改密码" :visible.sync="centerDialogVisible" :before-close="closeDialog" width="25%" class="dialog-st" center>
      <el-input placeholder="请输入原密码" type="password" v-model="rePassword" style="width: 100%;" />
      <el-input placeholder="请输入新密码" type="password" v-model="newPassword" style='width: 100%; margin-top: 20px; margin-bottom: 20px;' />
      <el-input placeholder="请再次输入新密码" type="password" v-model="new2Password" style="width: 100%;" />

      <span slot="footer" class="dialog-footer">
        <span class="su-btn" @click="updatePas">确 定</span>
      </span>
    </el-dialog>

  </div>
</template>

<script lang="ts">
/*
 module:
    main.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-30:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import { matchUrl } from "@/utils/index";
import User from "@api/user";
import md5 from "md5";
import { Mutation, State } from "vuex-class";
//https://github.com/ktsn/vuex-class
@Component({})
export default class HeadBar extends Vue {
  get key(): string {
    let _first = matchUrl(this.$route.path)[0];
    return "/" + _first;
  }
  @State("permissionList")
  permissionList: any;
  @State("secondMenu")
  secondMenu: any;
  @State("thirdMenu")
  thirdMenu: any;
  @Mutation("setSecondMenu")
  setSecondMenu: any;
  @Mutation("setThirdMenu")
  setThirdMenu: any;

  centerDialogVisible: boolean = false;
  rePassword: string = "";
  newPassword: string = "";
  new2Password: string = "";
  loginOut(): void {
    localStorage.removeItem("admin_token");
    location.replace("/login");
  }
  updatePas(): void {
    if (
      this.rePassword.length < 8 ||
      this.rePassword.length > 16 ||
      this.newPassword.length < 8 ||
      this.newPassword.length > 16
    ) {
      this.$notify({
        title: "提示",
        message: `密码不能小于8位或大于16位!`,
        type: "error"
      });
      return;
    }
    if (this.newPassword !== this.new2Password) {
      this.$notify({
        title: "提示",
        message: `两次输入的密码不相同!`,
        type: "error"
      });
      return;
    }
    let data = { oldPassword: md5(this.rePassword).toUpperCase(), newPassword: md5(this.newPassword).toUpperCase() };
    this.$store.dispatch("updatePassword", data).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: `密码修改成功!`,
          type: "success"
        });
        this.closeDialog();
        setTimeout(() => {
          this.loginOut();
        }, 1500)
      }
    });
  }
  select(index: string): void {
    if (index === this.key) return;
    this.setSecondMenu({
      key: index,
      data: this.permissionList
    });
    this.setThirdMenu({
      key: this.secondMenu[index][0].pageUrl,
      data: this.secondMenu[index]
    });
    this.$router.push({
      path: this.thirdMenu[this.secondMenu[index][0].pageUrl][0].pageUrl
    });
  }
  closeDialog(): void {
    this.rePassword = '';
    this.newPassword = '';
    this.new2Password = '';
    this.centerDialogVisible = false;
  }
  downLoad(): void {
    window.open(this.$store.state.configData.fileDomain + '/manual_manage.pdf','_blank');
  }
}
</script>
<style lang="scss" scoped>
  @import "@style/mixin.scss";
  .dialog-st {
    padding: 0 100px 0 100px;
  }
  .su-btn {
    display: block;
    width: 100%;
    padding: 13px 0;
    background-color: #4e5c79;
    color: #ffff;
    font-size: 16px;
    border-radius: 4px;
  }
  #head-bar {
    height: 0;
    float: right;
    margin-right: 50px;
    .el-menu--horizontal {
      border-bottom: none;
    }
    .user-box {
      text-align: center;
      margin-top: 16px;
    }
    .el-dropdown {
      color: #5b6a8b;
      margin-left: 40px;
    }
    .icon-left {
      width: 14px;
      height: 14px;
      position: absolute;
      left: -14px;
      top: 3px;
    }
    .user-name {
      padding: 0 5px;
      cursor: pointer;
      // @include ellipsis();
    }
    .el-icon--right {
      
    }
    .el-menu-item {
      width: 100px;
      text-align: center;
      font-weight: 700;
      // border: 5px solid transparent;
      cursor: pointer;
      &:hover {
        border-bottom: 5px solid $green !important;
        background: transparent !important;
      }
    }
    .el-menu--horizontal > .el-menu-item.is-active {
      border-color: transparent;
      color: $green;
    }
  }
</style>
<style lang="scss">
  .text-content {
    width: 400px;
    .text {
      margin: 12px 24px;
      p {
        margin: 0;
        line-height: 28px;
      }
    }
    .el-dropdown-menu__item {
      padding: 0!important;
      display: inline-block;
    }
    .button {
      text-align: right;
      margin: 20px 24px;
    }
  }
</style>

