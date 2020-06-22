<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="addUser">添加用户</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-input placeholder="姓名/手机号" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table ref="mainTable" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="photo" label="头像" width='100' align='center'>
          <template slot-scope="scope">
            <img v-if="scope.row.photo && scope.row.photo.includes('http')" class='img-bor' :src="scope.row.photo" />
            <img v-else class='img-bor' :src="scope.row.photo ? ($store.state.configData.imgDomain + scope.row.photo) : require('@/img/common/userp.svg')"/>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户姓名" min-width="140"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="140"></el-table-column>
        <el-table-column prop="regMode" label="报名方式" min-width='100'>
          <template slot-scope="scope">
            {{scope.row.regMode == 1 ? "管理员安排" : scope.row.regMode == 2 ? "自主报名" : ""}}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" min-width='120'>
          <template slot-scope="scope">
            {{scope.row.state == 1 ? "未参与" : scope.row.state == 2 ? "已参与" : scope.row.state == 3 ? "匿名参与" : ""}}
          </template>
        </el-table-column>
        <el-table-column prop="completeTimeStr" label="参与时间" width='170'></el-table-column>
        <el-table-column prop="createUserName" label="报名人" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="报名时间" width='170'></el-table-column>
        <el-table-column prop="" label="操作" width="140">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="look(scope.row)" v-if="scope.row.state != 1">查看</el-button>
            <el-button v-if="prm.isDelete && scope.row.state == 1" type="text" @click.native="dele(scope.row)">删除</el-button>
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
          <el-button type="primary" @click="back">上一步</el-button>
          <el-button type="primary" @click="saveBtn">完成</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog width="70%" v-if="addUserBox" :title="title" :visible.sync="addUserBox" :close-on-click-modal="false" :before-close="closeAddUser" append-to-body>
      <add-user :options="options"></add-user>
    </el-dialog>
    <el-dialog width="70%" v-if="answerBox" :title="title" :visible.sync="answerBox" :close-on-click-modal="false" append-to-body>
      <answer :queryData="queryAnswer" from="survey"></answer>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Survey from "@api/data";
@Component({
  components: {
    "add-user": () => import("@c/AddUser.vue"),
    "answer": () => import("@c/TestPaper.vue")
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
    sortBy: false,
    sortField: "completeTime",
    query: ""
  };
  prm = {
    isDelete: false,
    isCreate: false,
    isUpdate: false
  };
  stateArr: object[] = [
    {
      id: 1,
      text: "未参与"
    },
    {
      id: 2,
      text: "已参与"
    },
    {
      id: 3,
      text: "匿名参与"
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  total: number = 0;
  options: any = {
    params: {
        surveyId: this.queryData.surveyId,
        sortBy: false,
        sortField: "updateTime",
        pageSize: 10,
        pageNum: 1
    },
    arrs: 'userIds',
    arr: 'userId'
  }
  addUserBox: boolean = false;
  queryAnswer: object = {};
  answerBox: boolean = false;
  

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
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
    Survey.survey_record_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.completeTimeStr = i.completeTime ? this.$formatDate(i.completeTime) : "-";
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
      surveyRecordIds: e.surveyRecordId
    }
    Survey.delete_survey_record_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            type: "success",
            message: "操作成功！"
          });
          if (this.tableData.length === 1 && this.params.pageNum > 1) {
            this.params.pageNum --;
          }
          this.getList();
        }
      })
  }
  addUser() {
    this.addUserBox = true;
  }
  closeAddUser() {
    this.addUserBox = false;
    this.getList();
  }
  look(e: object) {
    let data = {
      surveyId: e.surveyId,
      userId: e.userId
    }
    Survey.query_survey_question_record_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.title = "调查详情"
          this.queryAnswer = res.data;
          this.answerBox = true;
        }
      })
  }
  back(){
    this.$emit("createEditThreeOverUp");
  }
  saveBtn() {
    this.$emit("createEditThreeOver");
  }
}
</script>
<style lang="scss" scope>
.mg-center{
    text-align: center;
    margin-right: 13%;
  }
</style>