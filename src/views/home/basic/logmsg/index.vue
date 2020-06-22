<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="类型 : ">
          <el-select v-model="params.type" class='w150' @change="getList" clearable @clear="params.type = ''">
            <el-option v-for="(i , index) in type" :key="i" :label="i" :value="index + 1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间段 : ">
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="请输入操作描述进行搜索" v-model="params.query" class='w320' @keyup.13.native="searchKey" @clear="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="" class='fr'>
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
    </el-row>
    <el-row>
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="project" label="项目" min-width="120"></el-table-column>
        <el-table-column prop="type" label="类型" min-width='80'></el-table-column>
        <el-table-column sortable='custom' prop="createTime" label="创建时间" min-width='180'></el-table-column>
        <el-table-column prop="describes" label="操作描述" min-width='320'></el-table-column>
        <el-table-column prop="" label="操作" min-width="120">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="isLog(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination :current-page.sync="params.pageNum" class="mg15 fr" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-row>
    <!-- 详情弹出框 -->
    <el-dialog :close-on-click-modal="false" width="50%" v-if="showLog" title="日志详情" :visible.sync="showLog" :before-close="closeLog">
      <log :logId="logId"></log>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
  author:
    谭清
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import Historylog from "@api/historylog";
import { debounce } from "typescript-debounce-decorator";
import { State } from "vuex-class";

//https://github.com/ktsn/vuex-class
@Component({
  components: {
    log: () => import("./log.vue")
  }
})
export default class Logmsg extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    type: "",
    startTime: "",
    endTime: ""
  };
  type: string = [
    "增加",
    "删除",
    "修改",
    "审核"
  ];
  tableData: any[] = [];
  time: string[] = [];
  total: number = 0;
  loading: boolean = false;
  showLog: boolean = false;
  logId: string = "";
  created() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.type ||
        this.params.startTime ||
        this.params.endTime
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    Historylog.historylogListAdmin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTime = this.$formatDate(i.createTime);
            i.type = this.type[i.type - 1];
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
  isLog(e: any) {
    this.logId = e.historyLogId;
    this.showLog = true;
  }
  closeLog() {
    this.showLog = false;
    this.logId = "";
  }
}
</script>
<style lang="scss">
  .org-name-dlog {
    text-align: center;
    height: 750px;
    .el-dialog__body {
      padding: 0 !important;
      padding-bottom: 5px;
    }
  }
</style>
