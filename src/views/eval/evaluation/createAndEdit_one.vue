<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="120px" label-position="right">
        <el-form-item label="企业名称 : ">
          <el-select filterable clearable v-model="form.orgId" class="w80per" @visible-change="judgeOrg()" :disabled="disabledEdit">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
           <!-- @change="getCategory" -->
        </el-form-item>
        <el-form-item label="测评标题 : ">
          <el-input placeholder="请输入测评标题" v-model="form.evalTitle" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="测评封面 : ">
          <el-upload action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.evalImg" :src="(form.evalImg  && form.evalImg.includes('http')) ? form.evalImg : $store.state.configData.imgDomain+form.evalImg+$imgSize[`100x100`]" class="avatar" style="height:100px;width:160px">
            <i style="height:100px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="fc303e">（选填）</span>
          <span class="fc303e">封面尺寸：640px*360px</span>
        </el-form-item>
        <el-form-item label="测评类型 : ">
          <el-input placeholder="请输入测评类型" v-model="form.type" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="测评接口地址 : ">
          <el-input placeholder="请输入测评接口地址" v-model="form.api" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="可见范围 : ">
          <el-radio-group v-model="form.visibleRange">
            <el-radio :label="1">仅自己</el-radio>
            <el-radio :label="2">本企业</el-radio>
            <el-radio :label="3">开放</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="测评分类 : ">
          <el-cascader :options="classifyList" :props="keyName" v-model="categoryId" @change="ClassifyId" :show-all-levels="false" change-on-select clearable class="w80per"></el-cascader>
        </el-form-item> -->

        <!-- <el-form-item label="原价 : ">
          <el-input placeholder="请输入原价" v-model="form.originalPrice" class="w80per"></el-input>
        </el-form-item>
        
        <el-form-item label="现价/优惠价 : ">
          <el-input placeholder="请输入现价/优惠价" v-model="form.price" class="w80per"></el-input>
        </el-form-item> -->

        <el-form-item label="测评简介 : ">
          <add-edit v-if="showIntro" :placeholder="'请输入测评简介'" :htmlStr="intro ? intro : ''" ref="addEditRefArlist"></add-edit>
          <!-- <span class="fc303e"> *必填</span> -->
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建测评哦！</span>
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
import Eval from "@api/eval";
import Category from "@api/category";
import System from "@api/system";
import Org from "@api/org";

@Component({
  components: {
    "add-edit": () => import ("@c/addEdit.vue")
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: "" })
  public title: string;
  @Prop({ default: {} })
  public queryData: object;
  classifyList: any[] = [];
  keyName: object = {
    label: "categoryTitle",
    value: "categoryId"
  };
  orgListId: any[] = [];
  categoryId: any = [];
  form: any = {
    orgId: this.$store.state.userInfo.org.orgId,
    evalId: this.queryData.evalId,
    evalTitle: "",
    evalImg: "",
    visibleRange: 2,
    intro: ""
  };
  mapObj = {
    orgId: "企业名称",
    evalTitle: "测评标题"
  };
  isPending: boolean = false;
  upLoading1: boolean = false;
  isOrg: boolean = false;
  fileUrl1: string = "";
  categoryTitle: string = "";
  showIntro: boolean = true;
  time: string[] = [];
  disabledEdit: boolean = false;
  intro: string = "";

  created() {
    this.init();
    this.getOrgList();
  }
  init () {
    if (this.queryData.evalId) {
      this.disabledEdit = true;
      let data = {
        evalId: this.queryData.evalId
      }
      Eval.query_evaluation({ data })
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
          }
        })
        .finally(() => {

        });
    } else {
      // this.getCategory();
    }
  }
  getCategory() {
    let data = {
      orgId: this.form.orgId
    };
    Category.category_list_eval({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        let data = this.$store.state.evalData;
        data.classify = res.data;
        this.$store.commit('setEvalData', data)
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
    } else {
      this.form.categoryId = "";
    }
  }
  // 压缩图片上传
  async upLoad1(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "evalImg");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "evalImg");
    });
  }

  upLoadImg(file: any, type: string) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/eval/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  is() {
    if (this.form.evalTitle.length <= 0 || this.form.evalTitle.length > 30 || this.form.evalTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "测评标题字数在1-30且不能有空格"
      });
      return false;
    } else if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入测评简介"
      });
      return false;
    } else {
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
    let str = this.$refs.addEditRefArlist.getHtmlText();
    this.form.intro = encodeURIComponent(str.replace(/http:/g, "https:")
      .replace(/section/g, "div")
      .replace(/strong/g, "div")
      .replace(/footer/g, "div")
      .replace(/\<img/g, '<img style="max-width:100%;height:auto"')
    )
    let data = { ...this.form };
    if (this.title === "创建测评") {
      Eval.create_evaluation_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOneOver");
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      delete data.orgId;
      Eval.update_evaluation_admin({ data })
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

