<template>
  <div v-loading="loading">
    <el-form class="main-top">
      <el-form-item label="接口地址 : " label-width="100px">
        <el-input v-model="configData.url" class="w320" placeholder="请输入SMTP地址"></el-input>
      </el-form-item>
      <el-form-item label="帐号 : " label-width="100px">
        <el-input v-model="configData.account" class="w240" placeholder="请输入SSL连接"></el-input>
      </el-form-item>
      <el-form-item label="密码 : " label-width="100px">
        <el-input v-model="configData.password" type="password" class="w240" placeholder="请输入邮箱密码"></el-input>
      </el-form-item>
      <el-form-item label="标识码 : " label-width="100px">
        <el-input v-model="configData.key" class="w240" placeholder="请输入发件人姓名"></el-input>
      </el-form-item>
      <el-form-item label="签名 : " label-width="100px">
        <el-input v-model="configData.sign" class="w240" placeholder="请输入发件人邮箱"></el-input>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary " @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script lang="ts">
/*
 module:
    短信配置
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-22:短信配置
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import System from "@api/system";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Messagecfg extends Vue {
  loading: boolean = false;
  isPending: boolean = false;
  configData = {
    account: "",
    key: "",
    password: "",
    sign: "",
    url: ""
  };
  created() {
    this.getConfig();
  }
  save() {
    this.isPending = true;
    let data = {
      type: 3,
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
    let data = { type: 3 };
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
</style>
