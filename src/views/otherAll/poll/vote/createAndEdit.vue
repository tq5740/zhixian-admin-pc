<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="150px" label-position="right">
        <el-form-item label="投票对象标题：">
          <el-input placeholder="请输入投票对象标题" v-model="form.pollObjTitle" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="上传图片：" v-if="videoList.length === 0">
          <el-upload list-type="picture-card" action="" :http-request="upLoad1" :file-list="imgList" :on-preview="handlePictureCardPreview" :on-remove='removeImg' accept=".gif,.jpeg,.jpg,.png" v-loading="upLoading" element-loading-text="上传中..." class="avatar-uploader" :class="imgList.length != 0 ? 'none' : ''" :disabled="isDisabled">
            <img width="100%" :src="dialogImageUrl" alt="">
            <i class="el-icon-plus"></i>
          </el-upload>
          &nbsp;
          <span class="fc303e" v-if="!isDisabled">（图片和视频只能上传一个，如需上传视频请删除图片）</span>
        </el-form-item>
        <el-form-item label="上传视频：" v-if="imgList.length === 0">
          <el-upload style="display: inline-flex;" :http-request="upVideo" action="" accept=".mp4,.m3u8" :file-list="videoList" :on-remove='removeVideo' :disabled="isDisabled">
            <el-button size="small" type="primary">上传视频</el-button>
          </el-upload>
          &nbsp;
          <span class="fc303e" v-if="!isDisabled">只支持mp4、m3u8格式的视频（图片和视频只能上传一个，如需上传图片请删除视频）</span>
          <el-progress v-if="process > 0 && process < 100" :percentage="process" color="#FF9012" style="margin-top: 10px;"></el-progress>
        </el-form-item>
        <el-form-item label="投票对象简介：">
          <add-edit v-if="showIntro" :placeholder="'请输入投票对象简介'" :htmlStr="intro ? intro : ''" ref="addEditRefArlist"></add-edit>
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
import Poll from "@api/otherAll";
import System from "@api/system";

@Component({
  components: {
    "add-edit": () => import ("@c/addEdit.vue")
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: {} })
  public queryData: any;

  form: any = {
    pollId: this.queryData.pollId,
    pollObjId: this.queryData.pollObjId,
    pollObjTitle: "",
    pollObjImg: "",
    intro: ""
  };
  mapObj = {
    pollObjTitle: "投票对象标题",
    pollObjImg: "投票对象图片/视频地址"
  };
  upLoading: boolean = false;
  isPending: boolean = false;
  showIntro: boolean = true;
  intro: string = "";
  process: number = 0;
  videoList: any[] = [];
  dialogVisible: boolean = false;
  dialogImageUrl: string = "";
  only: boolean = true;
  imgList: any[] = [];
  imgUrl: string = "";
  isDisabled: boolean = false;

  created() {
    this.init();
  }
  disabledDate(time: any){
    return time.getTime() < Date.now() - 8.64e7;
  }
  init () {
    if (this.queryData.pollObjId) {
      let data = {
        pollObjId: this.queryData.pollObjId
      }
      Poll.query_poll_obj_admin({ data })
        .then(res => {
          if (res.code === 0) {
            Object.keys(this.form).forEach((i, index) => {
              this.form[i] = res.data[i];
            });
            this.intro = this.form.intro;
            if (this.form.pollObjImg && this.form.pollObjImg.includes("http")) {
              this.videoList = [{ name: "视频", url: this.form.pollObjImg }];
            } else {
              this.imgList = this.form.pollObjImg ? [{ name: "图片", url: this.$store.state.configData.imgDomain + this.form.pollObjImg + this.$imgSize[`100x100`] }] : [];
              this.imgUrl = this.form.pollObjImg;
            }
            this.queryData.state == 4 ? this.isDisabled = true : this.isDisabled = false;
            this.showIntro = false;
            this.$nextTick(() => {
              this.showIntro = true;
            })
          }
        })
    } else {
      this.form = {
        pollId: this.queryData.pollId,
        pollObjId: this.queryData.pollObjId,
        pollObjTitle: "",
        pollObjImg: "",
        intro: ""
      };
    }
  }
  is() {
    this.form.pollObjImg = (this.videoList.length != 0 && this.videoList[0].url) || (this.imgList.length != 0 && this.imgUrl);
    if (this.form.pollObjTitle.length <= 0 || this.form.pollObjTitle.length > 30 || this.form.pollObjTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "投票标题字数在1-30且不能有空格"
      });
      return false;
    } else if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入投票对象简介"
      });
      return false;
    } else {
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
    }
    return true;
  }
  saveBtn() {
    if (!this.is()) return;
    this.isPending = true;
    let str = this.$refs.addEditRefArlist.getHtmlText();
    this.form.intro = encodeURIComponent(str.replace(/http:/g, "https:")
      .replace(/section/g, "div")
      .replace(/strong/g, "div")
      .replace(/footer/g, "div")
      .replace(/\<img/g, '<img style="max-width:100%;height:auto"')
    )
    let data = { ...this.form };
    if (!this.queryData.pollObjId) {
      Poll.create_poll_obj_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      Poll.update_poll_obj_admin({ data })
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
    if (this.videoList.length != 0) {
      this.$notify({
        type: `warning`,
        title: "提示",
        message: `图片和视频只能上传一种，请删除视频后再上传图片！`
      });
      return;
    }
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "pollObjImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "pollObjImg");
    });
  }
  upLoadImg(file: any, type: string) {
    this.upLoading = true;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/publics/poll/obj/img");
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
  upVideo(e: any) {
    const loading = this.$loading({
      lock: true,
      text: '正在上传视频，请耐心等待~',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    let videoFile = e.file;
    let _this = this;
    _this.tcVod = new TcVod.default({
      getSignature: _this.getSignature
    });
    _this.uploader = _this.tcVod.upload({
      mediaFile: videoFile
    });
    _this.uploader.on("media_progress", function(info) {
      _this.process = Math.floor(info.percent * 100);
    });
    _this.uploader.done()
      .then(function(doneResult) {
        _this.$notify({
          type: `success`,
          title: "提示",
          message: `上传成功!`
        });
        _this.process = 100;
        _this.videoList = [{ name: "视频", url: doneResult.video.url }];
      })
      .catch(function(err) {
        _this.$notify({
          type: `error`,
          title: "提示",
          message: `上传失败，请检查网络环境!`
        });
        _this.process = 0;
      })
      .finally(() => {
        loading.close();
      });
  }
  getSignature() {
    return System.getVodsign({ data: {} }).then(res => {
      return res.data;
    });
  }
  removeImg() {
    this.imgList = [];
    this.imgUrl = "";
  }
  removeVideo() {
    this.videoList = [];
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