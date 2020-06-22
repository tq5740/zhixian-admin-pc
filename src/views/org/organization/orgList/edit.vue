<template>
  <div v-loading="loading">
    <el-form label-width="120px">
      <el-form-item label="企业名称：">
        <el-input :disabled="true" v-model="orgInfo.orgName" placeholder="请输入企业名称" class="w70per"></el-input>
        <span class="fc303e"> *必填</span>
      </el-form-item>
      <el-form-item label="统一信用码：">
        <el-input maxlength="18" :disabled="true" v-model="orgInfo.orgCode" placeholder="请输入统一社会信用代码" class="w70per"></el-input>
        <span class="fc303e" v-show="showMust"> *必填</span>
      </el-form-item>
      <el-form-item label="营业执照：">
        <el-upload action="" :show-file-list="false" :http-request="upLoadLicense" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoadingLicense" element-loading-text="上传中..." class="avatar-uploader">
          <img style="height:297px;width:210px" v-if="orgInfo.orgLicense" :src="$store.state.configData.imgDomain+orgInfo.orgLicense +$imgSize['210x297']" class="avatar">
          <i v-else style="height:297px;width:210px;line-height:297px" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p class="fc303e" v-show="showMust">
          *必填（需加盖鲜章的营业执照扫描件）
          <!-- *必填(不超过2M的图片) -->
        </p>
      </el-form-item>
      <el-form-item label="企业简称：">
        <el-input v-model="orgInfo.shortName" placeholder="请输入企业简称" class="w70per"></el-input>
        <span class="fc303e"> *必填</span>
      </el-form-item>
      <el-form-item label="企业形象：">
        <el-upload action="" :show-file-list="false" :http-request="upLoadImg" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoadingImg" element-loading-text="上传中..." class="avatar-uploader">
          <img v-if="orgInfo.orgImg" :src="orgInfo.orgImg.includes('http') ? orgInfo.orgImg : $store.state.configData.imgDomain+orgInfo.orgImg+$imgSize['224x126']" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p class="fc303e">
          <!-- (不超过2M的图片) -->
        </p>
      </el-form-item>
      <el-form-item label="企业LOGO：">
        <el-upload :disabled="true" action="" :show-file-list="false" :http-request="upLoadLogo" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoadingLogo" element-loading-text="上传中..." class="avatar-uploader">
          <img style="height:100px;width:100px" @click="cropperShow = true" v-if="orgInfo.orgLogo" :src="$store.state.configData.imgDomain+orgInfo.orgLogo+$imgSize['100x100']" class="avatar">
          <i style="height:100px;width:100px;line-height:100px" @click="cropperShow = true" v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span class="fc303e"> *必填</span>
      </el-form-item>
      <el-form-item label="企业类型：">
        <el-select class='w240' v-model="orgInfo.orgType" disabled>
          <el-option v-for="(i) in orgTypeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
        </el-select>
        <span class="fc303e"> *必填</span>
      </el-form-item>
      <el-form-item label="所属行业：">
        <el-select class='w240' v-model="orgInfo.industry" @change="getIndustry">
          <el-option v-for="(i) in $store.state.industryList" :key="i.text" :label="i.text" :value="i.id"></el-option>
        </el-select>
        <span class="fc303e"> *必填</span>
      </el-form-item>
      <el-form-item label="企业性质：">
        <el-select class='w240' v-model="orgInfo.natrue" @change="getNature">
          <el-option v-for="(i) in $store.state.natureList" :key="i.text" :label="i.text" :value="i.id"></el-option>
        </el-select>
        <span class="fc303e"> *必填</span>
      </el-form-item>
      <el-form-item label="企业规模：">
        <el-select class='w240' v-model="orgInfo.scale" @change="getScale">
          <el-option v-for="(i) in $store.state.scaleList" :key="i.text" :label="i.text" :value="i.id"></el-option>
        </el-select>
        <span class="fc303e"> *必填</span>
      </el-form-item>
      <el-form-item label="官方网址：">
        <el-input placeholder="例 : http://www.baidu.com/" v-model="orgInfo.website" class="w70per"></el-input>
      </el-form-item>
      <!-- <el-form-item label="法人姓名：">
        <el-input :disabled="true" placeholder="请输入法人姓名" v-model="orgInfo.legalPerson" class="w70per"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="法人手机：">
        <el-input :disabled="true" placeholder="请输入法人手机" v-model="orgInfo.phone" class="w70per"></el-input>
      </el-form-item> -->
      <el-form-item label="成立日期：">
        <el-input :disabled="true" placeholder="请输入成立日期" v-model="orgInfo.createTimeStr" class="w70per"></el-input>
      </el-form-item>
      <el-form-item label="注册地址：">
        <el-input :disabled="true" v-model="orgInfo.address" class="w70per"></el-input>
      </el-form-item>
      <el-form-item label="企业简介：">
        <add-edit v-if="showIntro" :placeholder="'请输入企业简介'" :htmlStr="orgIntro ? orgIntro : ''" ref="addEditRef"></add-edit>
        <p class="fc303e">
          *必填
        </p>

      </el-form-item>
    </el-form>
    <el-row>
      <el-button style="margin-left:120px" type="primary" @click="saveBtn" :loading="isPending">保存</el-button>
    </el-row>

    <el-dialog width="35%" :append-to-body="true" v-if="cropperShow" :visible.sync="cropperShow" :title="'裁剪头像'">
      <cropper-img @getImgFile="getImgFile"></cropper-img>
    </el-dialog>

  </div>
</template>

<script lang="ts">
/*
 module:
    EditOrg
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-23:EditOrg
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
// import VEditor from "@c/VEditor.vue";
import Org from "@api/org";
import System from "@api/system";
import { miniSizePic, checkSize, checkSite } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    //"v-editor": () => import("@c/VEditor.vue")
    "add-edit": () => import("@c/addEdit.vue"),
    CropperImg: () => import("@c/CropperImg.vue")
  }
})
export default class EditOrg extends Vue {
  @Prop({ default: "" })
  public orgId!: string;
  @Prop({ default: [] })
  public orgTypeArr!: object[];
  orgInfo = {
    orgId: "",
    orgName: "",
    orgLicense: "",
    shortName: "",
    orgLogo: "",
    orgImg: "",
    orgType: "",
    natrue: "",
    industry: "",
    legalPerson: "",
    scale: "",
    // phone: "",
    website: "",
    intro: "",
    orgCode: "",
    createTime: "",
    address: ""
  };
  mapObj = {
    orgLicense: "营业执照",
    shortName: "企业简称",
    orgType: "企业类型",
    industry: "所属行业",
    natrue: "企业性质",
    scale: "企业规模",
    intro: "企业简介"
  };
  upLoadingLogo: boolean = false;
  upLoadingLicense: boolean = false;
  upLoadingImg: boolean = false;
  loading: boolean = false;
  isPending: boolean = false;

  cropperShow: boolean = false;
  orgIntro: any = "";
  showMust: boolean = true;
  showIntro: boolean = true;
  created() {
    this.getOrgInfo();
  }
  saveBtn() {
    this.isPending = true;
    if (this.orgInfo.orgType != 9) {
      if (this.orgInfo.orgType == 2 || this.orgInfo.orgType == 3 || this.orgInfo.orgType == 5){
        delete this.mapObj.orgLicense;
      }
      this.orgInfo.intro = this.$refs.addEditRef.getHtmlText();
      for (let i in this.mapObj) {
        //@ts-ignore
        if (this.orgInfo[i] !== 0 && !this.orgInfo[i]) {
          this.$notify({
            title: "提示",
            //@ts-ignore
            message: `请填写${this.mapObj[i]}!`,
            type: "error"
          });
          this.isPending = false;
          return;
        }
      }
    }
    if (this.orgInfo.website && !checkSite(this.orgInfo.website)) {
      this.$notify({
        title: "错误",
        type: "error",
        message: "网址格式错误"
      });
      this.isPending = false;
      return;
    }
    this.orgInfo.intro = encodeURIComponent(this.orgInfo.intro.replace(/http:/g, "https:")
      .replace(/section/g, "div")
      .replace(/strong/g, "div")
      .replace(/footer/g, "div")
      .replace(/\<img/g, '<img style="max-width:100%;height:auto"')
    )
    let data = { ...this.orgInfo };
    delete data.createTime;
    Org.updateOrg({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            type: "success",
            message: `编辑成功`
          });
          this.$emit("okCB");
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  async _upImg(e: any) {
    let res: any;
    try {
      res = await miniSizePic(e.file);
    } catch (error) {
      this.$notify({
        title: "提示",
        message: `压缩图片失败,将使用原始图片!`,
        type: "error"
      });
      res = e.file;
    }
    return Promise.resolve(res);
  }
  _checkSize(size: number): boolean {
    let flag = checkSize(size, 2);
    if (flag) {
      this.$notify({
        title: "提示",
        message: `图片大小超过2M,请重新上传!`,
        type: "error"
      });
    }
    return flag;
  }

  getImgFile(file: void): void {
    let files = { file };
    this.upLoadLogo(files);
  }

  async upLoadLicense(e: any) {
    // this.upLoadingLicense = true;
    // let res = await this._upImg(e);
    // if (this._checkSize(e.file.size)) {
    //   this.upLoadingLicense = false;
    //   return;
    // }
    this.upload(e, "orgLicense", 800);
  }
  async upLoadLogo(e: any) {
    //logo不用压缩
    // this.upLoadingLogo = true;
    // let res = await this._upImg(e);
    // if (this._checkSize(e.file.size)) {
    //   this.upLoadingLogo = false;
    //   return;
    // }
    this.upload(e, "orgLogo", 200);
  }
  async upLoadImg(e: any) {
    // this.upLoadingImg = true;
    // let res = await this._upImg(e);
    // if (this._checkSize(e.file.size)) {
    //   this.upLoadingImg = false;
    //   return;
    // }
    this.upload(e, "orgImg", 800);
  }
  upload(file: any, key: string, size: number) {
    if (file.file.size < 2097152) {
      this.upLoadImgSrc(file.file, key);
      return;
    }
    Lrz(file.file, { width: size, quality: 0.9 }).then((rst: any) => {
      this.upLoadImgSrc(rst.file, key);
    });
  }

  upLoadImgSrc(file: any, key: string) {
    this.upLoadingImg = true;
    let formData = new FormData();
    let { token } = this.$store.state.userInfo;
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", token);
    if (key === "orgLicense") {
      formData.append("path", "/user/org/license");
    } else if (key === "orgLogo") {
      formData.append("path", "/user/org/logo");
    } else if (key === "orgImg") {
      formData.append("path", "/user/org/img");
    }
    System.upload(formData)
      .then(res => {
        this.orgInfo[key] = res.data.url;
        if (key == "orgLogo") {
          this.$notify({
            title: "提示",
            message: `图片裁剪完成，并上传成功！`,
            type: "success"
          });
        }
      })
      .finally(() => {
        this.upLoadingImg = false;
        this.cropperShow = false;
      });
  }

  getOrgInfo() {
    this.loading = true;
    let data = { orgId: this.orgId };
    Org.queryOrg({ data })
      .then(res => {
        if (res.code === 0) {
          Object.keys(this.orgInfo).forEach(i => {
            //@ts-ignore
            this.orgInfo[i] = res.data[i];
            if (this.orgInfo[i] == null) {
              this.orgInfo[i] = "";
            }
            if (res.data[i] == null) {
              res.data[i] = "";
            }
            //@ts-ignore
            this.orgInfo.createTimeStr = this.$formatDate(
              res.data.createTime,
              "YYYY-MM-DD"
            );
            this.orgInfo.address = res.data.address
            // this.orgInfo.phone = this.orgInfo.phone ? this.orgInfo.phone : "保密";
            this.orgInfo.legalPerson = this.orgInfo.legalPerson ? this.orgInfo.legalPerson : ' ';
            this.orgInfo.orgType == 2 || this.orgInfo.orgType == 3 || this.orgInfo.orgType == 5 ? this.showMust = false : this.showMust = true;
          });
          this.orgIntro = this.orgInfo.intro;
          this.showIntro = false;
          this.$nextTick(()=>{
            this.showIntro = true;
          })
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  getIndustry(e): void {
    let res = this.$store.state.industryList.filter(i => i.id === e)[0];
    this.orgInfo.industry = res ? res.text : "";
  }
  getNature(e): void {
    let res = this.$store.state.natureList.filter(i => i.id === e)[0];
    this.orgInfo.natrue = res ? res.text : "";
  }
  getScale(e): void {
    let res = this.$store.state.scaleList.filter(i => i.id === e)[0];
    this.orgInfo.scale = res ? res.text : "";
  }
}
</script>
<style lang="scss" scoped>
</style>
