
/*
 module:
    职位职能
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-14: 职位职能
 */
<template>
  <div>
    <el-form :inline="true">
      <el-row>
        <el-form-item label="">
          <el-button @click.native="createJobClassify" v-if="isCreatePremission">创建职能</el-button>
        </el-form-item>
        <el-input style="display:none">
        </el-input>
        <el-input v-model="filterText" placeholder="请输入检索关键词" class="w320 fr" @keyup.13.native="filterTree">
          <el-button class="clickBtn" @click="filterTree" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-row>

      <el-row v-loading="loading" element-loading-text="加载中">
        <el-tree :filter-node-method="filterNode" ref="tree" :data="classifyList" :props="defaultProps" node-key="value" :default-expand-all="false" :expand-on-click-node="true" :empty-text="`暂无更多数据`">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button v-if="isUpdatePremission" type="text" size="mini" @click="() => edit(node,data)">
                编辑
              </el-button>
              <el-button v-if="isDelPremission" type="text" size="mini" @click="() => remove(node, data)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-row>
    </el-form>

    <el-dialog :close-on-click-modal="false" :title="title" v-if="showBox" :visible.sync="showBox" :before-close="closeFunc">
      <el-form>
        <el-form-item label="职能名称" :label-width="`100px`">
          <el-input v-model="workCategoryTitle" auto-complete="off" class="w80per"></el-input>
        </el-form-item>

        <el-form-item label="上级分类" :label-width="`100px`">
          <el-cascader v-model="moverClassify" class='w80per' placeholder="请选择" ref="cascaderRef" :options="copyClassifyList" @change='change' filterable clearable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="" :label-width="`100px`">
          <el-button class='btn' @click.native='closeFunc'>取消</el-button>
          <el-button type="primary" :loading="isPending" @click.native='saveBtn'>确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" width="30%" title="删除职能" v-if="isShowDel" :visible.sync="isShowDel" :before-close="closeDel">
      <el-radio v-model="type" label="1">删除该分类</el-radio>
      <el-radio v-model="type" label="2">删除该分类及以下</el-radio>
      <div style="margin-top:20px;">
        <el-button @click.native='closeDel'>取消</el-button>
        <el-button type="primary" :loading="isPending" @click.native='del'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import Classify from "@api/classify";

//https://github.com/ktsn/vuex-class
@Component({})
export default class Jobclassify extends Vue {
  loading: boolean = false;
  showBox: boolean = false;
  isCreatePremission: boolean = false;
  isDelPremission: boolean = false;
  isUpdatePremission: boolean = false;
  isPending: boolean = false;
  isShowDel: boolean = false;
  type: string = "1";
  filterText: string = "";
  classifyList: object[] = [];
  title: string = "创建职能";
  moverClassify: any[] = [];
  workCategoryId: string = "";
  workCategoryTitle: string = "";
  copyClassifyList: object[] = [];
  defaultProps: object = {
    children: "children",
    label: "label"
  };
  tmpData: any = {};
  parentId: string = "";
  top: object = { label: "顶层", value: "-1", children: null, parentId: "0" };
  created() {
    let { isCreate, isDelete, isUpdate } = this.$store.state.activeMenu[
      this.$route.path
    ];
    this.getTree();
    this.isCreatePremission = isCreate;
    this.isDelPremission = isDelete;
    this.isUpdatePremission = isUpdate;
  }
  //方法
  del() {
    let data = {
      type: this.type,
      workCategoryId: this.workCategoryId
    };
    this.isPending = true;
    Classify.deleteJobclassify({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `删除成功` || res.msg,
            type: "success"
          });
          this.closeDel();
          this.getTree(true);
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  closeDel() {
    this.type = "1";
    this.workCategoryId = "";
    this.isShowDel = false;
  }
  closeFunc() {
    this.showBox = false;
    delete this.tmpData.disabled;
    this.parentId = "";
    this.workCategoryTitle = "";
    this.workCategoryId = "";
    this.moverClassify = [];
  }
  saveBtn() {
    if (!this.workCategoryTitle) {
      this.$notify({
        title: "错误",
        message: `请填写职能名称!`,
        type: "error"
      });
      return;
    }
    if (!this.parentId) {
      this.$notify({
        title: "错误",
        message: `请选择上级分类!`,
        type: "error"
      });
      return;
    }
    this.isPending = true;

    if (this.title === "创建职能") {
      let data = {
        parentId: this.parentId,
        workCategoryTitle: this.workCategoryTitle
      };
      Classify.createJobclassify({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `创建成功` || res.msg,
              type: "success"
            });
            this.closeFunc();
            this.getTree(true);
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      let data = {
        workCategoryId: this.workCategoryId,
        parentId: this.parentId,
        workCategoryTitle: this.workCategoryTitle
      };
      Classify.updateJobclassify({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `编辑成功` || res.msg,
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
  change(val: any) {
    if (this.classifyName) {
      let arr = "" + this.$refs.cascaderRef.currentLabels;
      if (arr.includes(this.classifyName)) {
        this.$notify({
          title: "提示",
          message: `不能移动到自身或比自身层级低的分类下面!`,
          type: "warning"
        });
        this.moverClassify = [];
        return;
      }
    }
    if (val[0] === "-1") {
      this.parentId = "0";
    } else {
      this.parentId = val[val.length - 1];
    }
  }
  edit(node: any, data: any) {
    this.tmpData = data;
    this.tmpData.disabled = true;
    this.moverClassify = [];
    this.title = `编辑职能`;
    this.workCategoryTitle = data.label;
    this.workCategoryId = data.value;
    if (data.parentId === "0") {
      this.moverClassify.push("-1");
      this.parentId = "0";
    } else {
      this.moverClassify = this.$getFather(
        this.copyClassifyList,
        this.copyClassifyList,
        data.value
      );
      this.parentId = this.moverClassify[this.moverClassify.length - 1];
    }
    this.showBox = true;
  }
  remove(node: any, data: any) {
    this.workCategoryId = data.value;
    this.isShowDel = true;
  }
  filterTree() {
    //@ts-ignore
    this.$refs.tree.filter(this.filterText);
  }
  createJobClassify() {
    this.title = "创建职能";
    this.showBox = true;
  }
  filterNode(value: any, data: any): boolean {
    if (!value) return true;
    return data.label.includes(value);
  }
  async getTree(force: boolean = false) {
    this.loading = true;
    try {
      if (this.$store.state.jobClassify.length === 0 || force) {
        await this.$store.dispatch("getJobclassifyTree");
      }
      this.classifyList = [];
      this.classifyList = this.$forTree(
        this.$store.state.jobClassify,
        "workCategoryId",
        "workCategoryTitle"
      );
      this.copyClassifyList = [this.top, ...this.classifyList];
    } finally {
      this.loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
