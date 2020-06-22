<template>
  <div class="register">
    <el-form label-width="160px">
      <el-form-item label="企业全称：">
        <el-input type="text" v-model="param.orgName" placeholder="请输入企业全称" class='w80per'></el-input>
      </el-form-item>
      <el-form-item label="企业简称：">
        <el-input type="text" v-model="param.shortName" placeholder="请输入企业简称" class='w80per'></el-input>
      </el-form-item>
      <el-form-item label="企业地址：">
        <el-input type="text" v-model="param.address" placeholder="请输入企业地址" class='w80per'></el-input>
      </el-form-item>
      <el-form-item label="企业类型 : ">
        <el-select v-model="param.orgType" placeholder="请选择企业类型" class='w80per' clearable @clear="orgType = ''">
          <el-option :key="i.id" v-for="i in $store.state.orgTypeArr" :value="i.id" :label="i.text" v-show="i.id != 9"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="统一信用码：">
        <el-input v-model="param.orgCode" placeholder="请输入统一社会信用代码" class="w80per"></el-input>
        &nbsp;
        <span class="fc303e" v-show="param.orgType == 2 || param.orgType == 3 || param.orgType == 5">（选填）</span>
      </el-form-item>
      <el-form-item label="企业性质：">
        <el-select class='w80per' v-model="param.natrue">
          <el-option v-for="(i) in $store.state.natureList" :key="i.id" :label="i.text" :value="i.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属行业：">
        <el-select class='w80per' v-model="param.industry">
          <el-option v-for="(i) in $store.state.industryList" :key="i.id" :label="i.text" :value="i.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业规模：">
        <el-select class='w80per' v-model="param.scale">
          <el-option v-for="(i) in $store.state.scaleList" :key="i.id" :label="i.text" :value="i.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="成立日期：">
        <el-date-picker v-model="param.regDate" type="date" placeholder="选择日期" class="w80per" :picker-options="pickerOptions" value-format="yyyy-MM-dd 00:00:00"></el-date-picker>
      </el-form-item>
      <el-form-item label="官方网址：">
        <el-input type="text" v-model="param.website" placeholder="请输入企业官网" class='w80per'></el-input>
        &nbsp;
        <span class="fc303e">（选填）</span>
      </el-form-item>
      <el-form-item label="管理员姓名：">
        <el-input type="text" v-model="param.contact" placeholder="请输入管理员姓名" class='w80per'></el-input>
      </el-form-item>
      <el-form-item label="管理员手机号码：">
        <el-input type="text" v-model="param.phone" placeholder="请输入管理员手机号码" class='w80per'></el-input>
      </el-form-item>
      <el-form-item label="管理员电子邮箱：">
        <el-input type="text" v-model="param.email" placeholder="请输入管理员电子邮箱" class='w80per'></el-input>
        &nbsp;
        <span class="fc303e">（选填）</span>
      </el-form-item>
      <el-form-item label="营业执照：">
        <el-upload action="" :show-file-list="false" :http-request="upLoadLicense" accept="image/gif,image/jpeg,image/jpg,image/png" element-loading-text="上传中..." class="avatar-uploader">
          <img style="height:297px;width:210px" v-if="param.orgLicense" :src="$store.state.configData.imgDomain+param.orgLicense +$imgSize['210x297']" class="avatar">
          <i v-else style="height:297px;width:210px;line-height:297px" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        &nbsp;
        <span class="fc303e" v-show="param.orgType == 2 || param.orgType == 3 || param.orgType == 5">（选填）</span>
      </el-form-item>
      <el-form-item label="企业形象：">
        <el-upload action="" :show-file-list="false" :http-request="upLoadImg" accept="image/gif,image/jpeg,image/jpg,image/png" element-loading-text="上传中..." class="avatar-uploader">
          <img v-if="param.orgImg" :src="param.orgImg.includes('http') ? param.orgImg : $store.state.configData.imgDomain+param.orgImg+$imgSize['224x126']" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        &nbsp;
        <span class="fc303e">（选填）</span>
      </el-form-item>
      <el-form-item label="企业LOGO：">
        <el-upload action="" :show-file-list="false" :http-request="upLoadLogo" accept="image/gif,image/jpeg,image/jpg,image/png" element-loading-text="上传中..." class="avatar-uploader">
          <img style="height:100px;width:100px" @click="cropperShow = true" v-if="param.orgLogo" :src="$store.state.configData.imgDomain+param.orgLogo+$imgSize['100x100']" class="avatar">
          <i style="height:100px;width:100px;line-height:100px" @click="cropperShow = true" v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="企业简介：">
        <!-- <add-edit :placeholder="'请输入企业简介'" :htmlStr="orgIntro ? orgIntro : ''" ref="addEditRef"></add-edit> -->
        <el-input type="textarea" v-model="param.intro" class="h300"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveBtn" :loading="isPending">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mobileReg, checkSite } from "@utils/index";
import User from "@api/user";
import System from "@api/system";
import { debounce } from "typescript-debounce-decorator";
import { truncate } from 'fs';
@Component({
  components: {
    "add-edit": () => import("@c/addEdit.vue"),
    CropperImg: () => import("@c/CropperImg.vue")
  }
})
export default class Register extends Vue {
  param: {
    orgName: string;
    shortName: string;
    address: string;
    orgType: string;
    orgCode?: string;
    natrue: string;
    industry: string;
    scale: string;
    regDate: string;
    website?: string;
    contact: string;
    phone: string;
    email?: string;
    orgLicense?: string;
    orgImg?: string;
    orgLogo?: string;
    intro: string;
  } = {
    orgName: "",
    shortName: "",
    address: "",
    orgType: "",
    orgCode: "",
    natrue: "",
    industry: "",
    scale: "",
    regDate: "",
    website: "",
    contact: "",
    phone: "",
    email: "",
    orgLicense: "",
    orgImg: "",
    orgLogo: "",
    intro: ""
  }
  
  mapObj: {
    orgName: string;
    shortName: string;
    address: string;
    orgType: string;
    orgCode: string;
    natrue: string;
    industry: string;
    scale: string;
    regDate: string;
    contact: string;
    phone: string;
    orgLicense: string;
    orgLogo: string;
    intro: string;
  } = {
    orgName: "企业全称",
    shortName: "企业简称",
    address: "企业地址",
    orgType: "企业类型",
    orgCode: "统一信用码",
    natrue: "企业性质",
    industry: "所属行业",
    scale: "企业规模",
    regDate: "成立日期",
    contact: "管理员姓名",
    phone: "管理员手机号码",
    orgLicense: "营业执照",
    orgLogo: "企业LOGO",
    intro: "企业简介"
  };
  isPending: boolean = false;

  orgIntro: string = "";

  upLoadingImg: boolean = false;
  cropperShow: boolean = false;

  pickerOptions: object = {
    disabledDate: time => {
      return time.getTime() > new Date().getTime();
    }
  };

  created() {
  }

  async upLoadLicense(e: any) {
    this.upload(e, "orgLicense", 800);
  }
  async upLoadLogo(e: any) {
    this.upload(e, "orgLogo", 200);
  }
  async upLoadImg(e: any) {
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
    formData.append("file", file);
    formData.append("uploadType", "2");
    if (key === "orgLicense") {
      formData.append("path", "/user/org/license");
    } else if (key === "orgLogo") {
      formData.append("path", "/user/org/logo");
    } else if (key === "orgImg") {
      formData.append("path", "/user/org/img");
    }
    System.upload(formData)
      .then(res => {
        this.param[key] = res.data.url;
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
  saveBtn() {
    if (this.isPending) return;
    this.isPending = true;
    if (this.param.orgType == 2 || this.param.orgType == 3 || this.param.orgType == 5){
      delete this.mapObj.orgLicense;
      delete this.mapObj.orgCode;
    }
    // this.param.intro = this.$refs.addEditRef.getHtmlText();
    for (let i in this.mapObj) {
      //@ts-ignore
      if (this.param[i] !== 0 && !this.param[i]) {
        this.$notify({
          title: "提示",
          //@ts-ignore
          message: `请填写/选择${this.mapObj[i]}!`,
          type: "error"
        });
        this.isPending = false;
        return;
      }
    }
    if (this.param.orgCode !== '' && this.param.orgCode.length > 18) {
      this.$notify({
        title: "错误",
        type: "error",
        message: "统一信用码超过18位"
      });
      this.isPending = false;
      return;
    }
    if (this.param.website !== '' && !checkSite(this.param.website)) {
      this.$notify({
        title: "错误",
        type: "error",
        message: "官方网址格式错误"
      });
      this.isPending = false;
      return;
    }
    if (this.param.phone !== '' && !mobileReg(this.param.phone)) {
      this.$notify({
        title: "错误",
        type: "error",
        message: "管理员手机号码格式错误"
      });
      this.isPending = false;
      return;
    }
    // this.param.intro = encodeURIComponent(this.param.intro.replace(/http:/g, "https:")
    //   .replace(/section/g, "div")
    //   .replace(/strong/g, "div")
    //   .replace(/footer/g, "div")
    //   .replace(/\<img/g, '<img style="max-width:100%;height:auto"')
    // )
    let data = { ...this.param };
    User.create_org_reg({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            type: "success",
            message: `提交成功！请耐心等待审核通过`
          });
          this.$confirm("我们会尽快审核然后通知您，审核通过后，登录账号为管理员手机号，密码为随机生成，请点“忘记密码”重置密码。", "提交注册成功！", {
            confirmButtonText: "确定",
            showClose: false,
            showCancelButton: false
          }).then(() => {
            this.$emit("close");            
          }).catch(() => {
          });
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
}
</script>
<style lang="scss" scoped>
  .register {
    .avatar-uploader {
      float: left;
    }
  }
</style>
