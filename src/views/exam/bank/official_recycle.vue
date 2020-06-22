<template>
  <div id="createAndEdit">
    <el-form :inline="true">
      <el-form-item label="">
        <el-input placeholder="试题题干" v-model="params.query" class='w230' @change="getList()" @keyup.13.native="getList()" clearable>
          <el-button @click="getList()" slot="append" icon="el-icon-search"></el-button>
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
    <el-table ref="mainTable" border :data="tableData" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="拼命加载中">
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
      <el-table-column prop="operate" label="操作" width="70">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click='recover(scope.row)'>恢复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <span class="mag-top20">
        <el-checkbox class="mag-left20" v-model="toggleCheckbox" @change="handleCheckAllChange" :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
        <el-button class="mag-left20" @click="recover()">恢复</el-button>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Exam from "@api/exam";

//https://github.com/ktsn/vuex-class
@Component({

})

export default class OfficialRecycle extends Vue {
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
  toggleCheckbox: boolean = false;
  selectData: any[] = [];
  
  created() {
    this.params.examBankId = this.queryData.examBankId;
    this.getList();
  }
  getList(type: any) {
    if (!type) {
      if (
        this.params.query ||
        this.params.type ||
        this.params.diffculty
      ) {
        this.params.pageNum = 1;
      }
    }
    this.loading = true;
    let data = { ...this.params };
    Exam.recycle_exam_question_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.updateTimeStr = this.$formatDate(i.updateTime);
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
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
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
  recover(e: any) {
    if (e) {
      let id = e.examBankQuestionId;
      this.recoverFn(id);
    } else {
      if (this.selectData.length === 0) {
        this.$notify({
          title: "错误",
          message: `请至少选择一个试题!`,
          type: "warning"
        });
        return;
      }
      let id = JSON.stringify(this.selectData.map(i => i.examBankQuestionId)).replace(/"|\[|\]/g,'');
      this.recoverFn(id);
    }
  }
  recoverFn(id: string) {
    let data = {
      examBankQuestionIds: id
    }
    Exam.recover_exam_question_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "操作成功！",
            type: "success"
          });
          if ((this.selectData.length === this.tableData.length || this.tableData.length === 1 ) && this.params.pageNum > 1) {
            this.params.pageNum --;
          }
          this.getList();
        }
      })
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