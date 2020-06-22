<template>
  <div v-loading="loading" class="main-top">
    <el-form>
      <el-form-item label="SMTP地址 : " label-width="100px">
        <el-input v-model="configData.smtp" class="w240" placeholder="请输入SMTP地址"></el-input>
      </el-form-item>
      <el-form-item label="SSL连接 : " label-width="100px">
        <el-input v-model="configData.ssl" class="w240" placeholder="请输入SSL连接"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址 : " label-width="100px">
        <el-input v-model="configData.account" class="w240" placeholder="请输入邮箱地址"></el-input>
      </el-form-item>
      <el-form-item label="邮箱密码 : " label-width="100px">
        <el-input v-model="configData.password" type="password" class="w240" placeholder="请输入邮箱密码"></el-input>
      </el-form-item>
      <el-form-item label="发件人姓名 : " label-width="100px">
        <el-input v-model="configData.sendName" class="w240" placeholder="请输入发件人姓名"></el-input>
      </el-form-item>
      <el-form-item label="发件人邮箱 : " label-width="100px">
        <el-input v-model="configData.sendEmail" class="w240" placeholder="请输入发件人邮箱"></el-input>
      </el-form-item>
      <el-form-item label="测试邮箱 : " label-width="100px">
        <el-input v-model="configData.testEmail" class="w240" placeholder="请输入测试邮箱"></el-input>
        <el-button type="primary" :loading="sendPending" style="margin-left:10px" @click="send">发送测试邮件</el-button>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" :loading="isPending" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script lang="ts">
/*
 module:
    allroute
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-8:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import System from "@api/system";
import User from "@api/user";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Mailcfg extends Vue {
  loading: boolean = false;
  isPending: boolean = false;
  sendPending: boolean = false;
  configData = {
    account: "",
    ssl: "",
    password: "",
    sign: "",
    url: "",
    testEmail: "",
    smtp: "",
    sendName: "",
    sendEmail: ""
  };
  created() {
    this.getConfig();
  }
  send() {
    if (!this.configData.testEmail) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请填写测试邮箱!"
      });
      return;
    }
    let data = {
      sendUserEmail: this.configData.testEmail,
      sendMessage: "这是一封测试邮件.",
      theme: "测试"
    };
    this.sendPending = true;
    User.sendEmail({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            type: "success",
            message: "发送成功!"
          });
        }
      })
      .finally(() => {
        this.sendPending = false;
      });
  }
  save() {
    this.isPending = true;
    let data = {
      type: 2,
      systemConfig: JSON.stringify({
        ...this.configData
      })
    };
    System.updateSystemConfig({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            type: "success",
            message: "修改成功!"
          });
        }
        this.getConfig();
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  getConfig() {
    this.loading = true;
    let data = { type: 2 };
    System.querySystemConfig({ data })
      .then(res => {
        if (res.code === 0) {
          Object.keys(this.configData).forEach(i => {
            //@ts-ignore
            this.configData[i] = res.data[i];
          });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
.w240{
  width: 240px!important;
}
</style>
