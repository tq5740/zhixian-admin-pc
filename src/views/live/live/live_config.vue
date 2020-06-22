<template>
  <div v-loading="loading">
    <el-form class="main-top">
      <el-form-item label="创建的直播是否需要审核 : " label-width="180px">
        <el-radio v-model="isAuditLive" :label="1">是</el-radio>
        <el-radio v-model="isAuditLive" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="" label-width="180px">
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
import Live from "@api/live";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Photocfg extends Vue {
  loading: boolean = false;
  isPending: boolean = false;
  isAuditLive: number = null;
  configData = {
    isAuditLive: null,
    liveConfigId: ""
  }
  

  created() {
    this.getConfig();
  }
  getConfig() {
    this.loading = true;
    let data = {};
    Live.query_live_config_admin({ data })
    .then(res => {
        if (res.code === 0) {
          res.data.isAuditLive === true ? this.isAuditLive = 1 : this.isAuditLive = 0;
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
    this.configData.isAuditLive = this.isAuditLive === 1 ? true : false;
    let data = {
      ...this.configData
    };
    Live.update_live_config_admin({ data })
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
