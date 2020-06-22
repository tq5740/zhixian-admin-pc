<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="110px" label-position="left">
        <el-form-item label="企业名称 : ">
          <el-select style="width:500px;" filterable clearable v-model="form.orgId" @change="getCategory" @visible-change="judgeOrg()" :disabled="orgDisabled">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程标题 : ">
          <el-input placeholder="请输入课程标题" v-model="form.courseTitle" style="width:500px;"></el-input>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>

        <el-form-item label="课程封面 : ">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.courseImg" :src="(form.courseImg  && form.courseImg.includes('http')) ? form.courseImg : $store.state.configData.imgDomain+form.courseImg+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fc303e">（选填）</span>
          <span class="fc303e">封面尺寸：640px*360px</span>
        </el-form-item>

        <el-form-item label="可见范围 : ">
          <el-radio-group v-model="form.visibleRange">
            <el-radio :label="1">仅自己</el-radio>
            <el-radio :label="2">本企业</el-radio>
            <el-radio :label="3">开放</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="课程分类 : ">
          <el-cascader :options="classifyList" :props="keyName" v-model="categoryId" @change="ClassifyId" :show-all-levels="false" change-on-select clearable style="width:500px;"></el-cascader>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>

        <el-form-item label="讲师 : ">
          <el-input placeholder="请输入讲师姓名" v-model="form.lecturer" style="width:500px;">
          </el-input>
        </el-form-item>

        <el-form-item label="原价 : ">
          <el-input placeholder="请输入原价" v-model="form.originalPrice" style="width:500px;"></el-input>
        </el-form-item>
        
        <el-form-item label="现价/优惠价 : ">
          <el-input placeholder="请输入现价/优惠价" v-model="form.price" style="width:500px;"></el-input>
        </el-form-item>

        <el-form-item label="课程简介 : ">
          <add-edit v-if="showIntro" :placeholder="'请输入课程简介'" :htmlStr="intro ? intro : ''" ref="addEditRefArlist"></add-edit>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>
        <el-form-item label=" " label-width="120px">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建课程哦！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isOrg = false">取 消</el-button>
          <el-button type="primary" @click="isOrg = false;apply()">完善信息</el-button>
        </span>
      </el-dialog>
    </el-row>

  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { emptyLast } from "@utils/index";
import Course from "@api/train";
import Category from "@api/category";
import System from "@api/system";
import Org from "@api/org";

//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "add-edit": () => import ("@c/addEdit.vue")
  }
})
//CE = createAndEdit
export default class CreateAndEdit extends Vue {
  @Prop({ default: "" })
  public title: any;
  @Prop({ default: {} })
  public queryData: any;
  classifyList: any[] = [];
  keyName: object = {
    label: "categoryTitle",
    value: "categoryId"
  };
  orgListId: any[] = [];
  categoryId: any = [];
  form: any = {
    orgId: this.$store.state.userInfo.org.orgId,
    courseId: this.$store.state.courseData.id,
    courseTitle: "",
    courseImg: "",
    visibleRange: 3,
    categoryId: "",
    lecturer: "",
    originalPrice: "0",
    price: "0",
    intro: ""
  };
  intro: string = "";
  isPending: boolean = false;
  upLoading: boolean = false;
  isOrg: boolean = false;
  fileUrl1: string = "";
  categoryTitle: string = "";
  showIntro: boolean = true;
  orgDisabled: boolean = false;

  created() {
    this.init();
    this.getOrgList();
  }
  init () {
    if (this.$store.state.courseData.id) {
      this.orgDisabled = true;
      let data = {
        courseId: this.$store.state.courseData.id
      }
      Course.query_course_admin({ data })
        .then(res => {
          if (res.code === 0) {
            Object.keys(this.form).forEach((i, index) => {
              this.form[i] = res.data[i];
            });
            this.intro = this.form.intro;
            this.showIntro = false;
            this.$nextTick(()=>{
              this.showIntro = true;
            })
            this.getCategory();
          }
        })
        .finally(() => {

        });
    } else {
      this.getCategory();
    }
  }
  getCategory() {
    let data = {
      orgId: this.form.orgId
    };
    Category.category_list_course({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        let data = this.$store.state.courseData;
        data.classify = res.data;
        this.$store.commit('setCourseData', data)
        this.classifyList = res.data;
        if (this.form.categoryId) {
          this.categoryId = [
            ...this.$getFather(
              this.classifyList,
              this.classifyList,
              this.form.categoryId
            ),
            this.form.categoryId
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
      this.form.categoryId = "" + e[e.length - 1];
      let len: any = this.classifyList;
      this.selectClone(len, e[e.length - 1]);
      this.form.categoryTitle = this.categoryTitle;
    } else {
      this.form.categoryId = "";
      this.form.categoryTitle = "";
    }
  }

  // 压缩图片上传
  async upLoad1(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "courseImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "courseImg");
    });
  }

  upLoadImg(file: any, type: string) {
    this.upLoading = true;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/train/course/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }

  is() {
    if (this.form.courseTitle.length <= 0 || this.form.courseTitle.length > 30 || this.form.courseTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "课程标题字数在1-30且不能有空格"
      });
      return false;
    } else if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入课程简介"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn_one() {
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
    if (!this.$store.state.courseData.id) {
      Course.create_course_admin({ data })
        .then(res => {
          if (res.code === 0) {
            if (!this.$store.state.courseData.id) {
              let arr = this.$store.state.courseData;
              arr.id = res.data;
              this.$store.commit('setCourseData', arr);
            }
            this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      delete data.orgId;
      Course.update_course_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          loading.close();
        });
    }
  }
  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
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
    .fc303e{
      margin-left: 10px;
    }
  }
  .avatar-uploader {
    float: left;
    margin-right: 50px;
  }
  .mg-top20{
    margin-top: 20px;
  }
  /deep/ {
    .el-progress{
      margin-left: 10px;
      width: 150px;
      display: inline-block;
    }
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

