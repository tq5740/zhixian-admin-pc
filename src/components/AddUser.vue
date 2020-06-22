<template>
  <div id="createAndEdit">

    <el-row class="userTab">
      <el-col :span="6">
        <div class="userTab-txt" :class="{ bgTxt: bgActive===3 }" @click='bgActive = 3,isCheckAllPort=false,getDep(),userData = []' style="border-left:0">内部员工
        </div>
      </el-col>
      <el-col :span="6">
        <div class="userTab-txt" :class="{ bgTxt: bgActive===2 }" @click='bgActive = 2,isCheckAllPort=false,getDep()'>部门
        </div>
      </el-col>
      <el-col :span="6">
        <div :disabled="true" class="userTab-txt" :class="{ bgTxt: bgActive===1 }" @click="bgActive = 1,isCheckAllPort=false,getDep()">岗位
        </div>
      </el-col>
      <el-col :span="6">
        <div class="userTab-txt" :class="{ bgTxt: bgActive===4 }" @click='params1.labelId = "",bgActive = 4,isCheckAllPort=false,getDep()'>注册用户
        </div>
      </el-col>
    </el-row>
    <!-- 内部员工 -->
    <el-row v-show='bgActive===3'>
      <el-input v-model="params.query" placeholder="请输入姓名手机号搜索" class="seek" @keyup.13.native="userListFun()" @change="userListFun()" clearable>
        <el-button class="clickBtn" @click="userListFun()" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table @sort-change='sortFun2' height="441" ref="userTable" border :data="userData" v-loading="loading" element-loading-text="拼命加载中" @selection-change='OrgUserSelect' empty-text=" ">
        <el-table-column type="selection" align="center" min-width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="employeeNumber" label="工号" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="120"></el-table-column>
        <el-table-column prop="hireDateStr" label="入职时间" min-width='180'></el-table-column>
        <el-table-column prop="" label="操作" min-width='80'>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click='joinSelectBtn(scope.row)'>加入</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-checkbox class="mg-left10" v-model='allCheckboxOrgUser' :indeterminate="isIndeterminateOrg" @change="handleCheckAllChangeOrg" :disabled="userData.length === 0">{{!allCheckboxOrgUser ? '全选' : '取消全选'}}</el-checkbox>
        <el-button class="mg-left10" type="primary" size="small" @click='joinSelectBtn()'>加入</el-button>
      </el-row>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>共有
            <span class="TxtColor20A0FF">{{userTotal}} </span>条数据，每页显示
            <el-select placeholder="" v-model="params.pageSize" class='w65' @change='pageSeleUser'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination @current-change="userPageNum" layout="prev, pager, next, jumper" :page-size="params.pageSize" :total="userTotal"></el-pagination>
      </div>
    </el-row>
    <!-- 岗位 -->
    <el-row v-show='bgActive===1'>
      <el-input v-model="txtPort" placeholder="请输入岗位名称搜索" class="seek" @change="filterPortFun" clearable></el-input>
      <el-button @click="setCheckedNodes('port')" style="margin-bottom:15px">全选岗位</el-button>
      <el-tree style="height: 400px; overflow: auto;" check-strictly :filter-node-method="filterPort" :data="postData" show-checkbox default-expand-all node-key="value" ref="refPotr" highlight-current :props="defaultProps">
      </el-tree>
      <br>
      <el-row class="text-center">
        <el-button @click="reset(2)">重置</el-button>
        <el-button @click="confirm('port')" type="primary">确定</el-button>
      </el-row>
    </el-row>
    <!-- 部门 -->
    <el-row v-show='bgActive===2'>
      <el-input v-model="txtDep" placeholder="请输入部门名称搜索" class="seek" @change="filterDepFun" clearable></el-input>
      <el-tree style="height: 455px; overflow: auto;" check-strictly :filter-node-method="filterPort" :data="deptDara" show-checkbox default-expand-all node-key="value" ref="refDep" highlight-current :props="defaultProps">
      </el-tree>
      <el-row class="text-center">
        <el-button @click="reset(1)">重置</el-button>
        <el-button @click="confirm('dep')" type="primary" style="margin-top:15px">确定</el-button>
      </el-row>
    </el-row>
    <!-- 注册用户 -->
    <el-row v-show='bgActive===4'>
      <el-input v-model="params1.query" placeholder="请输入姓名手机号搜索" class="seek" @keyup.13.native="getLogin" clearable>
        <el-button class="clickBtn" @click="getLogin" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-table @sort-change='sortFun1' height="441" ref="registerTab" border :data="ZCuserData" v-loading="loading" element-loading-text="拼命加载中" @selection-change='RigUserSelect' empty-text=" ">
        <el-table-column type="selection" align="center" min-width="55"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="120"></el-table-column>
        <el-table-column prop="regTimeStr" label="注册时间" min-width='180'></el-table-column>
        <el-table-column prop="" label="操作" min-width='80'>
          <template slot-scope="scope">
            <el-button type="text" size="small" @click='joinSelectBtn(scope.row)'>加入</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-checkbox class="mg-left10" v-model='allCheckboxRigUser' :indeterminate="isIndeterminateRig" @change="handleCheckAllChangeRig" :disabled="ZCuserData.length === 0">{{!allCheckboxRigUser ? '全选' : '取消全选'}}
        </el-checkbox>
        <el-button class="mg-left10" type="primary" size="small" @click='joinSelectBtn("")'>加入</el-button>
      </el-row>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item> 共有
          <span class="TxtColor20A0FF">{{userTotal}} </span>条数据，每页显示
          <el-select placeholder="" v-model="params1.pageSize" class='w65' @change='getLogin'>
            <el-option label="10" value="10"></el-option>
            <el-option label="20" value="20"></el-option>
            <el-option label="50" value="50"></el-option>
          </el-select>
          条
          </el-form-item>
        </el-form>
        <el-pagination @current-change="getLogin" :current-page.sync="params1.pageNum" layout="prev, pager, next, jumper" :page-size="params1.pageSize" :total="userTotal"></el-pagination>
      </div>
    </el-row>

  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from "vue-property-decorator";
import Course from "@api/train";
import User from "@api/user";
import Exam from "@api/exam";
import Live from "@api/live";
import Eval from "@api/eval";
import Survey from "@api/data";

//https://github.com/ktsn/vuex-class
@Component({
  props: {
    options: {
      type: Object,
      default: {}
    }
  }
})

export default class AddUser extends Vue {
  options: any = this.options;
  params: any = {
    pageSize: 10,
    pageNum: 1,
    sortBy: false,
    sortField: "createTime"
  };
  params1: any = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    trainBatch: "",
    sortBy: false,
    sortField: "regTime",
    labelId: ""
  };
  defaultProps: any = {
    children: "children",
    label: "label",
    value: "value"
  };
  ZCuserData: any[] = [];
  allCheckboxOrgUser: boolean = false; //-------企业用户全选
  allCheckboxRigUser: boolean = false; //-------注册用户全选
  txtPort: string = ""; //---------------------搜索岗位
  txtDep: string = ""; //----------------------搜索部门
  postData: any[] = [];
  deptDara: any[] = [];
  bgActive: string = "";
  notInit: string = "暂无数据";
  userData: any[] = [];
  
  loading: boolean = false;
  seek: string = ""; //-------------------------搜索
  total: number = 0; //-------------------------共多少条数据
  isIndeterminateOrg: boolean = false;
  isIndeterminateRig: boolean = false;
  selectDataUser: any[] = [];
  userTotal: number = 0;
  isCheckAllPort: boolean = false;

  created() {
    this.userInit();
    this.getDep();
  }
  // 注册
  sortFun1() {
    this.params1.sortBy = !this.params1.sortBy;
    this.getLogin();
  }
  // 入职
  sortFun2() {
    this.params.sortBy = !this.params.sortBy;
    this.userListFun();
  }
  getLogin() {
    let data = {
      ...this.params1
    }
    User.recentlyRegList({ data }).then(res => {
      if (res.code === 0) {
        this.userTotal = res.data.total;
        res.data.result.forEach((i: any) => {
          i.regTimeStr = this.$formatDate(i.regTime, "YYYY-MM-DD hh:mm:ss");
        });
        this.ZCuserData = res.data.result;
      }
    });
  }
  //------------------------------------------------------------------------------------------------------- 添加用户列表代码
  setCheckedNodes(e: any) {
    if (!this.isCheckAllPort) {
      this.$refs.refPotr.setCheckedNodes(this.postData);
      this.isCheckAllPort = true;
    } else {
      this.reset();
      this.isCheckAllPort = false;
    }
  }
  userInit() {
    this.params1.trainBatch = "";
    this.ZCuserData = [];
    this.bgActive = 3;
    this.allCheckboxOrgUser = false;
    this.allCheckboxRigUser = false;
    this.params.pageSize = 10;
    this.params.pageNum = 1;
    delete this.params.query, (this.params1.query = "");
  }
  // 用户列表第几页
  userPageNum(pageNum) {
    this.params.pageNum = pageNum;
    this.userListFun();
  }
  //  用户列表一页显示多少个
  pageSeleUser(pageSize) {
    this.params.pageSize = parseInt(pageSize);
    this.userListFun();
  }
  // 搜索岗位
  filterPortFun() {
    this.$refs.refPotr.filter(this.txtPort);
  }
  filterPort(value, data) {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  }
  // 搜素部门
  filterDepFun() {
    this.$refs.refDep.filter(this.txtDep);
  }
  filterDep(value, data) {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  }
  // 用户加入
  joinSelectBtn(data) {
    if (data) {
      this.options.params["userIds"] = data["userId"];
      this.setRecordListFun();
    } else {
      if (this.selectDataUser.length === 0) {
        this.$notify({
          title: "提示",
          message: "请先勾选用户",
          type: "warning"
        });
      } else {
        let id = JSON.stringify(this.selectDataUser.map(i => i.userId));
        this.options.params.userIds = id.replace(/"|\[|\]/g,'');
        this.setRecordListFun();
      }
    }
  }
  setRecordListFun() {
    // delete this.options.params.pageSize;
    // delete this.options.params.pageNum;
    this.options.params.regMode = "1";
    if( "courseId" in this.options.params ){
      let data = {
        ...this.options.params,
        courseId: this.$store.state.courseData.id
      }
      Course.create_course_record_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success"
          });
          if (this.options.params.orgPortIds) {
            this.reset(2);
            delete this.options.params.orgPortIds;
          } else if (this.options.params.userIds) {
            this.$refs.userTable.clearSelection();
            this.$refs.registerTab.clearSelection();
            this.allCheckboxOrgUser = false;
            this.allCheckboxRigUser = false;
            delete this.options.params.userIds;
          } else if (this.options.params.userIds) {
            this.reset();
            delete this.options.params.userIds;
          }
          this.options.params.pageSize = 10;
          this.options.params.pageNum = 1;
        }
      });
    }
    if( "trainId" in this.options.params ){
      let data = {
        ...this.options.params,
        trainId: this.$store.state.trainData.id
      }
      Course.create_train_record_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success"
          });
          if (this.options.params.orgPortIds) {
            this.reset(2);
            delete this.options.params.orgPortIds;
          } else if (this.options.params.userIds) {
            this.$refs.userTable.clearSelection();
            this.$refs.registerTab.clearSelection();
            this.allCheckboxOrgUser = false;
            this.allCheckboxRigUser = false;
            delete this.options.params.userIds;
          } else if (this.options.params.userIds) {
            this.reset();
            delete this.options.params.userIds;
          }
          this.options.params.pageSize = 10;
          this.options.params.pageNum = 1;
        }
      });
    }
    if( "examId" in this.options.params ){
      let data = {
        ...this.options.params,
        examId: this.$store.state.examData.id
      }
      Exam.create_exam_reg_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success"
          });
          if (this.options.params.orgPortIds) {
            this.reset(2);
            delete this.options.params.orgPortIds;
          } else if (this.options.params.userIds) {
            this.$refs.userTable.clearSelection();
            this.$refs.registerTab.clearSelection();
            this.allCheckboxOrgUser = false;
            this.allCheckboxRigUser = false;
            delete this.options.params.userIds;
          } else if (this.options.params.userIds) {
            this.reset();
            delete this.options.params.userIds;
          }
          this.options.params.pageSize = 10;
          this.options.params.pageNum = 1;
        }
      });
    }
    if( "liveId" in this.options.params ){
      let data = {
        ...this.options.params,
        liveId: this.$store.state.liveData.id
      }
      Live.create_live_reg_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success"
          });
          if (this.options.params.orgPortIds) {
            this.reset(2);
            delete this.options.params.orgPortIds;
          } else if (this.options.params.userIds) {
            this.$refs.userTable.clearSelection();
            this.$refs.registerTab.clearSelection();
            this.allCheckboxOrgUser = false;
            this.allCheckboxRigUser = false;
            delete this.options.params.userIds;
          } else if (this.options.params.userIds) {
            this.reset();
            delete this.options.params.userIds;
          }
          this.options.params.pageSize = 10;
          this.options.params.pageNum = 1;
        }
      });
    }
    if( "evalId" in this.options.params ){
      let data = {
        ...this.options.params,
        evalId: this.$store.state.evalData.id
      }
      Eval.create_evaluation_report_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success"
          });
          if (this.options.params.orgPortIds) {
            this.reset(2);
            delete this.options.params.orgPortIds;
          } else if (this.options.params.userIds) {
            this.$refs.userTable.clearSelection();
            this.$refs.registerTab.clearSelection();
            this.allCheckboxOrgUser = false;
            this.allCheckboxRigUser = false;
            delete this.options.params.userIds;
          } else if (this.options.params.userIds) {
            this.reset();
            delete this.options.params.userIds;
          }
          this.options.params.pageSize = 10;
          this.options.params.pageNum = 1;
        }
      });
    }
    if( "surveyId" in this.options.params ){
      let data = {
        ...this.options.params
      }
      Survey.create_survey_record_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success"
          });
          if (this.options.params.orgPortIds) {
            this.reset(2);
            delete this.options.params.orgPortIds;
          } else if (this.options.params.userIds) {
            this.$refs.userTable.clearSelection();
            this.$refs.registerTab.clearSelection();
            this.allCheckboxOrgUser = false;
            this.allCheckboxRigUser = false;
            delete this.options.params.userIds;
          } else if (this.options.params.userIds) {
            this.reset();
            delete this.options.params.userIds;
          }
          this.options.params.pageSize = 10;
          this.options.params.pageNum = 1;
        }
      });
    }
  }
  //  重置
  reset(e: any) {
    if (e == 2) {
      this.$refs.refPotr.setCheckedNodes([]);
    } else {
      this.$refs.refDep.setCheckedNodes([]);
    }
  }
  //  确定
  confirm(e: any) {
    delete this.options.params.userIds;
    if (e == "port") {
      delete this.options.params.orgDepIds;
      this.options.params.orgPortIds = [];
      this.$refs.refPotr.getCheckedNodes().forEach(function(element) {
        this.options.params.orgPortIds.push(element.value);
      }, this);
      this.options.params.orgPortIds = "" + this.options.params.orgPortIds;
      if (this.options.params.orgPortIds) {
        this.setRecordListFun();
      } else {
        this.$notify({
          title: "提示",
          message: "请先选择岗位",
          type: "warning"
        });
      }
    } else if (e == "dep") {
      delete this.options.params.orgPortIds;
      this.options.params.orgDepIds = [];
      this.$refs.refDep.getCheckedNodes().forEach(function(element) {
        this.options.params.orgDepIds.push(element.title);
      }, this);
      this.options.params.orgDepIds = "" + this.options.params.orgDepIds;
      if (this.options.params.orgDepIds) {
        delete this.options.params.pageSize;
        delete this.options.params.pageNum;
        this.setRecordListFun();
      } else {
        this.$notify({
          title: "提示",
          message: "请先选择部门",
          type: "warning"
        });
      }
    }
  }
  // 企业用户列表单选
  handleCheckAllChangeOrg() {
    if (this.allCheckboxOrgUser) {
      this.$refs.userTable.toggleAllSelection();
    } else {
      this.$refs.userTable.clearSelection();
    }
    this.OrgUserSelect;
  }
  OrgUserSelect(e: any) {
    this.selectDataUser = e;
    let checkedCount = e.length;
    this.allCheckboxOrgUser = checkedCount === this.userData.length && this.userData.length != 0;
    this.isIndeterminateOrg = checkedCount > 0 && checkedCount < this.userData.length;
  }
  // 注册用户底部全选
  handleCheckAllChangeRig() {
    if (this.allCheckboxRigUser) {
      this.$refs.registerTab.toggleAllSelection();
    } else {
      this.$refs.registerTab.clearSelection();
    }
    this.RigUserSelect;
  }
  RigUserSelect(e: any) {
    this.selectDataUser = e;
    let checkedCount = e.length;
    this.allCheckboxRigUser = checkedCount === this.ZCuserData.length && this.ZCuserData.length != 0;
    this.isIndeterminateRig = checkedCount > 0 && checkedCount < this.ZCuserData.length;
  }
  //  添加用户
  getDep() {
    this.options.params.userIds = "";
    this.allCheckboxOrgUser = false;
    this.allCheckboxRigUser = false;
    if (this.bgActive === 1) {
      this.getPost();
    } else if (this.bgActive === 2) {
      this.getDept();
    } else if (this.bgActive === 3) {
      this.userListFun();
    } else if (this.bgActive === 4) {
      this.getLogin();
    } else {
      return;
    }
  }
  // 部门列表
  async getDept() {
    if (this.$store.state.deptTree.length === 0) {
      await this.$store.dispatch("getDeptTree");
    }
    this.deptDara = [];
    this.deptDara = this.$forTree(
      this.$store.state.deptTree,
      "deptId",
      "deptName"
    );
  }
  // 岗位列表
  async getPost(force: boolean = false) {
    if (this.$store.state.postTree.length === 0) {
      await this.$store.dispatch("getPostTree");
    }
    this.postData = [];
    this.postData = this.$forTree(
      this.$store.state.postTree,
      "postId",
      "postName"
    );
  }
  // 用户列表
  userListFun() {
    let data = {
      ...this.params
    }
    User.orgUserList({ data }).then(res => {
      if (res.code === 0) {
        this.userTotal = res.data.total;
        res.data.result.forEach((i: any) => {
          i.createTimeStr = this.$formatDate(i.createTime, "YYYY-MM-DD hh:mm:ss");
          i.hireDateStr = this.$formatDate(i.hireDate, "YYYY-MM-DD hh:mm:ss");
        });
        this.userData = res.data.result;
        if (res.data.result.length === 0) {
          this.notInit = "暂无数据";
        }
      }
    });
  }
}  
</script>
<style lang="scss" scoped>
.userTab{
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  .userTab-txt{
    border-left: 1px solid #ccc;
    background: #f5f5f5;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .bgTxt{
    background-color: #fff;
  }
}
.seek {
  margin: 20px 0;
}
.mg-left10{
  margin-top: 10px;
  margin-left: 10px;
}
.page-num{
  margin-top: 20px;
  margin-bottom: 40px;
}
</style>

