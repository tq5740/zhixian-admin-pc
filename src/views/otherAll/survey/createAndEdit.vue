<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="110px" label-position="right">
        <el-form-item label="企业名称 : ">
          <el-select class="w80per" filterable clearable v-model="form.orgId" @visible-change="judgeOrg()" :disabled="orgDisabled">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问卷标题 : ">
          <el-input placeholder="请输入问卷标题" v-model="form.surveyTitle" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="问卷封面 : ">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.surveyImg" :src="(form.surveyImg  && form.surveyImg.includes('http')) ? form.surveyImg : $store.state.configData.imgDomain+form.surveyImg+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fc303e">（选填）</span>
          <span class="fc303e">封面尺寸：640px*360px</span>
        </el-form-item>
        <el-form-item label="截止日期 : ">
          <el-date-picker style="width: 230px" v-model="time" type="date" placeholder="选择日期" value-format='yyyy-MM-dd' :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="可见范围 : ">
          <el-radio-group v-model="form.visibleRange">
            <el-radio :label="1">仅自己</el-radio>
            <el-radio :label="2">本企业</el-radio>
            <el-radio :label="3">开放</el-radio>
          </el-radio-group>
          <span class="fc303e">（选填）</span>
        </el-form-item>
        <el-form-item label="是否匿名 : ">
          <el-radio-group v-model="form.isAnonymous">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <span class="fc303e">（选填）</span>
        </el-form-item>
        <el-form-item label="问卷简介 : ">
          <add-edit v-if="showIntro" :placeholder="'请输入问卷简介'" :htmlStr="intro ? intro : ''" ref="addEditRefArlist"></add-edit>
        </el-form-item>
        <el-form-item label="" label-width="120px">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建问卷哦！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isOrg = false">取 消</el-button>
          <el-button type="primary" @click="isOrg = false;apply()">完善信息</el-button>
        </span>
      </el-dialog>
    </el-row>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Survey from "@api/data";
import System from "@api/system";
import Org from "@api/org";

@Component({
  components: {
    "add-edit": () => import ("@c/addEdit.vue")
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: "" })
  public title: any;
  @Prop({ default: {} })
  public queryData: any;
  classifyList: any[] = [];
  keyName: object = {
    label: "categoryTitle",
    value: "categoryId"
  };
  orgListId: any[] = [];
  categoryId: any = [];
  form: any = {
    orgId: this.$store.state.userInfo.org.orgId,
    surveyId: this.queryData.surveyId,
    surveyTitle: "",
    surveyImg: "",
    endTime: "",
    visibleRange: 3,
    intro: ""
  };
  intro: string = "";
  isPending: boolean = false;
  upLoading1: boolean = false;
  isOrg: boolean = false;
  fileUrl1: string = "";
  categoryTitle: string = "";
  showIntro: boolean = true;
  time: string = "";
  orgDisabled: boolean = false;
  pickerOptions: object = {
    disabledDate (time) {
      return time.getTime() < Date.now() - 8.64e7
    }
  };

  created() {
    this.init();
    this.getOrgList();
  }
  init () {
    if (this.queryData.surveyId) {
      this.orgDisabled = true;
      let data = {
        surveyId: this.queryData.surveyId
      }
      Survey.query_survey_admin({ data }).then(res => {
        if (res.code === 0) {
          Object.keys(this.form).forEach((i, index) => {
            this.form[i] = res.data[i];
          });
          this.intro = this.form.intro;
          this.time = this.$formatDate(res.data.endTime, "YYYY-MM-DD");
          this.showIntro = false;
          this.$nextTick(()=>{
            this.showIntro = true;
          })
        }
      });
    } else {
      this.form = {
        orgId: this.$store.state.userInfo.org.orgId,
        surveyId: this.queryData.surveyId,
        surveyTitle: "",
        surveyImg: "",
        surveyType: 1,
        visibleRange: 3,
        categoryId: "",
        tutor: "",
        originalPrice: "0",
        price: "0",
        intro: ""
      }
      this.addressOptions = [];
    }
  }
  judgeOrg(){
    let myOrgId = this.orgListId.toString();
    if(!myOrgId.includes(this.form.orgId)){
      this.isOrg = true;
      this.form.orgId = "";
    }
  }
  async getOrgList() {
    if (this.$store.state.myOrgList.length === 0) {
      await this.$store.dispatch("getMyOrgList");
      if (this.$store.state.myOrgList.length === 0) {
        this.$notify({
          title: "提示",
          message: "您暂无企业！",
          type: "error"
        });
        this.$emit("close");
        return;
      }
    }
    this.$store.state.myOrgList.forEach(element => {
      if(element.state === 4){
        this.orgListId = this.orgListId.concat(element.orgId);
      }
    });
  }
  // 跳转到企业管理页面
  apply(e: any) {
    this.$router.push({
      path: "/org/org"
    });
  }
  // 压缩图片上传
  async upLoad1(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "surveyImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "surveyImg");
    });
  }

  upLoadImg(file: any, type: string) {
    //this.upLoading["type"] = true;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/publics/survey/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }

  is() {
    if (this.form.surveyTitle.length <= 0 || this.form.surveyTitle.length > 30 || this.form.surveyTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "问卷标题字数在1-30且不能有空格"
      });
      return false;
    } else if (this.time === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入问卷截止日期"
      });
      return false;
    } else if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入问卷简介"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn_one() {
    this.form.endTime = this.time + ' 23:59:59';
    if (!this.is()) return;
    const loading = this.$loading({
      lock: true,
      text: '正在保存中，请耐心等待~',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    let str = this.$refs.addEditRefArlist.getHtmlText();
    this.form.intro = encodeURIComponent(str.replace(/http:/g, "https:")
      .replace(/section/g, "div")
      .replace(/strong/g, "div")
      .replace(/footer/g, "div")
      .replace(/\<img/g, '<img style="max-width:100%;height:auto"')
    )
    let data = { ...this.form };
    if (!this.queryData.surveyId) {
      Survey.create_survey_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver", res.data);
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      delete data.orgId;
      Survey.update_survey_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          loading.close();
        });
    }
  }

}
</script>
<style lang="scss" scoped>
  #createAndEdit {
    .el-checkbox {
      &:first-of-type {
        margin-left: 10px;
      }
    }
    .fc303e{
      margin-left: 10px;
    }
  }
  .avatar-uploader {
    float: left;
    margin-right: 50px;
  }
  .mg-top20{
    margin-top: 20px;
  }
  /deep/ {
    .el-progress{
      margin-left: 10px;
      width: 150px;
      display: inline-block;
    }
  }
</style>
<style lang="scss">
  .note-image-popover,
  [role="tooltip"] {
    z-index: 9999 !important;
  }
  .note-editor img {
    max-width: 100% !important;
  }
</style>

