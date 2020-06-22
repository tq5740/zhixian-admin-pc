<template>
  <div id="createAndEdit">
    <el-form :inline="true">
      <el-form-item label="">
        <el-button type="primary" icon="plus" @click="createBtn">创建试题</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" icon="plus" @click="addBtn()">添加试题</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" icon="plus" @click="importQuestion()">导入试题</el-button>
      </el-form-item>
      <!-- <el-form-item label="">
        <el-button type="primary" icon="plus" @click="recycleBtn()">恢复试题</el-button>
      </el-form-item> -->
      <el-form-item label="">
        <el-input placeholder="试题题干" v-model="params.query" class='w230' @change="searchKey" @keyup.13.native="searchKey" clearable>
          <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
        </el-input>
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
    <el-table ref="mainTable" border :data="tableData" @selection-change="handleSelectionChangeDel" v-loading="loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" align="center" min-width='55'></el-table-column>
      <el-table-column prop="examBankTitle" label="所属题库" min-width="80"></el-table-column>
      <el-table-column prop="typeStr" label="试题类型" min-width="70"></el-table-column>
      <el-table-column prop="examQuestionTitle" label="试题题干" min-width="120"></el-table-column>
      <el-table-column prop="optionsStr" label="选项" min-width="120">
        <template slot-scope="scope">
          <div v-for="(options, key) in JSON.parse(scope.row.options)" :key="options">
            {{String.fromCharCode(65 + key) + ". " + options}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="answerStr" label="答案"  min-width='95'></el-table-column>
      <el-table-column prop="analysis" label="解析"  min-width='95'></el-table-column>
      <el-table-column prop="diffcultyStr" label="困难度" min-width="80"></el-table-column>
      <el-table-column prop="examPointTitle" label="所属知识点" min-width="80">
        <template slot-scope="scope">
          {{scope.row.examPointTitle == '[null]' ? '' : scope.row.examPointTitle}}
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click='editBtn(scope.row)'>编辑</el-button>
          <el-button type="text" size="small" @click='del(scope.row)'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <span class="mag-top20">
        <el-checkbox class="mag-left20" v-model="toggleCheckboxDel" @change="handleCheckAllChangeDel" :disabled="tableData.length === 0">{{!toggleCheckboxDel ? '全选' : '取消全选'}}</el-checkbox>
        <el-button class="mag-left20" @click="del()">删除</el-button>
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

    <el-dialog width="50%" v-if="showBankList" title="添加试题 选择题库" :visible.sync="showBankList" :close-on-click-modal="false" append-to-body>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="题库名称" v-model="params1.query" class='w230' @keyup.13.native="getBankList" @change="getBankList" clearable>
            <el-button class="clickBtn" @click="getBankList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table header-row-class-name="thead" :data="bankListData" border v-loading="loading1" header-align="center" element-loading-text="加载中...">
        <el-table-column prop="examBankTitle" label="题库名称" min-width="170">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="bankBtn(scope.row)">{{scope.row.examBankTitle}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="questionNumber" label="正式试题数量" min-width="170"></el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='170'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" min-width='170'></el-table-column>
      </el-table>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
            共有
            <span class="fc303e">{{total1}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params1.pageSize" class='w65' @change='params1.pageNum = 1;getBankList()'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params1.pageNum" background @current-change="getBankList('type')" :page-size="parseInt(params1.pageSize)"
          layout="prev, pager, next, jumper" :total="total1">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog width="70%" v-if="showTestList" :title="titleName" :visible.sync="showTestList" :close-on-click-modal="false" append-to-body>
      <p>添加试题到 <b>{{queryData.examBankTitle}}</b> 题库</p>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="试题题干" v-model="params2.query" class='w230' @change="getList('test')" @keyup.13.native="getList('test')" clearable>
            <el-button @click="getList('test')" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="题型" class='w150' v-model="params2.type" @change="getList('test')" clearable @clear="params2.type = ''">
            <el-option v-for="(i) in $store.state.testType" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="困难度" class='w150' v-model="params2.diffculty" @change="getList('test')" clearable @clear="params2.diffculty = ''">
            <el-option v-for="(i) in $store.state.diffcultyArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table ref="minTable" border :data="testListData" @selection-change="handleSelectionChangeAdd" v-loading="loading2" element-loading-text="拼命加载中">
        <el-table-column type="selection" align="center" min-width='55' :selectable='selectInit'></el-table-column>
        <el-table-column prop="typeStr" label="试题类型" min-width="70"></el-table-column>
        <el-table-column prop="examQuestionTitle" label="试题题干" min-width="120"></el-table-column>
        <el-table-column prop="optionsStr" label="选项" min-width="120">
          <template slot-scope="scope">
            <div v-for="(options, key) in JSON.parse(scope.row.options)" :key="options">
              {{String.fromCharCode(65 + key) + ". " + options}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="answerStr" label="答案"  min-width='95'></el-table-column>
        <el-table-column prop="analysis" label="解析"  min-width='95'></el-table-column>
        <el-table-column prop="diffcultyStr" label="困难度" min-width="80"></el-table-column>
        <el-table-column prop="examPointTitle" label="所属知识点" min-width="80">
          <template slot-scope="scope">
            {{scope.row.examPointTitle == '[null]' ? '' : scope.row.examPointTitle}}
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="70">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click='add(scope.row)' v-if="'add' in scope.row && !scope.row.add">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <span class="mag-top20">
          <el-checkbox class="mag-left20" v-model="toggleCheckboxAdd" :indeterminate="isIndeterminateAdd" @change="handleCheckAllChangeAdd" :disabled="testListData.length === 0">{{!toggleCheckboxAdd ? '全选' : '取消全选'}}</el-checkbox>
          <el-button class="mag-left20" @click="add()">添加</el-button>
        </span>
      </el-row>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
            共有
            <span class="fc303e">{{total2}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params2.pageSize" class='w65' @change='params2.pageNum = 1;getList("test")'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
              <el-option label="99" value="99"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params2.pageNum" background @current-change="getList('test', 'is')" :page-size="parseInt(params2.pageSize)"
          layout="prev, pager, next, jumper" :total="total2">
        </el-pagination>
      </div>
    </el-dialog>
    <el-dialog width="70%" v-if="showRecycle" title="正式试题回收站" :visible.sync="showRecycle" :close-on-click-modal="false" :before-close="closeRecycle" append-to-body>
      <official-recycle :queryData="queryData"></official-recycle>
    </el-dialog>
    <el-dialog width="50%" v-if="showImport" title="导入试题" :visible.sync="showImport" :close-on-click-modal="false" @close="closeImport" append-to-body>
      <import-file :id="params.examBankId"></import-file>
    </el-dialog>
    <el-dialog :title="titleCresteEdit" :visible.sync="createBox" v-if="createBox" :before-close="closeCreate" append-to-body>
      <create-question :queryData="editData" @close="closeCreate" :editOfficial="edit"></create-question>
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
    "official-recycle": () => import("./official_recycle.vue"),
    "import-file": () => import("@c/ImportFile.vue"),
    "create-question": () => import("@c/CreateQuestion.vue")
  }
})

export default class StatisticsUser extends Vue {
  @Prop({ default: {} })
  public queryData: object;
  tableData: any[] = [];
  loading: boolean = false;
  params: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "updateTime",
    query: "",
    startTime: "",
    endTime: ""
  };
  total: number = 0;

  showBankList: boolean = false;
  loading1: boolean = false;
  total1: number = 0;
  params1: any = {
    pageSize: 10,
    pageNum: 1,
    sortBy: false,
    sortField: "updateTime"
  };
  bankListData: any[] = [];
  titleName: string = "";
  showTestList: boolean = false;
  testListData: any[] = [];
  params2: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "updateTime",
    query: ""
  };
  loading2: boolean = false;
  total2: number = 0;
  testListId: string = "";
  toggleCheckboxAdd: boolean = false;
  selectDataAdd: any[] = [];
  isIndeterminateAdd: boolean = false;
  
  showRecycle: boolean = false;
  toggleCheckboxDel: boolean = false;
  selectDataDel: any[] = [];
  isIndeterminateDel: boolean = false;

  showImport: boolean = false;

  createBox: boolean = false;
  titleCresteEdit: string = "";
  editData: any = {};
  
  created() {
    this.params.examBankId = this.queryData.examBankId;
    this.getList();
  }
  getList(type: any, is: string) {
    if (!type) {
      if (
        this.params.query ||
        this.params.type ||
        this.params.diffculty
      ) {
        this.params.pageNum = 1;
      }
    }
    if (type === 'test' && !is) {
      if (
        this.params2.query ||
        this.params2.type ||
        this.params2.diffculty
      ) {
        this.params2.pageNum = 1;
      }
    }
    type === 'test' ? this.loading2 = true : this.loading = true;
    let data = type === 'test' ? { ...this.params2, examBankId: this.testListId, bankId: this.queryData.examBankId } : { ...this.params };
    Exam.exam_question_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          type === 'test' ? this.total2 = res.data.total : this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.typeStr = this.$mapTypeStr(i.type, this.$store.state.testType);
            i.diffcultyStr = this.$mapTypeStr(i.diffculty, this.$store.state.diffcultyArr);
            if (i.type == 1) {
              i.answerStr = String.fromCharCode(65 + JSON.parse(i.options).indexOf(i.answer.replace(/\["|"\]/g,'')))
            } else if (i.type == 2) {
              var arr = [];
              var ans = JSON.parse(i.answer);
              var len = JSON.parse(i.answer).length;
              for (var ind = 0; ind < len; ind ++) {
                arr.push(String.fromCharCode(65 + JSON.parse(i.options).indexOf(ans[ind].replace(/\["|"\]/g,''))))
              }
              i.answerStr = arr.join("、");
            } else {
              i.answerStr = JSON.parse(i.answer);
            }
          });
          type === 'test' ? this.testListData = res.data.result : this.tableData = res.data.result;
        }
      })
      .finally(() => {
        type === 'test' ? this.loading2 = false : this.loading = false;
      });
  }
  searchKey() {
    this.getList();
  }
  sortFun() {
    this.params.sortBy = !this.params.sortBy
    this.getList()
  }
  addBtn() {
    this.bankListData = [];
    this.getBankList();
    this.showBankList = true;
  }
  getBankList(type: any) {
    if (type !== 'type') {
      if (
        this.params1.query
      ) {
        this.params1.pageNum = 1;
      }
    }
    let data = { ...this.params1 };
    this.loading1 = true;
    Exam.exam_bank_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total1 = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
          });
          this.bankListData = res.data.result;
        }
      })
      .finally(() => {
        this.loading1 = false;
      });
  }
  bankBtn(e: any) {
    if (e.examBankId === this.queryData.examBankId) {
      this.$notify({
        title: "错误",
        message: `不能选择目标题库!`,
        type: "warning"
      });
      return;
    };
    this.showTestList = true;
    this.params2 = {
      pageSize: 10,
      pageNum: 1,
      venueId: "",
      sortBy: false,
      sortField: "updateTime",
      query: ""
    };
    this.titleName = e.examBankTitle + ' 试题列表';
    this.testListId = e.examBankId;
    this.getList('test');
  }
  add(e: any) {
    if (e) {
      let id = e.examQuestionId;
      this.addFn(id);
    } else {
      if (this.selectDataAdd.length === 0) {
        this.$notify({
          title: "错误",
          message: `请至少选择一个试题!`,
          type: "warning"
        });
        return;
      }
      let id = JSON.stringify(this.selectDataAdd.map(i => i.examQuestionId)).replace(/"|\[|\]/g, '');
      this.addFn(id);
    }
  }
  addFn(id: string) {
    this.$confirm(`确认把所选试题加入到 ${this.queryData.examBankTitle} 吗?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = {
          examQuestionIds: id,
          examBankId: this.queryData.examBankId
        }
        Exam.add_question_by_exam_bank_admin({ data })
          .then(res => {
            if (res.code === 0) {
              let resData = res.data;
              if (resData.loseNumber && !resData.successNumber) {
                this.$notify({
                  title: "提示",
                  message: `全部添加失败，共${resData.loseNumber}道！原因：${resData.reason}`,
                  type: "error"
                });
              } else if (resData.loseNumber && resData.successNumber){
                this.$notify({
                  title: "提示",
                  message: `添加成功${resData.successNumber}道，失败${resData.loseNumber}道！原因：${resData.reason}`,
                  type: "warning"
                });
              } else {
                this.$notify({
                  title: "提示",
                  message: `全部添加成功，共${resData.successNumber}道！`,
                  type: "success"
                });
              }
              this.getList("test");
            }
          })
      })
      .catch(() => {

      });
  }
  handleCheckAllChangeAdd() {
    if (this.toggleCheckboxAdd) {
      this.$refs.minTable.toggleAllSelection();
    } else {
      this.$refs.minTable.clearSelection();
    }
    this.handleSelectionChangeAdd;
  }
  handleSelectionChangeAdd(e: any) {
    this.selectDataAdd = e;
    let checkedCount = e.length;
    this.toggleCheckboxAdd = checkedCount === this.testListData.length && this.testListData.length != 0;
    this.isIndeterminateAdd = checkedCount > 0 && checkedCount < this.testListData.length;
  }
  selectInit(row: any, index: any) {
    if ('add' in row && !row.add) {
      return true
    } else{
      return false
    }
  }

  recycleBtn() {
    this.showRecycle = true;
  }
  handleCheckAllChangeDel() {
    if (this.toggleCheckboxDel) {
      this.$refs.mainTable.toggleAllSelection();
    } else {
      this.$refs.mainTable.clearSelection();
    }
    this.handleSelectionChangeDel;
  }
  handleSelectionChangeDel(e: any) {
    this.selectDataDel = e;
    let checkedCount = e.length;
    this.toggleCheckboxDel = checkedCount === this.tableData.length && this.tableData.length != 0;
    this.isIndeterminateDel = checkedCount > 0 && checkedCount < this.tableData.length;
  }
  closeRecycle() {
    this.showRecycle = false;
    this.getList();
  }
  // recoverFn(id: string) {
  //   let data = {
  //     examBankQuestionIds: id
  //   }
  //   Exam.recover_exam_question_admin({ data })
  //     .then(res => {
  //       if (res.code === 0) {
  //         this.$notify({
  //           title: "提示",
  //           message: "操作成功！",
  //           type: "success"
  //         });
  //         this.getList();
  //       }
  //     })
  // }
  del(e: any) {
    if (e) {
      let id = e.examBankQuestionId;
      this.delFn(id);
    } else {
      if (this.selectDataDel.length === 0) {
        this.$notify({
          title: "错误",
          message: `请至少选择一个试题!`,
          type: "warning"
        });
        return;
      }
      let id = JSON.stringify(this.selectDataDel.map(i => i.examBankQuestionId)).replace(/"|\[|\]/g,'');
      this.delFn(id);
    }
  }
  delFn(id: string) {
    this.$confirm("删除后该试题将不能参与组卷，是否删除？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = {
          examBankQuestionIds: id
        }
        Exam.delete_exam_question_admin({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `操作成功！`,
                type: "success"
              });
              // if ((this.selectDataDel.length === this.tableData.length || this.tableData.length === 1) && this.params.pageNum > 1) {
              //   this.params.pageNum --;
              // }
              this.getList();
            }
          })
      })
      .catch(() => {

      });
  }
  importQuestion() {
    this.showImport = true;
  }
  closeImport() {
    this.getList();
  }
  createBtn() {
    this.edit = false;
    this.titleCresteEdit = '创建试题';
    this.createBox = true;
  }
  closeCreate() {
    this.createBox = false;
    this.getList();
  }
  editBtn(e: any) {
    this.edit = true;
    this.editData = e;
    this.editData.examBankId = this.queryData.examBankId;
    this.titleCresteEdit = '编辑试题';
    this.createBox = true;
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