<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="created_exam" v-if="prm.isCreate">创建考试</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="考试标题" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader placeholder="考试分类" class='w150' filterable :options="examClassify" :props="keyName" v-model="categoryId" @change="ClassifyId" change-on-select clearable></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="考试类型" class='w150' v-model="params.type" @change="getList" clearable @clear="params.type = ''">
            <el-option v-for="(i) in typeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="考试状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select placeholder="可见范围" class='w150' v-model="params.visibleRange" @change="getList" clearable @clear="params.visibleRange = ''">
            <el-option label="仅自己" value="1"></el-option>
            <el-option label="本企业" value="2"></el-option>
            <el-option label="开放" value="3"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @selection-change="handleSelectionChange" @sort-change='sortFunc'
        header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column type="selection" align="center" min-width='55' v-if="prm.isDelete" :selectable='selectInit'></el-table-column>
        <el-table-column prop="examImg" label="考试封面" width='100' align='center'>
          <template slot-scope="scope">
            <img class='img-bor' :src="scope.row.examImg ? (scope.row.examImg.includes('http') ? scope.row.examImg : $store.state.configData.imgDomain + scope.row.examImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/exam.jpg' + $imgSize['30x30'])"
            />
          </template>
        </el-table-column>
        <el-table-column prop="examTitle" label="考试标题" min-width="140"></el-table-column>
        <el-table-column prop="typeStr" label="考试类型" min-width='100'></el-table-column>
        <el-table-column prop="categoryTitle" label="考试分类" min-width='100'></el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="考试时长" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.type == 1 ? "不限" : scope.row.examLength + "分钟"}}
          </template>
        </el-table-column>
        <el-table-column sortable='custom' prop="startTimeStr" label="考试开始时间" width='180'></el-table-column>
        <el-table-column prop="" label="操作" width="410">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.state == 4 && scope.row.type != 1" type="text" @click.native="examReg(scope.row)">报名</el-button>
            <el-button v-if="prm.isAudit && scope.row.state != 5 && scope.row.state != 4" type="text" @click.native="audit(scope.row)">审核</el-button>
            <el-button v-if="prm.isRecommend && scope.row.state == 4" type="text" @click.native="recommend(scope.row)">{{scope.row.isRecommend ? "取消推荐" : "推荐"}}</el-button>
            <el-button type="text" v-if="scope.row.isAllow == 1 && scope.row.endTime < Date.now()" @click.native="oncemore(scope.row)">补考</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 2 && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="prm.isStatistics" type="text" @click.native="statistics(scope.row)">统计</el-button>
            <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="showDelDialog(scope.row)">删除</el-button>
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)"
          layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog :close-on-click-modal="false" width="30%" title="审核" :visible.sync="showAudit" :before-close="closeAudit">
      <div>
        <el-radio v-model="state" :label="4">通过</el-radio>
        <el-radio v-model="state" :label="2">不通过</el-radio>
        <br />
        <br />
        <el-input v-show="state ==2" tyle="text" placeholder="请输入审核不通过的原因" v-model="reason"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog width="70%" v-if="createEditOne" :title="title" :visible.sync="createEditOne" :close-on-click-modal="false" :before-close="closeOne">
      <create-edit-one @closeOne="closeOne" @createEditOneOver="createEditOneOver" :queryData="queryExamData" :title="{'title':title}"></create-edit-one>
    </el-dialog>
    <el-dialog width="70%" v-if="createEditThree" :title="title" :visible.sync="createEditThree" :close-on-click-modal="false" :before-close="closeThree">
      <create-edit-three :options='examData' @createEditThreeOverUp="createEditThreeOverUp" @createEditThreeOver="createEditThreeOver" :isShow='isShow'></create-edit-three>
    </el-dialog>
    <el-dialog width="70%" v-if="statisticsUser" title="考试用户报表" :visible.sync="statisticsUser" :close-on-click-modal="false" :before-close="statisticsUserOver">
      <statistics-user @statisticsUserOver="statisticsUserOver" from="exam"></statistics-user>
    </el-dialog>
    <el-dialog width="50%" v-if="statisticsState" title="统计" :visible.sync="statisticsState" :close-on-click-modal="false">
      <el-table header-row-class-name="thead" :data="statisticsData" border v-loading="loading" header-align="center" element-loading-text="加载中...">
        <el-table-column prop="browseNumber" label="浏览量" align="center" min-width="80"></el-table-column>
        <el-table-column prop="questionNumber" label="试题数量" align="center" min-width="80"></el-table-column>
        <el-table-column prop="shouldExamNumber" label="应考人数" align="center" min-width="80" v-if="examType != 1">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="shouldExam(scope.row)">{{scope.row.shouldExamNumber}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="actualExamNumber" label="实考人数" align="center" min-width="80" v-if="examType != 1"></el-table-column>
        <el-table-column prop="score" label="平均成绩" align="center" min-width="80" v-if="examType != 1"></el-table-column>
        <el-table-column prop="passRatioStr" label="合格率" align="center" min-width="80" v-if="examType != 1"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog width="30%" v-if="isDelShow" title="删除" :visible.sync="isDelShow" :close-on-click-modal="false" :before-close="closeDel">
      <el-form>
        <el-form-item label="请填写删除原因：">
          <el-input rows="3" type="textarea" placeholder="原因不能为空" v-model="delCause"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="del">确 定</el-button>
        <el-button @click="closeDel">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog width="70%" v-if="oncemoreBox" title="创建补考" :visible.sync="oncemoreBox" :close-on-click-modal="false" :before-close="oncemoreBoxOver">
      <el-form label-width="120px">
        <el-form-item label="补考开始时间：">
          <el-date-picker placeholder="请选择日期" v-model="startDay" type="date" value-format='yyyy-MM-dd' :picker-options="{disabledDate}"></el-date-picker>
          &nbsp;
          <el-time-select v-model="startTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00' }" placeholder="请选择时间"></el-time-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="examSave" :loading="isPending">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Exam from "@api/exam";
import Category from "@api/category";
import Org from "@api/org";
import { emptyLast } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "create-edit-one": () => import("./createAndEdit_one.vue"),
    "create-edit-three": () => import("@c/ChoiceUser.vue"),
    "statistics-user": () => import("@c/StatisticsUser.vue")
  }
})
export default class Companyreg extends Vue {
  isDelShow: boolean = false;
  createEditOne: boolean = false;
  createEditThree: boolean = false;
  statisticsState: boolean = false;
  statisticsUser: boolean = false;
  statisticsData: any = [];
  forms: any = null;
  title: any = "创建考试";
  keyName: object = {
    label: "categoryTitle",
    value: "categoryId"
  };
  params: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "createTime",
    query: "",
    startTime: "",
    endTime: ""
  };
  prm = {
    isDelete: false,
    isCreate: false,
    isAudit: false,
    isUpdate: false,
    isOnline: false,
    isRecommend: false,
    isStatistics: false
  };
  state: number = 4;
  reason: string = "";
  examId: string | number = "";
  examClassify: any[] = [];

  ArticSrc: string = "";
  isShowArtic: boolean = false;
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
      id: 2,
      text: "未通过"
    },
    {
      id: 3,
      text: "审核中"
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
  typeArr: object[] = [
    {
      id: 1,
      text: "练习"
    },
    {
      id: 2,
      text: "考试"
    },
    {
      id: 3,
      text: "补考"
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  showAudit: boolean = false;
  isPending: boolean = false;
  total: number = 0;
  categoryId: any = [];
  queryExamData: any = {};

  delExamId: string = "";
  delCause: string = "";

  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];

  examData: any = {
    params: {
        examId: '',
        sortBy: false,
        sortField: "userId",
        pageSize: 10,
        pageNum: 1
    },
    arrs: 'examRegIds',
    arr: 'examRegId'
  }
  oncemoreBox: boolean = false;
  applyData: object = {};
  startDay: string = "";
  startTime: string = "";
  createExamId: string = "";
  examEndTime: string = "";
  examType: string = "";

  created() {
    this.getCategory();
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  disabledDate(time: any){
    if (this.examEndTime < Date.now() - 8.64e7) {
      return time.getTime() < Date.now() - 8.64e7
    } else {
      return time.getTime() < this.examEndTime
    }
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
  examOnlineOffline() {
    let data = {
      state: 4,
      examId: this.$store.state.examData.id
    }
    Exam.online_offline_exam_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.createEditThree = this.createEditOne = false
        }
      })
  }
  delCheck(e: any){
    if (this.selectData.length === 0 && !e) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个考试!`,
        type: "error"
      });
      return;
    }
    let id = e && e.examId ? JSON.stringify(e.examId) : JSON.stringify(this.selectData.map(i => i.examId));
    this.delExamId = id.replace(/"|\[|\]/g,'');
    this.isDelShow = true;
  }
  ClassifyId(e: any) {
    if (e.length) {
      this.params.categoryId = "" + e[e.length - 1];
    } else {
      delete this.params.categoryId;
    }
    this.getList();
  }
  // 推荐
  recommend(e: any): void {
    let data = {
      examId: e.examId,
      isRecommend: !e.isRecommend ? 1 : 0
    };
    Exam.is_recommend_exam_admin({ data }).then(res => {
      if (res.code === 0) {
        this.getList();
      }
    });
  }
  // 上下线
  on_off(e: any): void {
    if(e.state == 2){
      this.$notify({
        title: "警告",
        message: `未通过审核不能发布`,
        type: "warning"
      });
      return;
    }
    if(e.state == 3){
      this.$notify({
        title: "警告",
        message: `审核中不能发布`,
        type: "warning"
      });
      return;
    }
    let data = {
      examId: e.examId,
      state: e.state == 4 ? 5 : 4
    };
    Exam.online_offline_exam_admin({ data }).then(res => {
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
  // 审核_弹框
  audit(e: any) {
    this.showAudit = true;
    this.examId = e.examId;
  }
  // 审核
  saveBtn() {
    if (this.state === 2 && !this.reason || this.reason.includes(" ")){
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    let data = {
      examId: this.examId,
      state: this.state,
      reason: this.reason
    };
    this.isPending = true;
    Exam.audit_exam_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.closeAudit();
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  // 展示删除细节
  showDelDialog(e: any): void {
    this.isDelShow = true;
    this.delExamId = e.examId;
  }
  closeDel() {
    this.isDelShow = false;
    this.delCause = "";
  }
  // 执行逻辑删除
  del(): void {
    if (!this.delCause || this.delCause.includes(" ")) {
      this.$notify.error({
        title: "错误",
        message: "删除原因必填，并且不能含有空格！"
      });
      return;
    }
    let data = {
      examId: this.delExamId,
      reason: this.delCause
    };
    Exam.del_exam_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: "删除成功！",
          type: "success"
        });
        this.isDelShow = false;
        this.delCause = "";
        if ((this.selectData.length === this.tableData.length || this.tableData.length === 1 ) && this.params.pageNum > 1) {
          this.params.pageNum --;
        }
        this.getList();
      }
    });
  }

  // 统计
  statistics(e: any) {
    if (e) {
      this.examType = e.type;
      let arr = this.$store.state.examData;
      arr.id = e.examId;
      this.$store.commit('setExamData', arr)  
    }
    let data = {
      examId: this.$store.state.examData.id
    };
    Exam.exam_statistics_admin({ data }).then(res => {
      if (res.code === 0) {
        res.data.passRatioStr = Math.round(res.data.passRatio * 100) + "%";
        let arr = [];
        arr.push(res.data);
        this.statisticsData = arr;
        this.statisticsState = true;
      }
    });
  }
  // 关闭第一步回调
  closeOne() {
    this.createEditOne = false;
    this.getList();
  }
  closeThree() {
    this.createEditThree = false;
    this.getList();
  }
  createEditThreeOverUp() {
    this.isShow.class = false;
    this.createEditOne = true;
    this.createEditThree = false;
  }
  createEditThreeOver() {
    this.createEditThree = false;
    this.getList();
  }
  // 编辑
  edit(e: any): void {
    this.queryExamData.state = e.state;
    this.loading = true;
    let arr = this.$store.state.examData;
    arr.id = e.examId;
    this.$store.commit('setExamData', arr)
    this.createEditOne = true;
    e.type == 3 ? this.title = "编辑补考" : this.title = "编辑考试";
  }
  // 创建考试
  created_exam(): void {
    this.$store.state.examData.id = '';
    this.createEditOne = true;
    this.title = "创建考试";
  }
  createEditOneOver() {
    this.createEditOne = false;
    this.createEditThree = true;
  }
  closeAudit() {
    this.showAudit = false;
    this.state = 4;
    this.reason = "";
  }
  getCategory() {
    let data = {};
    Category.category_list_exam({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        let arr = this.$store.state.examData;
        arr.classify = res.data;
        this.$store.commit('setExamData', arr)
        this.examClassify = res.data;
      }
    });
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.categoryId ||
        this.params.state
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Exam.exam_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.startTimeStr = this.$formatDate(i.startTime, "YYYY-MM-DD hh:mm");
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            i.typeStr = i.type == 1 ? "练习" : i.type == 2 ? "考试" : i.type == 3 ? "补考" : "";
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  examReg(e: any) {
    if (e.endTime < Date.now()) {
      this.$notify({
        title: "提示",
        message: "考试已经结束，不能报名！",
        type: "error"
      });
      return;
    };
    this.$store.commit('setExamData', { id: e.examId });
    this.isShow.user = true;
    this.createEditThree = true;
    this.title = "考试报名";
  }
  shouldExam() {
    this.isShow.study = true;
    this.statisticsUser = true;
  }
  statisticsUserOver() {
    this.statisticsUser = false;
    this.statistics();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc(e: any) {
    if (e.prop === "startTimeStr") {
      this.params.sortField = "startTime"
    }
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  oncemore(e: any) {
    this.examEndTime = e.endTime;
    this.createExamId = e.examId;
    this.oncemoreBox = true;
  }
  examSave(): void {
    let data = {
      examId: this.createExamId,
      startTime: this.startDay + ' ' + this.startTime + ':00'
    }
    this.isPending = true;
    Exam.repair_exam_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "创建补考成功！",
            type: "success"
          });
          this.oncemoreBoxOver();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  oncemoreBoxOver() {
    this.oncemoreBox = false;
    this.getList();
  }
}
</script>
<style lang="scss" scope>
  .img-bor {
    width: 30px;
    height: 30px;
  }
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

