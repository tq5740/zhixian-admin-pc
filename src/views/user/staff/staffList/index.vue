<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" v-if="prm.isCreate" @click="create">创建用户</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="importUser">导入用户</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="updateBatchDept">移动部门</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="updateBatchPost">移动岗位</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item>
          <el-input style="display:none"></el-input>
          <el-input placeholder="姓名/手机号" v-model="params.query" class='w230' @keyup.13.native="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader placeholder="部门" class='w230' :options="deptDara" @change="changeDept" clearable filterable change-on-select :show-all-levels="false"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-cascader placeholder="岗位" class='w150' :options="postData" @change="changePost" clearable filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="multipleTable" stripe @selection-change="handleSelectionChange" @sort-change="changeTime" header-row-class-name="thead" :data="tableData" v-loading="loading" element-loading-text="加载中...">
        <el-table-column type="selection" min-width="55" align="center"></el-table-column>
        <el-table-column prop="photo" label="头像" min-width="80" align="center">
          <template slot-scope="scope">
            <img class='img-bor1' :src="scope.row._photo" />
          </template>
        </el-table-column>
        <el-table-column prop="employeeNumber" label="员工编号" min-width='100'></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="100"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width='120'></el-table-column>
        <el-table-column prop="deptName" label="部门" min-width='220' :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="postName" label="岗位" min-width='140'></el-table-column>
        <el-table-column prop="stateStr" label="状态" width='70'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable='custom' prop="hireDateStr" label="入职时间" width='110'></el-table-column>
        <el-table-column sortable='custom' prop="updateTimeStr" label="更新时间" width='160'></el-table-column>
        <el-table-column prop="" label="操作" width="280">
          <template slot-scope='scope'>
            <el-button type="text" v-if="prm.isReset" @click="reset(scope.row)">重置密码</el-button>
            <el-button type="text" v-if="prm.isUpdate" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" v-if="prm.isAudit" @click="audit(scope.row)">审核</el-button>
            <el-button type="text" v-if="prm.isDelete" @click="del(scope.row)">删除</el-button>
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
    <!-- 移动岗位部门 -->
    <el-dialog :close-on-click-modal="false" :title="title" v-if="showBox" :visible.sync="showBox" :before-close="closeFunc">
      <el-row v-if="title ===`移动岗位`">
        <el-form :inline="true">
          <el-form-item label="岗位 :">
            <el-cascader :options="postData" v-model="updatePost" clearable filterable change-on-select></el-cascader>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row v-else>
        <el-form :inline="true">
          <el-form-item label="部门 :">
            <el-cascader :options="deptDara" v-model="updateDept" clearable filterable change-on-select></el-cascader>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-button type="primary" :loading="isPending" @click="saveBtn">确定</el-button>
      </el-row>
    </el-dialog>

    <!-- 审核 -->
    <el-dialog :close-on-click-modal="false" width="30%" v-if="showAudit" title="审核" :visible.sync="showAudit" :before-close="closeAudit">
      <div>
        <el-radio v-model="auditObj.state" :label="4">通过</el-radio>
        <el-radio v-model="auditObj.state" :label="2">不通过</el-radio>
        <br />
        <br />
        <el-input v-show="auditObj.state ==2" tyle="text" placeholder="请输入审核不通过的原因" v-model="auditObj.reason"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="auditBtn">确定</el-button>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" width="40%" v-if="showEdit" :title="editTitle" :visible.sync="showEdit" :before-close="closeEdit">
      <c-e :editObj="editObj" @okCB="okCB" :title="editTitle"></c-e>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="76%" v-if="showImport" title="临时用户列表" :visible.sync="showImport" :before-close="closeImport">
      <i-list :queryData="queryData"></i-list>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    staffList
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-21:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import User from "@api/user";
import { debounce } from "typescript-debounce-decorator";
import { State } from "vuex-class";
import { emptyLast } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "c-e": () => import("./CreateAndEdit.vue"),
    "i-list": () => import("./ImportList.vue")
  }
})
export default class staffList extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    startTime: "",
    endTime: "",
    deptId: "",
    postId: "",
    sortBy: false,
    sortField: "updateTime"
  };
  title: string = "移动岗位";
  editTitle: string = "创建用户";
  showBox: boolean = false;
  time: string[] = [];
  deptDara: any[] = [];
  postData: any[] = [];
  tableData: any[] = [];
  loading: boolean = false;
  isPending: boolean = false;
  showAudit: boolean = false;
  showEdit: boolean = false;
  total: number = 0;
  updateDept: string[] = [];
  updatePost: string[] = [];
  stateArr: object[] = [
    {
      id: 2,
      text: "未通过"
    },
    {
      id: 3,
      text: "待审核"
    },
    {
      id: 4,
      text: "已通过"
    }
  ];
  selectData: any[] = [];
  auditObj = {
    userId: "",
    state: 4,
    reason: ""
  };
  editObj = {
    photo: "",
    deptId: "",
    postId: "",
    deptName: "",
    postName: "",
    userId: "",
    email: "",
    employeeNumber: "",
    hireDate: "",
    name: "",
    phone: ""
  };
  prm = {
    isAudit: false,
    isCreate: false,
    isDelete: false,
    isImport: false,
    isUpdate: false,
    isReset: false
  };
  showImport: boolean = false;
  queryData: object = {};
  @State("configData")
  configData: any;
  created() {
    this.getList();
    this.getDept();
    this.getPost();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  okCB() {
    this.closeEdit();
    this.getList();
  }
  create() {
    this.editTitle = `创建用户`;
    this.showEdit = true;
  }
  edit(e: any) {
    this.editTitle = `编辑用户`;
    Object.keys(this.editObj).forEach(i => {
      //@ts-ignore
      this.editObj[i] = e[i];
    });
    this.showEdit = true;
  }
  reset(e: any): void {
    console.log(e);
    let data = { userId: e.userId };
    this.$confirm("确定要将此用户的密码重置为：cdjy9957吗？")
      .then(_ => {
        User.resetPassword({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `密码重置成功!`,
                type: "success"
              });
            }
          })
          .finally(() => {});
      })
      .catch(_ => {});
  }
  closeEdit() {
    this.showEdit = false;
    this.editObj = {
      photo: "",
      deptId: "",
      postId: "",
      userId: "",
      email: "",
      employeeNumber: "",
      hireDate: "",
      name: "",
      phone: "",
      deptName: "",
      postName: ""
    };
  }
  audit(e: any) {
    this.auditObj.userId = e.userId;
    this.showAudit = true;
  }
  closeAudit() {
    this.showAudit = false;
    this.auditObj = {
      userId: "",
      state: 4,
      reason: ""
    };
  }
  auditBtn() {
    if(this.auditObj.state === 2 && !this.auditObj.reason || this.auditObj.reason.includes(" ")){
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    this.isPending = true;
    let data = { ...this.auditObj };
    User.auditOrguserState({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `操作成功!`,
            type: "success"
          });
          this.closeAudit();
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  del(e: any) {
    this.$confirm(`是否删除员工 "${e.name}" ?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          userId: e.userId
        };
        User.deleteOrgUser({ data })
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
  saveBtn() {
    if (this.title === `移动岗位`) {
      if (this.updatePost.length === 0) {
        this.$notify({
          title: "错误",
          message: `请选择岗位!`,
          type: "error"
        });
        return;
      }
      let data = {
        userIds: JSON.stringify(this.selectData.map(i => i.userId)),
        postId: this.updatePost[this.updatePost.length - 1]
      };
      this.isPending = true;
      User.updateBatchPost({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `移动成功!`,
              type: "success"
            });
            this.closeFunc();
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      if (this.updateDept.length === 0) {
        this.$notify({
          title: "错误",
          message: `请选择部门!`,
          type: "error"
        });
        return;
      }
      let data = {
        userIds: JSON.stringify(this.selectData.map(i => i.userId)),
        deptId: this.updateDept[this.updateDept.length - 1]
      };
      this.isPending = true;
      User.updateBatchDept({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `移动成功!`,
              type: "success"
            });
            this.closeFunc();
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  closeFunc() {
    this.showBox = false;
    this.selectData = [];
    (this.$refs.multipleTable as any).clearSelection();
    this.updateDept = [];
    this.updatePost = [];
  }
  handleSelectionChange(e: any) {
    this.selectData = e;
  }
  updateBatchDept() {
    if (this.selectData.length === 0) {
      this.$notify({
        title: "错误",
        message: `请至少选择一位用户!`,
        type: "error"
      });
      return;
    }
    this.title = `移动部门`;
    this.showBox = true;
  }
  updateBatchPost() {
    if (this.selectData.length === 0) {
      this.$notify({
        title: "错误",
        message: `请至少选择一位用户!`,
        type: "error"
      });
      return;
    }
    this.title = `移动岗位`;
    this.showBox = true;
  }
  @debounce(500, { leading: false })
  changeDept(e: any) {
    this.params.deptId = e[e.length - 1];
    this.getList();
  }
  @debounce(500, { leading: false })
  changePost(e: any) {
    this.params.postId = e[e.length - 1];
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  changeTime(e: any) {
    this.params.sortField = e.prop.split("Str")[0];
    this.params.sortBy = !this.params.sortBy;
    this.getList();
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
    emptyLast(this.deptDara);
  }
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
    emptyLast(this.postData);
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.deptId || this.params.postId || this.params.query || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    User.orgUserList({ data })
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
            i.hireDateStr = this.$formatDate(i.hireDate).split(" ")[0];
            i.updateTimeStr = this.$formatDate(i.updateTime);
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  importUser() {
    this.showImport = true;
  }
  closeImport() {
    this.showImport = false;
    this.getList();
    this.$store.state.deptTree.length = 0;
    this.getDept();
    this.$store.state.postTree.length = 0
    this.getPost();
  }
}
</script>
<style lang="scss" scoped>
</style>
