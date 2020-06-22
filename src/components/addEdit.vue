<template>
  <div id="addEdit">
    <div id="summernote"></div>
  </div>
</template>


<script>
import System from "@api/system";
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入内容"
    },
    // path: {
    //   type: String,
    //   default: "/intro"
    // },
    htmlStr: {
      type: String,
      default: ""
    }
  },
  mounted() {
    var _this = this;
    var $summernote = $("#summernote").summernote({
      lang: "zh-CN",
      placeholder: this.placeholder,
      height: 400,
      maxHeight: 400,
      minHeight: 400,
      //调用图片上传
      callbacks: {
        onImageUpload: function (files) {
          _this.sendFile($summernote, files[0]);
        }
      }
    });
    $('#summernote').summernote('code', decodeURIComponent(this.htmlStr));
  },
  methods: {
    // 获取html文本
    getHtmlText() {
      return $('#summernote').summernote('code');
    },
    // 销毁编辑器
    destroyEdit() {
      $('#summernote').summernote('destroy');
    },
    // 压缩图片上传
    sendFile($summernote, file) {
      if (file.size < 2097152 || file.type === "image/gif") {
        this.LoadImg($summernote, file);
        return;
      }
      Lrz(file, { width: 800, quality: 0.9 }).then(rst => {
        this.LoadImg($summernote, rst.file);
      });
    },
    LoadImg($summernote, file) {
      let formData = new FormData();
      formData.append('file', file);
      formData.append('uploadType', 2);
      formData.append("token", this.$store.state.userInfo.token);
      formData.append("path", "/intro");
      System.upload(formData)
        .then(res => {
          if (res.code === 0) {
            let imgNode = document.createElement("img");
            imgNode.src = this.$store.state.configData.imgDomain + res.data.url + "/800";
            $summernote.summernote('insertNode', imgNode);
            this.$notify({
              type: `success`,
              title: '提示',
              message: `图片上传成功...`
            });
          } else {
            this.$notify({
              type: `error`,
              title: '提示',
              message: `图片上传失败...`
            });
          }
        })
    }
  }
}
</script>
<style lang="scss">
  .note-image-popover,
  [role="tooltip"] {
    z-index: 9999 !important;
  }
  .note-editor img {
    max-width: 100% !important;
  }
</style>

