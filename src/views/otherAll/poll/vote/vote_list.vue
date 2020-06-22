<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createdBtn">创建投票对象</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="exportBtn" v-if="tableData.length !== 0">导出报表</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-input placeholder="投票对象名称" v-model="params.query" class='w230' @keyup.13.native="searchKey" @change="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table ref="mainTable" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="pollObjTitle" label="投票对象名称" min-width="140"></el-table-column>
        <el-table-column prop="pollObjImg" label="图片/视频地址" min-width="140"></el-table-column>
        <el-table-column prop="total" label="总票数" min-width='100'></el-table-column>
        <el-table-column prop="rank" label="排名" min-width='100'></el-table-column>
        <el-table-column prop="createUserName" label="创建人姓名" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width='170'></el-table-column>
        <el-table-column prop="" label="操作" width="140">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="dele(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      <el-form v-if="queryData.showBtn">
        <el-form-item label=" " label-width="120px" class="mg-center">
          <el-button type="primary" @click="back">上一步</el-button>
          <el-button type="primary" @click="saveBtn">完成</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog width="70%" v-if="createEdit" :title="title" :visible.sync="createEdit" :close-on-click-modal="false" :before-close="createEditOver" append-to-body>
      <create-edit @createEditOver="createEditOver" :queryData="queryObj"></create-edit>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Poll from "@api/otherAll";
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue")
  }
})
export default class Companyreg extends Vue {
  @Prop({ default: {} })
  public queryData: object;

  createEdit: boolean = false;
  title: any = "创建投票对象";
  params: any = {
    pageSize: 10,
    pageNum: 1,
    pollId: this.queryData.pollId,
    sortBy: false,
    sortField: "total",
    query: ""
  };
  tableData: any[] = [];
  loading: boolean = false;
  total: number = 0;
  queryObj: object = {};

  created() {
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.type
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Poll.poll_obj_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
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
  edit(e: any): void {
    this.createEdit = true;
    this.title = "编辑投票对象";
    this.queryObj = e;
  }
  createdBtn(): void {
    this.createEdit = true;
    this.title = "创建投票对象";
    this.queryObj = this.queryData;
  }
  createEditOver() {
    this.createEdit = false;
    this.getList();
  }
  dele(e: any) {
    let data = {
      pollObjId: e.pollObjId
    }
    Poll.delete_poll_obj_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            type: "success",
            message: "操作成功！"
          });
          if (this.tableData.length === 1 && this.params.pageNum > 1) {
            this.params.pageNum --;
          }
          this.getList();
        }
      })
  }
  back(){
    this.$emit("createEditTwoOverUp");
  }
  saveBtn() {
    this.$emit("createEditTwoOver");
  }
  exportBtn() {
    window.open(
      `${Poll.exportPollObjDataAdmin()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&pollId=${this.queryData.pollId}`
    );
  }
}
</script>
<style lang="scss" scope>
.mg-center{
    text-align: center;
    margin-right: 13%;
  }
</style>