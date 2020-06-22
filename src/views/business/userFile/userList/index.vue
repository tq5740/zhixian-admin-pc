<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createUser" v-if="prm.isCreate">创建求职用户</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="用户名称" class='w230' v-model="params.query" @keyup.13.native="searchKey" clearable>
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="table" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="userImg" label="用户头像" width='100' align='center'>
          <template slot-scope="scope">
            <img v-if="scope.row.userImg && scope.row.userImg.includes('http')" class='img-bor' :src="scope.row.userImg" />
            <img v-else class='img-bor' :src="scope.row.userImg ? ($store.state.configData.imgDomain + scope.row.userImg) : require('@/img/common/userp.svg')"/>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="80"></el-table-column>
        <el-table-column label="性别" min-width="40">
          <template slot-scope="scope">
            {{scope.row.sex == 1 ? '男' : scope.row.sex == 2 ? '女' : '保密'}}
          </template>
        </el-table-column>
        <el-table-column prop="birthDateStr" label="出生日期" min-width="110" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" min-width="90"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="120"></el-table-column>
        <el-table-column prop="highestEducation" label="最高学历" min-width='80'>
          <template slot-scope="scope">
            {{$mapTypeStr(scope.row.highestEducation, $store.state.educationArr)}}
          </template>
        </el-table-column>
        <el-table-column prop="startWorkYearStr" label="工作年限" min-width='80'></el-table-column>
        <el-table-column prop="regTimeStr" label="注册时间" sortable='custom' width='180'></el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="editUser(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="addIntention(scope.row)">求职意向</el-button>
            <el-button type="text" @click.native="recommendWork(scope.row)">推荐就业</el-button>
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
    <!-- 创建注册用户 -->
    <el-dialog width="70%" :close-on-click-modal="false" v-if="createEditOne" :title="title" :visible.sync="createEditOne">
      <create-edit-one @createEditOneOver="createEditOneOver"></create-edit-one>
    </el-dialog>
    <el-dialog width="70%" :close-on-click-modal="false" v-if="createEditTwo" :title="title" :visible.sync="createEditTwo">
      <create-edit-two @createEditTwoOverUp="createEditTwoOverUp" @createEditTwoOverDown="createEditTwoOverDown"></create-edit-two>
    </el-dialog>
    <el-dialog width="70%" :close-on-click-modal="false" v-if="createEditThree" :title="title" :visible.sync="createEditThree">
      <create-edit-three @createEditThreeOverUp="createEditThreeOverUp" @createEditThreeOver="createEditThreeOver"></create-edit-three>
    </el-dialog>
    <!-- 推荐就业 -->
    <el-dialog width="70%" :append-to-body="true" v-if="isRecommendWork" :visible.sync="isRecommendWork" title="推荐职位列表">
      <recommend-work-list :data="workListData" :queryData="userId"></recommend-work-list>
    </el-dialog>
    <!-- 添加求职意向 -->
    <el-dialog :close-on-click-modal="false" v-if="showAddIntention" title="求职意向" :visible.sync="showAddIntention" :before-close="closeAddIntention">
      <el-form label-width="120px">
        <el-form-item label="期望职位 : ">
          <el-input placeholder="请填写期望职位" v-model="workTitle" class='w80per mgb-10' clearable></el-input>
          &nbsp;
          <span style="color: #fc703e;" > * 必填</span>
          <el-input placeholder="请填写期望职位" v-model="workTitle1" class='w80per' clearable></el-input>
        </el-form-item>
        <el-form-item label="工作性质 : ">
          <el-radio-group v-model="intentionObj.workNature">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">全职</el-radio>
            <el-radio :label="2">兼职</el-radio>
            <el-radio :label="3">实习</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="期望薪资 : ">
          <el-input placeholder="请填写期望薪资(兼职为日薪)" v-model="intentionObj.salary" class='w80per' type="number" :min="0" clearable></el-input>
          &nbsp;
          <span style="color: #fc703e;" > 兼职请填写日薪</span>
        </el-form-item>
        <el-form-item label="意向职能 : ">
          <el-cascader class='w80per mgb-10' v-model="post" :options="classifyList" @change="handleChange" :show-all-levels="false" clearable></el-cascader>
          &nbsp;
          <span style="color: #fc703e;" > * 必填</span>
          <el-cascader class='w80per' v-model="post1" :options="classifyList" @change="handleChange1" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="到岗时间 : ">
          <el-radio-group v-model="intentionObj.availableTime">
            <el-radio :label="1">随时</el-radio>
            <el-radio :label="2">一周内</el-radio>
            <el-radio :label="3">一月内</el-radio>
            <el-radio :label="4">待定</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否开放简历 : ">
          <el-radio-group v-model="intentionObj.isOvert">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click='saveIntentionBtn'>确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import User from "@api/user";
import Work from "@api/job";
import Booking from "@api/booking";
import { emptyLast, checkNum } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "create-edit-one": () => import("./createAndEdit_one.vue"),
    "create-edit-two": () => import("./createAndEdit_two.vue"),
    "create-edit-three": () => import("./createAndEdit_three.vue"),
    "recommend-work-list": () => import("./recommend_workList")
  }
})
export default class Companyreg extends Vue {
  params: any = {
    pageSize: 10,
    pageNum: 1,
    sortBy: false,
    sortField: "regTime",
    query: "",
    startTime: "",
    endTime: ""
  };
  prm = {
    isCreate: false
  };
  tableData: any[] = [];
  loading: boolean = false;
  isPending: boolean = false;
  total: number = 0;
  
  showAddIntention: boolean = false;
  intentionObj: any = {
    userId: "",
    workNature: "",
    salary: "",
    isOvert: "",
    availableTime: "",
    workCategory: "",
    workTitle: ""
  };
  classifyList: any[] = [];
  category: string = "";
  category1: string = "";
  workTitle: string = "";
  workTitle1: string = "";
  post: any[] = [];
  post1: any[] = [];
  loading1: boolean = false;

  isRecommendWork: boolean = false;
  workListData: any[] = [];
  workListObj: any = {
    pageSize: 10,
    pageNum: 1,
    sortBy: false,
    sortField: "updateTime",
    query: ""
  };
  userId: string | number = "";

  createEditOne: boolean = false;
  createEditTwo: boolean = false;
  createEditThree: boolean = false;
  title: string = "";
  create: boolean = true;

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.state ||
        this.params.startTime ||
        this.params.endTime
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    User.work_user_reg_list({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          let year = new Date().getFullYear();
          res.data.result.forEach((i: any) => {
            i.regTimeStr = this.$formatDate(i.regTime);
            i.birthDate ? i.birthDateStr = this.$formatDate(i.birthDate, 'YYYY-MM-DD') : i.birthDateStr = "-";
            i.startWorkYear ? i.startWorkYearStr = year - i.startWorkYear + "年" : "-";
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
  // 添加求职意向
  async addIntention(e: any) {
    this.getIntention(e)
    this.intentionObj.userId = e.userId;
    this.showAddIntention = true;
    if (this.$store.state.jobClassify.length === 0) {
      await this.$store.dispatch("getJobclassifyTree");
    }
    this.classifyList = [];
    this.classifyList = this.$forTree(
      this.$store.state.jobClassify,
      "workCategoryId",
      "workCategoryTitle"
    );
    emptyLast(this.classifyList);
  }
  getIntention(e: string){
    this.loading1 = true;
    let data = { 
      userId: e.userId
    };
    Booking.queryIntentionAdmin({ data })
      .then(res => {
        if (res.code === 0 && res.data) {
          let resData = res.data;
          this.intentionObj.workNature = resData.workNature;
          this.intentionObj.salary = resData.salary;
          this.intentionObj.isOvert = resData.isOvert;
          this.intentionObj.availableTime = resData.availableTime;
          var arr = JSON.parse(resData.workCategory);
          if(resData.workCategory && arr.length !== 0){
            this.post = [
              ...this.$getFather(
                this.classifyList,
                this.classifyList,
                arr[0]
              ),
              arr[0]
            ]
            if (arr.length >= 2) this.post1 = [
              ...this.$getFather(
                this.classifyList,
                this.classifyList,
                arr[1]
              ),
              arr[1]
            ];
          }
          if(resData.workTitle){
            var arr = JSON.parse(resData.workTitle);
            this.workTitle = arr[0];
            this.workTitle1 = arr[1];
          }
        }
      })
      .finally(() => {
        this.loading1 = false;
      })
  }
  is() {
    if (!this.workTitle) {
      this.$notify({
        title: "提示",
        message: `请填写第一个期望职位!`,
        type: "error"
      });
      return false;
    } else if (!this.post || this.post.length === 0) {
      this.$notify({
        title: "提示",
        message: `请填写第一个意向职能!`,
        type: "error"
      });
      return false;
    } else if (this.intentionObj.salary && !checkNum(this.intentionObj.salary)) {
      this.$notify({
        title: "提示",
        message: `期望薪资为纯数字!`,
        type: "error"
      });
      return false;
    } else {
      return true;
    }
  }
  saveIntentionBtn() {
    if (!this.is()) return;
    let arr = [];
    arr[0] = this.category;
    arr[1] = this.category1;  
    this.intentionObj.workCategory = JSON.stringify(arr);
    let arr1 = [];
    arr1[0] = this.workTitle;
    arr1[1] = this.workTitle1;
    this.intentionObj.workTitle = JSON.stringify(arr1);
    this.loading1 = true;
    let data = {
      ...this.intentionObj
    }
    Work.create_intention_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `操作成功!`,
            type: "success"
          });
          this.closeAddIntention();
          this.getList();
        }
      })
      .finally(() => {
        this.loading1 = false;
      });
  }
  closeAddIntention() {
    this.showAddIntention = false;
    this.workTitle = "";
    this.workTitle1 = "";
    this.category = "";
    this.category1 = "";
    this.post = [];
    this.post1 = [];
    this.intentionObj = {
      userId: "",
      workNature: "",
      salary: "",
      isOvert: "",
      availableTime: "",
      workCategory: "",
      workTitle: ""
    }
  }
  handleChange(val: any) {
    this.category = val[val.length - 1];
  }
  handleChange1(val: any) {
    this.category1 = val[val.length - 1];
  }
  // 创建注册用户
  createUser() {
    this.create = true;
    let arr = this.$store.state.userData;
    arr.id = '';
    arr.name = '';
    this.$store.commit('setUserData', arr);
    this.title = "创建求职用户 基本信息";
    this.createEditOne = true;
  }
  editUser(e: any) {
    let arr = this.$store.state.userData;
    arr.id = e.userId;
    arr.name = e.name;
    this.$store.commit('setUserData', arr)
    this.create = false;
    this.title = "编辑求职用户 基本信息 " + (this.$store.state.userData.name || '');
    this.createEditOne = true;
  }
  createEditOneOver() {
    this.create === true ? this.title = "创建求职用户 工作经历": this.title = "编辑求职用户 工作经历 " + (this.$store.state.userData.name || '');
    this.createEditOne = false;
    this.createEditTwo = true;
    this.getList();
  }
  createEditTwoOverUp() {
    this.create === true ? this.title = "创建求职用户 基本信息": this.title = "编辑求职用户 基本信息 " + (this.$store.state.userData.name || '');
    this.createEditOne = true;
    this.createEditTwo = false;
  }
  createEditTwoOverDown() {
    this.create === true ? this.title = "创建求职用户 教育经历": this.title = "编辑求职用户 教育经历 " + (this.$store.state.userData.name || '');
    this.createEditTwo = false;
    this.createEditThree = true;
  }
  createEditThreeOverUp() {
    this.create === true ? this.title = "创建求职用户 工作经历": this.title = "编辑求职用户 工作经历 " + (this.$store.state.userData.name || '');
    this.createEditTwo = true;
    this.createEditThree = false;
  }
  createEditThreeOver() {
    this.createEditThree = false;
    this.getList();
  }
  // 推荐就业
  recommendWork(e: any) {
    this.userId = e.userId;
    let data = {
      ...this.workListObj,
      userId: this.userId
    }
    Booking.matching_work_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.workListData = res.data;
          this.isRecommendWork = true;
        }
      })
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  
}
</script>
<style lang="scss" scope>
.mgb-10{
  margin-bottom: 10px;
}
.mag-top20 {
  float: left;
  margin-top: 15px;
}
.mag-left20 {
  margin-left: 15px;
}
</style>