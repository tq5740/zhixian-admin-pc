<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createdBtn" v-if="prm.isCreate">创建调查问题</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-input placeholder="问题名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="问题类型" class='w150' v-model="params.type" @change="getList" clearable @clear="params.type = ''">
            <el-option v-for="(i) in typeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table ref="mainTable" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="surveyQuestionTitle" label="问题名称" min-width="140"></el-table-column>
        <el-table-column prop="type" label="问题类型" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.type == 1 ? "单选题" : scope.row.type == 2 ? "多选题" : scope.row.type == 5 ? "填空题" : scope.row.type == 6 ? "问答题" : ""}}
          </template>
        </el-table-column>
        <el-table-column prop="options" label="选项" min-width='120'>
          <template slot-scope="scope">
            <div v-if="scope.row.type != 6 && scope.row.type != 5">
              <div v-for="(options, key) in JSON.parse(scope.row.options)" :key="options">
                {{String.fromCharCode(65 + key) + ". " + options}}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="options" label="填空数量" min-width='50'>
          <template slot-scope="scope">
            <div v-if="scope.row.type == 5">
              {{scope.row.options}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width='100'></el-table-column>
        <el-table-column prop="updateTimeStr" label="创建时间" width='170'></el-table-column>
        <el-table-column prop="" label="操作" width="140">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate && queryData.state != 4" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="prm.isDelete && queryData.state != 4" type="text" @click.native="dele(scope.row)">删除</el-button>
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
      <el-form v-if="!('surveyTitle' in queryData)">
        <el-form-item label=" " label-width="120px" class="mg-center">
          <el-button type="primary" @click="back_two">上一步</el-button>
          <el-button type="primary" @click="saveBtn_two">下一步</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog width="70%" v-if="createEdit" :title="title" :visible.sync="createEdit" :close-on-click-modal="false" append-to-body>
      <create-edit @createEditOver="createEditOver" :queryData="editData" :title="title"></create-edit>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Survey from "@api/data";
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue")
  }
})
export default class Companyreg extends Vue {
  @Prop({ default: {} })
  public queryData: any;

  createEdit: boolean = false;
  title: any = "创建问题";
  params: any = {
    pageSize: 10,
    pageNum: 1,
    surveyId: this.queryData.surveyId,
    sortBy: true,
    sortField: "type",
    query: ""
  };
  prm = {
    isDelete: false,
    isCreate: false,
    isUpdate: false
  };
  typeArr: object[] = [
    {
      id: 1,
      text: "单选题"
    },
    {
      id: 2,
      text: "多选题"
    },
    {
      id: 5,
      text: "填空题"
    },
    {
      id: 6,
      text: "问答题"
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  total: number = 0;
  

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  // 编辑
  edit(e: any): void {
    this.editData = e;
    this.title = "编辑调查问题";
    this.createEdit = true;
    this.editData.surveyId = this.queryData.surveyId;
  }
  // 创建问题
  createdBtn(): void {
    this.editData = {
      surveyId: this.queryData.surveyId
    };
    this.title = "创建调查问题";
    this.createEdit = true;
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.type
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Survey.survey_question_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.updateTimeStr = this.$formatDate(i.updateTime);
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
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  createEditOver() {
    this.createEdit = false;
    this.getList();
  }
  dele(e: any) {
    let data = {
      surveyQuestionId: e.surveyQuestionId
    }
    Survey.delete_survey_question_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            type: "success",
            message: "操作成功！"
          });
          this.getList();
        }
      })
  }
  back_two(){
    this.$emit("createEditTwoOverUp");
  }
  saveBtn_two() {
    if (this.tableData.length == 0) {
      this.$notify({
        title: "提示",
        message: "请先添加调查题",
        type: "warning"
      });
    } else {
      this.$emit("createEditTwoOverDown", this.queryData.surveyId);
    }
  }
}
</script>
<style lang="scss" scope>
.mg-center{
    text-align: center;
    margin-right: 13%;
  }
</style>