<template>
  <div>
    <span class="tips-span">温馨提示：鼠标滚轮可以放大或缩小图片</span>
    <div class="cropper-content">
      <div class="cropper">
        <vueCropper ref="cropper" :centerBox="false" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" @realTime="realTime" @imgLoad="imgLoad"></vueCropper>
      </div>
      <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden', 'margin': '5px'}">
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img">
        </div>
      </div>
    </div>

    <div class="footer-btn">
      <div class="scope-btn">
        <label for="uploads" class="label-success">选择图片</label>
        <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
        <el-button style="margin-left: 100px;" type="primary" @click="rotateLeft">
          <span style="font-weight: 600;">↺</span>
        </el-button>
        <el-button type="primary" @click="rotateRight">
          <span style="font-weight: 600;">↻</span>
        </el-button>
      </div>
      <div class="upload-btn">
        <el-button :loading="isLoading" style="margin-left:20px" type="success" :style="'margin-left: 46px'" @click="down('base64')">完成上传</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import VueCropper from '@c/vueCropper/vue-cropper.vue'
export default {
  data() {
    return {
      crap: false,
      previews: {},
      option: {
        img: "",
        size: 1,
        full: false,
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      downImg: '#',
      isLoading: false
    }
  },
  components: { VueCropper },
  methods: {
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    finish(type) {
      // 输出
      // var test = window.open('about:blank')
      // test.document.body.innerHTML = '图片生成中..'
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          var img = window.URL.createObjectURL(data)
          this.model = true
          this.modelSrc = img
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    // 实时预览函数
    realTime(data) {
      this.previews = data
    },
    convertBase64UrlToBlob(urlData) {
      let bytes = window.atob(urlData.split(',')[1]);//去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/jpeg' });
    },
    down(type) {
      // event.preventDefault()
      if (!this.option.img) {
        this.$notify({
          title: "提示",
          message: `你没有选择图片！`,
          type: "error"
        });
        return;
      }
      this.isLoading = true;
      var aLink = document.createElement('a')
      aLink.download = 'author-img'
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          this.downImg = window.URL.createObjectURL(data)
          aLink.href = window.URL.createObjectURL(data)
          aLink.click()
        })
      } else {
        this.$refs.cropper.getCropData(data => {
          this.downImg = data
          this.$emit("getImgFile", this.convertBase64UrlToBlob(data))
        })
      }
    },
    uploadImg(e, num) {
      //上传图片
      // this.option.img
      var file = e.target.files[0]
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$notify({
          title: "提示",
          message: `请选择正确的图片格式！`,
          type: "error"
        });
        return false
      }
      var reader = new FileReader()
      reader.onload = e => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          this.option.img = data
        } else if (num === 2) {
          this.example2.img = data
        }
      }
      // 转化为base64
      reader.readAsDataURL(file)
      // 转化为blob
      // reader.readAsArrayBuffer(file)
    },
    imgLoad(msg) {
      console.log(msg)
    }
  }
}
</script>
<style lang="scss">
  .tips-span {
    color: #fc703e;
    position: absolute;
    top: 50px;
  }
  .cropper-content {
    position: relative;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .cropper {
      width: 350px;
      height: 300px;
    }
    .show-preview {
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
      .preview {
        overflow: hidden;
        border-radius: 50%;
        border: 1px solid #cccccc;
        background: #cccccc;
        margin-left: 40px;
      }
    }
  }
  .footer-btn {
    margin-top: 30px;
    display: flex;
    display: -webkit-flex;
    justify-content: flex-end;
    -webkit-justify-content: flex-end;
    .scope-btn {
      width: 350px;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;
    }
    .upload-btn {
      flex: 1;
      -webkit-flex: 1;
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
    }
  }
  .label-success {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: rgb(103, 194, 58) !important;
    border-color: rgb(103, 194, 58) !important;
  }
  .label-success:hover {
    background-color: rgb(133, 206, 97) !important;
    border-color: rgb(133, 206, 97) !important;
  }
</style>