<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createdBtn" v-if="prm.isCreate">创建调查</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="调查名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="调查状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="surveyImg" label="调查封面" width='100' align='center'>
          <template slot-scope="scope">
            <img class='img-bor' :src="scope.row.surveyImg ? ($store.state.configData.imgDomain + scope.row.surveyImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/survey.jpg' + $imgSize['30x30'])"/>
          </template>
        </el-table-column>
        <el-table-column prop="surveyTitle" label="调查名称" min-width="140"></el-table-column>
        <el-table-column prop="visibleRange" label="可见范围" min-width='100'>
          <template slot-scope="scope">
            {{scope.row.visibleRange == 1 ? "仅自己" : scope.row.visibleRange == 2 ? "本企业" : scope.row.visibleRange == 3 ? "开放" : ""}}
          </template>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'></el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width='170'></el-table-column>
        <el-table-column prop="" label="操作" width="380">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="questionBtn(scope.row)">试题</el-button>
            <el-button type="text" @click.native="recordBtn(scope.row)">报名</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="prm.isStatistics" type="text" @click.native="statistics(scope.row)">统计</el-button>
            <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="del(scope.row)">删除</el-button>
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
    </el-row>
    <el-dialog width="70%" v-if="createEditOne" :title="title" :visible.sync="createEditOne" :close-on-click-modal="false" :before-close="oneOver">
      <create-edit @createEditOver="createEditOver" :queryData="queryData" :title="{'title':title}"></create-edit>
    </el-dialog>
    <el-dialog width="70%" v-if="questionBox" title="调查试题" :visible.sync="questionBox" :close-on-click-modal="false" :before-close="questionOver">
      <question-list @questionOver='questionOver' @createEditTwoOverUp="createEditTwoOverUp" @createEditTwoOverDown="createEditTwoOverDown" :queryData="queryData"></question-list>
    </el-dialog>
    <el-dialog width="70%" v-if="recordBox" title="调查报名" :visible.sync="recordBox" :close-on-click-modal="false" :before-close="recordOver">
      <record-list @recordOver="recordOver" @createEditThreeOverUp="createEditThreeOverUp" @createEditThreeOver="recordOver" :queryData="queryData"></record-list>
    </el-dialog>
    <el-dialog title="统计" v-if="statisticsState" :visible.sync="statisticsState">
      <el-table header-row-class-name="thead" :data="statisticsData" border v-loading="loading" header-align="center" element-loading-text="加载中...">
        <el-table-column prop="anonymousNumber" label="匿名调查人数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="attendNumber" label="总参与人数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="completeNumber" label="完成调查人数" align="center" min-width="80">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="statisticsFun()">{{scope.row.completeNumber}}</a>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog width="70%" v-if="statisticsUser" :title="surveyTitle" :visible.sync="statisticsUser" :close-on-click-modal="false">
      <statistics-user :queryData="queryData"></statistics-user>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Survey from "@api/data";
import Org from "@api/org";
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue"),
    "question-list": () => import("./question/question_list"),
    "record-list": () => import("./record/record_list"),
    "statistics-user": () => import("./statistics_user")
  }
})
export default class Companyreg extends Vue {
  createEditOne: boolean = false;
  questionBox: boolean = false;
  createEditThree: boolean = false;
  recordBox: boolean = false;
  forms: any = null;
  title: any = "创建调查";
  params: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "createTime",
    query: "",
    startDate: "",
    endDate: ""
  };
  prm = {
    isDelete: false,
    isCreate: false,
    isUpdate: false,
    isOnline: false,
    isStatistics: false
  };
  state: number = 4;
  surveyId: string | number = "";

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
  time: string[] = [];
  total: number = 0;
  queryData: any = {};

  statisticsState: boolean = false;
  statisticsUser: boolean = false;
  surveyTitle: string = "";
  statisticsData: any[] = [];

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  // 上下线
  on_off(e: any): void {
    let data = {
      surveyId: e.surveyId,
      state: e.state == 4 ? 5 : 4
    };
    Survey.online_offline_survey_admin({ data }).then(res => {
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
  // 展示删除细节
  showDelDialog(e: any): void {
    this.isDelShow = true;
    this.delSurveyId = e.surveyId;
  }
  // 执行逻辑删除
  del(e: any): void {
    this.$confirm('确认删除该调查?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        surveyId: e.surveyId
      };
      Survey.del_survey_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "删除成功！",
            type: "success"
          });
          if (this.tableData.length === 1 && this.params.pageNum > 1) {
            this.params.pageNum --;
          }
          this.getList();
        }
      });
    }).catch(() => { });
  }
  // 编辑
  edit(e: any): void {
    this.loading = true;
    let data = {
      surveyId: e.surveyId
    };
    Survey.query_survey_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.queryData = { surveyId: res.data.surveyId };
          this.createEditOne = true;
          this.title = "编辑调查";
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  // 创建调查
  createdBtn(): void {
    this.createEditOne = true;
    this.title = "创建调查";
    this.queryData = {};
  }
  
  createEditOver(e: string) {
    e ? this.queryData = { surveyId: e } : '';
    this.createEditOne = false;
    this.questionBox = true;
    this.getList();
  }
  oneOver() {
    this.createEditOne = false;
    this.getList();
  }
  questionOver() {
    this.questionBox = false;
    this.getList();
  }
  createEditTwoOverUp() {
    this.createEditOne = true;
    this.questionBox = false;
  }
  createEditTwoOverDown(e: string) {
    e ? this.queryData = { surveyId: e } : '';
    this.questionBox = false;
    this.recordBox = true;
  }
  createEditThreeOverUp() {
    this.questionBox = true;
    this.recordBox = false;
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.state ||
        this.params.surveyType ||
        this.params.startDate ||
        this.params.endDate
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Survey.survey_list_admin({ data })
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
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startDate = time[0];
      this.params.endDate = time[1];
    } else {
      this.params.startDate = "";
      this.params.endDate = "";
    }
    this.getList();
  }
  questionBtn(e: any) {
    this.queryData = e;
    this.questionBox = true;
  }
  recordBtn(e: any) {
    this.queryData = e;
    this.recordBox = true;
  }
  recordOver() {
    this.recordBox = false;
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  // 统计
  statistics(e: any) {
    this.loading = true;
    this.queryData = e;
    this.surveyTitle = e.surveyTitle;
    let data = {
      surveyId: e.surveyId
    }
    Survey.survey_statistics_admin({ data })
      .then((res) => {
        if (res.code === 0) {
          this.statisticsData = [];
          this.statisticsData.push(res.data);
          this.statisticsState = true;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  statisticsFun() {
    this.statisticsUser = true;
  }
}
</script>
<style lang="scss" scope>
</style>