/*
 module:
    岗位管理.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-13:岗位管理
 */
<template>
  <div class="org-post">
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item>
          <el-button type="primary" v-if="canCreate" @click.native="createPost">创建岗位</el-button>
        </el-form-item>
      </el-form>

      <el-input style="display:none"></el-input>
      <el-input v-model="filterText" placeholder="岗位名称" class="w230 mgb22" @change="filterTree">
        <el-button class="clickBtn" @click="filterTree" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </el-row>
    <el-row class="main-body" v-loading="loading" element-loading-text="加载中">
      <el-tree :filter-node-method="filterNode" ref="tree" :data="postData" :props="defaultProps" node-key="value" :default-expand-all="false" :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button v-if="canUpdate" type="text" size="mini" @click="() => edit(node,data)">
              编辑
            </el-button>
            <el-button v-if="canDel" type="text" size="mini" @click="() => remove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-row>
    <el-dialog :close-on-click-modal="false" :title="title" v-if="showBox" :visible.sync="showBox" :before-close="closeFunc">
      <el-form>
        <el-form-item label="岗位名称" :label-width="`80px`">
          <el-input v-model="postName" placeholder="请输入岗位名称" auto-complete="off" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="上级分类" :label-width="`80px`">
          <el-cascader v-model="moverClassify" class='w80per' placeholder="请选择" :options="copyClassifyList" @change='change' filterable clearable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="" :label-width="`100px`">
          <el-button class='btn' @click.native='closeFunc'>取消</el-button>
          <el-button type="primary" :loading="isPending" @click.native='saveBtn'>确定</el-button>
        </el-form-item>
      </el-form>
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
import { emptyLast } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({})
export default class PortTree extends Vue {
  title: string = "";
  postName: string = "";
  filterText: string = "";
  loading: boolean = false;
  showBox: boolean = false;
  isPending: boolean = false;
  canCreate: boolean = false;
  canDel: boolean = false;
  canUpdate: boolean = false;
  postData: any[] = [];
  copyClassifyList: object[] = [];
  moverClassify: any[] = [];
  top: object = { label: "顶层", value: "-1", children: null, parentId: "0" };
  parentId: string = "";
  postId: string = "";
  tmpData: any = {};
  defaultProps: object = {
    children: "children",
    label: "label"
  };
  created() {
    this.getTree(true);
    let { isCreate, isDelete, isUpdate } = this.$store.state.activeMenu[
      this.$route.path
    ];
    this.canCreate = isCreate;
    this.canDel = isDelete;
    this.canUpdate = isUpdate;
  }
  change(val: any) {
    if (val[0] === "-1") {
      this.parentId = "0";
    } else {
      this.parentId = val[val.length - 1];
    }
  }
  createPost() {
    this.title = "创建岗位";
    this.showBox = true;
  }
  closeFunc() {
    this.showBox = false;
    delete this.tmpData.disabled;
    this.parentId = "";
    this.postName = "";
    this.postId = "";
    this.moverClassify = [];
  }
  saveBtn() {
    if (!this.postName || this.postName.includes(" ")) {
      this.$notify({
        title: "错误",
        message: `填写岗位名称不合法`,
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
    if (this.title === "创建岗位") {
      let data = {
        postName: this.postName,
        parentId: this.parentId
      };
      Post.createPost({ data })
        .then((res: any) => {
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
        postName: this.postName,
        parentId: this.parentId,
        postId: this.postId
      };
      Post.updatePost({ data })
        .then((res: any) => {
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
  edit(node: any, data: any) {
    this.tmpData = data;
    this.tmpData.disabled = true;
    this.moverClassify = [];
    this.title = `编辑岗位`;
    this.postName = data.label;
    this.postId = data.value;
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
  remove(node: any, _data: any) {
    this.$confirm(`是否删除岗位 "${_data.label}" 吗?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        if (!_data.children || _data.children.length === 0) {
          this.loading = true;
          let data = {
            postId: _data.value
          };
          Post.deletePost({ data })
            .then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: "提示",
                  message: "删除成功",
                  type: "success"
                });
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
            message: "该岗位下存在岗位,无法删除！",
            type: "error"
          });
        }
      })
      .catch(() => {});
  }
  filterNode(value: any, data: any): boolean {
    if (!value) return true;
    return data.label.includes(value);
  }
  filterTree() {
    //@ts-ignore
    this.$refs.tree.filter(this.filterText);
  }
  //创建岗位
  async getTree(force: boolean = false) {
    this.loading = true;
    try {
      if (this.$store.state.postTree.length === 0 || force) {
        await this.$store.dispatch("getPostTree");
      }
      this.postData = [];
      this.postData = this.$forTree(
        this.$store.state.postTree,
        "postId",
        "postName"
      );
      this.copyClassifyList = [this.top, ...this.postData];
      emptyLast(this.copyClassifyList);
    } finally {
      this.loading = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.org-post{
    .main-body{
      padding: 25px;
    }
    .el-button--text{
      padding: 0;
      background-color: inherit;
      color: $green;
    }
  }
</style>
