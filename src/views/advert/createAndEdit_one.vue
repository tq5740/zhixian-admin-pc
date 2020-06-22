<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="110px" label-position="right">
        <!-- <el-form-item label="企业名称 : ">
          <el-select filterable clearable v-model="form.orgId" class="w80per" @change="getCategory" @visible-change="judgeOrg()" v-if="!disabledEdit">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="广告标题 : ">
          <el-input placeholder="请输入广告标题" v-model="form.advertTitle" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="广告封面 : ">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.advertImg" :src="(form.advertImg  && form.advertImg.includes('http')) ? form.advertImg : $store.state.configData.imgDomain+form.advertImg+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fc303e">（选填）</span>
          <span class="fc303e">封面尺寸：640px*360px</span>
        </el-form-item>
        <el-form-item label="广告链接 : ">
          <el-input placeholder="请输入广告链接" v-model="form.url" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="广告类型 : ">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">图片广告</el-radio>
            <el-radio :label="2">视频广告</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="广告分类 : ">
          <el-cascader :options="classifyList" :props="keyName" v-model="categoryId" @change="ClassifyId" :show-all-levels="false" change-on-select clearable class="w80per"></el-cascader>
          <span class="fc303e">（选填）</span>
        </el-form-item>
        <el-form-item label="投放设备 : ">
          <el-radio-group v-model="form.device">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">电脑端</el-radio>
            <el-radio :label="2">手机端</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键字 : ">
          <el-input placeholder="请输入关键字" v-model="form.keyword" class="w80per"></el-input>
          &nbsp;
          <span class="fc303e">（选填）</span>
        </el-form-item>
        <el-form-item label="投放地点 : ">
          <el-select v-model="addressStr" filterable clearable :filter-method="querySearchAsync" @change="getAddress" placeholder="请输入简略地址，并根据提示选择详细地址" class="w80per">
            <el-option v-for="item in addressOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放距离 : ">
          <el-input type="number" placeholder="请输入投放距离（单位：千米）" v-model="form.distances" class="w80per"></el-input>
          &nbsp;千米
        </el-form-item>
        <el-form-item label="投放时间段 : ">
          <el-time-select placeholder="起始时间" v-model="form.startTime" :picker-options="{ start: '00:00', step: '00:15', end: '23:45', maxTime: form.endTime}"></el-time-select> <!--  -->
          &nbsp;至
          &nbsp;
          <el-time-select placeholder="结束时间" v-model="form.endTime" :picker-options="{ start: '00:00', step: '00:15', end: '23:45', minTime: form.startTime}"></el-time-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">保存</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { checkSite, checkNum, emptyLast } from "@utils/index";
import axios from "axios";
import Advert from "@api/advert";
import Category from "@api/category";
import System from "@api/system";
import Org from "@api/org";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "add-edit": () => import ("@c/addEdit.vue")
  }
})
//CE = createAndEdit
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
    // orgId: this.$store.state.userInfo.org.orgId,
    advertId: this.$store.state.advertData.id,
    advertTitle: "",
    advertImg: "",
    url: "",
    type: 1,
    categoryId: "",
    keyword: "",
    device: 0,
    distances: "",
    startTime: "",
    endTime: "",
    lng: "",
    lat: ""
  };
  mapObj: any = {
    advertTitle: "广告名称",
    url: "广告链接",
    type: "广告类型",
    device: "投放设备",
    lng: "投放地点",
    distances: "投放距离",
    startTime: "投放开始时间",
    endTime: "投放结束时间"
  }
  isPending: boolean = false;
  upLoading1: boolean = false;
  isOrg: boolean = false;
  fileUrl1: string = "";
  categoryTitle: string = "";
  time: string[] = [];
  disabledEdit: boolean = false;
  addressStr: string = "";
  addressOptions: any[] = [];

  created() {
    this.init();
    // this.getOrgList();
  }
  init () {
    if (this.queryData.advertId) {
      this.disabledEdit = true;
      let data = {
        advertId: this.queryData.advertId
      }
      Advert.query_advert_admin({ data }).then(res => {
        if (res.code === 0) {
          res.data.startTime = this.$formatDate(
            res.data.startTime,
            "hh:mm"
          );
          res.data.endTime = this.$formatDate(
            res.data.endTime,
            "hh:mm"
          );
          let data = { key: 'VXUBZ-JL4CV-EXFPH-UVNCN-3VLP6-N2FZH', location : res.data.lat + ',' + res.data.lng, output: 'jsonp' }
          this.$jsonp("https://apis.map.qq.com/ws/geocoder/v1/", data).then(res => {
            if (res.status == 0) {
              this.addressStr = res.result.address
            }
          })
          res.data.distances ? res.data.distances = res.data.distances / 1000 : res.data.distances;
          Object.keys(this.form).forEach((i, index) => {
            this.form[i] = res.data[i];
          });
          this.getCategory();
        }
      });
    } else {
      this.getCategory();
    }
  }
  getCategory() {
    let data = {
      orgId: this.$store.state.userInfo.org.orgId
    };
    Category.category_list_advert({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
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
        this.$emit("close");
        return;
      }
    } else {
      this.$store.state.myOrgList.forEach(element => {
        if(element.state === 4){
          this.orgListId = this.orgListId.concat(element.orgId);
        }
      });
    }
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

  // 压缩图片上传
  async upLoad1(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "advertImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "advertImg");
    });
  }

  upLoadImg(file: any, type: string) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/advert/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }

  is() {
    if (this.form.advertTitle.length <= 0 || this.form.advertTitle.length > 30 || this.form.advertTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "广告标题字数在1-30且不能有空格"
      });
      return false;
    } else if (!checkSite(this.form.url)) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "广告链接格式错误"
      });
      return false;
    } else if (this.form.distances != 0 && !checkNum(this.form.distances)) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "投放距离格式错误"
      });
      return false;
    } else{
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
    }
    return true;
  }
  saveBtn_one() {
    if (!this.is()) return;
    if (this.isPending) return;
    this.isPending = true;
    let data = { ...this.form };
    data.endTime = data.endTime + ":00";
    data.startTime = data.startTime + ":00";
    data.distances = data.distances * 1000;
    if (this.title.title === "创建广告") {
      Advert.create_advert_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      delete data.orgId;
      Advert.update_advert_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  querySearchAsync(query) {
    if (!query) {
      this.addressOptions = [];
      this.addressStr = "";
    }
    let data = { key: 'VXUBZ-JL4CV-EXFPH-UVNCN-3VLP6-N2FZH', keyword: query, region: "四川", region_fix: 1, callbackName: 'QQmap', output: 'jsonp' }
    this.$jsonp("https://apis.map.qq.com/ws/place/v1/suggestion", data).then(res => {
      if (res.status == 0) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].value = res.data[i].address + "-" + res.data[i].title;
        }
        this.addressOptions = res.data;
      }
    })
  }
  getAddress() {
    let obj = {}; 
    obj = this.addressOptions.find((item)=>{
      return item.value === this.addressStr;
    });
    if (obj) {
      this.form.lng = obj.location.lng;
      this.form.lat = obj.location.lat;
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

