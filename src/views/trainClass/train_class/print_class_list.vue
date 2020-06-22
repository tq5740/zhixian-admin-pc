<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="班级批次号/培训专业" class='w230' v-model="params.query" @keyup.13.native="searchKey" clearable @change="searchKey">
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column sortable='custom' prop="classId" label="班级批次号" min-width='130'>
          <template slot-scope="scope">
            <a style="cursor: pointer" @click="userList(scope.row, '全部')">
              {{scope.row.classId}}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="班级类型" min-width="80">
          <template slot-scope="scope">
            {{scope.row.type == 1 ? '技能培训' : scope.row.type == 2 ? '创业培训' : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="trainMajor" label="培训专业" min-width='100'></el-table-column>
        <el-table-column prop="majorLevel" label="专业等级" min-width='80'></el-table-column>
        <el-table-column prop="allCounts" label="学员数量" min-width='80'></el-table-column>
        <el-table-column sortable='custom' prop="noPrints" label="未打印人数" min-width='80'>
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="userList(scope.row, '未打印')">{{scope.row.noPrints}}</a>
          </template>
        </el-table-column>
        <el-table-column sortable='custom' prop="yesPrints" label="已打印人数" min-width='80'>
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="userList(scope.row, '已打印')">{{scope.row.yesPrints}}</a>
          </template>
        </el-table-column>
        <el-table-column sortable='custom' prop="printTimeStr" label="打印时间" width='160'></el-table-column>
        <el-table-column prop="orgName" label="培训学校" min-width='100'></el-table-column>
        <el-table-column prop="" label="操作" width="160">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="userList(scope.row, '全部')">打印证书</el-button>
            <el-button type="text" @click.native="statistics(scope.row)">统计</el-button>
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)"
          layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog width="80%" v-if="showUser" title="培训班级学员" :visible.sync="showUser" :close-on-click-modal="false" :before-close="closeUser">
      <user-list :queryUser="queryUser" from="print"></user-list>
    </el-dialog>
    <el-dialog width="50%" v-if="showStatistics" title="统计" :visible.sync="showStatistics" :close-on-click-modal="false">
      <el-table header-row-class-name="thead" :data="statisticsData" border header-align="center" element-loading-text="加载中...">
        <el-table-column prop="allCounts" label="学员总人数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="studyRatio" label="学习标准" align="center" min-width="80">
          <template slot-scope='scope'>
            {{scope.row.studyRatio ? scope.row.studyRatio * 100 + "%" : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="testRatio" label="考试标准" align="center" min-width="80">
          <template slot-scope='scope'>
            {{scope.row.testRatio ? scope.row.testRatio * 100 + "%" : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="noApplyPrints" label="待申请人数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="noPrints" label="未打印人数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="yesPrints" label="已打印人数" align="center" min-width="80">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="userList(scope.row, '已打印')">{{scope.row.yesPrints}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="failApply" label="申请失败人数" align="center" min-width="80"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Trainclass from "@api/trainClass";
@Component({
  components: {
    "user-list": () => import("./user_list.vue")
  }
})
export default class Companyreg extends Vue {
  title: any = "创建培训班级";
  params: any = {
    pageSize: 10,
    pageNum: 1,
    sortBy: false,
    sortField: "classId",
    query: "",
    startTime: "",
    endTime: ""
  };
  prm = {
    isDelete: false,
    isCreate: false,
    isUpdate: false
  };
  state: number = 4;
  
  tableData: any[] = [];
  loading: boolean = false;
  total: number = 0;
  showStatistics: boolean = false;
  statisticsData: any[] = [];

  showUser: boolean = false;
  queryUser: object = {};

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.state ||
        this.params.type
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Trainclass.train_class_print_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.dateStr = this.$formatDate(i.startDate, "YYYY-MM-DD") + ' 至 ' + this.$formatDate(i.endDate, "YYYY-MM-DD");
            i.printTimeStr = i.printTime ? this.$formatDate(i.printTime) : '-';
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  changeTime() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc(e: any) {
    if (e.prop === "noPrints") {
      this.params.sortField = "noprints"
    } else if (e.prop === "yesPrints"){
      this.params.sortField = "yesprints"
    } else if (e.prop === "printTimeStr"){
      this.params.sortField = "printTime"
    } else {
      this.params.sortField = e.prop
    }
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  statistics(e: any) {
    var arr = [];
    arr.push(e);
    this.statisticsData = arr;
    this.showStatistics = true;
  }
  userList(e: any, str: string) {
    this.queryUser = e;
    this.queryUser.from = str;
    this.showUser = true;
  }
  closeUser() {
    this.showUser = false;
    this.getList();
  }
}
</script>
<style lang="scss" scope>
</style>

