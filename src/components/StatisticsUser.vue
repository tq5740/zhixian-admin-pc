<template>
  <div id="createAndEdit">
    <el-row>
      <el-form :inline="true">
        <el-form-item v-if="from != 'live'">
          <el-button type="primary" icon="plus" @click="exportReg" :disabled="tableData.length ? false : true">导出报表</el-button>
        </el-form-item>
        <el-form-item v-if="from !== 'live'">
          <el-input style="display: none"></el-input>
          <el-input placeholder="姓名/手机号" v-model="params.query" class='w230' @keyup.13.native="searchKey" @change="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item v-if="from !== 'live'">
          <el-select placeholder="报名方式" class='w150' v-model="params.regMode" @change="getList" clearable @clear="params.regMode = ''">
            <el-option label="管理员安排" value="1"></el-option>
            <el-option label="自主报名" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="from === 'train' || from === 'course'">
          <el-select placeholder="状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="from === 'exam'">
          <el-select placeholder="是否合格" class='w150' v-model="params.isPass" @change="getList" clearable @clear="params.isPass = ''">
            <el-option label="合格" value="1"></el-option>
            <el-option label="不合格" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table ref="mainTable" border :data="tableData" v-loading="loading" element-loading-text="拼命加载中" @sort-change='sortFun' v-if="from === 'live'">
        <el-table-column prop="userModelBO.userName" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="userModelBO.phone" label="手机号码" min-width="100"></el-table-column>
        <el-table-column prop="regMode" label="报名方式" min-width="90">
          <template slot-scope="scope">
            {{scope.row.regMode === 1 ? '管理员安排' : '自主报名'}}
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="70">
          <template slot-scope="scope">
            {{scope.row.role == 1 ? '主讲人' : scope.row.role == 2 ? '助教' : scope.row.role == 3 ? '互动者' : '旁观者'}}
          </template>
        </el-table-column>
        <el-table-column prop="liveChapterTitle" label="直播章节" min-width="100"></el-table-column>
        <el-table-column prop="length" label="观看时长" min-width="80">
          <template slot-scope="scope">
            {{scope.row.length != 0 ? $formatSeconds(scope.row.length) : "-"}}
          </template>
        </el-table-column>
        <el-table-column label="设备" min-width="70">
          <template slot-scope="scope">
            {{scope.row.device == 1 ? '手机' : '电脑'}}
          </template>
        </el-table-column>
        <el-table-column prop="updateTimeStr" label="最后观看时间" width='170'></el-table-column>
      </el-table>
      <el-table ref="mainTable" border :data="tableData" v-loading="loading" element-loading-text="拼命加载中" @sort-change='sortFun' v-else>
        <el-table-column prop="userPhoto" label="头像" max-width='100' align='center'>
          <template slot-scope="scope">
            <img v-if="scope.row.photo && scope.row.photo.includes('http')" @error="errorLoadImg($event)" style="width:30px;height:30px" class='img-bor' :src="scope.row.photo" />
            <img v-else @error="errorLoadImg($event)" style="width:30px;height:30px" class='img-bor' :src="scope.row.photo ? (imgDomain + scope.row.photo) : require('../img/common/userp.svg')" />
          </template>
        </el-table-column>
        <el-table-column prop="userModelBO.userName" label="姓名" min-width="120" v-if="from === 'exam'"></el-table-column>
        <el-table-column prop="realName" label="姓名" min-width="120" show-overflow-tooltip v-else></el-table-column>
        <el-table-column prop="userModelBO.phone" label="手机号码" min-width="130" v-if="from === 'exam'"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="130" v-else></el-table-column>
        <el-table-column prop="regMode" label="报名方式" min-width="100">
          <template slot-scope="scope">
            {{scope.row.regMode === 1 ? '管理员安排' : '自主报名'}}
          </template>
        </el-table-column>
        
        <el-table-column prop="examNumber" label="考试次数"  min-width='80' v-if="from === 'exam'"></el-table-column>
        <el-table-column prop="maxScore" label="最高成绩"  min-width='80' v-if="from === 'exam'"></el-table-column>
        <el-table-column prop="isPass" label="是否合格" min-width='80' v-if="from === 'exam'">
          <template slot-scope="scope">
            {{scope.row.isPass == 1 ? "合格" : "不合格"}}
          </template>
        </el-table-column>
        <el-table-column prop="createUserModel.userName" label="报名人"  min-width='100' v-if="from === 'exam'"></el-table-column>
        <el-table-column prop="createTimeStr" label="报名时间" width='170' v-if="from === 'exam'"></el-table-column>
        <el-table-column label="操作" width='120' v-if="from === 'exam'">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="examDetail(scope.row)" v-if="scope.row.examNumber > 0">考试记录</el-button>
          </template>
        </el-table-column>
        
        <el-table-column prop="stateStr" label="状态" min-width="80" v-if="from != 'exam'"></el-table-column>
        <el-table-column label="学习进度" min-width="80" v-if="from != 'exam'">
          <template slot-scope="scope">
            {{scope.row.progress ? (Math.round(scope.row.progress * 100) + "%") : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="lengthStr" label="学习时长"  min-width='95' v-if="from != 'exam'"></el-table-column>
        <el-table-column prop="score" label="测试成绩"  min-width='80' v-if="from != 'exam'">
          <template slot-scope="scope">
            {{scope.row.scope || "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="updateTimeStr" label="最后学习时间" width='170' v-if="from != 'exam'"></el-table-column>
        <el-table-column label="操作" width="100" v-if="from != 'exam'">
          <template slot-scope="scope">
            <el-button type="text" @click="studyProgress(scope.row)">详情</el-button>
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
              <el-option label="60" value="60"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)"
          layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog width="70%" v-if="statisticsResource" :title="statisticsUser + ' 用户报表'" :visible.sync="statisticsResource" :before-close="statisticsResourceOver" :close-on-click-modal="false" append-to-body>
      <statistics-resource :queryData="queryData" @statisticsResourceOver="statisticsResourceOver" :from="fromUp"></statistics-resource>
    </el-dialog>
    <el-dialog width="70%" v-if="statisticsStudy" :title="statisticsUser + ' 用户报表'" :visible.sync="statisticsStudy" :before-close="statisticsStudyOver" :close-on-click-modal="false" append-to-body>
      <statistics-study :queryData="queryData" @statisticsResourceOver="statisticsStudyOver" :from="fromUp"></statistics-study>
    </el-dialog>
    <el-dialog width="70%" v-if="showExamRecords" :title="statisticsUser + ' 考试记录'" :visible.sync="showExamRecords" :before-close="examRecordsOver" :close-on-click-modal="false" append-to-body>
      <exam-records :queryData="queryData" @statisticsResourceOver="examRecordsOver" :from="fromUp"></exam-records>
    </el-dialog>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Course from "@api/train";
import Exam from "@api/exam";
import Live from "@api/live";

@Component({
  components: {
    "statistics-resource": () => import("@c/StatisticsResource.vue"),
    "statistics-study": () => import("@c/StatisticsStudy.vue"),
    "exam-records": () => import("@c/ExamRecords.vue")
  }
})

export default class StatisticsUser extends Vue {
  @Prop({ default: "" })
  public from: string;
  @Prop({ })
  public queryUser: any;

  from: string = this.from;
  fromUp: string = "";
  tableData: any[] = [];
  total: number = 0;
  statisticsResource: boolean = false;
  statisticsStudy: boolean = false;
  showExamRecords: boolean = false;
  statisticsUser: string = "";
  queryData:any = {};
  params: any = {
    pageSize: 60,
    pageNum: 1,
    courseId: "",
    sortBy: false,
    sortField: "updateTime",
    query: ""
  };
  stateArr: object[] = [
    {
      id: 1,
      text: "未尝试"
    },
    {
      id: 2,
      text: "未完成"
    },
    {
      id: 3,
      text: "已完成"
    }
  ];
  stateArrExam: object[] = [
    {
      id: 2,
      text: "未通过"
    },
    {
      id: 3,
      text: "审核中"
    },
    {
      id: 4,
      text: "已通过"
    }
  ];
  imgDomain: string = this.$store.state.configData.imgDomain;
  courseId: string = this.$store.state.courseData.id;
  trainId: string = this.$store.state.trainData.id;
  examId: string = this.$store.state.examData.id;
  liveId: string = this.$store.state.liveData.id;
  url: any = window.location.host;
  
  created() {
    console.log(this.from);
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.categoryIds ||
        this.params.state ||
        this.params.isPass != ''
      ) {
        this.params.pageNum = 1;
      }
    }
    this.loading = true;
    if (this.from === "course") {
      let data = { ...this.params, courseId: this.courseId };
      Course.course_record_list_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.updateTimeStr = this.$formatDate(i.updateTime);
              i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
              i.lengthStr = i.length ? this.$formatSeconds(i.length) : "-";
            });
            this.tableData = res.data.result;
            this.loading = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
    if (this.from === "train") {
      let data = { ...this.params, trainId: this.trainId };
      Course.train_record_list_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.updateTimeStr = this.$formatDate(i.updateTime);
              i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
              i.lengthStr = i.length ? this.$formatSeconds(i.length) : "-";
            });
            this.tableData = res.data.result;
            this.loading = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
    if (this.from === "exam") {
      let data = { ...this.params, examId: this.examId };
      data.sortField = "examRegId";
      Exam.exam_reg_list_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.createTimeStr = this.$formatDate(i.createTime);
              i.stateStr = this.$mapTypeStr(i.state, this.stateArrExam);
            });
            this.tableData = res.data.result;
            this.loading = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
    if (this.from === "live") {
      let data = { ...this.params, liveId: this.liveId, userId: this.queryUser.userId };
      Live.live_chapter_record_list_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.updateTimeStr = this.$formatDate(i.updateTime);
            });
            this.tableData = res.data.result;
            this.loading = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
  // 考试次数或者学习时长为0的,才能被删除
  selectInit(row: any, index: any) {
    if(row.examNumber == 0 || row.length == 0){
      return true
    } else{
      return false
    }
  }
  exportReg() {
    if (this.from == "course") {
      window.open(
        `${Course.exportCourseUser()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&courseId=${this.courseId}`
        // `http://10.3.1.34:8019/train/course/export_course_user_admin?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&courseId=${this.courseId}`
      );
    }
    if (this.from == "train") {
      window.open(
        `${Course.exportTrainUserAdmin()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&trainId=${this.trainId}`
        // `http://10.3.1.34:8019/train/train/export_train_user_admin?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&trainId=${this.trainId}`
      );
    }
    if (this.from == "exam") {
      window.open(
        `${Exam.exportExamDataAdmin()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&examId=${this.examId}`
        // `http://192.168.10.15:8015/exam/exam_import_export/export_exam_data_admin?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&examId=${this.examId}`
      );
    }
    if (this.from == "live") {
      window.open(
        `${Live.exportLiveReg()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&liveId=${this.liveId}`
        // `http://192.168.10.15:9006/live/reg/export_live_reg?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&liveId=${this.liveId}`
      );
    }
  }
  sortFun() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  studyProgress(e: any){
    this.queryData = e;
    if (this.from === "course") {
      this.statisticsUser = e.realName;
      this.fromUp = "course";
      this.statisticsStudy = true;
    }
    if (this.from === "train") {
      this.statisticsUser = e.realName;
      this.fromUp = "train";
      this.statisticsResource = true;
    }
  }
  examDetail(e: any) {
    this.queryData = e;
    this.statisticsUser = e.createUserModel.userName;
    this.fromUp = "exam";
    this.showExamRecords = true;
  }
  statisticsResourceOver() {
    this.statisticsResource = false;
  }
  statisticsStudyOver() {
    this.statisticsStudy = false;
  }
  examRecordsOver() {
    this.showExamRecords = false;
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  
}  
</script>
<style lang="scss" scoped>
.mg-left10{
  margin-left: 10px;
  margin-top: 10px;
}
</style>

