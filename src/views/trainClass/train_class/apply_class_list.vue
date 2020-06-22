<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="班级批次号/培训专业" class='w230' v-model="params.query" @keyup.13.native="searchKey" clearable @change="searchKey">
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="班级类型" class='w150' v-model="params.type" @change="getList" clearable @clear="params.type = ''">
            <el-option v-for="(i) in typeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
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
        <el-table-column prop="dateStr" label="培训时间" width='200'></el-table-column>
        <el-table-column prop="allCounts" label="学员数量" min-width='80'>
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="userList(scope.row, '全部')">{{scope.row.allCounts}}</a>
          </template>
        </el-table-column>
        <el-table-column sortable='custom' prop="createTimeStr" label="创建时间" width='160'></el-table-column>
        <el-table-column prop="orgName" label="培训学校" min-width='100'></el-table-column>
        <el-table-column prop="district" label="所在区县" min-width='80'></el-table-column>
        <el-table-column prop="" label="操作" width="220">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="userFn(scope.row)">学员</el-button>
            <el-button type="text" @click.native="applyExam(scope.row)">{{scope.row.examId ? '申请补考' : '申请考试'}}</el-button>
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
    <el-dialog width="80%" v-if="showUser" title="培训班级学员" :visible.sync="showUser" :close-on-click-modal="false" :before-close="createUserOver">
      <user-list @createUserOver="createUserOver" :queryUser="queryUser" from="apply"></user-list>
    </el-dialog>
    <el-dialog width="70%" v-if="applyBox" :title="applyData.examId ? '申请补考' : '申请考试'" :visible.sync="applyBox" :close-on-click-modal="false" :before-close="applyBoxOver">
      <el-form label-width="120px">
        <el-form-item label="考试开始时间：">
          <el-date-picker v-model="startDay" placeholder="请选择日期" type="date" value-format='yyyy-MM-dd' :picker-options="{}" :disabled="true"></el-date-picker>
          &nbsp;
          <el-time-select v-model="startTime" :picker-options="{ start: '08:00', step: '00:30', end: '20:00' }" placeholder="选择时间"></el-time-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="applyExamSave" :loading="isPending">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog width="50%" v-if="showStatistics" title="统计" :visible.sync="showStatistics" :close-on-click-modal="false">
      <el-table header-row-class-name="thead" :data="statisticsData" border header-align="center" element-loading-text="加载中...">
        <el-table-column prop="testRatio" label="考试标准" align="center" min-width="80">
          <template slot-scope='scope'>
            {{scope.row.testRatio ? scope.row.testRatio * 100 + "%" : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="allCounts" label="总人数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="noApplyPrints" label="待申请人数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="noPrints" label="未打印人数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="yesPrints" label="已打印人数" align="center" min-width="80">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="userList(scope.row, '已打印')">{{scope.row.yesPrints}}</a>
          </template>
        </el-table-column>
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
  trainclassId: string | number = "";

  typeArr: object[] = [
    {
      id: 1,
      text: "技能培训"
    },
    {
      id: 2,
      text: "创业培训"
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  time: string[] = [];
  total: number = 0;
  showUser: boolean = false;
  queryUser: object = {};
  showStatistics: boolean = false;
  statisticsData: any[] = [];
  queryData: any = {};
  applyBox: boolean = false;
  applyData: object = {};
  startDay: string = "";
  startTime: string = "";
  isPending: boolean = false;

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  // 申请考试
  applyExam(e: any) {
    this.applyData = e;
    this.startDay = this.$formatDate(e.endDate, "YYYY-MM-DD");
    this.applyBox = true;
  }
  applyExamSave(): void {
    if (this.isPending) return;
    if (this.startTime === "") {
      this.$notify({
        title: "提示",
        message: "请选择考试开始时间！",
        type: "error"
      });
      return;
    }
    let data = {
      classId: this.applyData.classId,
      orgId: this.applyData.orgId,
      startTime: this.startTime + ':00'
    }
    this.isPending = true;
    if (this.applyData.examId) {
      data.examId = this.applyData.examId;
      Trainclass.apply_repair_exam({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "申请成功！",
              type: "success"
            });
            this.applyBox = false;
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.isPending = false;            
          }, 5000);
        });  
    } else {
      Trainclass.apply_exam({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "申请成功！",
              type: "success"
            });
            this.applyBox = false;
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.isPending = false;            
          }, 5000);
        });  
    }
    
  }
  applyBoxOver() {
    this.applyBox = false;
    this.getList();
  }
  createUserOver() {
    this.getList();
    this.showUser = false;
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
    Trainclass.train_class_apply_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.dateStr = this.$formatDate(i.startDate, "YYYY-MM-DD") + ' 至 ' + this.$formatDate(i.endDate, "YYYY-MM-DD");
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
  sortFunc(e: any) {
    if (e.prop === "createTimeStr") {
      this.params.sortField = "createTime"
    } else {
      this.params.sortField = "classId"
    }
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  userFn(e: any) {
    this.queryUser = e;
    this.showUser = true;
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
}
</script>
<style lang="scss" scope>
</style>

