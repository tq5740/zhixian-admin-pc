<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="150px" label-position="right">
        <el-form-item label="企业名称：">
          <el-select filterable clearable v-model="form.orgId" class="w70per" @change="getCategory" @visible-change="judgeOrg()" :disabled="disabledEdit">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
          &nbsp;
          <span class="fc303e">*必填</span>
        </el-form-item>
        <el-form-item label="讲师名称：">
          <el-input placeholder="请输入讲师名称" v-model="form.teacherName" class="w400" :disabled="disabledEdit"></el-input>
          <span class="fc303e">*必填</span>
        </el-form-item>
        <el-form-item label="讲师照片：">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.teacherImg" :src="(form.teacherImg  && form.teacherImg.includes('http')) ? form.teacherImg : $store.state.configData.imgDomain+form.teacherImg+$imgSize[`100x100`]" class="avatar" style="height:100px;width:100px">
            <i style="height:100px;width:100px;line-height:100px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fc303e">照片尺寸：800px*450px</span>
        </el-form-item>
        <el-form-item label="讲师分类：">
          <el-cascader :options="classifyList" :props="keyName" v-model="categoryId" @change="ClassifyId" :show-all-levels="false" change-on-select clearable class="w400"></el-cascader>
          <el-button type="primary" style="margin-left: 20px" @click.native="showCategory = true">管理分类</el-button>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input placeholder="请输入手机号码" type="number" v-model="form.phone" class="w400" @mousewheel.native.prevent></el-input>
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input placeholder="请输入身份证号" type="text" v-model="form.idCard" class="w400" @focus="form.idCard = ''"></el-input>
        </el-form-item>
        <el-form-item label="职称：">
          <el-input placeholder="请输入讲师职称" v-model="form.academicTitle" class="w400"></el-input>
        </el-form-item>
        <el-form-item label="所在单位：">
          <el-input placeholder="请输入讲师所在单位" v-model="form.school" class="w400"></el-input>
          <span class="fc303e">*必填</span>
        </el-form-item>
        <el-form-item label="单位性质：">
          <el-radio-group placeholder="请选择单位性质" v-model="form.nature" class='w500'>
            <el-radio value="公办" label="公办"></el-radio>
            <el-radio value="民办" label="民办"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="讲师简介：">
          <add-edit v-if="showIntro" :placeholder="'请输入讲师简介'" :htmlStr="intro ? intro : ''" ref="addEditIntro"></add-edit>
          <span class="fc303e">*必填</span>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">{{queryData.showDown ? "下一步" : "确定"}}</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="70%" title="管理分类" v-if="showCategory" :visible.sync="showCategory" append-to-body :before-close="categoryOver">
        <category :queryId="form.orgId"></category>
      </el-dialog>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建讲师哦！</span>
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
import { mobileReg, emptyLast } from "@utils/index";
import Teacher from "@api/otherAll";
import Category from "@api/category";
import System from "@api/system";

@Component({
  components: {
    "add-edit": () => import ("@c/addEdit.vue"),
    "category": () => import ("./teacher_category.vue")
  }
})
export default class CreateAndEdit extends Vue {
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
    teacherId: this.queryData.teacherId,
    teacherName: "",
    teacherImg: "",
    academicTitle: "",
    phone: "",
    school: "",
    categoryId: "",
    nature: "公办",
    idCard: "",
    intro: ""
  };
  mapObj = {
    orgId: "企业名称",
    teacherName: "讲师名称",
    school: "所在单位",
    nature: "单位性质"
  };
  isPending: boolean = false;
  upLoading1: boolean = false;
  isOrg: boolean = false;
  categoryTitle: string = "";
  showIntro: boolean = true;
  disabledEdit: boolean = false;
  intro: string = "";

  showCategory: boolean = false;

  created() {
    this.init();
    this.getOrgList();
  }
  init () {
    if (this.queryData.teacherId) {
      if (this.queryData.state == 4) {
        this.disabledEdit = true;
      }
      let data = {
        teacherId: this.queryData.teacherId
      }
      Teacher.query_teacher_admin({ data })
        .then(res => {
          if (res.code === 0) {
            Object.keys(this.form).forEach((i, index) => {
              this.form[i] = res.data[i];
              this.intro = this.form.intro;
            });
            this.getCategory();
            this.showIntro = false;
            this.$nextTick(()=>{
              this.showIntro = true;
            })
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
    Category.category_list_teacher({ data }).then(res => {
      if (res.code === 0) {
        this.classifyList = res.data;
        emptyLast(this.classifyList);
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
      this.upLoadImg(e.file, "teacherImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "teacherImg");
    });
  }
  upLoadImg(file: any, type: string) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/publics/teacher/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  is() {
    for (let i in this.mapObj) {
      if (this.form[i] !== 0 && !this.form[i]) {
        this.$notify({
          title: "提示",
          message: `请填写/选择${this.mapObj[i]}!`,
          type: "error"
        });
        return false;
      }
    }
    if (this.form.teacherName.length > 10 || this.form.teacherName.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "讲师名称字数在1-10且不能有空格！"
      });
      return false;
    }
    if (this.form.phone != "" && !mobileReg(this.form.phone)) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "手机号码不合法！"
      });
      return false;
    }
    if (this.$refs.addEditIntro.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入讲师简介！"
      });
      return false;
    }
    return true;
  }
  saveBtn_one() {
    if (!this.is()) return;
    const loading = this.$loading({
      lock: true,
      text: '正在保存中，请耐心等待~',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    if (this.form.idCard.includes("*")) {
      delete this.form.idCard
    }
    let str = this.$refs.addEditIntro.getHtmlText();
    this.form.intro = encodeURIComponent(str.replace(/http:/g, "https:")
      .replace(/section/g, "div")
      .replace(/strong/g, "div")
      .replace(/footer/g, "div")
      .replace(/\<img/g, '<img style="max-width:100%;height:auto"')
    )
    let data = { ...this.form };
    if (!this.queryData.teacherId) {
      Teacher.create_teacher_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOverDown", res.data);
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      Teacher.update_teacher_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          loading.close();
        });
    }
  }
  categoryOver() {
    this.showCategory = false;
    this.getCategory();
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
  .w400{
    width: 400px!important;
    margin-right: 10px;
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

