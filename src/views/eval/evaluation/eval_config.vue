<template>
  <div v-loading="loading">
    <el-form class="main-top">
      <el-form-item label="创建的测评是否需要审核 : " label-width="180px">
        <el-radio v-model="isAuditEval" :label="1">是</el-radio>
        <el-radio v-model="isAuditEval" :label="0">否</el-radio>
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
import Eval from "@api/eval";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Photocfg extends Vue {
  loading: boolean = false;
  isPending: boolean = false;
  isAuditEval: number = null;
  configData = {
    isAuditEval: null,
    evalConfigId: ""
  }
  

  created() {
    this.getConfig();
  }
  getConfig() {
    this.loading = true;
    let data = {};
    Eval.query_evaluation_config_admin({ data })
    .then(res => {
        if (res.code === 0) {
          res.data.isAuditEval === true ? this.isAuditEval = 1 : this.isAuditEval = 0;
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
    this.configData.isAuditEval = this.isAuditEval === 1 ? true : false;
    let data = {
      ...this.configData
    };
    Eval.update_evaluation_config_admin({ data })
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
