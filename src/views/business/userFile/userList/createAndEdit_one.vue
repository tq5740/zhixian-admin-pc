<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="120px" v-loading="loading">
        <el-form-item label="姓名 : ">
          <el-input placeholder="请填写姓名" v-model="params.name" class='w80per' type="text" clearable :disabled="isAuth"></el-input>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="手机号 : ">
          <el-input placeholder="请填写手机号" v-model="params.phone" class='w80per' type="number" clearable :disabled="!!$store.state.userData.id"></el-input>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="密码 : " v-if="!this.$store.state.userData.id">
          <el-input placeholder="请填写密码" v-model="params.password" class='w80per' clearable></el-input>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="身份类型 : ">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="应届毕业生"></el-checkbox>
            <el-checkbox label="退伍军人"></el-checkbox>
            <el-checkbox label="失业人员"></el-checkbox>
            <el-checkbox label="就业困难人员"></el-checkbox>
            <el-checkbox label="农民工"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="邮箱 : ">
          <el-input placeholder="请填写邮箱" v-model="params.email" class='w80per' clearable></el-input>
        </el-form-item>
        <el-form-item label="性别 : ">
          <el-radio-group v-model="params.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最高学历 : ">
          <el-select placeholder="请填写最高学历" class='w80per' v-model="params.highestEducation" clearable @clear="params.highestEducation = ''">
            <el-option v-for="(i) in $store.state.educationArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始工作年份 : ">
          <el-select placeholder="请填写开始工作年份" class='w320' v-model="params.startWorkYear" clearable @clear="params.startWorkYear = ''">
            <el-option v-for="(i) in yearArr" :key="i" :label="i" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在区域 : ">
          <el-cascader class="w320" ref="area" :options="options" v-model="area"></el-cascader>
        </el-form-item>
        <el-form-item label="头像 : ">
          <el-upload :disabled="true" action="" :show-file-list="false" :http-request="upLoadLogo" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="params.photo" :src="(params.photo && params.photo.includes('http')) ? params.photo : $store.state.configData.imgDomain+params.photo+$imgSize[`100x100`]" class="avatar" style="height:100px;width:100px">
            <i style="height:100px;width:100px;line-height:100px" v-else @click="cropperShow = true" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click='saveBtn' :loading="isPending">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog width="35%" :append-to-body="true" v-if="cropperShow" :visible.sync="cropperShow" :title="'裁剪头像'">
      <cropper-img @getImgFile="getImgFile"></cropper-img>
    </el-dialog>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from "vue-property-decorator";
import { mobileReg } from "@utils/index";
import { regionData, TextToCode } from 'element-china-area-data';
import User from "@api/user";
import System from "@api/system";

@Component({
  components: {
    CropperImg: () => import("@c/CropperImg.vue")
  }
})
export default class CreateAndEdit extends Vue {
  params: any = {
    name: "",
    userId: "",
    phone: "",
    password: "",
    email: "",
    photo: "",
    sex: "",
    identity: "",
    highestEducation: 0,
    startWorkYear: ""
  };
  cropperShow: boolean = false;
  upLoading: boolean = false;
  isPending: boolean = false;
  loading: boolean = false;
  options: any[] = regionData;
  area: any[] = [];
  yearArr: any[] = [];
  checkList: any[] = [];

  isAuth: boolean = false;

  created() {
    this.init();
  }
  init() {
    var year = new Date().getFullYear();
    for(var i = year; i >= 1950; i --){
      this.yearArr.push(i);
    }
    if (this.$store.state.userData.id) {
      this.loading = true;
      let data = {
        userId: this.$store.state.userData.id
      }
      User.query_work_reg_user({ data })
        .then(res => {
          if (res.code === 0) {
            this.isAuth = res.data.isAuth === 4 ? true : false;
            Object.keys(this.params).forEach((i, index) => {
              this.params[i] = res.data[i];
            });
            this.checkList = JSON.parse(res.data.identity) || [];
            this.area.push(TextToCode[res.data.province].code)
            this.area.push(TextToCode[res.data.province][res.data.city].code)
            this.area.push(TextToCode[res.data.province][res.data.city][res.data.district].code)
          }
        })
        .finally(() => {
          this.loading = false;
        })
      }
  }
  getImgFile(file: void): void {
    let files = { file };
    this.upLoadLogo(files);
  }
  async upLoadLogo(e: any) {
    this.upload(e);
  }
  upload(file: any) {
    if (file.file.size < 2097152) {
      this.upLoadImgSrc(file.file);
      return;
    }
    Lrz(file.file, { width: size, quality: 0.9 }).then((rst: any) => {
      this.upLoadImgSrc(rst.file);
    });
  }
  upLoadImgSrc(file: any) {
    this.upLoading = true;
    let formData = new FormData();
    let { token } = this.$store.state.userInfo;
    formData.append("file", file);
    formData.append("uploadType", "1");
    formData.append("token", token);
    formData.append("path", "/user/user/photo");
    System.upload(formData)
      .then(res => {
        this.params.photo = res.data.url;
        this.$notify({
          title: "提示",
          message: `图片裁剪完成，并上传成功！`,
          type: "success"
        });
      })
      .finally(() => {
        this.upLoading = false;
        this.cropperShow = false;
      });
  }
  is() {
    if (!this.params.name || this.params.name.includes(" ")) {
      this.$notify({
        title: "提示",
        message: `请输入姓名且不能含有空格`,
        type: "error"
      });
      return false;
    }
    if (!this.params.phone || !mobileReg(this.params.phone)) {
      this.$notify({
        title: "提示",
        message: `请输入正确的手机号`,
        type: "error"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn() {
    if(!this.is()) return;
    if(this.area.length !== 0){
      var arr = this.$refs['area'].currentLabels;
      this.params.province = arr[0];
      this.params.city = arr[1];
      this.params.district = arr[2];
    }
    this.params.identity = this.checkList.length > 0 ? JSON.stringify(this.checkList) : null;
    let data = {
      ...this.params
    }
    this.isPending = true;
    if (this.$store.state.userData.id) {
      User.update_work_reg_user({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
       if (!data.password || data.password.length < 8 || data.password.length > 16) {
        this.$notify({
          title: "提示",
          message: `请输入8~16位密码`,
          type: "error"
        });
        this.isPending = false;
        return;
      }
      User.create_work_reg_user({ data })
        .then(res => {
          if (res.code === 0) {
            let arr = this.$store.state.userData;
            arr.id = res.data.userId;
            arr.name = res.data.name;
            this.$store.commit('setUserData', arr)
            this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
}
</script>
<style lang="scss" scoped>  
</style>


