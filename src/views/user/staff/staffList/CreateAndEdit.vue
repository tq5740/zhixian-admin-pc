<template>
  <div class="createStaff">
    <el-row style="margin-left:10px">
      <el-form label-width="110px">
        <el-form-item label="用户头像 : ">
          <el-upload :disabled="true" action="" :show-file-list="false" :http-request="upLoad" accept="image/gif,image/jpeg,image/jpg,image/png" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="apiData.photo" @click="cropperShow = true" :src="(apiData.photo  && apiData.photo.includes('http')) ? apiData.photo : $store.state.configData.imgDomain+apiData.photo+$imgSize[`100x100`]" class="avatar" style="height:100px;width:100px">
            <i @click="cropperShow = true" style="height:100px;width:100px;line-height:100px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <span class="fc303e" style="padding-left:100px">图片大小不得超过2M</span> -->
        </el-form-item>
        <el-form-item label="员工编号 : ">
          <el-input placeholder="请输入员工编号" v-model="apiData.employeeNumber" class='w80per'></el-input>
        </el-form-item>
        <el-form-item label="用户姓名 : ">
          <el-input placeholder="请输入姓名" v-model="apiData.name" class='w80per'></el-input>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="手机号码 : ">
          <el-input :disabled="!!apiData.userId" placeholder="请输入手机号码" v-model="apiData.phone" class='w80per'></el-input>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="电子邮箱 : ">
          <el-input placeholder="请输入电子邮箱" v-model="apiData.email" class='w80per'></el-input>
        </el-form-item>
        <el-form-item label="企业部门 : ">
          <el-cascader class='w80per' :options="deptDara" v-model="selectDept" @change="changeDept" clearable filterable change-on-select></el-cascader>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="企业岗位 : ">
          <el-cascader class='w80per' :options="postData" v-model="selectPost" clearable filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="入职时间 : ">
          <el-date-picker value-format='yyyy-MM-dd' v-model="apiData.hireDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click="savaBtn">确定</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-dialog width="35%" :append-to-body="true" v-if="cropperShow" :visible.sync="cropperShow" :title="'裁剪头像'">
      <cropper-img @getImgFile="getImgFile"></cropper-img>
    </el-dialog>

  </div>
</template>

<script lang="ts">
/*
 module:
    StaffCE
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-22:StaffCE
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
import User from "@api/user";
import System from "@api/system";
import { mobileReg, emptyLast } from "@utils/index";
import Post from "@api/post"
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    CropperImg: () => import("@c/CropperImg.vue")
  }
})
export default class StaffCE extends Vue {
  @Prop({
    default: {
      photo: "",
      deptId: "",
      postId: "",
      userId: "",
      email: "",
      employeeNumber: "",
      hireDate: "",
      name: "",
      phone: "",
      deptName: "",
      postName: ""
    }
  })
  public editObj: any;

  @Prop({ default: "创建用户" })
  public title: string;
  
  selectDept: string[] = [];
  selectPost: string[] = [];

  cropperShow: boolean = false;

  apiData = {
    photo: "",
    deptId: "",
    postId: "",
    userId: "",
    email: "",
    employeeNumber: "",
    hireDate: "",
    name: "",
    phone: "",
    deptName: "",
    postName: ""
  };

  deptDara: any = [];
  postData: any = [];
  isPending: boolean = false;
  selectData: object = {};
  getImgFile(file: void): void {
    this.upLoad(file);
  }
  created() {
    if (this.editObj.userId) {
      Object.keys(this.apiData).forEach(i => {
        if (i === `hireDate`) {
          this.apiData.hireDate = this.$formatDate(this.editObj.hireDate);
        } else {
          //@ts-ignore
          this.apiData[i] = this.editObj[i];
        }
      });
    }
    this.getDept();
    this.getPost();
  }
  // 压缩图片上传
  async upLoad(file: any) {
    if (file.size < 2097152) {
      this.upLoadImg(file);
      return;
    }
    Lrz(file, { width: 200, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file);
    });
  }

  upLoadImg(file: any) {
    let formData = new FormData();
    let { token } = this.$store.state.userInfo;
    formData.append("file", file);
    formData.append("uploadType", "1");
    formData.append("token", token);
    formData.append("path", "/user/user/photo");
    System.upload(formData)
      .then(res => {
        this.apiData.photo = res.data.url;
        this.cropperShow = false;
        this.$notify({
          title: "提示",
          message: `图片裁剪完成，并上传成功！`,
          type: "success"
        });
      })
      .finally(() => {});
  }


  savaBtn() {
    if(this.selectPost){
      this.apiData.postId = this.selectPost[this.selectPost.length - 1];
    }
    this.apiData.deptId = this.selectDept[this.selectDept.length - 1];

    if (
      !this.apiData.phone ||
      this.apiData.phone.includes(" ") ||
      !this.apiData.name ||
      this.apiData.name.includes(" ") ||
      !this.apiData.deptId ||
      this.apiData.deptId.includes(" ")
    ) {
      this.$notify({
        title: "提示",
        message: `请填写必填项,并且不能含有空格!`,
        type: "error"
      });
      return;
    }
    if (!mobileReg(this.apiData.phone)) {
      this.$notify({
        title: "提示",
        message: `手机号填写不合法!`,
        type: "error"
      });
      return;
    }

    this.isPending = true;
    let hireDate = this.apiData.hireDate.split(" ")[0];
    if (this.editObj.userId) {
      let data = { ...this.apiData, hireDate };
      User.updateOrguser({ data })
        .then(res => {
          this.$notify({
            title: "提示",
            message: `编辑成功!`,
            type: "success"
          });
          this.$emit("okCB");
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      let data = { ...this.apiData, hireDate };
      User.createOrguser({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `创建成功!`,
              type: "success"
            });
            this.$emit("okCB");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  async getDept() {
    if (this.$store.state.deptTree.length === 0) {
      await this.$store.dispatch("getDeptTree");
    }
    this.deptDara = [];
    this.deptDara = this.$forTree(
      this.$store.state.deptTree,
      "deptId",
      "deptName"
    );
    emptyLast(this.deptDara);
    this.selectDept = this.$getFather(
      this.deptDara,
      this.deptDara,
      this.apiData.deptId,
      true
    );
    // this.selectDept = [this.apiData.deptId];
  }
  async getPost(force: boolean = false) {
    if (this.$store.state.postTree.length === 0) {
      await this.$store.dispatch("getPostTree");
    }
    this.postData = [];
    this.postData = this.$forTree(
      this.$store.state.postTree,
      "postId",
      "postName"
    );
    emptyLast(this.postData);
    this.selectPost = this.$getFather(
      this.postData,
      this.postData,
      this.apiData.postId,
      true
    );
    if(this.title === "编辑用户" && !this.apiData.postId){
      this.selectPost = null;
    }
  }
  changeDept(e: any) {
    this.getObj(this.deptDara, e[e.length - 1]);
    if (e.length === 0) {
      this.$store.state.postTree = [];
      this.getPost();
    }
  }
  getObj(arr: any, id: string) {
    for (let i of arr) {
      if (i.value == id) {
        if (i.type == 9) {
          return true;
        } else {
          this.selectData = i;
          this.getNowPost();
          return;
        }
      } else {
        if (i.children && i.children.length !== 0) {
          let r = this.getObj(i.children, id);
          if (r) {
            if (i.type == 9) {
              return true;
            } else {
              this.selectData = i;
              this.getNowPost();
              return;
            }
          }
        }
      }
    }
  }
  getNowPost() {
    let data = {
      hierarchy: this.selectData.hierarchy
    }
    Post.query_post_by_hierarchy({ data })
      .then(res => {
        if (res.code === 0) {
          this.postData = [];
          this.postData = this.$forTree(
            res.data,
            "postId",
            "postName"
          );
          emptyLast(this.postData);
        }
      })
  }
}
</script>
<style lang="scss">
.w80per{
  width: 80%!important;
}
</style>
