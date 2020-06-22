<template>
  <div>
    <el-form label-width="160px" class="main-top">
      <el-form-item label="企业名称：">
        <el-select class="w580" filterable v-model="orgId" @change="init">
          <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgName" :label="i.orgName" :value="i.orgId"></el-option>
        </el-select>
      </el-form-item>
      <!-- 站点logo -->
      <el-form-item label="站点LOGO：">
        <el-upload :disabled="true" action="" :show-file-list="false" :http-request="upLoadLogo" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoadingLogo" element-loading-text="上传中..." class="avatar-uploader">
          <img style="height:100px;width:100px" @click="cropperShow = true" v-if="siteInfo.siteLogo" :src="$store.state.configData.imgDomain+siteInfo.siteLogo+$imgSize['100x100']" class="avatar">
          <i style="height:100px;width:100px;line-height:100px" @click="cropperShow = true" v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <p class="fc303e">
          <!-- (不超过2M的图片,尺寸为100*100) -->
        </p>
      </el-form-item>

      <el-form-item label="站点名称：">
        <el-input v-model="siteInfo.siteName" placeholder="请输入站点名称" class="w580"></el-input>
        <span class="fc303e"> *必填</span>
      </el-form-item>

      <!-- <el-form-item label="宣传口号：">
        <el-input v-model="siteInfo.siteSlogan" placeholder="请输入宣传口号" class="w580"></el-input>
      </el-form-item>

      <el-form-item label="关键字：">
        <el-input v-model="siteInfo.siteKeyword" placeholder="请输入关键字" class="w580"></el-input>
      </el-form-item>

      <el-form-item label="信息描述：">
        <el-input type="textarea" :rows="6" placeholder="请输入信息描述" v-model="siteInfo.siteDescription" class="w580"></el-input>
      </el-form-item> -->

      <el-form-item label="二级域名：">
        <el-input v-model="siteInfo.twoDomain" :minlength="3" :maxlength="10" placeholder="请输二级域名" class="w580">
          <!-- <template slot="append">.{{$store.state.configData.doMain}}</template> -->
        </el-input>
        <span class="fc303e"> *至少3位</span>
        <p class="fc303e"> *二级域名和主域名请选填一个</p>
      </el-form-item>
      <el-form-item label="自主域名：">
        <el-input v-model="siteInfo.selfDomain" placeholder="请输入主域名" class="w580"></el-input>
        <p class="fc303e">请将您的域名解析至：140.143.84.249</p>
      </el-form-item>
      <el-form-item label="AppId：">
        <el-input v-model="siteInfo.wxAppId" placeholder="请输入AppId" class="w580"></el-input>
      </el-form-item>
      <el-form-item label="AppSecret：">
        <el-input v-model="siteInfo.wxAppSecret" placeholder="请输入AppSecret" class="w580"></el-input>
      </el-form-item>
      <el-form-item label="小程序AppId：">
        <el-input v-model="siteInfo.xcxAppId" placeholder="请输入小程序AppId" class="w580"></el-input>
      </el-form-item>
      <el-form-item label="小程序AppSecret：">
        <el-input v-model="siteInfo.xcxAppSecret" placeholder="请输入小程序AppSecret" class="w580"></el-input>
      </el-form-item>

      <el-form-item label="客服QQ：">
        <el-input v-model="siteInfo.serviceQq" placeholder="请输入客服QQ" class="w580"></el-input>
      </el-form-item>

      <el-form-item label="客服电话：">
        <el-input v-model="siteInfo.serviceTel" placeholder="请输入服务电话" class="w580"></el-input>

      </el-form-item>

      <el-form-item label=" ">
        <el-button type="primary" :loading="isPending" @click="saveBtn">保存</el-button>
      </el-form-item>

      <!-- 用户裁剪 -->
      <el-dialog width="35%" :append-to-body="true" v-if="cropperShow" :visible.sync="cropperShow" :title="'裁剪头像'">
        <cropper-img @getImgFile="getImgFile"></cropper-img>
      </el-dialog>

    </el-form>
  </div>
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
import Org from "@api/org";
import System from "@api/system";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    CropperImg: () => import("@c/CropperImg.vue")
  }
})
export default class Configbasic extends Vue {
  isPending: boolean = false;
  siteInfo: any = {
    siteName: "",
    siteSlogan: "",
    siteKeyword: "",
    siteDescription: "",
    twoDomain: "",
    selfDomain: "",
    serviceQq: "",
    serviceTel: "",
    orgSiteId: "",
    siteLogo: "",
    wxAppId: "",
    wxAppSecret: "",
    xcxAppId: "",
    xcxAppSecret: "",
  };
  orgId: string = "";
  // 是否展示上传中
  upLoadingLogo: boolean = false;

  // 是否展示用户裁剪
  cropperShow: boolean = false;

  created() {
    this.orgId = this.$store.state.userInfo.org.orgId;
    this.init();
    this.getOrgList();
  }
  init() {
    let data = {
      orgId: this.orgId
    };
    Org.query_orgsite({ data }).then(res => {
      if (res.data) {
        this.siteInfo.siteName = res.data.siteName;
        this.siteInfo.siteSlogan = res.data.siteSlogan;
        this.siteInfo.siteKeyword = res.data.siteKeyword;
        this.siteInfo.siteDescription = res.data.siteDescription;
        this.siteInfo.twoDomain = res.data.twoDomain;
        this.siteInfo.selfDomain = res.data.selfDomain;
        this.siteInfo.serviceQq = res.data.serviceQq;
        this.siteInfo.serviceTel = res.data.serviceTel;
        this.siteInfo.orgSiteId = res.data.orgSiteId;
        this.siteInfo.siteLogo = res.data.siteLogo;
        this.siteInfo.wxAppId = res.data.wxAppId;
        this.siteInfo.wxAppSecret = res.data.wxAppSecret;
        this.siteInfo.xcxAppId = res.data.xcxAppId;
        this.siteInfo.xcxAppSecret = res.data.xcxAppSecret;  
      } else {
        this.siteInfo = {
          siteName: "",
          siteSlogan: "",
          siteKeyword: "",
          siteDescription: "",
          twoDomain: "",
          selfDomain: "",
          serviceQq: "",
          serviceTel: "",
          orgSiteId: "",
          siteLogo: "",
          wxAppId: "",
          wxAppSecret: "",
          xcxAppId: "",
          xcxAppSecret: "",
        }
      }
    });
  }
  // 获取裁剪的头像信息
  getImgFile(file: void): void {
    let files = { file };
    this.upLoadLogo(files);
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
  }
  // 上传logo
  async upLoadLogo(e: any) {
    this.upload(e, 200);
  }
  // 压缩logo
  upload(file: any, size: number) {
    if (file.file.size < 2097152) {
      this.upLoadImgSrc(file.file);
      return;
    }
    Lrz(file.file, { width: size, quality: 0.9 }).then((rst: any) => {
      this.upLoadImgSrc(rst.file);
    });
  }

  // 连接服务器并上传logo
  upLoadImgSrc(file: any, key: string) {
    this.upLoadingLogo = true;
    let formData = new FormData();
    let { token } = this.$store.state.userInfo;
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", token);
    formData.append("path", "/user/org/siteLogo");
    System.upload(formData)
      .then(res => {
        if (res.code === 0) {
          this.siteInfo.siteLogo = res.data.url;
          this.$notify({
            title: "提示",
            message: `图片裁剪完成，并上传成功！`,
            type: "success"
          });
        } else {
          this.$notify({
            title: "提示",
            message: res.msg,
            type: "error"
          });
        }
      })
      .finally(() => {
        this.upLoadingLogo = false;
        this.cropperShow = false;
      });
  }
  saveBtn() {
    if (!this.siteInfo.siteName || this.siteInfo.siteName.includes(" ")) {
      this.$notify({
        title: "提示",
        message: "站点名称填写不合法！",
        type: "error"
      });
      return;
    }
    if (!this.siteInfo.twoDomain && !this.siteInfo.selfDomain) {
      this.$notify({
        title: "提示",
        message: "二级域名和主域名请选填一个！",
        type: "error"
      });
      return;
    }
    if (
      (this.siteInfo.twoDomain && this.siteInfo.twoDomain.length < 3) ||
      this.siteInfo.twoDomain.includes(" ")
    ) {
      this.$notify({
        title: "提示",
        message: "二级域名至少3位,并且不能含有空格！",
        type: "error"
      });
      return;
    }
    if (this.siteInfo.selfDomain && this.siteInfo.selfDomain.includes(" ")) {
      this.$notify({
        title: "提示",
        message: "主域名不能含有空格！",
        type: "error"
      });
      return;
    }
    this.siteInfo.orgId = this.orgId;
    let data = { ...this.siteInfo };
    delete data.updateTime;
    this.isPending = true;
    Org.updateOrgsite({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "修改成功！",
            type: "success"
          });
          let data = { doMain: location.hostname };
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
}
</script>
<style lang="scss" scoped>
</style>
