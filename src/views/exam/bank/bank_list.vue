<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="created_bank">创建题库</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="题库名称" v-model="params.query" class='w230' @keyup.13.native="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @sort-change='sortFunc'
        header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="examBankTitle" label="题库名称" min-width="140"></el-table-column>
        <el-table-column label="临时试题数量" min-width="100">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="temporaryFun(scope.row)">{{scope.row.temporaryNumber}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="questionNumber" label="正式试题数量" min-width="100">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="officialFun(scope.row)">{{scope.row.questionNumber}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="paperNumber" label="试卷数（套）" min-width='100'>
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="papersFun(scope.row)">{{scope.row.paperNumber}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" sortable='custom' label="创建时间" width='170'></el-table-column>
        <el-table-column prop="" label="操作" width="280">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="createPapers(scope.row)">组卷</el-button>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="importQuestion(scope.row)">导入试题</el-button>
            <el-button type="text" @click.native="delBank(scope.row)">删除</el-button>
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
    <el-dialog width="40%" v-if="addBank" :title="title" :visible.sync="addBank" :close-on-click-modal="false">
      <el-form label-width="80px" label-position="left">
        <el-form-item label="企业名称 : ">
          <el-select filterable clearable v-model="apiData.orgId" class="w80per" @visible-change="judgeOrg()" :disabled="orgDisabled">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题库名称 : ">
          <el-input placeholder="请输入题库名称" class="w80per" v-model="apiData.examBankTitle"></el-input>
        </el-form-item>
        <el-form-item label="可见范围 : ">
          <el-radio-group v-model="apiData.visibleRange">
            <el-radio :label="1">仅自己</el-radio>
            <el-radio :label="2">本企业</el-radio>
            <el-radio :label="3">开放</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addBank = false">取 消</el-button>
        <el-button type="primary" @click="savaBtn">确 定</el-button>
      </span>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建考试哦！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isOrg = false">取 消</el-button>
          <el-button type="primary" @click="isOrg = false;apply()">完善信息</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog width="50%" v-if="showImport" title="导入试题" :visible.sync="showImport" :close-on-click-modal="false" @close="closeImport">
      <import-file :id="imExamBankId"></import-file>
    </el-dialog>
    <el-dialog width="70%" v-if="official" :title="ofTitle" :visible.sync="official" :close-on-click-modal="false" :before-close="officialOver">
      <official-list @officialOver="officialOver" :queryData="queryData"></official-list>
    </el-dialog>
    <el-dialog width="30%" v-if="papersList" title="试卷列表" :visible.sync="papersList" :close-on-click-modal="false">
      <el-table ref="minTable" header-row-class-name="thead" :data="papersData" border element-loading-text="加载中...">
        <el-table-column label="试卷" min-width="140">
          <template slot-scope='scope'>
            {{"第" + (scope.$index + 1) + "套试卷"}}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="details(scope.$index)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog width="60%" ref="paperRef" id="paperId" class="exam-paper" v-if="showPaper" :title="paperTitle" :visible.sync="showPaper" :close-on-click-modal="false">
      <test-list :id="queryId" :num="pagerNo" from="exam"></test-list>
    </el-dialog>
    <el-dialog width="70%" v-if="showCreatePapers" title="组卷" :visible.sync="showCreatePapers" :close-on-click-modal="false">
      <create-paper @closeSelf="createPaperOver" @close="closePaper" :id="queryId"></create-paper>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Bank from "@api/exam";
import Category from "@api/category";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "official-list": () => import("./official_list.vue"),
    "test-list": () => import("@c/TestList.vue"),
    "import-file": () => import("@c/ImportFile.vue"),
    "create-paper": () => import("./create_paper.vue")
  }
})
export default class Companyreg extends Vue {
  showCreatePapers: boolean = false;
  orgDisabled: boolean = false;
  official: boolean = false;
  ofTitle: string = "";
  papersList: boolean = false;
  showPaper: boolean = false;
  addBank: boolean = false;
  createTest: boolean = false;
  title: any = "创建题库";
  params: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "createTime",
    query: ""
  };
  prm = {
    isAudit: false,
    isUpdate: false,
    isOnline: false,
    isRecommend: false
  };
  apiData = {
    examBankId: "",
    visibleRange: 3,
    orgId: "",
    examBankTitle: ""
  };

  tableData: any[] = [];
  loading: boolean = false;
  isPending: boolean = false;
  total: number = 0;
  
  orgListId: any[] = [];
  isOrg: boolean = false;

  showImport: boolean = false;
  imExamBankId: string = "";

  papersData: any[] = [];
  pagerNo: number = null;
  pTitle: string = "";
  paperTitle: string = "";

  queryData: object = {};
  queryId: string = "";

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
    this.getOrgList();
  }
  savaBtn(): void {
    if(!this.apiData.examBankTitle || this.apiData.examBankTitle.includes(" ")){
      this.$notify({
        title: "提示",
        message: "题库名称不能为空，且不能含有空格！",
        type: "error"
      });
      return;
    }
    if(this.title === "创建题库"){
      let data = {
        ...this.apiData
      };
      Bank.create_exam_bank_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "创建成功！",
            type: "success"
          });
          this.addBank = false;
          this.getList();
        }
      });
    } else {
      let data = {
        ...this.apiData
      };
      Bank.update_exam_bank_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "修改成功！",
            type: "success"
          });
          this.addBank = false;
          this.getList();
        }
      });
    }
  }

  edit(e: any): void {
    this.title = "编辑题库";
    this.addBank = true;
    this.orgDisabled = true;
    let data = {
      examBankId: e.examBankId
    }
    Bank.query_exam_bank_admin({ data })
      .then(res => {
        if (res.code === 0) {
          Object.keys(this.apiData).forEach((i, index) => {
            this.apiData[i] = res.data[i];
          });
        }
      })
      .catch(e => {
      });
  }
  created_bank(): void {
    this.apiData.examBankTitle = "";
    this.apiData.orgId = "";
    this.apiData.visibleRange = 3;
    this.addBank = true;
    this.title = "创建题库";
    this.orgDisabled = false;
  }
  getScore() {
    let radio = (this.testNum.radio1Ratio + this.testNum.radio2Ratio + this.testNum.radio3Ratio) * this.radioScore;
    let multi = (this.testNum.multi1Ratio + this.testNum.multi2Ratio + this.testNum.multi3Ratio) * this.multiScore;
    let judge = (this.testNum.judge1Ratio + this.testNum.judge2Ratio + this.testNum.judge3Ratio) * this.judgeScore;
    let fill = (this.testNum.fill1Ratio + this.testNum.fill2Ratio + this.testNum.fill3Ratio) * this.fillScore;
    let qa = (this.testNum.qa1Ratio + this.testNum.qa2Ratio + this.testNum.qa3Ratio) * this.qaScore;
    let sc = (this.testNum.sc1Ratio + this.testNum.sc2Ratio + this.testNum.sc3Ratio) * this.scScore;
    this.scoreTotal = (radio + multi + judge + fill + qa + sc) || 0;
    this.scorePass = (this.scoreTotal * this.passScore / 100) || 0;
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Bank.exam_bank_list_admin({ data })
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
  delBank(e: any) {
    this.$confirm("确定删除该题库吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    })
      .then(() => {
        this.loading = true;
        let data = {
          examBankId: e.examBankId
        };
        Bank.delete_exam_bank_admin({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "操作成功！",
                type: "success"
              });
              this.getList();
            }
          })
          .finally(() => {
            this.loading = false;
          });
      })
      .catch(() => {})
  }
  createPapers(e: any) {
    this.queryId = e.examBankId;
    this.showCreatePapers = true;
  }
  createPaperOver() {
    this.showCreatePapers = false;
    this.getList();
  }
  closePaper() {
    this.showCreatePapers = false;
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  officialOver() {
    this.official = false;
    this.getList();
  }
  papersOver() {
    this.showPaper = false;
  }
  temporaryFun(e: any) {
    this.$router.push({
      path: "/exam/temporary_question",
      query: { examBankId: e.examBankId, from: 'temporary' }
    });
  }
  officialFun(e: any) {
    this.queryData = e;
    this.ofTitle = e.examBankTitle + " 正式试题";
    this.official = true;
  }
  papersFun(e: any) {
    if(!e.paperNumber){
      this.$notify({
        title: "提示",
        message: "此题库暂无试卷，请先组卷！",
        type: "warning"
      });
      return;
    }
    this.queryId = e.examBankId;
    this.pTitle = e.examBankTitle;
    this.papersData = [];
    for(var i = 0; i < e.paperNumber; i++){
      this.papersData.push(i);
    }
    this.papersList = true;
  }
  importQuestion(e: any) {
    this.imExamBankId = e.examBankId;
    this.showImport = true;
  }
  closeImport() {
    this.getList();
  }
  
  details(e: number) {
    this.pagerNo = e + 1;
    this.paperTitle = `${this.pTitle} 第${this.pagerNo}套试卷`;
    this.showPaper = true;
  }

  // 跳转到企业管理页面
  apply(e: any) {
    this.$router.push({
      path: "/org/org"
    });
  }
  judgeOrg(){
    let myOrgId = this.orgListId.toString();
    if(!myOrgId.includes(this.apiData.orgId)){
      this.isOrg = true;
      this.apiData.orgId = "";
    }
  }
  async getOrgList() {
    if (this.$store.state.myOrgList.length === 0) {
      await this.$store.dispatch("getMyOrgList");
      if (this.$store.state.myOrgList.length === 0) {
        this.$notify({
          title: "提示",
          message: "您暂无企业！",
          type: "error"
        });
        return;
      }
    }
    this.$store.state.myOrgList.forEach(element => {
      if(element.state === 4){
        this.orgListId = this.orgListId.concat(element.orgId);
      }
    });
  }
}
</script>
<style lang="scss" scope>
.cho ul{
  width: 100%;
  overflow: hidden;
  &:first-child{
    font-weight: bold;
  }
  li{
    width: 100px;
    float: left;
    text-align: center;
    margin: 0 5px;
    input{
      text-align: center;
    }
  }
}
.el-progress{
  width: 320px;
  margin-left: 0px;
}
.exam-paper{
  /deep/ {
    .el-dialog__header {
      background: #333A4D;
      text-align: center;
      padding: 15px 20px 15px;
      .el-dialog__title {
        color: #fff;
      }
      .el-dialog__headerbtn {
        top: 11px;
        font-size: 20px;
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>

