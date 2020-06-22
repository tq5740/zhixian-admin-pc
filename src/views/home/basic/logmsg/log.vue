<template>
  <div v-loading="loading" class="log">
    <el-row class="el-row">
      <p class="title">历史记录ID：</p>
      <p class="content">{{logInfo.historyLogId}}</p>
    </el-row>
    <el-row class="el-row">
      <p class="title">项目：</p>
      <p class="content">{{logInfo.project}}</p>
    </el-row>
    <el-row class="el-row">
      <p class="title">资源ID：</p>
      <p class="content">{{logInfo.resourcesId}}</p>
    </el-row>
    <el-row class="el-row">
      <p class="title">类型：</p>
      <p class="content">{{logInfo.type}}</p>
    </el-row>
    <el-row class="el-row">
      <p class="title">老数据：</p>
      <p class="content">{{logInfo.oldData}}</p>
    </el-row>
    <el-row class="el-row">
      <p class="title">新数据：</p>
      <p class="content">{{logInfo.newData}}</p>
    </el-row>
    <el-row class="el-row">
      <p class="title">操作描述：</p>
      <p class="content">{{logInfo.describes}}</p>
    </el-row>
    <el-row class="el-row">
      <p class="title">创建人ID：</p>
      <p class="content">{{logInfo.createUser}}</p>
    </el-row>
    <el-row class="el-row">
      <p class="title">创建时间：</p>
      <p class="content">{{logInfo.createTime}}</p>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Historylog from "@api/historylog";

@Component({

})
export default class EditOrg extends Vue {
  @Prop({ default: "" })
  public logId!: string;

  cropperShow: boolean = false;
  logInfo: any[] = [];
  loading: boolean = false;
  type: string = [
    "增加",
    "删除",
    "修改",
    "审核"
  ];
  oldData: object = {};
  newData: object = {};

  created() {
    this.getOrgInfo();
  }
  getOrgInfo() {
    this.loading = true;
    let data = { historyLogId: this.logId };
    Historylog.queryHistorylogAdmin({ data })
      .then(res => {
        if (res.code === 0) {
            res.data.createTime = this.$formatDate(res.data.createTime);
            res.data.type = this.type[res.data.type - 1];
          this.logInfo = res.data;
          this.oldData = res.data.oldData;
          this.newData = res.data.newData;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
.log{
  .el-row{
    margin: 10px 0;
    overflow: hidden;
  }
  p{
    float: left;
  }
  .title{
    width: 15%;
  }
  .content{
    width: 85%;
    word-wrap: break-word;
    color: #333;
  }
}

</style>
