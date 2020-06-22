<template>
  <div v-loading="loading">
    <el-form class="main-top">
      <el-form-item label="培训是否需要审核 : " label-width="140px">
        <el-radio v-model="tof" :label="1">是</el-radio>
        <el-radio v-model="tof" :label="2">否</el-radio>
      </el-form-item>
      <el-form-item label="" label-width="140px">
        <el-button style="margin-right:10px" type="primary " @click="save">保存</el-button>
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
import Train from "@api/train";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Photocfg extends Vue {
  loading: boolean = false;
  isPending: boolean = false;
  configData = {
    isAuditTrain: false,
    trainConfigId: "",
    updateUser: "",
    updateUserRealName: "",
    updateTime: ""
  };
  tof: number = 1;
  created() {
    this.getConfig();
  }
  getConfig() {
    this.loading = true;
    let data = {};
    Train.query_train_config_admin({ data })
    .then(res => {
        if (res.code === 0) {
            res.data.isAuditTrain === true ? this.tof = 1 : this.tof = 2;
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
      isAuditTrain: this.tof === 1 ? true : false
    };
    Train.update_train_config_admin({ data })
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
