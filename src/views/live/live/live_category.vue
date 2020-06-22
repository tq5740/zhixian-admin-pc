
<template>
  <div class="category">
      
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="" class="btn-main">
          <el-button type="primary" @click.native="createJobClassify">创建直播分类</el-button>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="企业名称" filterable clearable v-model="orgId" @change="getCategory">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filterText" placeholder="请输入检索关键词" class="w230"></el-input>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row class="main-body" v-loading="loading" element-loading-text="加载中">
      <el-tree :filter-node-method="filterNode" ref="classify" :data="liveClassify" :props="defaultProps" node-key="value" :default-expand-all="false" :expand-on-click-node="true" :empty-text="`暂无更多数据`">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => edit(node,data)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </el-row>
    

    <el-dialog :close-on-click-modal="false" :title="title" v-if="showBox" :visible.sync="showBox">
      <el-form :label-width="`100px`">
        <el-form-item label="分类名称">
          <el-input v-model="classifyName" auto-complete="off" class="w80per"></el-input>
        </el-form-item>

        <el-form-item label="上级分类">
          <el-cascader v-model="moverClassify" class='w80per' placeholder="请选择" ref="cascaderRef" :options="liveClassifyClone" :props="defaultProps" @change='change' filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="" :label-width="`100px`">
          <el-button @click.native='showBox = false'>取消</el-button>
          <el-button type="primary" :loading="isPending" @click.native='saveBtn'>确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Watch } from "vue-property-decorator";
import Category from "@api/category";
import Org from "@api/org";
import { emptyLast } from "@utils/index";

//https://github.com/ktsn/vuex-class
@Component({})
export default class Liveclassify extends Vue {
  liveClassify: any = [];
  liveClassifyClone: any = [];
  orgId: string = this.$store.state.userInfo.org.orgId;
  categoryId: string = "";
  loading: boolean = false;
  showBox: boolean = false;
  isDelPremission: boolean = false;
  isUpdatePremission: boolean = false;
  isPending: boolean = false;
  type: string = "1";
  filterText: string = "";
  classifyList: object[] = [];
  title: string = "创建直播分类";
  moverClassify: any[] = [];
  workCategoryId: string = "";
  classifyName: string = "";
  copyClassifyList: object[] = [];
  defaultProps: object = {
    children: "children",
    label: "categoryTitle",
    value: "categoryId"
  };
  tmpData: any = {};
  parentId: string = "";
  top: object = {
    categoryTitle: "顶层",
    categoryId: "-1",
    children: null,
    parentId: "0"
  };
  @Watch("filterText")
  filterTexts(val: any) {
    //@ts-ignore
    this.$refs.classify.filter(val);
  }
  created() {
    this.getCategory();
    this.getOrgList();
  }
  getCategory() {
    let data = {
      orgId: this.orgId
    };
    Category.category_list_live({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        this.liveClassify = res.data;
        this.liveClassifyClone = [this.top, ...res.data];
      }
    });
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
  }
  saveBtn() {
    if (this.classifyName === "" || this.classifyName.includes(" ")) {
      this.$notify({
        title: "错误",
        message: `请填写分类名称且不能含有空格!`,
        type: "error"
      });
      return;
    }
    console.log()
    if (this.parentId === "") {
      this.$notify({
        title: "错误",
        message: `请选择上级分类!`,
        type: "error"
      });
      return;
    }
    

    this.isPending = true;
    let data: any = {
      parentId: this.parentId,
      categoryTitle: this.classifyName,
      orgId: this.orgId
    };
    if (this.title === "创建直播分类") {
      Category.create_category_live({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `创建成功` || res.msg,
              type: "success"
            });
            this.showBox = false;
            this.getCategory();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      data.categoryId = this.categoryId;
      Category.update_category_live({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `编辑成功` || res.msg,
              type: "success"
            });
            this.showBox = false;
            this.getCategory();
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
    delete this.tmpData.disabled;
    this.tmpData = data;
    this.tmpData.disabled = true;
    
    this.moverClassify = [];
    this.title = `编辑直播分类`;
    this.classifyName = data.categoryTitle;
    this.categoryId = data.categoryId;
    this.orgId = data.orgId;
    this.getCategory();
    if (data.parentId === "0") {
      this.moverClassify.push("-1");
      this.parentId = "0";
    } else {
      this.moverClassify = [
        ...this.$getFather(
          this.liveClassifyClone,
          this.liveClassifyClone,
          data.parentId
        ),
        data.parentId
      ];
      this.parentId = data.parentId;
    }
    this.showBox = true;
  }
  remove(node: any, datas: any) {
    this.categoryId = datas.categoryId;
    this.$confirm("确认删除该分类吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = {
          categoryId: datas.categoryId
        };
        this.isPending = true;
        Category.delete_category_live({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `删除成功` || res.msg,
                type: "success"
              });
              this.getCategory();
            }
          })
          .finally(() => {
            this.isPending = false;
          });
      })
      .catch(() => {
        // this.$message({
        //   type: "info",
        //   message: "已取消删除"
        // });
      });
  }
  filterTree() {
    //@ts-ignore
    this.$refs.classify.filter(this.filterText);
  }
  createJobClassify() {
    if (this.orgId === "") {
      this.$notify({
        title: "错误",
        message: `请先选择企业名称!`,
        type: "error"
      });
      return;
    }
    this.title = "创建直播分类";
    this.parentId = "";
    this.showBox = true;
    this.classifyName = "";
    this.moverClassify = [];
    delete this.tmpData.disabled;
  }
  filterNode(value: any, data: any): boolean {
    if (!value) return true;
    return data.categoryTitle.includes(value);
  }
}
</script>
<style lang="scss" scoped>
.category{
  .main-body{
    padding: 25px;
  }
  .el-button--text{
    padding: 0;
    background-color: inherit;
    color: $green;
    &:hover,
    &:focus{
      border-color: #fff;
    }
  }
}
</style>
