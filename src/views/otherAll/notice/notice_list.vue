<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createdBtn" v-if="prm.isCreate">创建公告</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="公告标题" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="公告状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @selection-change="handleSelectionChange" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column type="selection" align="center" min-width='55' v-if="prm.isDelete" :selectable='selectInit'></el-table-column>
        <el-table-column prop="noticeTitle" label="公告标题" min-width="210">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="onClickTitle(scope.row)">{{scope.row.noticeTitle}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'></el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='80'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" min-width='120'></el-table-column>
        <el-table-column prop="" label="操作" width="200">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="prm.isDelete">
        <span class="mag-top20">
          <el-checkbox class="mag-left20" v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
          <el-button class="mag-left20" @click="delCheck">删除</el-button>
        </span>
      </el-row>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
            共有
            <span class="fc303e">{{total}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params.pageSize" class='w65' @change='params.pageNum = 1;getList()'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog width="70%" v-if="createEdit" :title="title" :visible.sync="createEdit" :close-on-click-modal="false">
      <create-edit @createEditOver="createEditOver" :queryData="queryData" :title="{'title':title}"></create-edit>
    </el-dialog>
    <!-- 预览弹出框 -->
    <el-dialog title="公告预览" width="400px" style="height: 900px; overflow: hidden;" class="artic-dlog" :visible.sync="isShowPreview">
      <iframe :src="previewSrc" style="height: 667px; border: 2px dashed red" width="375px" frameborder="0"></iframe>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Notice from "@api/data";
import Org from "@api/org";
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue")
  }
})
export default class Companyreg extends Vue {
  createEdit: boolean = false;
  questionBox: boolean = false;
  createEditThree: boolean = false;
  recordBox: boolean = false;
  forms: any = null;
  title: any = "创建公告";
  params: any = {
    pageSize: 10,
    pageNum: 1,
    sortBy: false,
    sortField: "createTime",
    query: "",
    state: ""
  };
  prm = {
    isDelete: false,
    isCreate: false,
    isUpdate: false,
    isOnline: false
  };
  state: number = 4;
  noticeId: string | number = "";

  isShow: object = {
    user: false,
    class: false
  }

  stateArr: object[] = [
    {
      id: 1,
      text: "草稿"
    },
    {
      id: 4,
      text: "发布中"
    },
    {
      id: 5,
      text: "已关闭"
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  total: number = 0;
  queryData: any = {};

  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];
  delId: string = "";

  isShowPreview: boolean = false;
  previewSrc: string = "";

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  handleCheckAllChange() {
    if (this.toggleCheckbox) {
      this.$refs.mainTable.toggleAllSelection();
    } else {
      this.$refs.mainTable.clearSelection();
    }
    this.handleSelectionChange;
  }
  handleSelectionChange(e: any) {
    this.selectData = e;
    let checkedCount = e.length;
    this.toggleCheckbox = checkedCount === this.tableData.length && this.tableData.length != 0;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
  }
  selectInit(row: any, index: any) {
    if(row.state != 4){
      return true
    } else{
      return false
    }
  }
  on_off(e: any): void {
    let data = {
      noticeId: e.noticeId,
      state: e.state == 4 ? 5 : 4
    };
    Notice.online_offline_notice_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: `${e.state == 4 ? "关闭" : "发布"}成功!`,
          type: "success"
        });
        this.getList();
      }
    });
  }
  delCheck(){
    if (this.selectData.length === 0) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个公告!`,
        type: "error"
      });
      return;
    }
    let id = JSON.stringify(this.selectData.map(i => i.noticeId));
    this.delId = id.replace(/"|\[|\]/g,'');
    this.del();
  }
  del(e: any): void {
    this.$confirm('确认删除所选公告?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        noticeIds: e ? e.noticeId : this.delId
      };
      Notice.delete_notice_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "删除成功！",
            type: "success"
          });
          if ((this.selectData.length === this.tableData.length || this.tableData.length === 1 ) && this.params.pageNum > 1) {
            this.params.pageNum --;
          }
          this.getList();
        }
      });
    }).catch(() => { });
  }
  edit(e: any): void {
    this.queryData = e;
    this.createEdit = true;
    this.title = "编辑公告";
  }
  createdBtn(): void {
    this.queryData = {};
    this.createEdit = true;
    this.title = "创建公告";
  }
  createEditOver() {
    this.createEdit = false;
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.state
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Notice.notice_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  onClickTitle(e: any){
    // 生产环境
    this.previewSrc = "https://m.weijiuye.com.cn/pages/discover/publicnotice/detail?noticeId=" + e.noticeId;
    this.isShowPreview = true;
  }
}
</script>
<style lang="scss" scope>
  .mag-top20 {
    float: left;
    margin-top: 15px;
  }
  .mag-left20 {
    margin-left: 15px;
  }
</style>
<style lang="scss">
  .artic-dlog {
    text-align: center;
    height: 750px;
    .el-dialog__body {
      padding: 0 !important;
      padding-bottom: 5px;
    }
  }
</style>

