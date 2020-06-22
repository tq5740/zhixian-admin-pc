<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="资源名称" v-model="params.query" class='w230' @keyup.13.native="searchKey" @change="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select placeholder="资源类型" v-model="params.resourcesType" class='w150' @change="getList" clearable @clear="params.resourcesType = ''">
            <el-option :key="i.id" v-for="i in $store.state.scoreArr" :value="i.id" :label="i.text">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
            <el-option :key="i.id" v-for="i in statesArr" :value="i.id" :label="i.text">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="resourcesTitle" label="资源名称" min-width="140"></el-table-column>
        <el-table-column prop="typeStr" label="资源类型" min-width='80'></el-table-column>
        <el-table-column prop="resourcesId" label="资源ID" min-width='120'></el-table-column>
        <el-table-column prop="resourcesChildId" label="资源子ID" min-width='120'></el-table-column>
        <el-table-column prop="content" label="错误详情" min-width='200'></el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'></el-table-column>
        <el-table-column prop="createUserName" label="错误提交人" min-width='100'></el-table-column>
        <el-table-column sortable='custom' prop="createTimeStr" label="提交时间" width='170'>
        </el-table-column>
        <el-table-column prop="" label="操作" width="80">
          <template slot-scope='scope'>
            <el-button type="text" v-if="prm.isAudit" @click.native="audit(scope.row)">审核</el-button>
            <!-- <el-button type="text" v-if="prm.isDelete" @click.native="del(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class='page-num'>
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
    <el-dialog :close-on-click-modal="false" width="30%" title="审核" :visible.sync="showAudit" :before-close="closeAudit">
      <div>
        <el-radio v-model="auditObj.state" :label="4">通过</el-radio>
        <el-radio v-model="auditObj.state" :label="2">不通过</el-radio>
        <br />
        <br />
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn">确定</el-button>
        </el-row>
      </div>
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
import Public from "@api/publics";
import { debounce } from "typescript-debounce-decorator";
//https://github.com/ktsn/vuex-class
@Component({})
export default class ErrorReportlist extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    sortBy: false,
    sortField: "createTime"
  };
  tableData: any[] = [];
  total: number = 0;
  loading: boolean = false;
  showAudit: boolean = false;
  isPending: boolean = false;
  auditObj = {
    errorReportId: "",
    state: 4
  };
  statesArr: object[] = [
    {
      id: 2,
      text: "未通过"
    },
    {
      id: 3,
      text: "审核中"
    },
    {
      id: 4,
      text: "已修复"
    }
  ];
  prm = {
    isAudit: false,
    isDelete: false
  };
  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.state || this.params.query || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    Public.error_report_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.stateStr = this.$mapTypeStr(i.state, this.statesArr);

            i.typeStr = this.$mapTypeStr(i.resourcesType, this.$store.state.scoreArr);
          });
          this.total = res.data.total;
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  saveBtn() {
    let data = { ...this.auditObj };
    this.isPending = true;
    Public.audit_error_report_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "操作成功！",
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
  closeAudit() {
    this.showAudit = false;
    this.auditObj = {
      errorReportId: "",
      state: 4
    };
  }
  audit(e: any) {
    this.auditObj.errorReportId = e.errorReportId;
    this.showAudit = true;
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
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
