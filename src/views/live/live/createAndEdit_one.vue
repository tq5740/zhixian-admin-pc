<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="150px" label-position="right">
        <el-form-item label="企业名称 : ">
          <el-select filterable clearable v-model="form.orgId" class="w80per" @change="getCategory" @visible-change="judgeOrg()" :disabled="disabledEdit">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="直播标题 : ">
          <el-input placeholder="请输入直播标题" v-model="form.liveTitle" class="w80per"></el-input>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>

        <el-form-item label="直播封面 : ">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.liveImg" :src="(form.liveImg  && form.liveImg.includes('http')) ? form.liveImg : $store.state.configData.imgDomain+form.liveImg+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
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

        <el-form-item label="直播分类 : ">
          <el-cascader :options="classifyList" :props="keyName" v-model="categoryId" @change="ClassifyId" :show-all-levels="false" change-on-select clearable class="w80per"></el-cascader>
          <span class="fc303e">（选填）</span>
        </el-form-item>

        <el-form-item label="原价 : ">
          <el-input placeholder="请输入原价" v-model="form.originalPrice" class="w80per"></el-input>
        </el-form-item>
        
        <el-form-item label="现价/优惠价 : ">
          <el-input placeholder="请输入现价/优惠价" v-model="form.price" class="w80per"></el-input>
        </el-form-item>

        <el-form-item label="直播简介 : ">
          <add-edit v-if="showIntro" :placeholder="'请输入直播简介'" :htmlStr="intro ? intro : ''" ref="addEditRefArlist"></add-edit>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建直播哦！</span>
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
import Live from "@api/live";
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
  form: any = {
    orgId: this.$store.state.userInfo.org.orgId,
    liveId: this.$store.state.liveData.id,
    liveTitle: "",
    liveImg: "",
    visibleRange: 2,
    categoryId: "",
    originalPrice: "0",
    price: "0",
    intro: ""
  };
  mapObj = {
    orgId: "企业名称",
    liveTitle: "直播标题"
  };
  isPending: boolean = false;
  upLoading1: boolean = false;
  isOrg: boolean = false;
  fileUrl1: string = "";
  categoryTitle: string = "";
  showIntro: boolean = true;
  time: string[] = [];
  disabledEdit: boolean = false;
  intro: string = "";

  created() {
    this.init();
    this.getOrgList();
  }
  init () {
    if (this.$store.state.liveData.id) {
      this.disabledEdit = true;
      let data = {
        liveId: this.$store.state.liveData.id
      }
      Live.query_live_admin({ data })
        .then(res => {
          if (res.code === 0) {
            Object.keys(this.form).forEach((i, index) => {
              this.form[i] = res.data[i];
            });
            this.intro = this.form.intro;
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
    Category.category_list_live({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        let data = this.$store.state.liveData;
        data.classify = res.data;
        this.$store.commit('setLiveData', data)
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
    } else {
      this.form.categoryId = "";
    }
  }
  // 压缩图片上传
  async upLoad1(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "liveImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "liveImg");
    });
  }

  upLoadImg(file: any, type: string) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/live/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  is() {
    if (this.form.liveTitle.length <= 0 || this.form.liveTitle.length > 30 || this.form.liveTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "直播标题字数在1-30且不能有空格"
      });
      return false;
    } else if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入直播简介"
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
    if (this.title.title === "创建直播") {
      Live.create_live_admin({ data })
        .then(res => {
          if (res.code === 0) {
            if (!this.$store.state.liveData.id) {
              let arr = this.$store.state.liveData;
              arr.id = res.data;
              this.$store.commit('setLiveData', arr);
            }
            this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      delete data.orgId;
      Live.update_live_admin({ data })
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

