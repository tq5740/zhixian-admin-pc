<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="150px" label-position="right">
        <el-form-item label="企业名称：">
          <el-select filterable clearable v-model="form.orgId" class="w80per" @change="getCategory" @visible-change="judgeOrg()" :disabled="disabledEdit">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投票标题：">
          <el-input placeholder="请输入投票标题" v-model="form.pollTitle" class="w80per" :disabled="disabledEdit"></el-input>
        </el-form-item>
        <el-form-item label="投票封面：">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.pollImg" :src="(form.pollImg  && form.pollImg.includes('http')) ? form.pollImg : $store.state.configData.imgDomain+form.pollImg+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fc303e">（选填）</span>
          <span class="fc303e">封面尺寸：640px*360px</span>
        </el-form-item>
        <el-form-item label="投票分类：">
          <el-cascader :options="classifyList" :props="keyName" v-model="categoryId" @change="ClassifyId" :show-all-levels="false" change-on-select clearable class="w400"></el-cascader>
          <span class="fc303e">（选填）</span>
          <el-button type="primary" style="margin-left: 20px" @click.native="showCategory = true">管理分类</el-button>
        </el-form-item>
        <el-form-item label="可见范围：">
          <el-radio-group v-model="form.visibleRange">
            <el-radio :label="1">仅自己</el-radio>
            <el-radio :label="2">本企业</el-radio>
            <el-radio :label="3">开放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input placeholder="请输入联系人姓名" v-model="form.contact" class="w400"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input placeholder="请输入联系电话" type="number" v-model="form.tel" class="w400" @mousewheel.native.prevent></el-input>
        </el-form-item>
        <el-form-item label="每天可投票数：">
          <el-input placeholder="请输入每天可投票数" type="number" v-model="form.number" class="w400" @mousewheel.native.prevent></el-input>
        </el-form-item>
        <el-form-item label="投票开始时间：">
          <el-date-picker placeholder="请选择日期" v-model="startDay" type="date" value-format='yyyy-MM-dd' :picker-options="disabledDateS" :disabled="disabledEdit && form.startTime < Date.now()"></el-date-picker>
          &nbsp;
          <el-time-select placeholder="请选择时间" v-model="startTime" :picker-options="{start: '00:00', step: '00:30', end: startDay && (startDay == endDay) && endTime ? endTime : '23:50'}" :disabled="disabledEdit && form.startTime < Date.now()"></el-time-select>
        </el-form-item>
        <el-form-item label="投票结束时间：">
          <el-date-picker placeholder="请选择日期" v-model="endDay" type="date" value-format='yyyy-MM-dd' :picker-options="disabledDateE" :disabled="disabledEdit && form.endTime < Date.now()"></el-date-picker>
          &nbsp;
          <el-time-select placeholder="请选择时间" v-model="endTime" :picker-options="{start: startDay && (startDay == endDay) && startTime ? startTime : '00:00', step: '00:30', end: '23:50'}" :disabled="disabledEdit && form.endTime < Date.now()"></el-time-select>
        </el-form-item>
        <el-form-item label="投票简介：">
          <add-edit v-if="showIntro" :placeholder="'请输入投票简介'" :htmlStr="intro ? intro : ''" ref="addEditRefArlist"></add-edit>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">{{queryData.showDown ? "下一步" : "确定"}}</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="70%" title="管理分类" v-if="showCategory" :visible.sync="showCategory" append-to-body :before-close="categoryOver">
        <category :queryId="form.orgId"></category>
      </el-dialog>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建投票哦！</span>
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
import { mobileReg, emptyLast } from "@utils/index";
import Poll from "@api/otherAll";
import Category from "@api/category";
import System from "@api/system";

@Component({
  components: {
    "add-edit": () => import ("@c/addEdit.vue"),
    "category": () => import ("./poll_category.vue")
  }
})
export default class CreateAndEdit extends Vue {
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
    pollId: this.queryData.pollId,
    pollTitle: "",
    pollImg: "",
    visibleRange: 2,
    contact: "",
    tel: "",
    startTime: "",
    endTime: "",
    categoryId: "",
    number: "",
    intro: ""
  };
  mapObj = {
    orgId: "企业名称",
    pollTitle: "投票标题",
    contact: "联系人",
    tel: "联系电话",
    number: "每天可投票数"
  };
  isPending: boolean = false;
  upLoading1: boolean = false;
  isOrg: boolean = false;
  fileUrl1: string = "";
  categoryTitle: string = "";
  showIntro: boolean = true;
  disabledEdit: boolean = false;
  startDay: string = "";
  startTime: string = "";
  endDay: string = "";
  endTime: string = "";
  intro: string = "";

  showCategory: boolean = false;

  disabledDateS: object = {};
  disabledDateE: object = {};

  created() {
    this.init();
    this.getOrgList();
    this.getDateScope();
  }
  getDateScope() {
    let _this = this;
    this.disabledDateS = {
      disabledDate(time: any){
        let endDay;
        if (_this.endDay) {
          let end = _this.endDay.replace(/-/g, '/');
          endDay = new Date(end).getTime();
        }
        let str = time.getTime();
        let date = Date.now();
        if (!endDay) {
          return str < date - 8.64e7;
        } else {
          return str > endDay || str < date - 8.64e7;
        }
      }
    }
    this.disabledDateE = {
      disabledDate(time: any){
        let startDay;
        if (_this.startDay) {
          let start = _this.startDay.replace(/-/g, '/');
          startDay = new Date(start).getTime();
        }
        let str = time.getTime();
        let date = Date.now();
        if (!startDay) {
          return str < date - 8.64e7;
        } else {
          return str < startDay;
        }
      }
    }
  }
  init () {
    if (this.queryData.pollId) {
      if (this.queryData.state == 4) {
        this.disabledEdit = true;
      }
      let data = {
        pollId: this.queryData.pollId
      }
      Poll.query_poll_admin({ data })
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
              this.endDay = this.$formatDate(
                res.data.endTime,
                "YYYY-MM-DD"
              );
              this.endTime = this.$formatDate(
                res.data.endTime,
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
    let data = {
      orgId: this.form.orgId
    };
    Category.category_list_poll({ data }).then(res => {
      if (res.code === 0) {
        this.classifyList = res.data;
        emptyLast(this.classifyList);
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
      this.upLoadImg(e.file, "pollImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "pollImg");
    });
  }
  upLoadImg(file: any, type: string) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/publics/poll/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  is() {
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
    if (this.form.pollTitle.length <= 0 || this.form.pollTitle.length > 30 || this.form.pollTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "投票标题字数在1-30且不能有空格！"
      });
      return false;
    }
    if (this.form.pollLength > 120) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "投票时长不能超过120分钟！"
      });
      return false;
    }
    if (!this.startDay || !this.startTime) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入完整的投票开始时间！"
      });
      return false;
    }
    if (!this.endDay || !this.endTime) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入完整的投票结束时间！"
      });
      return false;
    }
    if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入投票简介！"
      });
      return false;
    }
    if (!mobileReg(this.form.tel)) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "联系电话不合法！"
      });
      return false;
    }
    return true;
  }
  saveBtn_one() {
    this.form.startTime = this.startDay + ' ' + this.startTime + ':00';
    this.form.endTime = this.endDay + ' ' + this.endTime + ':00';
    this.form.type == 1 ? delete this.form.startTime : '';
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
    if (!this.queryData.pollId) {
      Poll.create_poll_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOverDown", res.data);
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      Poll.update_poll_admin({ data })
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
  categoryOver() {
    this.showCategory = false;
    this.getCategory();
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

