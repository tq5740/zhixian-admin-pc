<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="资源名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
            <el-option :key="i.id" v-for="i in statesArr" :value="i.id" :label="i.text">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">

        <el-table-column label="资源名称" min-width="220">
          <template slot-scope="scope">
            <a style="color: #000000;" :href="'https://www.' + scope.row.url">{{scope.row.title}}</a>
          </template>
        </el-table-column>

        <el-table-column prop="complaintType" label="投诉原因" min-width='120'></el-table-column>
        <el-table-column prop="complaintReason" label="详情说明" min-width='140'></el-table-column>

        <el-table-column prop="stateStr" label="状态" min-width='100'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.failReason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="投诉人" min-width='120'></el-table-column>
        <el-table-column sortable='custom' prop="createTimeStr" label="投诉时间" min-width='180'>
        </el-table-column>
        <el-table-column prop="" label="操作" width="160">
          <template slot-scope='scope'>
            <el-button type="text" v-if="prm.isAudit" @click.native="audit(scope.row)">审核</el-button>
            <el-button type="text" v-if="prm.isDelete" @click.native="del(scope.row)">删除</el-button>
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
        <el-input v-show="auditObj.state ==2" tyle="text" placeholder="请输入审核不通过的原因" v-model="auditObj.failReason"></el-input>
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
import Complaint from "@api/complaint";
import { debounce } from "typescript-debounce-decorator";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Complaintlist extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    startTime: "",
    endTime: "",
    sortBy: false,
    sortField: "createTime"
  };
  tableData: any[] = [];
  time: string[] = [];
  total: number = 0;
  loading: boolean = false;
  showAudit: boolean = false;
  isPending: boolean = false;
  auditObj = {
    complaintId: "",
    state: 4,
    failReason: ""
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
      text: "已通过"
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
  saveBtn() {
    if(this.auditObj.state === 2 && !this.auditObj.failReason || this.auditObj.failReason.includes(" ")){
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    let data = { ...this.auditObj };
    this.isPending = true;
    Complaint.auditComplaint({ data })
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
      complaintId: "",
      state: 4,
      failReason: ""
    };
  }
  del(e: any) {
    this.$confirm(`是否将 "${e.title}" 删除? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          complaintId: e.complaintId
        };
        Complaint.delete_complaint({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "删除成功！",
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
  audit(e: any) {
    this.auditObj.complaintId = e.complaintId;
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
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.state || this.params.query || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    Complaint.complaintList({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.stateStr = this.$mapTypeStr(i.state, this.statesArr);
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
