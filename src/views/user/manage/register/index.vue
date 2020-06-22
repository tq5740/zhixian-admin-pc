<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="姓名/手机号" v-model="params.query" class='w230' @keyup.13.native="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
            <el-option label="全部" value=""></el-option>
            <el-option label="禁用" value="2"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select placeholder="企业" filterable v-model="params.deptHierarchy" class='w230' @change="getList" clearable @clear="params.deptHierarchy = ''">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.hierarchy" :label="i.orgName" :value="i.hierarchy"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-cascader placeholder="部门" class='w150' :options="deptDara" @change="changeDept" clearable filterable change-on-select :show-all-levels="false"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change="changeTime" header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="photo" label="头像" width='80' align="center">
          <template slot-scope="scope">
            <img class='img-bor1' :src="scope.row._photo" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="120"></el-table-column>
        <el-table-column prop="email" label="电子邮箱" min-width='140'></el-table-column>
        <el-table-column prop="identityStr" label="用户类型" min-width="120"></el-table-column>
        <el-table-column prop="state" label="状态" min-width='70'>
          <template slot-scope='scope'>
            {{scope.row.state == 1 ? '启用' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column prop="regIp" label="注册IP" min-width='120'></el-table-column>
        <el-table-column sortable='custom' prop="regTimeStr" label="注册时间" width='170'>
        </el-table-column>
        <el-table-column prop="loginTime" label="操作" width="280">
          <template slot-scope='scope'>
            <el-button v-if="isReset" type="text" @click.native="resetpwd(scope.row)">重置密码</el-button>
            <el-button type="text" @click.native="seeLoginList(scope.row)">登录记录</el-button>
            <el-button v-if="isForbidden" type="text" @click.native="toggleUserState(scope.row)">{{scope.row.state==2 ? '启用' : '禁用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item label="">
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog :close-on-click-modal="false" v-if="showLoginRecord" title="登录记录" :visible.sync="showLoginRecord" :before-close="close">
      <login-record :userId="userId"></login-record>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    allroute
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-8:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import User from "@api/user";
import Work from "@api/job";
import Booking from "@api/booking";
import { debounce } from "typescript-debounce-decorator";
import { State } from "vuex-class";
import { emptyLast } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "login-record": () => import("./loginRecord.vue")
  }
})
export default class Register extends Vue {
  time: string[] = [];
  params: any = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    startTime: "",
    endTime: "",
    state: "",
    sortBy: false,
    sortField: "regTime"
  };
  isReset: boolean = false;
  isForbidden: boolean = false;
  showLoginRecord: boolean = false;
  loading: boolean = false;
  tableData: any[] = [];
  total: number = 0;
  userId: string = "";

  showCreateUser: boolean = false;
  createUserObj: any = {};
  cropperShow: boolean = false;

  deptDara: any[] = [];

  @State("configData") configData: any;
  created() {
    this.getList();
    let { isReset, isForbidden } = this.$store.state.activeMenu[
      this.$route.path
    ];
    this.isReset = isReset;
    this.isForbidden = isForbidden;
    // this.getOrgList();
    this.getDept();
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
      }
    }
  }
  async getDept() {
    if (this.$store.state.deptTree.length === 0) {
      await this.$store.dispatch("getDeptTree");
    }
    this.deptDara = [];
    this.deptDara = this.$forTree(
      this.$store.state.deptTree,
      "hierarchy",
      "deptName"
    );
    emptyLast(this.deptDara);
  }
  @debounce(500, { leading: false })
  changeDept(e: any) {
    this.params.deptHierarchy = e[e.length - 1];
    this.getList();
  }
  changeTime() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  close() {
    this.showLoginRecord = false;
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  toggleUserState(e: any) {
    this.$prompt(
      `是否${e.state === 1 ? "禁用" : "启用"}用户 "${e.name}"？ 请填写原因：`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '必须填写原因'
      }
    )

    if(e.state === 1){
      this.$prompt(
      `是否禁用用户 "${e.name}" ？ 请填写原因：`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '必须填写原因'
      }).then(({ value }) => {
        this.loading = true;
        let data = {
          userId: e.userId,
          state: e.state === 1 ? "2" : "1",
          reason: value
        };
        User.updateUserState({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `操作成功!`,
                type: "success"
              });
              this.getList();
            } else {
              this.loading = false;
            }
          })
          .catch(() => {
            this.loading = false;
          });
      })
      .catch(() => {});
    }else {
      this.$confirm(
      `是否启用用户 "${e.name}"？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        this.loading = true;
        let data = {
          userId: e.userId,
          state: e.state === 1 ? "2" : "1"
        };
        User.updateUserState({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `操作成功!`,
                type: "success"
              });
              this.getList();
            } else {
              this.loading = false;
            }
          })
          .catch(() => {
            this.loading = false;
          });
      })
      .catch(() => {});
    }
      
  }
  resetpwd(e: any) {
    this.$confirm(
      `确定要用户 "${e.name}" 的密码重置为：cdjy9957吗？ `,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    )
      .then(() => {
        this.loading = true;
        let data = {
          userId: e.userId
        };
        User.userResetPassword({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `密码重置成功!`,
                type: "success"
              });
            }
          })
          .finally(() => {
            this.loading = false;
          });
      })
      .catch(() => {});
  }
  seeLoginList(e: any) {
    this.userId = e.userId;
    this.showLoginRecord = true;
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.state || this.params.query || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    User.recentlyRegList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.regTimeStr = this.$formatDate(i.regTime);
            if (i.photo) {
              if (i.photo.includes("http")) {
                i._photo = i.photo;
              } else {
                i._photo =
                  this.configData.imgDomain + i.photo + this.$imgSize["30x30"];
              }
            } else {
              i._photo = require("@/img/common/userp.svg");
            }
            if (i.identity) {
              if (i.identity.includes("[")){
                i.identityStr = JSON.parse(i.identity).join("、")
              } else {
                i.identityStr = i.identity
              }
            } else {
              i.identityStr = "普通用户"
            }
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startTime = time[0];
      this.params.endTime = time[1];
    } else {
      this.params.startTime = "";
      this.params.endTime = "";
    }
    this.getList();
  }
  
  handleChange(val: any) {
    this.category = val[val.length - 1];
  }
  handleChange1(val: any) {
    this.category1 = val[val.length - 1];
  }
}
</script>
<style lang="scss" scoped>
.mgb-10{
  margin-bottom: 10px;
}
</style>
