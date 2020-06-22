
<template>
  <div class="category">
      
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="" class="btn-main">
          <el-button type="primary" @click.native="createJobClassify">创建知识点</el-button>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="企业名称" filterable clearable v-model="params.orgId" @change="getCategory">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="params.query" placeholder="请输入检索关键词" class="w230" @keyup.13.native="getCategory" @change="getCategory()" clearable></el-input>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row class="main-body" v-loading="loading" element-loading-text="加载中">
      <el-tree :filter-node-method="filterNode" ref="classify" :data="pointClassify" :props="defaultProps" @node-expand="getChildren" node-key="value" :default-expand-all="false" :expand-on-click-node="true" :empty-text="`暂无更多数据`">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => edit(node,data)">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="() => del(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
            共有
            <span class="fc303e">{{total}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params.pageSize" class='w65' @change='params.pageNum = 1;getCategory()'>
              <el-option label="50" value="50"></el-option>
              <el-option label="99" value="99"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getCategory('type')" :page-size="parseInt(params.pageSize)"
          layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    

    <el-dialog :close-on-click-modal="false" :title="title" v-if="showBox" :visible.sync="showBox">
      <el-form :label-width="`100px`">
        <el-form-item label="知识点名称">
          <el-input v-model="classifyName" auto-complete="off" class="w80per"></el-input>
        </el-form-item>

        <el-form-item label="上级知识点">
          <el-cascader v-model="moverClassify" class='w80per' placeholder="请选择" :options="pointClassifyClone" :props="defaultProps" @change='change' filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item label="" :label-width="`100px`">
          <el-button @click.native='showBox = false'>取消</el-button>
          <el-button type="primary" :loading="isPending" @click.native='createSaveBtn'>确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Watch } from "vue-property-decorator";
import Point from "@api/exam";
import Org from "@api/org";
import { emptyLast } from "@utils/index";

//https://github.com/ktsn/vuex-class
@Component({})
export default class Pointclassify extends Vue {
  pointClassify: any = [];
  pointClassifyClone: any = [];
  examPointId: string = "";
  loading: boolean = false;
  showBox: boolean = false;
  isDelPremission: boolean = false;
  isUpdatePremission: boolean = false;
  isPending: boolean = false;
  type: string = "1";
  // filterText: string = "";
  classifyList: object[] = [];
  title: string = "创建知识点";
  moverClassify: any[] = [];
  workCategoryId: string = "";
  classifyName: string = "";
  copyClassifyList: object[] = [];
  defaultProps: object = {
    children: "children",
    label: "examPointTitle",
    value: "examPointId"
  };
  tmpData: any = {};
  parentId: string = "";
  top: object = {
    examPointTitle: "顶层",
    examPointId: "-1",
    children: null,
    parentId: "0"
  };
  params: any = {
    pageSize: 50,
    pageNum: 1,
    orgId: this.$store.state.userInfo.org.orgId,
    query: ""
    // sortBy: false,
    // sortField: "createTime"
  };
  total: number = 0;
  created() {
    this.getCategory();
    this.getOrgList();
  }
  getChildren(all: any) {
    this.getCategory('',all);
  }
  getObj(arr: any, id: string, data: any) {
    for (let i of arr) {
      if (i.examPointId == id) {
        i.children = data;
      } else {
        if (i.children && i.children.length !== 0){
          this.getObj(i.children, id, data)
        }
      }
    }
  }
  getCategory(type: string,e: any) {
    if (type != 'type') {
      if (
        this.params.query ||
        this.params.orgId
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = {
      ...this.params
    };
    e ? data.examPointId = e.examPointId : '';
    Point.point_list_admin({ data }).then(res => {
      if (res.code === 0) {
        let arr = emptyLast(res.data.result)
        if (e) {
          this.getObj(this.pointClassify, e.examPointId, arr)
        } else {
          this.total = res.data.total;
          this.pointClassify = arr;
          this.pointClassifyClone = [this.top, ...arr];
        }
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
  createSaveBtn() {
    if (!this.classifyName || this.classifyName.includes(" ")) {
      this.$notify({
        title: "错误",
        message: `请填写知识点名称，且不能含有空格`,
        type: "error"
      });
      return;
    }
    if (this.parentId === "") {
      this.$notify({
        title: "错误",
        message: `请选择上级知识点!`,
        type: "error"
      });
      return;
    }
    if (this.params.orgId === "") {
      this.$notify({
        title: "错误",
        message: `请选择企业名称!`,
        type: "error"
      });
      return;
    }

    this.isPending = true;
    let data: any = {
      parentId: this.parentId,
      examPointTitle: this.classifyName,
      orgId: this.params.orgId
    };
    if (this.title === "创建知识点") {
      Point.create_exam_point_admin({ data })
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
      data.examPointId = this.examPointId;
      Point.update_exam_point_admin({ data })
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
    this.title = `编辑知识点`;
    this.classifyName = data.examPointTitle;
    this.examPointId = data.examPointId;
    this.params.orgId = data.orgId;
    if (data.parentId === "0") {
      this.moverClassify.push("-1");
      this.parentId = "0";
    } else {
      this.moverClassify = [
        ...this.$getFather(
          this.pointClassifyClone,
          this.pointClassifyClone,
          data.parentId
        ),
        data.parentId
      ];
      this.parentId = data.parentId;
    }
    this.showBox = true;
  }
  del(node: any, datas: any) {
    this.examPointId = datas.examPointId;
    this.$confirm("确认删除该知识点吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = {
          examPointId: datas.examPointId
        };
        this.isPending = true;
        Point.delete_exam_point_admin({ data })
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
      });
  }
  createJobClassify() {
    this.title = "创建知识点";
    this.showBox = true;
    this.classifyName = "";
    this.moverClassify = [];
    delete this.tmpData.disabled;
  }
  filterNode(value: any, data: any): boolean {
    if (!value) return true;
    return data.examPointTitle.includes(value);
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
