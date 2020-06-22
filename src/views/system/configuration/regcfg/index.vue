<template>
  <el-row v-loading="loading" class="main-top">
    <el-form>
      <el-form-item label="是否开启新手引导 : " label-width="150px">
        <el-radio v-model="isOpenNoviceGuidance" :label="true">是</el-radio>
        <el-radio v-model="isOpenNoviceGuidance" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label-width="150px">
        <el-button type="primary" :loading="isPending" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
    
  </el-row>
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
export default class Regcfg extends Vue {
  isOpenNoviceGuidance: number = 1;
  loading: boolean = false;
  isPending: boolean = false;

  created() {
    this.getConfig();
  }
  save() {
    this.isPending = true;
    let data = {
      type: 1,
      systemConfig: JSON.stringify({
        isOpenNoviceGuidance: this.isOpenNoviceGuidance
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
    let data = { type: 1 };
    System.querySystemConfig({ data })
      .then(res => {
        if (res.code === 0) {
          this.isOpenNoviceGuidance = res.data.isOpenNoviceGuidance;
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
