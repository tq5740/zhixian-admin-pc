<template>
  <div class="import-file">
    <el-form label-width="160px">
      <el-form-item label="试题导入模板下载：">
        <el-button @click="download">下载模板</el-button>&nbsp;
        <span>请下载模板，以该模板的结构整理好试题数据。</span>
      </el-form-item>
      <el-form-item label="请选择导入文件：">
        <el-upload :action="`${url}?examBankId=${id}&token=${token}`" :show-file-list="false" :on-success='successImport' :on-progress="progressImport" :on-error="errorImport" accept=".xlsx" :disabled="flag">
          <el-button type="primary">点击上传</el-button>&nbsp;
          <span>仅支持Excel文档格式：.xlsx</span><br>
        </el-upload>
        <el-progress :percentage="percent" color="#FF9012" style="margin-top: 20px;" v-if="percent > 0"></el-progress>
      </el-form-item>
      <el-form-item label=" ">
        <el-button @click="lookImport()">预览</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Bank from "@api/exam";

@Component({
  props: {
    id: {
      type: String,
      default: ""
    }
  }
})

export default class ImportFile extends Vue {
  importNum: object = {};
  showImport: boolean = false;
  percent: number = 0;
  flag: boolean = false;
  url: string = "";
  token: any = this.$store.state.userInfo.token;

  created() {
    this.flag = false;
    this.url = Bank.importQuestionAdmin();
    this.percent = 0;
  }
  lookImport() {
    if (this.percent != 100) {
      this.$notify({
        title: "提示",
        type: "warning",
        message: `请先上传导入文件`
      });
      return;
    }
    let obj = this.$store.state.examData;
    obj.rightNumber = this.importNum.rightNumber;
    obj.errNumber = this.importNum.errNumber;
    this.$store.commit("setExamData", obj)
    this.$router.push({
      path: "/exam/temporary_question",
      query: { examBankId: this.importNum.examBankId }
    });
  }
  successImport(e: any) {
    if (e.code !==0) {
      this.$notify({
        title: "警告",
        type: "error",
        message: e.msg
      });
      this.flag = false;
      this.percent = 0;
    } else {
      this.$notify({
        title: "提示",
        type: "success",
        message: `导入成功`
      });
      this.flag = true;
      this.percent = 100;
      this.importNum = e.data;
    }
  }
  progressImport(e: any) {
    this.flag = true;
    this.percent = e.percent - 1;
  }
  errorImport(e: any){
    this.flag = false;
    this.percent = 0;
  }
  download() {
    window.open(`${this.$store.state.configData.fileDomain}/exam/question.xlsx`);
  }
  lookImport() {
    if (this.percent != 100) {
      this.$notify({
        title: "提示",
        type: "warning",
        message: `请先上传导入文件`
      });
      return;
    }
    let obj = this.$store.state.examData;
    obj.rightNumber = this.importNum.rightNumber;
    obj.errNumber = this.importNum.errNumber;
    this.$store.commit("setExamData", obj)
    this.$router.push({
      path: "/exam/temporary_question",
      query: { examBankId: this.importNum.examBankId }
    });
  }
}  
</script>
<style lang="scss" scoped>
.import-file {
  
}
</style>

