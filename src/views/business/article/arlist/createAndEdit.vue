<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="110px" label-position="right">
        <el-form-item label="企业名称 : ">
          <el-select filterable clearable v-model="form.orgId" style="width:99.8%;" @change="getCategory" @visible-change="judgeOrg()">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="文章名称 : ">
          <el-input placeholder="请输入文章名称" v-model="form.articleTitle">
          </el-input>
        </el-form-item>
        <el-form-item label="文章封面 : ">
          
          <!-- 封面一 -->
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.articleImg" :src="(form.articleImg  && form.articleImg.includes('http')) ? form.articleImg : $store.state.configData.imgDomain+form.articleImg+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <!-- 封面二 -->
          <el-upload action="" :show-file-list="false" :http-request="upLoad2" accept="image/jpeg,image/jpg,image/png" v-loading="upLoading2" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.articleImg2" :src="(form.articleImg2  && form.articleImg2.includes('http')) ? form.articleImg2 : $store.state.configData.imgDomain+form.articleImg2+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <!-- 封面三 -->
          <el-upload action="" :show-file-list="false" :http-request="upLoad3" accept="image/jpeg,image/jpg,image/png" v-loading="upLoading3" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.articleImg3" :src="(form.articleImg3  && form.articleImg3.includes('http')) ? form.articleImg3 : $store.state.configData.imgDomain+form.articleImg3+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fc303e">封面尺寸：640px*360px</span>

        </el-form-item>
        
        <el-form-item label="文章分类 : ">
          <el-cascader :options="articleClassify" :props="keyName" v-model="categoryId" @change="ClassifyId" change-on-select clearable style="width:99.8%;"></el-cascader>
        </el-form-item>

        <el-form-item label="可见范围 : ">
          <el-radio-group v-model="form.visibleRange">
            <el-radio :label="1">仅自己</el-radio>
            <el-radio :label="2">本企业</el-radio>
            <el-radio :label="3">开放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示报名 : ">
          <el-radio-group v-model="form.isOpenReg">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="报名截止时间 : " v-show="form.isOpenReg === true">
          <el-date-picker :default-value="new Date()" v-model="form.regEndTime" type="date" placeholder="请选择报名截止时间" value-format="yyyy-MM-dd 23:59:59" style="width:99.8%;"></el-date-picker>
          <el-form-item label="需填报名信息">
            <el-checkbox-group v-model="form.regInfo">
              <el-checkbox label="姓名" disabled></el-checkbox>
              <el-checkbox label="手机号码" disabled></el-checkbox>
              <el-checkbox label="身份证号"></el-checkbox>
              <el-checkbox label="职务"></el-checkbox>
              <el-checkbox label="企业名称"></el-checkbox>
              <el-checkbox label="相关附件"></el-checkbox>
              <el-checkbox label="备注"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="上传附件模板" v-if="form.regInfo.includes('相关附件')">
            <el-upload action="" :show-file-list="isOk" :on-remove="remove" :http-request="upLoad_file" :file-list="fileList" :on-change="handleChange" :on-success="handleSuccess" class="upload-demo" accept=".doc, .docx, .xls, .xlsx">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传word、excel文件</div>
            </el-upload>
          </el-form-item>
        </el-form-item>
        <el-form-item label="内容 ：">

          <add-edit :placeholder="'请输入文章内容'" :htmlStr="intro ? intro : ''" ref="addEditRefArlist"></add-edit>

        </el-form-item>
        <el-form-item label=" " label-width="120px">
          <el-button type="primary" :loading="isPending" @click="saveBtn">确定</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog
      width="30%"
      title="提示"
      :visible.sync="isOrg"
      append-to-body>
      <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建文章哦！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOrg = false">取 消</el-button>
        <el-button type="primary" @click="isOrg = false;apply()">完善信息</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    职位管理
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:职位管理
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
import { emptyLast } from "@utils/index";
import Article from "@api/article";
import Category from "@api/category";
import System from "@api/system";
import Org from "@api/org";

//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "add-edit": () => import ("@c/addEdit.vue")
  },
  props: {
    workNatureArr: {
      type: Array
    },
    stateArr: {
      type: Array
    }
  }
})
//CE = createAndEdit
export default class CreateAndEdit extends Vue {
  @Prop({ default: "" })
  public title: any;
  @Prop({ default: {} })
  public queryData: any;
  articleClassify: any[] = [];
  keyName: object = {
    label: "categoryTitle",
    value: "categoryId"
  };
  orgListId: any[] = [];
  categoryId: any = [];
  form: any = {
    orgId: "",
    intro: "",
    articleTitle: "",
    visibleRange: 3,
    isOpenReg: false,
    regInfo: ["姓名", "手机号码"],
    articleImg: "",
    articleImg2: "",
    articleImg3: "",
    regTemplate: "",
    regEndTime: "",
    categoryId: "",
    isRecommend: 0,
    categoryTitle: ""
  };
  params = {
    pageSize: 99,
    pageNum: 1,
    orgId: ""
  };
  isPending: boolean = false;
  upLoading1: boolean = false;
  upLoading2: boolean = false;
  upLoading3: boolean = false;
  isOk: boolean = true;
  isOrg: boolean = false;
  fileUrl1: string = "";
  categoryTitle: string = "";
  fileList: any[] = [];

  intro: string = "";

  created() {
    if (this.title.title == "编辑文章") {
      this.form.orgId = this.queryData.orgId;
      this.intro = this.form.intro = this.queryData.intro;
      this.form.articleTitle = this.queryData.articleTitle;
      this.form.articleImg = this.queryData.articleImg;
      this.form.articleImg2 = this.queryData.articleImg2;
      this.form.articleImg3 = this.queryData.articleImg3;
      this.form.visibleRange = this.queryData.visibleRange;
      this.form.isOpenReg = this.queryData.isOpenReg;
      this.form.regTemplate = this.queryData.regTemplate;
      if (this.queryData.regEndTime) {
        this.form.regEndTime = this.$formatDate(this.queryData.regEndTime);
      } else {
        this.form.regEndTime = this.$formatDate(new Date().getTime());
      }
      this.form.regInfo = this.queryData.regInfo.split(",");
      if (this.queryData.fileUrl) {
        this.fileList = [{ name: '文件', url: this.queryData.fileUrl }]
      }
      this.form.categoryTitle = this.queryData.categoryTitle;
      this.form.categoryId = this.queryData.categoryId;
    }
    this.getCategory();
    this.getOrgList();
  }
  getCategory() {
    let data = {
      orgId: this.form.orgId
    };
    Category.category_list_article({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        this.articleClassify = res.data;
        if (this.title.title == "编辑文章") {
          this.categoryId = [
            ...this.$getFather(
              this.articleClassify,
              this.articleClassify,
              this.queryData.categoryId
            ),
            this.queryData.categoryId
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
        this.$emit("close");
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
      this.form.categoryId = "" + e;
      let len: any = this.articleClassify;
      this.selectClone(len, e[e.length - 1]);
      this.form.categoryTitle = this.categoryTitle;
    } else {
      this.form.categoryId = "";
      this.form.categoryTitle = "";
    }
  }
  remove() {
    this.fileUrl1 = "";
    this.form.regTemplate = "";
    this.form.fileUrl = "";
    this.fileList = [];
  }
  handleChange(file: any, fileList: any) {
    if (fileList.length > 1) {
      fileList.splice(0, 1);
    }
  }
  handleSuccess(e: any) {
    if (e.code === 0) {
      if (e.data.code === 9999) {
        this.$notify({
          title: "警告",
          type: "error",
          message: "请上传正确的文件格式!"
        });
        this.isOk = false;
        return false;
      }
      this.fileUrl1 = e.data.fileUrl_1;
      this.isOk = true;
    }
  }

  // 压缩图片上传
  async upLoad1(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "articleImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "articleImg");
    });
  }

  async upLoad2(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "articleImg2");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "articleImg2");
    });
  }

  async upLoad3(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "articleImg3");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "articleImg3");
    });
  }

  upLoadImg(file: any, type: string) {
    //this.upLoading["type"] = true;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "1");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/article/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }

  upLoad_file(e: any) {
    // return;
    let formData = new FormData();
    let { token } = this.$store.state.userInfo;
    formData.append("file", e.file);
    formData.append("uploadType", "3");
    formData.append("token", token);
    formData.append("path", "/article/file");
    System.upload(formData)
      .then(res => {
        this.form.regTemplate = res.data.url;
        this.form.fileUrl = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  is() {
    if (this.form.articleTitle.length <= 0 || this.form.articleTitle.length > 60 || this.form.articleTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "文章名称字数在1-30且不能有空格"
      });
      return false;
    } else if (this.form.orgId === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请选择企业"
      });
      return false;
    } else if (this.form.isOpenReg == true && this.form.regEndTime === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请选择报名截止时间"
      });
      return false;
    } else if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入文章内容"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn() {
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
    data.regInfo = "" + this.form.regInfo;
    if (this.title.title === "创建文章") {
      Article.create_article_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `操作成功！`,
              type: "success"
            });
            this.$emit("saveBtn_success");
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      data.articleId = this.queryData.articleId;
      Article.update_article_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `操作成功！`,
              type: "success"
            });
            this.$emit("saveBtn_success");
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
  }
  .avatar-uploader {
    float: left;
    margin-right: 50px;
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

