/*
 module:
    Role
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-13: Role
 */
<template>
  <div id="role" v-loading="editFlag" element-loading-text="请稍等...">
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item class="btn-main">
          <el-button type="primary" icon="plus" @click='createRole' v-if="isCreatePremission">创建角色</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="等级名称" v-model="params.roleName" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="roleName" label="角色名称" min-width='120'></el-table-column>
        <el-table-column prop="typeStr" label="类型" min-width='80'></el-table-column>
        <el-table-column prop="checkScopeStr" label="权限范围" min-width='100'></el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width='120'></el-table-column>
        <el-table-column prop="updateTimeStr" label="修改时间" width='160'></el-table-column>
        <el-table-column label="操作" width='140'>
          <template slot-scope="scope">
            <span>
              <el-button v-if="isUpdatePremission" type="text" size="small" @click="editRole(scope.row)">编辑</el-button>
              <el-button v-if="isDelPremission" type="text" size="small" @click="del(scope.row)">删除</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class='page-num'>
        <el-form :inline="true">
          <el-form-item label="">
            共有
            <span class="fc303e">{{total}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params.pageSize" class='w65' @change='params.pageNum = 1;getList()'>
              <el-option label="10" value=10></el-option>
              <el-option label="20" value=20></el-option>
              <el-option label="50" value=50></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-row>
      <el-dialog :close-on-click-modal="false" :title="createEditTitle" v-if="createRoleDialog" :visible.sync="createRoleDialog" :before-close="createOver">
        <create-role @createOver="createOver" :isCreate="isCreate" :activeData="activeData"></create-role>
      </el-dialog>
    </el-row>
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
import RoleApi from "@api/role";
import { debounce } from "typescript-debounce-decorator";
@Component({
  components: {
    "create-role": () => import("./createRole.vue")
  }
})
export default class Role extends Vue {
  tableData: object[] = [];
  loading: boolean = false;
  isCreate: boolean = false;
  editFlag: boolean = false;
  isUpdatePremission: false = false;
  isCreatePremission: false = false;
  isDelPremission: boolean = false;
  activeData: object = {};
  params = {
    pageSize: 10,
    pageNum: 1,
    roleName: ""
  };
  total: number = 0;
  createEditTitle: string = "";
  createRoleDialog: boolean = false;
  scopeOfAuthority: object[] = [
    { id: 1, text: "仅自己" },
    { id: 2, text: "本企业" }
  ];
  types: object[] = [{ id: 0, text: "系统管理" },{ id: 1, text: "管理" }, { id: 2, text: "普通" }];
  created() {
    let { isCreate, isUpdate, isDelete } = this.$store.state.activeMenu[
      this.$route.path
    ];
    this.isCreatePremission = isCreate;
    this.isUpdatePremission = isUpdate;
    this.isDelPremission = isDelete;
    this.getList();
  }
  // method

  del(e: any) {
    this.$confirm(`是否删除角色 "${e.roleName}" 吗?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = { roleId: e.roleId };
        this.loading = true;
        RoleApi.deleteRole({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "删除成功",
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
  searchKey() {
    this.getList();
  }
  createRole() {
    this.createEditTitle = `创建角色`;
    this.isCreate = true;
    this.createRoleDialog = true;
  }
  editRole(e: any) {
    this.createEditTitle = `编辑角色`;
    this.isCreate = false;
    let roleId = e.roleId;
    let data = {
      roleId
    };
    this.editFlag = true;
    RoleApi.queryRole({ data })
      .then((res: any) => {
        if (res.code === 0) {
          this.activeData = res.data;
          this.createRoleDialog = true;
        }
      })
      .finally(() => {
        this.editFlag = false;
      });
  }
  createOver() {
    this.createRoleDialog = false;
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {if (this.params.roleName) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    this.loading = true;
    RoleApi.roleListAdmin({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((i: any) => {
            i.checkScopeStr = this.$mapTypeStr(
              i.checkScope,
              this.scopeOfAuthority
            );
            i.typeStr = this.$mapTypeStr(i.type, this.types);
            i.updateTimeStr = this.$formatDate(i.updateTime);
          });
          this.total = res.data.total;
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
</style>
