<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="150px" label-position="right">
        <el-form-item label="培训工种：">
          <el-input placeholder="请输入培训工种" v-model="form.trainMajor" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="专业级别：">
          <el-input placeholder="请输入专业级别" v-model="form.majorLevel" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="证书编号：">
          <el-input placeholder="请输入证书编号" v-model="form.certNumber" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="证书扫描件：">
          <el-upload list-type="picture-card" action="" :http-request="upLoad1" :file-list="imgList" :on-preview="handlePictureCardPreview" :on-remove='removeImg' accept=".gif,.jpeg,.jpg,.png" v-loading="upLoading" element-loading-text="上传中..." class="avatar-uploader" :class="imgList.length != 0 ? 'none' : ''">
            <img width="100%" :src="dialogImageUrl" alt="">
            <i class="el-icon-plus"></i>
          </el-upload>
          &nbsp;
          <span class="fc303e">(选填)</span>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click="saveBtn">确定</el-button>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Teacher from "@api/otherAll";
import System from "@api/system";

@Component({
  components: {
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: {} })
  public queryData: any;

  form: any = {
    teacherId: this.queryData.teacherId,
    teacherMajorId: this.queryData.teacherMajorId,
    trainMajor: "",
    majorLevel: "",
    certNumber: "",
    certImg: ""
  };
  mapObj = {
    trainMajor: "培训工种",
    majorLevel: "专业级别",
    certNumber: "证书编号"
  };
  upLoading: boolean = false;
  isPending: boolean = false;
  intro: string = "";
  process: number = 0;
  dialogVisible: boolean = false;
  dialogImageUrl: string = "";
  imgList: any[] = [];
  imgUrl: string = "";

  created() {
    this.init();
  }
  init () {
    if (this.queryData.teacherMajorId) {
      let data = {
        teacherMajorId: this.queryData.teacherMajorId
      }
      Teacher.query_teacher_major_admin({ data })
        .then(res => {
          if (res.code === 0) {
            Object.keys(this.form).forEach((i, index) => {
              this.form[i] = res.data[i];
            });
            this.imgList = this.form.certImg ? [{ name: "图片", url: this.$store.state.configData.imgDomain + this.form.certImg + this.$imgSize[`100x100`] }] : [];
            this.imgUrl = this.form.certImg;
            this.queryData.state == 4 ? this.isDisabled = true : this.isDisabled = false;
          }
        })
    } else {
      this.form = {
        teacherId: this.queryData.teacherId,
        teacherMajorId: this.queryData.teacherMajorId,
        trainMajor: "",
        majorLevel: "",
        certNumber: "",
        certImg: ""
      };
    }
  }
  is() {
    this.form.certImg = this.imgUrl;
    for (let i in this.mapObj) {
      if (this.form[i] !== 0 && !this.form[i]) {
        this.$notify({
          title: "提示",
          message: `请填写${this.mapObj[i]}!`,
          type: "error"
        });
        return false;
      }
    }
    return true;
  }
  saveBtn() {
    if (!this.is()) return;
    this.isPending = true;
    let data = { ...this.form };
    if (!this.queryData.teacherMajorId) {
      Teacher.create_teacher_major_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      Teacher.update_teacher_major_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  // 压缩图片上传
  async upLoad1(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "certImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "certImg");
    });
  }
  upLoadImg(file: any, type: string) {
    this.upLoading = true;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/publics/teacher/major/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
        this.imgList = [{ name: "图片", url: this.$store.state.configData.imgDomain + res.data.url + this.$imgSize[`100x100`] }];
        this.imgUrl = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  removeImg() {
    this.imgList = [];
    this.imgUrl = "";
  }
  handlePictureCardPreview(file: any) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  }
}
</script>
<style lang="scss" scoped>
.avatar-uploader {
  display: inline-block;
  /deep/ {
    .el-upload--picture-card {
      background-color: #fff;
    }
  }
}
.none {
  /deep/ {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>