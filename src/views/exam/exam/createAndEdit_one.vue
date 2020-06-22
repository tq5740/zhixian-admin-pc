<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="150px" label-position="right">
        <el-form-item label="企业名称 : ">
          <el-select filterable clearable v-model="form.orgId" class="w80per" @change="getCategory" @visible-change="judgeOrg()" :disabled="disabledEdit">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试标题 : ">
          <el-input placeholder="请输入考试标题" v-model="form.examTitle" class="w80per" :disabled="disabledEdit"></el-input>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>

        <el-form-item label="考试封面 : ">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.examImg" :src="(form.examImg  && form.examImg.includes('http')) ? form.examImg : $store.state.configData.imgDomain+form.examImg+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fc303e">（选填）</span>
          <span class="fc303e">封面尺寸：640px*360px</span>
        </el-form-item>
        
        <el-form-item label="考试类型 : " v-if="form.type != 3">
          <el-radio-group v-model="form.type" @change="changeType" :disabled="disabledEdit">
            <el-radio :label="1">练习</el-radio>
            <el-radio :label="2">正式考试</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选择题库 : ">
          <el-select placeholder="选择题库" class="w80per" filterable clearable v-model="form.examBankId" :disabled="disabledEdit">
            <el-option v-for="(i) in bankList" :key="i.examBankId" :label="i.examBankTitle" :value="i.examBankId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="考试开始时间 : " v-if="form.type != 1">
          <el-date-picker placeholder="请选择日期" v-model="startDay" type="date" value-format='yyyy-MM-dd' :picker-options="{disabledDate}" :disabled="disabledEdit"></el-date-picker>
          &nbsp;
          <el-time-select placeholder="请选择时间" v-model="startTime" :picker-options="{start: '08:00', step: '00:30', end: '20:00'}" :disabled="disabledEdit && queryData && queryData.state == 4"></el-time-select>
        </el-form-item>

        <el-form-item label="考试时长 : " v-if="form.type != 1">
          <el-input placeholder="请输入考试时长" type="number" v-model="form.examLength" class="w230" @mousewheel.native.prevent :disabled="disabledEdit"></el-input>
          &nbsp;分钟
          <span class="fc303e"> *不能超过120分钟</span>
        </el-form-item>

        <!-- <el-form-item label="可考次数 : ">
          <el-input placeholder="请输入可考次数" type="number" :min="1" v-model="form.examNumber" class="w400"></el-input>
        </el-form-item> -->

        <el-form-item label="可见范围 : ">
          <el-radio-group v-model="form.visibleRange">
            <el-radio :label="1">仅自己</el-radio>
            <el-radio :label="2">本企业</el-radio>
            <el-radio :label="3">开放</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="考完是否显示成绩 : " v-if="form.type != 1">
          <el-radio-group v-model="form.isDisplay">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="考试分类 : ">
          <el-cascader :options="classifyList" :props="keyName" v-model="categoryId" @change="ClassifyId" :show-all-levels="false" change-on-select clearable class="w80per"></el-cascader>
          <span class="fc303e">（选填）</span>
        </el-form-item>

        <el-form-item label="原价 : ">
          <el-input placeholder="请输入原价" v-model="form.originalPrice" class="w80per"></el-input>
        </el-form-item>
        
        <el-form-item label="现价/优惠价 : ">
          <el-input placeholder="请输入现价/优惠价" v-model="form.price" class="w80per"></el-input>
        </el-form-item>

        <el-form-item label="考试简介 : ">
          <add-edit v-if="showIntro" :placeholder="'请输入考试简介'" :htmlStr="intro ? intro : ''" ref="addEditRefArlist"></add-edit>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">{{title.title === '编辑补考' || form.type == 1 ? '确定' : '下一步'}}</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建考试哦！</span>
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
import { emptyLast } from "@utils/index";
import Exam from "@api/exam";
import Category from "@api/category";
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
  bankList: any = [];
  form: any = {
    orgId: this.$store.state.userInfo.org.orgId,
    examId: this.$store.state.examData.id,
    examTitle: "",
    examImg: "",
    visibleRange: 2,
    type: 1,
    examBankId: "",
    isDisplay: 1,
    startTime: "",
    examLength: "",
    categoryId: "",
    originalPrice: "0",
    price: "0",
    userExamNumber: "",
    intro: ""
  };
  mapObj = {
    orgId: "企业名称",
    examTitle: "考试标题",
    type: "考试类型",
    examBankId: "考试题库",
    startTime: "考试开始时间",
    examLength: "考试时长"
  };
  isPending: boolean = false;
  upLoading1: boolean = false;
  isOrg: boolean = false;
  fileUrl1: string = "";
  categoryTitle: string = "";
  showIntro: boolean = true;
  time: string[] = [];
  disabledEdit: boolean = false;
  startDay: string = "";
  startTime: string = "";
  intro: string = "";

  created() {
    this.init();
    this.getOrgList();
  }
  disabledDate(time: any){
    return time.getTime() < Date.now() - 8.64e7;
  }
  getBankList() {
    let data = {
      orgId: this.form.orgId
    }
    Exam.query_exam_bank_title_admin({ data }).then(res => {
      if (res.code === 0) {
        if (JSON.parse(JSON.stringify(res.data)).length === 0) {
          this.$notify({
            title: "提示",
            message: "您暂无题库！",
            type: "error"
          });
          this.bankList = [];
          return;
        } else {
          res.data.forEach((e, i) => {
            if (e.type == false){
              res.data.splice(i,1)
            }
          });
          this.bankList = res.data;
        }
      }
    });
  }
  init () {
    if (this.$store.state.examData.id) {
      this.disabledEdit = true;
      let data = {
        examId: this.$store.state.examData.id
      }
      Exam.query_exam_admin({ data })
        .then(res => {
          if (res.code === 0) {
            Object.keys(this.form).forEach((i, index) => {
              this.startDay = this.$formatDate(
                res.data.startTime,
                "YYYY-MM-DD"
              );
              this.startTime = this.$formatDate(
                res.data.startTime,
                "hh:mm"
              );
              this.form[i] = res.data[i];
              this.intro = this.form.intro;
              if (this.form.type == '1') {
                this.form.isDisplay = 1
              } 
            });
            this.getCategory();
            this.showIntro = false;
            this.$nextTick(()=>{
              this.showIntro = true;
            })
          }
        })
        .finally(() => {

        });
    } else {
      this.getCategory();
    }
  }
  getCategory() {
    this.getBankList();
    let data = {
      orgId: this.form.orgId
    };
    Category.category_list_exam({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        let data = this.$store.state.examData;
        data.classify = res.data;
        this.$store.commit('setExamData', data)
        this.classifyList = res.data;
        if (this.form.categoryId) {
          this.categoryId = [
            ...this.$getFather(
              this.classifyList,
              this.classifyList,
              this.form.categoryId
            ),
            this.form.categoryId
          ];
        }
      }
    });
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
  selectClone(data: any, categoryId: number) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].categoryId == categoryId) {
        this.categoryTitle = data[i].categoryTitle;
        return;
      } else {
        this.selectClone(data[i].children || [], categoryId);
      }
    }
  }
  ClassifyId(e: any) {
    if (e.length) {
      this.form.categoryId = "" + e[e.length - 1];
      let len: any = this.classifyList;
      this.selectClone(len, e[e.length - 1]);
      this.form.categoryTitle = this.categoryTitle;
    } else {
      this.form.categoryId = "";
      this.form.categoryTitle = "";
    }
  }
  changeType(e: any) {
    if (e == 1) {
      this.form.isDisplay = 1;
    }
  }
  // 压缩图片上传
  async upLoad1(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "examImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "examImg");
    });
  }

  upLoadImg(file: any, type: string) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/exam/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  is() {
    this.form.type == 1 ? delete this.mapObj.startTime : '';
    for (let i in this.mapObj) {
      if (this.form[i] !== 0 && !this.form[i]) {
        this.$notify({
          title: "提示",
          message: `请填写/选择${this.mapObj[i]}!`,
          type: "error"
        });
        return false;
      }
    }
    if (this.form.examTitle.length <= 0 || this.form.examTitle.length > 30 || this.form.examTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "考试标题字数在1-30且不能有空格"
      });
      return false;
    }
    if (this.form.examLength > 120) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "考试时长不能超过120分钟！"
      });
      return false;
    }
    if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入考试简介"
      });
      return false;
    }
    return true;
  }
  saveBtn_one() {
    this.form.startTime = this.startDay + ' ' + this.startTime + ':00';
    if (this.form.type == 1) {
      delete this.form.startTime;
      delete this.mapObj.examLength;
      this.form.examLength = 0;
    } else {
      this.mapObj.examLength = "考试时长";
    }
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
    if (this.title.title === "创建考试") {
      Exam.create_exam_admin({ data })
        .then(res => {
          if (res.code === 0) {
            if (!this.$store.state.examData.id) {
              let arr = this.$store.state.examData;
              arr.id = res.data;
              this.$store.commit('setExamData', arr);
            }
            this.form.type == 1 ? this.$emit("closeOne") : this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      delete data.orgId;
      Exam.update_exam_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.title.title === "编辑补考" || this.form.type == 1 ? this.$emit("closeOne") : this.$emit("createEditOneOver");
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
  .w400{
    width: 400px!important;
    margin-right: 10px;
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

