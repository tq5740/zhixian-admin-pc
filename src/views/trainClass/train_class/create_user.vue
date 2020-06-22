<template>
  <div>
    <el-form label-width="150px" label-position="right" :class="where === 'apply' ? 'isShow' : ''">
      <el-form-item label="姓名：">
        <el-input placeholder="请输入姓名" v-model="authUserInfo.name" class="w80per" v-if="where === 'print'"></el-input>
        <span v-else>{{authUserInfo.name}}</span>
      </el-form-item>
      <el-form-item label="性别：">
        <el-radio-group v-model="authUserInfo.sex" v-if="where === 'print'">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
        <span v-else>{{authUserInfo.sex == 1 ? '男' : authUserInfo.sex == 2 ? '女' : ''}}</span>
      </el-form-item>
      <el-form-item label="民族：">
        <el-input placeholder="请输入民族，如：汉族" v-model="authUserInfo.nation" class="w80per" v-if="where === 'print'"></el-input>
        <span v-else>{{authUserInfo.nation}}</span>
      </el-form-item>
      <el-form-item label="出生日期：">
        <el-date-picker placeholder="请选择出生日期" v-model="authUserInfo.birthdayDate" type="date" value-format='yyyy-MM-dd' :picker-options="{disabledDate}" v-if="where === 'print'"></el-date-picker>
        <span v-else>{{authUserInfo.birthdayDate}}</span>
      </el-form-item>
      <el-form-item label="户籍地址：">
        <el-input placeholder="请输入户籍地址" v-model="authUserInfo.address" class="w80per" v-if="where === 'print'"></el-input>
        <span v-else>{{authUserInfo.address}}</span>
      </el-form-item>
      <el-form-item label="身份证号：">
        <el-input placeholder="请输入身份证号" v-model="authUserInfo.idNumber" class="w80per" disabled v-if="where === 'print'"></el-input>
        <span v-else>{{authUserInfo.idNumber}}</span>
      </el-form-item>
      <el-form-item label="有效期：">
        <div v-if="where === 'print'">
          <el-date-picker placeholder="请选择日期" v-model="authUserInfo.startDate" type="date" value-format='yyyy-MM-dd' :picker-options="{disabledDate}"></el-date-picker>
          &nbsp;至&nbsp;
          <el-date-picker placeholder="请选择日期" v-model="authUserInfo.endDate" type="date" value-format='yyyy-MM-dd'></el-date-picker>
        </div>
        <span v-else>{{authUserInfo.startDate}} 至 {{authUserInfo.endDate}}</span>
      </el-form-item>
      <el-form-item label="发证机关：">
        <el-input placeholder="请输入发证机关" v-model="authUserInfo.issued" class="w80per" v-if="where === 'print'"></el-input>
        <span v-else>{{authUserInfo.issued}}</span>
      </el-form-item>
      <el-form-item label="证件照：">
        <div v-if="where === 'print'">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="authUserInfo.idPhoto" :src="(authUserInfo.idPhoto  && authUserInfo.idPhoto.includes('http')) ? authUserInfo.idPhoto : $store.state.configData.imgDomain+authUserInfo.idPhoto+$imgSize[`100x100`]" class="avatar" style="height:100px;width:100px">
            <i style="height:100px;width:100px;line-height:100px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          &nbsp;
          <span class="fc303e">证件照尺寸：102px * 126px</span>
        </div>
        <span v-else><img v-if="authUserInfo.imgStr" :src="['data:image/jpg;base64,']+authUserInfo.imgStr" class="avatarImg"></span>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input placeholder="请输入手机号" type="number" v-model="authUserInfo.phone" class="w230" @mousewheel.native.prevent :disabled="isDisabled"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" :loading="isPending" @click="saveBtn" style="margin-top: 15px">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { mobileReg } from "@utils/index";
import User from "@api/user";
import System from "@api/system";
@Component({
  components: {
  }
})
export default class Companyreg extends Vue {
  @Prop({ default: {} })
  public queryData: object;
  @Prop({ default: "" })
  public where: string;

  loading: boolean = false;
  isPending: boolean = false;
  isDisabled: boolean = false;
  authUserInfo: object = {
    name: "",
    sex: "",
    nation: "",
    birthdayDate: "",
    address: "",
    idNumber: "",
    startDate: "",
    endDate: "",
    issued: "",
    idPhoto: "",
    imgStr: "",
    phone: "",
    hierarchy: "",
    classUserId: "",
  };
  mapObj: object = {
    name: "姓名",
    sex: "性别",
    nation: "民族",
    birthdayDate: "出生日期",
    address: "户籍地址",
    startDate: "完整的有效期",
    endDate: "完整的有效期",
    issued: "发证机关",
    idPhoto: "证件照",
    phone: "手机号",
  };

  created() {
    Object.keys(this.authUserInfo).forEach((i, index) => {
      this.authUserInfo[i] = this.queryData[i]
    })
  }
  disabledDate(time: any){
    return time.getTime() > Date.now();
  }
  // 压缩图片上传
  async upLoad1(e: any) {
    // this.$store.dispatch("setUploadImage", e.file,"/user/user/id", "2")
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "idPhoto");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "idPhoto");
    });
  }
  upLoadImg(file: any, type: string) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/user/user/id");
    System.upload(formData)
      .then(res => {
        this.authUserInfo[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  is(): void {
    for (let i in this.mapObj) {
      if (this.authUserInfo[i] !== 0 && !this.authUserInfo[i]) {
        this.$notify({
          title: "提示",
          message: `请填写/选择${this.mapObj[i]}!`,
          type: "error"
        });
        return false;
      }
    }
    return true;
  }
  saveBtn(): void {
    if (this.where === 'print') {
      if (!this.is()) return;
    }
    if (!mobileReg(this.authUserInfo.phone)) {
      this.$notify({
        title: "提示",
        message: "手机号码不合法！",
        type: "error"
      });
      return;
    }
    this.isAuthSave();
  }
  isAuthSave() {
    this.isPending = true;
    let data = { ...this.authUserInfo };
    if (this.where === "apply") {
      delete data.idPhoto;
    } else if (this.where === "print") {
      delete data.imgStr;
    }
    User.read_idcard_auth({ data })
      .then(res => {
        this.isPending = false;
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "认证成功！",
            type: "success"
          });
          this.$emit("close");
        }
        if (res.code === 2053) {
          this.$confirm("该手机号码已被认证，是否需要系统随机生成手机号码？（也可以自行更换手机号码认证）", "提示", {
            confirmButtonText: "需要",
            cancelButtonText: "不需要",
            type: "warning"
          })
            .then(() => {
              User.generate_phone({ data: {} })
                .then(res => {
                  if (res.code === 0) {
                    this.authUserInfo.phone = res.data;
                    this.isDisabled = true;
                  }
                })
            })
            .catch(() => {
              this.isDisabled = false;
              this.authUserInfo.phone = "";
            });
        }
      })
  }
}
</script>
<style lang="scss" scope>
.avatar-uploader {
  float: left;
}
.avatarImg {
  width: 100px;
  height: auto;
  display: inline-block;
  margin-bottom: 15px;
}
.isShow {
  /deep/ {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>

