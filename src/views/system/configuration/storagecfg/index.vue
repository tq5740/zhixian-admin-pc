<template>
  <div v-loading="loading">
    <el-form class="main-top">
      <el-form-item label="存储方式 : " label-width="130px">
        <el-radio v-model="configData.mode" :label="1">本地</el-radio>
        <el-radio v-model="configData.mode" :label="2">腾讯云</el-radio>
      </el-form-item>
      <el-form-item label="APP_ID : " label-width="130px">
        <el-input v-model="configData.appId" class="w320" placeholder="请输入APP_ID"></el-input>
      </el-form-item>
      <el-form-item label="SECRET_ID : " label-width="130px">
        <el-input v-model="configData.secretId" class="w320" placeholder="请输入SECRET_ID"></el-input>
      </el-form-item>
      <el-form-item label="SECRET_KEY : " label-width="130px">
        <el-input type="password" v-model="configData.secretKey" class="w320" placeholder="请输入SECRET_KEY"></el-input>
      </el-form-item>
      <el-form-item label="BUCKET_NAME : " label-width="130px">
        <el-input class="w320" v-model="configData.bucketName" placeholder="请输入BUCKET_NAME"></el-input>
      </el-form-item>
      <el-form-item label="访问域名 : " label-width="130px">
        <el-input class="w320" v-model="configData.accessDomain" placeholder="请输入访问域名"></el-input>
      </el-form-item>
      <el-form-item label-width="130px">
        <el-button type="primary " @click="save">保存</el-button>
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
//https://github.com/ktsn/vuex-class
@Component({})
export default class Storecfg extends Vue {
  loading: boolean = false;
  isPending: boolean = false;
  configData = {
    mode: 1,
    appId: "",
    secretKey: "",
    secretId: "",
    bucketName: "",
    accessDomain: ""
  };
  created() {
    this.getConfig();
  }
  getConfig() {
    this.loading = true;
    let data = { type: 5 };
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
  save() {
    this.isPending = true;
    let data = {
      type: 5,
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
}
</script>
<style lang="scss" scoped>
</style>
