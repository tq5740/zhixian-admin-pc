<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="110px" label-position="right">
        <el-form-item label="企业名称 : ">
          <el-select class="w80per" filterable clearable v-model="form.orgId" @change="getCategory" @visible-change="judgeOrg()" :disabled="orgDisabled">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接标题 : ">
          <el-input placeholder="请输入链接标题" v-model="form.title" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="链接封面 : ">
          <el-upload style="float: left;" action="" :show-file-list="false" :http-request="upLoad1" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="form.img" :src="(form.img  && form.img.includes('http')) ? form.img : $store.state.configData.imgDomain+form.img+$imgSize[`100x100`]" class="avatar" style="height:90px;width:160px">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          &nbsp;
          <!-- <span class="fc303e">（选填）</span> -->
          <span class="fc303e">封面尺寸：640px*360px</span>
        </el-form-item>
        <el-form-item label="链接分类 : ">
          <el-cascader :options="classifyList" :props="keyName" v-model="categoryId" @change="ClassifyId" :show-all-levels="false" change-on-select clearable style="width:500px;"></el-cascader>
          &nbsp;
          <span class="fc303e">（选填）</span>
          <el-button type="primary" style="margin-left: 20px" @click.native="showCategory = true">管理分类</el-button>
        </el-form-item>
        <el-form-item label="链接地址 : ">
          <el-input placeholder="请输入链接地址" v-model="form.linkUrl" class="w80per"></el-input>
          &nbsp;
          <span class="fc303e">（选填）</span>
        </el-form-item>
        <el-form-item label="" label-width="120px">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">确定</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="70%" title="管理分类" v-if="showCategory" :visible.sync="showCategory" append-to-body :before-close="categoryOver">
        <category :queryId="form.orgId"></category>
      </el-dialog>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建链接哦！</span>
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
import Link from "@api/data";
import Org from "@api/org";
import Category from "@api/category";
import System from "@api/system";

@Component({
  components: {
    "category": () => import ("./category.vue")
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: "" })
  public title: any;
  @Prop({ default: {} })
  public queryData: any;
  orgListId: any[] = [];
  form: any = {
    orgId: this.$store.state.userInfo.org.orgId,
    linkId: this.queryData.linkId,
    categoryId: "",
    title: "",
    img: "",
    linkUrl: ""
  };
  mapObj = {
    orgId: "企业名称",
    title: "链接标题",
    img: "链接封面"
  };
  isPending: boolean = false;
  isOrg: boolean = false;
  orgDisabled: boolean = false;

  upLoading1: boolean = false;

  showCategory: boolean = false;
  classifyList: any[] = [];
  keyName: object = {
    label: "categoryTitle",
    value: "categoryId"
  };
  categoryId: any[] = [];

  created() {
    this.init();
    this.getOrgList();
  }
  init () {
    if (this.queryData.linkId) {
      this.orgDisabled = true;
      let data = {
        linkId: this.queryData.linkId
      }
      Link.query_link_admin({ data }).then(res => {
        if (res.code === 0) {
          Object.keys(this.form).forEach((i, index) => {
            this.form[i] = res.data[i];
          });
          this.getCategory();
        }
      });
    } else {
      this.getCategory();
    }
  }
  getCategory() {
    let data = {
      orgId: this.form.orgId
    };
    Category.category_list_link({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
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
  ClassifyId(e: any) {
    if (e.length) {
      this.form.categoryId = "" + e[e.length - 1];
    } else {
      this.form.categoryId = "";
    }
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
    if (this.form.title.length <= 0 || this.form.title.length > 30 || this.form.title.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "链接标题字数在1-30且不能有空格"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn_one() {
    if (!this.is()) return;
    this.isPending = true;
    let data = { ...this.form };
    if (!this.queryData.linkId) {
      Link.create_link_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      Link.update_link_admin({ data })
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
  categoryOver() {
    this.showCategory = false;
    this.getCategory();
  }
  // 压缩图片上传
  async upLoad1(e: any) {
    if (e.file.size < 2097152) {
      this.upLoadImg(e.file, "img");
      return;
    }
    Lrz(e.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file, "img");
    });
  }
  upLoadImg(file: any, type: string) {
    this.upLoading1 = true;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/publics/link/img");
    System.upload(formData)
      .then(res => {
        this.form[type] = res.data.url;
      })
      .finally(() => {
        this.upLoading1 = false;
      });
  }
}
</script>
<style lang="scss" scoped>
</style>