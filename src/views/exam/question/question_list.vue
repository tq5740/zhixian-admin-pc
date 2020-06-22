<template>
  <div id="createAndEdit">
    <el-row class="main-top">
      <!-- <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createBtn">创建试题</el-button>
        </el-form-item>
      </el-form> -->
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="试题题干" v-model="params.query" class='w230' @keyup.13.native="searchKey" clearable>
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="选择题库" filterable clearable v-model="params.examBankId" @change="getList">
            <el-option v-for="(i) in bankList" :key="i.examBankId" :label="i.examBankTitle" :value="i.examBankId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="题型" class='w150' v-model="params.type" @change="getList" clearable @clear="params.type = ''">
            <el-option v-for="(i) in $store.state.testType" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="困难度" class='w150' v-model="params.diffculty" @change="getList" clearable @clear="params.diffculty = ''">
            <el-option v-for="(i) in $store.state.diffcultyArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @selection-change="handleSelectionChange" stripe :data="tableData" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column type="selection" align="center" min-width='55'></el-table-column>
        <el-table-column prop="examQuestionTitle" label="试题题干" min-width="150">
          <template slot-scope='scope'>
            <div style="padding-right: 10%">
              <a style="cursor: pointer" @click="detail(scope.row)">{{scope.row.examQuestionTitle}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="typeStr" label="试题类型" min-width="60"></el-table-column>
        <el-table-column prop="diffcultyStr" label="困难度" min-width="50"></el-table-column>
        <el-table-column prop="examBankTitle" label="所属题库" min-width="60"></el-table-column>
        <el-table-column prop="examPointTitleStr" label="所属知识点" min-width="80"></el-table-column>
        <el-table-column prop="error" label="错误原因" min-width='60'></el-table-column>
        <el-table-column prop="operate" label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" size="small" :style="scope.row.error ? 'color: #c0c4cc' : ''" @click='add(scope.row)'>加入正式题</el-button>
            <el-button type="text" size="small" @click='editBtn(scope.row)'>编辑</el-button>
            <el-button type="text" size="small" @click='dele(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <span class="mag-top20">
          <el-checkbox class="mag-left20" v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
          <el-button class="mag-left20" @click="deleAll">清空临时试题</el-button>
          <el-button class="mag-left20" @click="addFn">加入正式题</el-button>
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
    <el-dialog :title="titleCresteEdit" :visible.sync="createBox" v-if="createBox" :before-close="close" append-to-body>
      <create-question :queryData="queryData" @close="close" :official="official" :edit="edit" :title="titleCresteEdit"></create-question>
    </el-dialog>
    <el-dialog width="30%" v-if="showImport" title="导入试题统计" :visible.sync="showImport" :close-on-click-modal="false">
      <p>导入正确题数：{{importNum.rightNumber}} 道</p>
      <p>导入错误题数：{{importNum.errNumber}} 道</p>
      <div style="width: 100%; text-align: center">
        <el-button type="primary" @click="closeImport()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Exam from "@api/exam";

//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "create-question": () => import("@c/CreateQuestion.vue")
  }
})

export default class StatisticsUser extends Vue {
  tableData: any[] = [];
  loading: boolean = false;
  params: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "error",
    query: "",
    startTime: "",
    endTime: ""
  };
  bankList: any[] = [];
  total: number = 0;
  createBox: boolean = false;
  titleCresteEdit: string = "";
  queryData: object = {};
  official: boolean = false;
  edit: boolean = false;

  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];
  isExamBank: string = "";

  showImport: boolean = false;
  importNum: object = {};
  
  created() {
    if(this.$route.query.examBankId){
      this.params.examBankId = this.$route.query.examBankId;
    }
    if(this.$store.state.examData.rightNumber || this.$store.state.examData.errNumber){
      this.importNum = {
        rightNumber: this.$store.state.examData.rightNumber,
        errNumber: this.$store.state.examData.errNumber
      }
      this.showImport = true;
    }
    this.getList();
    this.getBankList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.examBankId ||
        this.params.type ||
        this.params.diffculty
      ) {
        this.params.pageNum = 1;
      }
    }
    this.loading = true;
    let data = { ...this.params };
    Exam.question_temporary_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.typeStr = this.$mapTypeStr(i.type, this.$store.state.testType);
            i.diffcultyStr = this.$mapTypeStr(i.diffculty, this.$store.state.diffcultyArr);
            i.examPointTitleStr = JSON.parse(i.examPointTitle).join("、");
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  getBankList() {
    Exam.query_exam_bank_title_admin().then(res => {
      if (res.code === 0) {
        if (JSON.parse(JSON.stringify(res.data)).length === 0) {
          this.$notify({
            title: "提示",
            message: "您暂无题库！",
            type: "error"
          });
          return;
        } else {
          this.bankList = res.data;
        }
      }
    });
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
  createBtn() {
    this.edit = false;
    this.official = false;
    this.queryData = {};
    this.titleCresteEdit = '创建试题';
    this.createBox = true;
  }
  editBtn(e: any) {
    this.edit = true;
    this.official = false;
    this.queryData = e;
    this.titleCresteEdit = '编辑试题';
    this.createBox = true;
  }
  add(e: any) {
    if (e.error) {
      this.$notify({
        title: "提示",
        message: "试题有误，无法加入正式试题！",
        type: "error"
      });
      return;
    }
    this.edit = true;
    this.official = true;
    this.queryData = e;
    this.titleCresteEdit = '加入正式试题';
    this.createBox = true;
  }
  detail(e: any) {
    this.edit = true;
    this.official = true;
    this.queryData = e;
    this.titleCresteEdit = '详情';
    this.createBox = true;
  }
  addFn(e: any) {
    if (this.selectData.length === 0) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个试题!`,
        type: "warning"
      });
      return;
    }
    let id = JSON.stringify(this.selectData.map(i => i.examQuestionTemporaryId));
    this.$confirm('加入正式题库后，试题不能修改、删除，确认加入？', '加入正式题库', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        examQuestionTemporaryId: id
      }
      Exam.add_question_temporary_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功！",
              type: "success"
            });
            this.toggleCheckbox = false;
            if ((this.selectData.length === this.tableData.length || this.tableData.length === 1 ) && this.params.pageNum > 1) {
              this.params.pageNum --;
            }
            setTimeout(() => {
              this.getList();
            }, 1000);
          }
        })
    }).catch(() => { });
  }
  dele(e: any) {
    if (!e && this.selectData.length === 0) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个试题!`,
        type: "warning"
      });
      return;
    }
    let id = e.examQuestionTemporaryId ? '["' + e.examQuestionTemporaryId + '"]' : JSON.stringify(this.selectData.map(i => i.examQuestionTemporaryId));
    this.$confirm('确认删除选择的试题?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        examQuestionTemporaryIds: id
      }
      Exam.delete_question_temorary_admin({ data })
        .then(res => {
          this.getList()
        })
    }).catch(() => { });
  }
  searchKey() {
    this.getList();
  }
  sortFun(i) {
    this.params.sortBy = !this.params.sortBy
    this.getList()
  }
  close() {
    this.createBox = false;
    this.getList();
  }
  closeImport() {
    let obj = this.$store.state.examData;
    obj.rightNumber = "";
    obj.errNumber = "";
    this.$store.commit("setExamData", obj)
    this.showImport = false;
  }
  deleAll() {
    if (!this.params.examBankId) {
      this.$notify({
        title: "错误",
        message: `请选择题库!`,
        type: "warning"
      });
      return;
    }
    this.bankList.forEach((item, index) => {
      if(item.examBankId === this.params.examBankId){
        this.isExamBank = item.examBankTitle
      }
    })
    this.$confirm(`确认清空 ${this.isExamBank} 题库的临时试题?`, '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        examBankId: this.params.examBankId
      }
      Exam.clear_question_temporary_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功！",
              type: "success"
            });
            this.getList();
          }
        })
    }).catch(() => { });
  }
}  
</script>
<style lang="scss" scoped>
  .mag-top20 {
    float: left;
    margin-top: 15px;
  }
  .mag-left20 {
    margin-left: 15px;
  }
</style>

