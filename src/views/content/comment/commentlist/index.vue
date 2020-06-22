<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="资源名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select placeholder="资源类型" v-model="params.resourcesType" class='w150' @change="getList" clearable @clear="params.resourcesType = ''">
            <el-option :key="i.id" v-for="i in $store.state.scoreArr" :value="i.id" :label="i.text">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="typeStr" label="资源类型" min-width='120'>
        </el-table-column>
        <el-table-column prop="resourcesName" label="资源名称" min-width='200'></el-table-column>
        <el-table-column prop="_content" label="内容" min-width="200" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="fromUserName" label="评论人" min-width='120'></el-table-column>
        <el-table-column sortable="custom" prop="createTimeStr" label="评论时间" width='170'> </el-table-column>
        <el-table-column prop="replyCount" label="回复" min-width='120'>
          <template slot-scope='scope'>
            <el-button type="text" @click.native="reply(scope.row)">{{scope.row.replyCount}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="100">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='page-num'>
        <el-form :inline="true">
          <el-form-item label="">
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog :close-on-click-modal="false" title="回复列表" :visible.sync="showBox" :before-close="closeBox">
      <div style="min-height:150px" v-loading="loading1" element-loading-text="加载中...">
        <el-table header-row-class-name="thead" :data="tableData1" border>
          <el-table-column prop="fromUserName" label="回复人" min-width='120'>
          </el-table-column>
          <el-table-column prop="_content" min-width="200" :show-overflow-tooltip='true' label="内容">
          </el-table-column>
          <el-table-column prop="createTimeStr" label="时间" min-width='140'>
          </el-table-column>
          <el-table-column prop="toUserName" label="回复对象" min-width='120'>
          </el-table-column>
          <el-table-column prop="" label="操作" min-width="100">
            <template slot-scope='scope'>
              <el-button type="text" @click.native="delReply(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-pagination :current-page.sync="params1.pageNum" class="mg15 fr" background @current-change="getReply" :page-size="parseInt(params1.pageSize)" layout="prev, pager, next, jumper" :total="total1">
          </el-pagination>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Comment from "@api/comment";
@Component({})
export default class Commentlist extends Vue {
  params = {
    query: "",
    resourcesType: "",
    pageSize: 10,
    pageNum: 1,
    startTime: "",
    endTime: "",
    sortField: "createTime",
    sortBy: false
  };
  total: number = 0;
  total1: number = 0;
  time: string[] = [];
  tableData: any[] = [];
  tableData1: any[] = [];
  loading: boolean = false;
  loading1: boolean = false;
  showBox: boolean = false;
  commentId: string = "";
  params1 = {
    pageSize: 10,
    pageNum: 1
  };
  created() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  getReply() {
    this.loading1 = true;
    let data = { commentId: this.commentId, ...this.params1 };
    Comment.reply_list({ data })
      .then(res => {
        if (res.code === 0) {
          this.total1 = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i._content = decodeURIComponent(i.content);
          });
          this.tableData1 = res.data.result;
        }
      })
      .finally(() => {
        this.loading1 = false;
      });
  }
  async reply(e: any) {
    this.commentId = e.commentId;
    this.showBox = true;
    this.getReply();
  }
  closeBox() {
    this.showBox = false;
    this.loading1 = false;
    this.commentId = "";
    this.tableData1 = [];
  }
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startTime = time[0];
      this.params.endTime = time[1];
    } else {
      this.params.startTime = "";
      this.params.endTime = "";
    }
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.resourcesType || this.params.query || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    Comment.comment_list({ data })
      .then(res => {
        if (res.code === 0) {
          console.log(res);
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.typeStr = this.$mapTypeStr(i.resourcesType, this.$store.state.scoreArr);
            i._content = decodeURIComponent(i.content);
            i.createTimeStr = this.$formatDate(i.createTime);
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  delReply(e: any) {
    this.$confirm(`是否删除该条评论吗?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = { commentId: e.commentId };
        this.loading1 = true;
        Comment.delete_reply({ data }).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `删除成功!`,
              type: "success"
            });
            this.getReply();
          }
          this.loading1 = false;
        });
      })
      .catch(() => {
        this.loading1 = false;
      });
  }
  del(e: any) {
    this.$confirm(`是否删除该条评论吗?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = { commentId: e.commentId };
        this.loading = true;
        Comment.delete_comment({ data }).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `删除成功!`,
              type: "success"
            });
            this.getList();
          }
          this.loading = false;
        });
      })
      .catch(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
</style>
