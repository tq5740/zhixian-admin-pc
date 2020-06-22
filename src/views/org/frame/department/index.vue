/*
 module:
    部门管理.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-13:部门管理
 */
<template>
  <div class="org-dep">
    <el-form :inline="true" v-loading="loading" element-loading-text="加载中...">
      <el-row class="main-top">
        <el-form-item label="" class="btn-main">
          <el-button type="primary" v-if="canCreate" @click.native="createPost">创建部门</el-button>
        </el-form-item>
        <el-input style="display:none">
        </el-input>
        <el-input v-model="filterText" placeholder="部门名称" class="w230 mgb22" @change="filterTree">
          <el-button class="clickBtn" @click="filterTree" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-row>
      <el-row class="main-body">
        <el-tree :default-expanded-keys="defaultArr" :filter-node-method="filterNode" ref="tree" :data="deptData" :props="defaultProps" node-key="value" :default-expand-all="false" :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.hierarchy !== $store.state.userInfo.userAdministrator.permissionHierarchy">
              <el-button type="text" size="mini" @click="() => move(node,data)">
                移动
              </el-button>
              <el-button v-if="canUpdate && data.type === 9 " type="text" size="mini" @click="() => edit(node,data)">
                编辑
              </el-button>
              <el-button v-if="canDel" type="text" size="mini" @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-row>
    </el-form>
    <el-dialog title="移动" v-if="showMoveBox" :visible.sync="showMoveBox" :before-close="closeMoveBox">
      <el-input v-model="filterTextMove" placeholder="部门名称" class="w230 mgb22" @change="filterTreeMove">
        <el-button class="clickBtn" @click="filterTreeMove" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <div class="move-org">把 <b>{{moveOrg}}</b> 移动到</div>
      <el-tree show-checkbox check-strictly :expand-on-click-node="false" accordion @check-change="checkMoveValue" @node-click="nodeClick" :default-expanded-keys="defaultArr" :filter-node-method="filterNode" ref="treeMove" :data="deptData" :props="defaultProps" node-key="value">
      </el-tree>
      <div class="mag-top20">
        <el-button @click.native='closeMoveBox'>取消</el-button>
        <el-button type="primary" :loading="isPending " @click.native='saveMoveBtn' :disabled="dis">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="title" v-if="showBox" :visible.sync="showBox" :before-close="closeFunc">
      <el-form>
        <el-form-item label="部门名称：" :label-width="`120px`">
          <el-input v-model="orgInfo.deptName" auto-complete="off" class="w80per"></el-input>
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <div v-if="title==='创建部门'">
          <el-form-item label="上级分类：" :label-width="`120px`">
            <el-cascader v-model="moverClassify" class='w80per' placeholder="请选择" :options="copyClassifyList" @change='change' filterable clearable change-on-select></el-cascader>
            <span class="fc303e"> *必填</span>
          </el-form-item>
          <el-form-item label="部门类型：" :label-width="`120px`">
            <el-select v-model="orgInfo.type" placeholder="请选择" @change="getOrgType">
              <el-option v-for="(i) in $store.state.orgTypeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
            </el-select>
            <span class="fc303e"> *必填</span>
          </el-form-item>
          <div v-show="showOther">
            <el-form-item label="企业简称：" :label-width="`120px`">
              <el-input v-model="orgInfo.shortName" auto-complete="off" class="w80per"></el-input>
              <span class="fc303e"> *必填</span>
            </el-form-item>
            <el-form-item label="注册时间：" :label-width="`120px`">
              <el-date-picker v-model="orgInfo.regDate" type="date" placeholder="选择日期" value-format='yyyy-MM-dd'>
              </el-date-picker>
              <span class="fc303e"> *必填</span>
            </el-form-item>
            <el-form-item label="注册地址：" :label-width="`120px`">
              <el-input v-model="orgInfo.address" class="w80per" placeholder="请输入注册地址"></el-input>
              <span class="fc303e"> *必填</span>
            </el-form-item>
            <el-form-item label="统一信用码：" :label-width="`120px`">
              <el-input v-model="orgInfo.orgCode" maxlength="18" class="w80per" placeholder="请输入统一社会信用代码"></el-input>
              <span class="fc303e" v-show="showMust"> *必填</span>
            </el-form-item>
            <el-form-item label="营业执照：" :label-width="`120px`">
              <el-upload action="" :show-file-list="false" :http-request="upLoadLicense" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading1" element-loading-text="上传中..." class="avatar-uploader">
                <img style="height:297px;width:210px" v-if="orgInfo.orgLicense" :src="(orgInfo.orgLicense  && orgInfo.orgLicense.includes('http')) ? orgInfo.orgLicense : $store.state.configData.imgDomain+orgInfo.orgLicense+$imgSize['210x297']" class="avatar">
                <i style="height:297px;width:210px;line-height:297px" v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="fc303e" v-show="showMust"> *必填</span>
            </el-form-item>
            <el-form-item label="企业LOGO：" :label-width="`120px`">
              <el-upload :disabled="true" action="" :show-file-list="false" :http-request="upLoadLogo" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading2" element-loading-text="上传中..." class="avatar-uploader">
                <img style="height:100px;width:100px" @click="cropperShow = true" v-if="orgInfo.orgLogo" :src="$store.state.configData.imgDomain+orgInfo.orgLogo+$imgSize['100x100']" class="avatar">
                <i style="height:100px;width:100px;line-height:100px" @click="cropperShow = true" v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span class="fc303e"> *必填</span>
            </el-form-item>
            <el-form-item label="企业形象：" :label-width="`120px`">
              <el-upload action="" :show-file-list="false" :http-request="upLoadImg" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading3" element-loading-text="上传中..." class="avatar-uploader">
                <img v-if="orgInfo.orgImg" :src="(orgInfo.orgImg  && orgInfo.orgImg.includes('http')) ? orgInfo.orgImg : $store.state.configData.imgDomain+orgInfo.orgImg+$imgSize['224x126']" class="avatar" style="height:90px;width:160px">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="所属行业：" :label-width="`120px`">
              <el-select class='w240' v-model="orgInfo.industry" @change="getIndustry">
                <el-option v-for="(i) in $store.state.industryList" :key="i.text" :label="i.text" :value="i.id"></el-option>
              </el-select>
              <span class="fc303e"> *必填</span>
            </el-form-item>
            <el-form-item label="企业性质：" :label-width="`120px`">
              <el-select class='w240' v-model="orgInfo.natrue" @change="getNature">
                <el-option v-for="(i) in $store.state.natureList" :key="i.text" :label="i.text" :value="i.id"></el-option>
              </el-select>
              <span class="fc303e"> *必填</span>
            </el-form-item>
            <el-form-item label="企业规模：" :label-width="`120px`">
              <el-select class='w240' v-model="orgInfo.scale" @change="getScale">
                <el-option v-for="(i) in $store.state.scaleList" :key="i.text" :label="i.text" :value="i.id"></el-option>
              </el-select>
              <span class="fc303e"> *必填</span>
            </el-form-item>
            <el-form-item label="官方网址：" :label-width="`120px`">
              <el-input placeholder="例 : http://www.baidu.com/" v-model="orgInfo.website" class="w70per"></el-input>
            </el-form-item>
            <el-form-item label="管理员姓名：" :label-width="`120px`">
              <el-input v-model="orgInfo.contact" class="w80per" placeholder="请输入管理员姓名"></el-input>
              <span class="fc303e"> *必填</span>
            </el-form-item>
            <el-form-item label="管理员手机：" :label-width="`120px`">
              <el-input v-model="orgInfo.phone" class="w80per" placeholder="请输入管理员手机号"></el-input>
              <span class="fc303e"> *必填</span>
            </el-form-item>
            <el-form-item label="管理员邮箱：" :label-width="`120px`">
              <el-input v-model="orgInfo.email" class="w80per" placeholder="请输入管理员邮箱"></el-input>
            </el-form-item>
            <el-form-item label="企业简介：" :label-width="`120px`">
              <add-edit :placeholder="'请输入企业简介'" :htmlStr="orgIntro ? orgIntro : ''" ref="addEditRef"></add-edit>
              <p class="fc303e">
                *必填
              </p>
            </el-form-item>
          </div>

        </div>
        <el-form-item label="" :label-width="`120px`">
          <el-button @click.native='closeFunc'>取消</el-button>
          <el-button type="primary " :loading="isPending" @click.native='saveBtn'>确定</el-button>
        </el-form-item>
      </el-form>

      <el-dialog width="35%" :append-to-body="true" v-if="cropperShow" :visible.sync="cropperShow" :title="'裁剪头像'">
        <cropper-img @getImgFile="getImgFile"></cropper-img>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    allroute
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-8:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import Post from "@api/post";
import Dept from "@api/dept";
import System from "@api/system";
import { emptyLast, checkSite, emailReg, mobileReg } from "@utils/index";
Component.registerHooks(["beforeRouteLeave"]);
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    //"v-editor": () => import("@c/VEditor.vue")
    "add-edit": () => import("@c/addEdit.vue"),
    CropperImg: () => import("@c/CropperImg.vue")
  }
})
export default class DepartMent extends Vue {
  orgInfo = {
    parentId: "",
    deptName: "",
    shortName: "",
    orgLicense: "",
    orgLogo: "",
    orgImg: "",
    type: "",
    natrue: "",
    industry: "",
    contact: "",
    scale: "",
    phone: "",
    regDate: "",
    website: "",
    intro: "",
    orgCode: "",
    address: ""
  };
  mapObj = {
    shortName: "企业简称",
    regDate: "注册时间",
    address: "注册地址",
    orgCode: "统一信用码",
    orgLicense: "营业执照",
    orgLogo: "企业LOGO",
    industry: "所属行业",
    natrue: "企业性质",
    scale: "企业规模",
    contact: "管理员姓名",
    phone: "管理员手机",
    intro: "企业简介"
  };
  moveProps = {
    deptId: "",
    parentId: ""
  }
  title: string = "";
  filterText: string = "";
  filterTextMove: string = "";
  moveValue: string = "";
  selectData: any[] = [];
  parentId: string = "";
  loading: boolean = false;
  showBox: boolean = false;
  showMoveBox: boolean = false;
  moveOrg: string = "";
  isPending: boolean = false;
  canCreate: boolean = false;
  canDel: boolean = false;
  canUpdate: boolean = false;
  deptData: any[] = [];
  copyClassifyList: object[] = [];
  moverClassify: any[] = [];
  defaultArr: string[] = [];
  deptId: string = "";
  defaultProps: object = {
    children: "children",
    label: "label"
  };

  upLoading1: boolean = false;
  upLoading2: boolean = false;
  upLoading3: boolean = false;

  cropperShow: boolean = false;
  showOther: boolean = false;
  showMust: boolean = true;
  dis: boolean = false;

  orgIntro: string = "";
  
  async created() {
    await this.getTree();
    let { isCreate, isDelete, isUpdate } = this.$store.state.activeMenu[
      this.$route.path
    ];
    this.canCreate = isCreate;
    this.canDel = isDelete;
    this.canUpdate = isUpdate;
    if (this.$store.state.companyreg) {
      this.orgInfo.type = `1`;
      this.createPost();
      this.orgInfo.deptName = this.$store.state.companyreg.orgName;
    }
  }
  beforeRouteLeave(to: any, from: object, next: any): void {
    this.$store.commit("setCompanyreg", null);
    next();
  }
  change(val: any) {
    if (val[0] === "-1") {
      this.orgInfo.parentId = "0";
    } else {
      this.orgInfo.parentId = val[val.length - 1];
    }
  }
  getOrgType(e: any) {
    this.orgInfo.type = e;
    this.orgInfo.type == 9 ? this.showOther = false : this.showOther = true;
    this.orgInfo.type == 2 || this.orgInfo.type == 3 || this.orgInfo.type == 5 ? this.showMust = false : this.showMust = true;
  }
  createPost() {
    this.title = "创建部门";
    this.showBox = true;
    this.orgInfo.type = 9;
    this.showOther = false;
  }
  closeFunc() {
    this.showBox = false;
    this.orgInfo = {};
    this.moverClassify = [];
  }
  saveBtn() {
    if (!this.orgInfo.deptName || this.orgInfo.deptName.includes(" ")) {
      this.$notify({
        title: "错误",
        message: `请填写部门名称，且不能含有空格!`,
        type: "error"
      });
      return;
    }
    if (this.orgInfo.deptName.includes("（") || this.orgInfo.deptName.includes("）")) {
      this.$notify({
        title: "错误",
        message: `部门名称不能含有中文括号!`,
        type: "error"
      });
      return;
    }
    if (this.title === "创建部门" && !this.orgInfo.parentId || this.orgInfo.parentId.includes(" ")) {
      this.$notify({
        title: "错误",
        message: `请填写上级分类且不能含有空格!`,
        type: "error"
      });
      return;
    }
    if (this.orgInfo.type != 9) {
      if (this.orgInfo.type == 2 || this.orgInfo.type == 3 || this.orgInfo.type == 5){
        delete this.mapObj.orgCode;
        delete this.mapObj.orgLicense;
      }
      this.orgInfo.intro = this.$refs.addEditRef.getHtmlText();
      for (let i in this.mapObj) {
        //@ts-ignore
        if (this.orgInfo[i] !== 0 && !this.orgInfo[i]) {
          this.$notify({
            title: "提示",
            //@ts-ignore
            message: `请填写${this.mapObj[i]}!`,
            type: "error"
          });
          return;
        }
      }
    }
    if (this.orgInfo.orgCode && this.orgInfo.orgCode.length > 18) {
      this.$notify({
        title: "错误",
        type: "error",
        message: "统一信用代码格式错误"
      });
      return;
    }
    if (this.orgInfo.website && !checkSite(this.orgInfo.website)) {
      this.$notify({
        title: "错误",
        type: "error",
        message: "网址格式错误"
      });
      return;
    }
    if (this.orgInfo.phone && !mobileReg(this.orgInfo.phone)) {
      this.$notify({
        title: "提示",
        message: `手机号码格式有误!`,
        type: "error"
      });
      return;
    }
    if (this.orgInfo.email && !emailReg(this.orgInfo.email)) {
      this.$notify({
        title: "提示",
        message: `电子邮箱格式有误!`,
        type: "error"
      });
      return;
    }
    
    this.isPending = true;
    if (this.title === "创建部门") {
      this.orgInfo.intro = encodeURIComponent(this.orgInfo.intro.replace(/http:/g, "https:")
        .replace(/section/g, "div")
        .replace(/strong/g, "div")
        .replace(/footer/g, "div")
        .replace(/\<img/g, '<img style="max-width:100%;height:auto"')
      )
      let data = {
        ...this.orgInfo
      };
      if (this.$store.state.companyreg) {
        //@ts-ignore
        data.venueRegId = this.$store.state.companyreg.venueRegId;
      }
      Dept.createDept({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `创建成功!`,
              type: "success"
            });
            this.closeFunc();
            this.getTree(true);
            this.$store.state.companyreg &&
              this.$store.commit("setCompanyreg", null);
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      let data = {
        deptId: this.deptId,
        deptName: this.orgInfo.deptName
      };
      Dept.updateDept({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `编辑成功!`,
              type: "success"
            });
            this.closeFunc();
            this.getTree(true);
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  edit(node: any, data: any) {
    this.title = "编辑部门";
    this.orgInfo.deptName = data.label;
    this.deptId = data.value;
    this.showBox = true;
  }
  remove(node: any, _data: any) {
    this.$confirm(`是否删除部门 "${_data.label}" 吗?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = {
          deptId: _data.value
        };
        if (!_data.children || _data.children.length === 0) {
          this.loading = true;
          Dept.deleteDept({ data })
            .then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: "提示",
                  message: `删除成功!`,
                  type: "success"
                });
                this.closeFunc();
                this.getTree(true);
              } else {
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          this.$notify({
            title: "提示",
            message: "该部门下存在部门,无法删除！",
            type: "error"
          });
        }
      })
      .catch(() => {});
  }
  move(node: any, data: any) {
    this.moveOrg = data.label;
    this.moveProps.deptId = data.value;
    this.showMoveBox = true;
  }
  closeMoveBox(): void {
    this.showMoveBox = false;
  }
  checkMoveValue(data, checked, node){
    if(checked == true){
      this.moveProps.parentId = data.value;
      this.$refs.treeMove.setCheckedNodes([data]);
      if (this.moveOrg === data.label) {
        this.$notify({
          title: "提示",
          message: "不能移动到自己下面！",
          type: "error"
        });
        this.dis = true;
        return;
      }
      this.dis = false;
    }
  }
  nodeClick(data, checked, node){
    this.moveProps.parentId = data.value;
    this.$refs.treeMove.setCheckedNodes([data]);
  }
  saveMoveBtn() {
    if (!this.moveProps.parentId) {
      this.$notify({
        title: "错误",
        message: `请选择目标企业!`,
        type: "error"
      });
      return;
    }
    this.loading = true;
    let data = {
      ...this.moveProps
    }
    Dept.moveDept({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `移动成功!`,
            type: "success"
          });
          this.showMoveBox = false;
          this.getTree(true);
        } else {
          this.loading = false;
        }
      })
      .catch(() => {
        this.loading = false;
      });
  }
  filterNode(value: any, data: any): boolean {
    if (!value) return true;
    return data.label.includes(value);
  }
  filterTree() {
    //@ts-ignore
    this.$refs.tree.filter(this.filterText);
  }
  filterTreeMove() {
    //@ts-ignore
    this.$refs.treeMove.filter(this.filterTextMove);
  }
  //创建部门
  async getTree(force: boolean = false) {
    this.loading = true;
    try {
      if (this.$store.state.deptTree.length === 0 || force) {
        await this.$store.dispatch("getDeptTree");
      }
      this.deptData = [];
      this.deptData = this.$forTree(
        this.$store.state.deptTree,
        "deptId",
        "deptName"
      );
      this.deptData.length > 0 && this.defaultArr.push(this.deptData[0].value);
      // this.top,
      this.copyClassifyList = [...this.deptData];
      emptyLast(this.copyClassifyList)
    } finally {
      this.loading = false;
    }
    return Promise.resolve();
  }

  // 上传图片
  getImgFile(file: void): void {
    let files = { file };
    this.upLoadLogo(files);
  }
  async upLoadLicense(e: any) {
    this.upload(e, "orgLicense", 800);
  }
  async upLoadLogo(e: any) {
    this.upload(e, "orgLogo", 200);
  }
  async upLoadImg(e: any) {
    this.upload(e, "orgImg", 800);
  }
  upload(file: any, key: string, size: number) {
    if (file.file.size < 2097152) {
      this.upLoadImgSrc(file.file, key);
      return;
    }
    Lrz(file.file, { width: size, quality: 0.9 }).then((rst: any) => {
      this.upLoadImgSrc(rst.file, key);
    });
  }
  upLoadImgSrc(file: any, key: string) {
    this.upLoadingImg = true;
    let formData = new FormData();
    let { token } = this.$store.state.userInfo;
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", token);
    if (key === "orgLicense") {
      formData.append("path", "/user/org/license");
    } else if (key === "orgLogo") {
      formData.append("path", "/user/org/logo");
    } else if (key === "orgImg") {
      formData.append("path", "/user/org/img");
    }
    System.upload(formData)
      .then(res => {
        console.log(res.data.url);
        this.orgInfo[key] = res.data.url;
        if (key == "orgLogo") {
          this.$notify({
            title: "提示",
            message: `图片上传成功！`,
            type: "success"
          });
        }
      })
      .finally(() => {
        this.upLoadingImg = false;
        this.cropperShow = false;
      });
  }
  getIndustry(e): void {
    let res = this.$store.state.industryList.filter(i => i.id === e)[0];
    this.orgInfo.industry = res ? res.text : "";
  }
  getNature(e): void {
    let res = this.$store.state.natureList.filter(i => i.id === e)[0];
    this.orgInfo.natrue = res ? res.text : "";
  }
  getScale(e): void {
    let res = this.$store.state.scaleList.filter(i => i.id === e)[0];
    this.orgInfo.scale = res ? res.text : "";
  }
}
</script>
<style lang="scss" scoped>
  .org-dep{
    .main-body{
      padding: 25px;
    }
    .el-button--text{
      padding: 0;
      background-color: inherit;
      color: $green;
    }
  }
  .avatar-uploader {
    float: left;
    margin-right: 50px;
  }
  .btn {
    width: 100%;
    text-align: right;
  }
  .move-org {
    margin-bottom: 10px;
  }
  .mag-top20 {
    margin-top: 15px;
  }
</style>
