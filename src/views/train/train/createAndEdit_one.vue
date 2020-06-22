<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="110px" label-position="right">
        <el-form-item label="企业名称 : ">
          <el-select class="w80per" filterable clearable v-model="form.orgId" @change="getCategory" @visible-change="judgeOrg()" :disabled="orgDisabled">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="培训标题 : ">
          <el-input placeholder="请输入培训标题" v-model="form.trainTitle" class="w80per"></el-input>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>

        <el-form-item label="培训封面 : ">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.trainImg" :src="(form.trainImg  && form.trainImg.includes('http')) ? form.trainImg : $store.state.configData.imgDomain+form.trainImg+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fc303e">（选填）</span>
          <span class="fc303e">封面尺寸：640px*360px</span>
        </el-form-item>

        <el-form-item label="可见范围 : ">
          <el-radio-group v-model="form.visibleRange">
            <el-radio :label="1">仅自己</el-radio>
            <el-radio :label="2">本企业</el-radio>
            <el-radio :label="3">开放</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="培训类型 : ">
          <el-radio-group v-model="form.trainType">
            <el-radio :label="1">线下培训</el-radio>
            <el-radio :label="2">线上培训</el-radio>
            <el-radio :label="3">混合式培训（线上+线下）</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="培训分类 : ">
          <el-cascader :options="classifyList" :props="keyName" v-model="categoryId" @change="ClassifyId" :show-all-levels="false" change-on-select clearable class="w80per"></el-cascader>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>

        <el-form-item label="辅导员 : ">
          <el-input placeholder="请输入辅导员姓名" v-model="form.tutor" class="w80per"></el-input>
        </el-form-item>

        <el-form-item label="培训地点 : ">
          <el-select v-model="addressStr" filterable clearable :filter-method="querySearchAsync" @change="getAddress" placeholder="请输入简略地址，并根据提示选择详细地址" class="w80per">
            <el-option v-for="item in addressOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <span class="fc303e" v-show="form.trainType == 2"> (选填)</span>
        </el-form-item>

        <el-form-item label="开班时间 : ">
          <el-date-picker style="width: 400px" v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>

        <el-form-item label="原价 : ">
          <el-input placeholder="请输入原价" v-model="form.originalPrice" class="w80per"></el-input>
        </el-form-item>
        
        <el-form-item label="现价/优惠价 : ">
          <el-input placeholder="请输入现价/优惠价" v-model="form.price" class="w80per"></el-input>
        </el-form-item>

        <el-form-item label="培训简介 : ">
          <add-edit v-if="showIntro" :placeholder="'请输入培训简介'" :htmlStr="intro ? intro : ''" ref="addEditRefArlist"></add-edit>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>
        <el-form-item label=" " label-width="120px">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建培训哦！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isOrg = false">取 消</el-button>
          <el-button type="primary" @click="isOrg = false;apply()">完善信息</el-button>
        </span>
      </el-dialog>
    </el-row>

  </div>
</template>

<script lang="ts">
/*
 module:
    职位管理
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:职位管理
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { emptyLast } from "@utils/index";
import Train from "@api/train";
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
    orgId: this.$store.state.userInfo.org.orgId,
    trainId: this.$store.state.trainData.id,
    trainTitle: "",
    trainImg: "",
    trainType: 1,
    visibleRange: 3,
    categoryId: "",
    tutor: "",
    originalPrice: "0",
    price: "0",
    intro: "",
    province: "",
    district: "",
    city: "",
    street: "",
    lng: "",
    lat: ""
  };
  intro: string = "";
  isPending: boolean = false;
  upLoading1: boolean = false;
  isOrg: boolean = false;
  fileUrl1: string = "";
  categoryTitle: string = "";
  showIntro: boolean = true;

  time: string[] = [];
  addressStr: string = "";
  addressOptions: any[] = [];
  orgDisabled: boolean = false;

  created() {
    this.init();
    this.getOrgList();
  }
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.form.startDate = time[0];
      this.form.endDate = time[1];
    } else {
      this.form.startDate = "";
      this.form.endDate = "";
    }
  }
  init () {
    if (this.$store.state.trainData.id) {
      this.orgDisabled = true;
      let data = {
        trainId: this.$store.state.trainData.id
      }
      Train.query_train_admin({ data }).then(res => {
        if (res.code === 0) {
          Object.keys(this.form).forEach((i, index) => {
            this.form[i] = res.data[i];
          });
          this.intro = this.form.intro;
          let time1 = this.$formatDate(res.data.startTime, "YYYY-MM-DD");
          let time2 = this.$formatDate(res.data.endTime, "YYYY-MM-DD");
          this.time = [time1,time2];
          this.handleChangeTime();
          this.addressStr = `${res.data.province || ''}${res.data.city || ''}${res.data.district || ''}${res.data.street || ''}`
          this.showIntro = false;
          this.$nextTick(()=>{
            this.showIntro = true;
          })
          this.getCategory();
        }
      });
    } else {
      this.form = {
        orgId: this.$store.state.userInfo.org.orgId,
        trainId: this.$store.state.trainData.id,
        trainTitle: "",
        trainImg: "",
        trainType: 1,
        visibleRange: 3,
        categoryId: "",
        tutor: "",
        originalPrice: "0",
        price: "0",
        intro: ""
      }
      this.getCategory();
      this.addressOptions = [];
    }
  }
  getCategory() {
    let data = {
      orgId: this.form.orgId
    };
    Category.category_list_train({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        let data = this.$store.state.trainData;
        data.classify = res.data;
        this.$store.commit('setTrainData', data);
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
      this.form.province = obj.province;
      this.form.district = obj.district;
      this.form.city = obj.city;
      this.form.street = obj.address.replace(`${obj.province}${obj.city}${obj.district}`,"") || obj.title;
      this.form.lng = obj.location.lng;
      this.form.lat = obj.location.lat;
    }
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
      this.upLoadImg(e.file, "trainImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "trainImg");
    });
  }

  upLoadImg(file: any, type: string) {
    //this.upLoading["type"] = true;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/train/train/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }

  is() {
    if (this.form.trainTitle.length <= 0 || this.form.trainTitle.length > 30 || this.form.trainTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "培训标题字数在1-30且不能有空格"
      });
      return false;
    } else if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入培训简介"
      });
      return false;
    } else if((this.form.trainType == 1 || this.form.trainType == 3) && !this.addressStr){
      this.$notify({
        title: "提示",
        type: "error",
        message: "请填写培训地点"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn_one() {
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
    if (!this.$store.state.trainData.id) {
      Train.create_train_admin({ data })
        .then(res => {
          if (res.code === 0) {
            if (!this.$store.state.trainData.id) {
              let arr = this.$store.state.trainData;
              arr.id = res.data.trainId;
              this.$store.commit('setTrainData', arr);
            }
            this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      delete data.orgId;
      Train.update_train_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOneOver");
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

