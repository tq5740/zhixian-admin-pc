<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button v-if="prm.isCreate" type="primary" @click="createAdmin">创建管理员</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="姓名/手机号" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader placeholder="权限范围" class='w150' :options="permissionHierarchyList" clearable change-on-select @change="changePRM" filterable></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="角色名称" v-model="params.roleName" class='w150' @change="getList" clearable @clear="params.roleName = ''">
            <el-option :key="i.roleId" v-for="i in roleArr" :value="i.roleName" :label="i.roleName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table stripe @sort-change="changeTime" header-row-class-name="thead" :data="tableData" v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="photo" label="头像" width='80' align="center">
          <template slot-scope="scope">
            <img class='img-bor1' :src="scope.row._photo" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="120"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" min-width='120'></el-table-column>
        <el-table-column prop="permissionDept" label="权限范围" min-width='160'></el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width='120'></el-table-column>
        <el-table-column sortable='custom' prop="updateTimeStr" label="修改时间" width='160'>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope='scope'>
            <el-button type="text" v-if="prm.isUpdate" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" v-if="prm.isDelete" @click.native="del(scope.row)">删除</el-button>
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

    <!-- 创建/编辑 -->
    <el-dialog :close-on-click-modal="false" width="40%" v-if="showBox" :title="title" :visible.sync="showBox" :before-close="close">
      <el-form class="mg15" :inline="true">
        <el-row>
          <el-form-item label="用户姓名 : ">
            <el-autocomplete :disabled="title ===`编辑管理员`" class='w240' v-model="userName" :fetch-suggestions="querySearchAsync" placeholder="根据姓名或手机号选择用户" @select="handleSelect"></el-autocomplete>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="权限范围 :">
            <el-cascader @change="selectDeptId" v-model="defaultDept" :options="permissionHierarchyList" clearable filterable change-on-select></el-cascader>
            <!-- <el-select v-model="adminObj.permissionDeptId" class='w240'>
              <el-option :key="i.deptId" v-for="i in permissionHierarchyList" :value="i.hierarchy" :label="i.deptName">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="角色名称 :">
            <el-select v-model="adminObj.roleId" class='w240'>
              <el-option :key="i.roleId" v-for="i in roleArr" :value="i.roleId" :label="i.roleName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-button :loading="isPending" type="primary" @click="saveBtn">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    admin
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-20:adminlsit
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import { State } from "vuex-class";
import Dept from "@api/dept";
import User from "@api/user";
import UserAdmin from "@api/userAdmin";
import Role from "@api/role";
import { emptyLast } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({})
export default class AdminList extends Vue {
  time: string[] = [];
  params = {
    state: "",
    roleName: "",
    pageSize: 10,
    pageNum: 1,
    startTime: "",
    endTime: "",
    permissionDeptId: "",
    query: "",
    sortBy: false,
    sortField: "updateTime"
  };
  adminObj = {
    permissionDeptId: "",
    roleId: "",
    userId: ""
  };
  permissionHierarchyList: any[] = [];
  total: number = 0;
  tableData: any[] = [];
  loading: boolean = false;
  showBox: boolean = false;
  isPending: boolean = false;
  title: string = `创建管理员`;
  userName: string = "";
  roleArr: any[] = [];
  defaultDept: string[] = [];
  prm = {
    isDelete: false,
    isCreate: false,
    isUpdate: false
  };
  @State("configData") configData: any;
  created() {
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
    this.getList();
    this.getPrmDept();
    this.getRoleList();
  }
  changeTime() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  selectDeptId(e: any) {
    if (e.length === 0) {
      this.adminObj.permissionDeptId = "";
    } else {
      this.adminObj.permissionDeptId = e[e.length - 1];
    }
  }
  @debounce(500, { leading: false })
  changePRM(e: any) {
    if (e.length === 0) {
      this.params.permissionDeptId = "";
    } else {
      this.params.permissionDeptId = e[e.length - 1];
    }
    this.getList();
  }
  close() {
    this.showBox = false;
    this.adminObj = {
      permissionDeptId: "",
      roleId: "",
      userId: ""
    };
    this.defaultDept = [];
    this.userName = "";
  }
  saveBtn() {
    if (!this.adminObj.permissionDeptId) {
      this.$notify({
        title: "提示",
        message: `请选择权限范围!`,
        type: "error"
      });
      return;
    }
    if (!this.adminObj.roleId) {
      this.$notify({
        title: "提示",
        message: `请选择角色!`,
        type: "error"
      });
      return;
    }
    if (!this.userName || !this.adminObj.userId) {
      this.$notify({
        title: "提示",
        message: `请选择用户!`,
        type: "error"
      });
      return;
    }
    let data = { ...this.adminObj };
    this.isPending = true;
    if (this.title === "创建管理员") {
      UserAdmin.createUserAdminstrator({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `创建成功!`,
              type: "success"
            });
            this.close();
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      UserAdmin.updateUserAdminstrator({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `编辑成功!`,
              type: "success"
            });
            this.close();
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  del(e: any) {
    this.$confirm(`是否删除管理员 "${e.name}"? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          userId: e.userId
        };
        UserAdmin.deleteUserAdminstrator({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `删除成功!`,
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
  @debounce(200, { leading: false })
  edit(e: any) {
    this.defaultDept = this.$getFather(
      this.permissionHierarchyList,
      this.permissionHierarchyList,
      e.permissionHierarchy,
      true
    );
    console.log(this.defaultDept);
    console.log(this.permissionHierarchyList);
    this.adminObj.permissionDeptId = this.defaultDept[
      this.defaultDept.length - 1
    ];
    this.adminObj.roleId = e.roleId;
    this.adminObj.userId = e.userId;
    this.userName = e.name + " - " + e.phone;
    this.title = "编辑管理员";
    this.showBox = true;
  }
  @debounce(200, { leading: false })
  querySearchAsync(query: string, cb: Function) {
    if (query) {
      let data = { query };
      User.queryUserVague({ data }).then(res => {
        if (res.code === 0) {
          let result = res.data.map((i: any) => ({
            value: i.name + " - " + i.phone,
            userId: i.userId
          }));
          cb(result);
        }
      });
    }
  }
  handleSelect(item: any) {
    this.adminObj.userId = item.userId;
  }
  createAdmin() {
    this.title = "创建管理员";
    this.showBox = true;
    if (this.roleArr.length === 0) {
      this.getRoleList();
    }
    if (this.permissionHierarchyList.length === 0) {
      this.getPrmDept();
    }
  }
  getPrmDept() {
    Dept.queryUserPermissionDept().then(res => {
      if (res.code === 0) {
        this.permissionHierarchyList = this.$forTree(
          res.data,
          "deptId",
          "deptName"
        );
        emptyLast(this.permissionHierarchyList);
      }
    });
  }
  getRoleList() {
    let data = { pageNum: 1, pageSize: 99 };
    Role.roleList({ data }).then(res => {
      if (res.code === 0) {
        this.roleArr = res.data.result;
      }
    });
  }
  getList(type: any) {
    if (type !== 'type') {if (this.params.state || this.params.roleName || this.params.query || this.params.permissionDeptId || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    this.loading = true;
    UserAdmin.userAdminstratorList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
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
            i.updateTimeStr = this.$formatDate(i.updateTime);
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
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
}
</script>
<style lang="scss" scoped>
</style>
