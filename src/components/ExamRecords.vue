<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item>
          <el-select placeholder="状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @sort-change='sortFunc'
        header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column label="编号" min-width='50'>
          <template slot-scope='scope'>
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column label="头像" min-width='70' align="center">
          <template slot-scope="scope">
            <img v-if="scope.row.img && scope.row.img.includes('http')" class='img-bor' :src="scope.row.img" />
            <img v-else class='img-bor' :src="scope.row.courseChapterRecord && scope.row.img ? $store.state.configData.imgDomain + scope.row.img : require('../img/common/userp.svg')" />
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" min-width='90'></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width='150'></el-table-column>
        <el-table-column prop="examTitle" label="试卷名称" min-width='150'></el-table-column>
        <el-table-column prop="examRecordNumber" label="考试次数" min-width='90'></el-table-column>
        <el-table-column label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.recordStateStr}}
          </template>
        </el-table-column>
        <el-table-column prop="submitTimeStr" label="交卷时间" min-width='180'></el-table-column>
        <el-table-column prop="recordScore" label="测试成绩" min-width='100'></el-table-column>
        <el-table-column label="是否阅卷" min-width='80'>
          <template slot-scope="scope" v-if="scope.row.examType != 1">
            {{scope.row.isMark == 1 ? '已阅卷' : '未阅卷'}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="110">
          <template slot-scope='scope'>
            <el-button v-if="scope.row.examType != 1 && scope.row.recordState == 2" type="text"  @click.native="lookPaper(scope.row)">阅卷</el-button>
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

    <el-dialog width="70%" v-if="showTestPaper" title="阅卷" :visible.sync="showTestPaper" :close-on-click-modal="false" :before-close="examPaperOver" append-to-body>
      <exam-paper :queryData="queryPaper" @examPaperOver="examPaperOver"></exam-paper>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Exam from "@api/exam";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "exam-paper": () => import("@c/TestPaper.vue")
  }
})
export default class Companyreg extends Vue {
  @Prop({ default: {} })
  public queryData: any;
  @Prop({ default: "" })
  public from: string;


  params: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "submitTime",
    query: "",
    startTime: "",
    endTime: ""
  };
  stateArr: object[] = [
    {
      id: 1,
      text: "考试中"
    },
    {
      id: 2,
      text: "已交卷"
    },
    {
      id: 3,
      text: "考试异常"
    }
  ];
  tableData: any[] = [];
  showTestPaper: boolean = false;
  loading: boolean = false;
  isPending: boolean = false;
  total: number = 0;
  queryPaper: any = {};

  created() {
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.regMode ||
        this.params.isPass
      ) {
        this.params.pageNum = 1;
      }
    }
    this.params.examId = this.queryData.examId;
    this.params.userId = this.queryData.userId;
    let data = { ...this.params };
    this.loading = true;
    Exam.query_exam_record_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.submitTimeStr = i.submitTime ? this.$formatDate(i.submitTime, "YYYY-MM-DD hh:mm:ss") : "考试中";
            i.recordStateStr = this.$mapTypeStr(i.recordState, this.stateArr);
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  lookPaper(e: any) {
    let data = {
      examId: e.examId,
      examRecordId: e.examRecordId
    };
    this.loading = true;
    Exam.query_exam_paper_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.queryPaper = res.data.paperMap;
          this.queryPaper.examRecordId = e.examRecordId;
          this.showTestPaper = true;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  examPaperOver() {
    this.showTestPaper = false;
    this.getList();
  }
}
</script>
<style lang="scss" scope>
  .img-bor {
    width: 30px;
    height: 30px;
  }
</style>