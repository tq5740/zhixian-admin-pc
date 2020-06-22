<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createdBtn" v-if="prm.isCreate">创建投票</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="投票名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="投票状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="pollImg" label="投票封面" width='100' align='center'>
          <template slot-scope="scope">
            <img class='img-bor' :src="scope.row.pollImg ? ($store.state.configData.imgDomain + scope.row.pollImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/poll.jpg' + $imgSize['30x30'])"/>
          </template>
        </el-table-column>
        <el-table-column prop="pollTitle" label="投票名称" min-width="140"></el-table-column>
        <el-table-column prop="visibleRange" label="可见范围" min-width='100'>
          <template slot-scope="scope">
            {{scope.row.visibleRange == 1 ? "仅自己" : scope.row.visibleRange == 2 ? "本企业" : scope.row.visibleRange == 3 ? "开放" : ""}}
          </template>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width='170'></el-table-column>
        <el-table-column prop="" label="操作" width="400">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="voteBtn(scope.row)">投票对象</el-button>
            <el-button type="text" v-if="prm.isAudit && scope.row.state == 1" @click.native="audit(scope.row)">审核</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 1 && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="prm.isStatistics" type="text" @click.native="statistics(scope.row)">统计</el-button>
            <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-form :inline="true" style="margin-top: 20px">
          <el-form-item label="" style="margin-left: 20px">
            <el-button type="primary" icon="plus" @click.native="recycleBtn">活动回收站</el-button>
          </el-form-item>
        </el-form>
      </el-row>
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
    </el-row>
    <el-dialog width="70%" v-if="createEditOne" :title="title" :visible.sync="createEditOne" :close-on-click-modal="false" :before-close="createEditOver">
      <create-edit @createEditOver="createEditOver" @createEditOverDown="createEditOverDown" :queryData="queryData"></create-edit>
    </el-dialog>
    <el-dialog width="70%" v-if="createEditTwo" :title="title" :visible.sync="createEditTwo" :close-on-click-modal="false" :before-close="createEditTwoOver">
      <vote-list @createEditTwoOverUp="createEditTwoOverUp" @createEditTwoOver="createEditTwoOver" :queryData="queryData"></vote-list>
    </el-dialog>
    <el-dialog width="70%" v-if="showRecycle" :title="title" :visible.sync="showRecycle" :close-on-click-modal="false" :before-close="recycleOver">
      <recycle></recycle>
    </el-dialog>
    <el-dialog width="50%" v-if="statisticsState" title="统计" :visible.sync="statisticsState" :close-on-click-modal="false">
      <el-table header-row-class-name="thead" :data="statisticsData" border v-loading="loading" header-align="center" element-loading-text="加载中...">
        <el-table-column prop="objNumber" label="投票对象数量" align="center" min-width="80"></el-table-column>
        <el-table-column prop="total" label="投票总数" align="center" min-width="80"></el-table-column>
        <el-table-column prop="peopleNumber" label="投票人数" align="center" min-width="80"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="30%" title="删除" :visible.sync="showReason">
      <div>
        <el-input tyle="text" placeholder="请输入删除的原因" v-model="reason"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="delFn()">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="30%" title="审核" :visible.sync="showAudit" :before-close="closeAudit">
      <div>
        <el-radio v-model="auditObj.state" :label="4">通过</el-radio>
        <el-radio v-model="auditObj.state" :label="2">不通过</el-radio>
        <br />
        <br />
        <el-input v-show="auditObj.state ==2" tyle="text" placeholder="请输入审核不通过的原因" v-model="auditObj.reason"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Poll from "@api/otherAll";
import Org from "@api/org";
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue"),
    "vote-list": () => import("../poll/vote/vote_list.vue"),
    "recycle": () => import("./poll_recycle.vue")
  }
})
export default class PollList extends Vue {
  createEditOne: boolean = false;
  createEditTwo: boolean = false;
  forms: any = null;
  title: any = "创建投票";
  isPending: boolean = false;
  params: any = {
    pageSize: 10,
    pageNum: 1,
    pollId: "",
    sortBy: false,
    sortField: "createTime",
    query: "",
    startDate: "",
    endDate: ""
  };
  prm = {
    isAudit: false,
    isDelete: false,
    isCreate: false,
    isUpdate: false,
    isOnline: false,
    isStatistics: false
  };
  state: number = 4;
  pollId: string | number = "";

  isShow: object = {
    user: false,
    class: false
  }

  stateArr: object[] = [
    {
      id: 1,
      text: "草稿"
    },
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
      text: "发布中"
    },
    {
      id: 5,
      text: "已关闭"
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  time: string[] = [];
  total: number = 0;
  queryData: any = {};

  statisticsState: boolean = false;
  statisticsData: any[] = [];

  auditObj = {
    state: 4,
    reason: "",
    pollId: ""
  };
  showAudit: boolean = false;

  showReason: boolean = false;
  delObj: object = {};
  reason: string = "";

  showRecycle: boolean = false;

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  // 上下线
  on_off(e: any): void {
    let data = {
      pollId: e.pollId,
      state: e.state == 4 ? 5 : 4
    };
    Poll.online_offline_poll_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: `${e.state == 4 ? "关闭" : "发布"}成功!`,
          type: "success"
        });
        this.getList();
      }
    })
  }
  // 执行逻辑删除
  del(e: any){
    this.showReason = true;
    this.delObj = e;
  }
  delFn(): void {
    if (this.reason === "" || this.reason.includes(" ")) {
      this.$notify.error({
        title: "错误",
        message: "删除原因必填，并且不能含有空格！"
      });
      return;
    }
    this.isPending = true;
    let data = {
      reason: this.reason,
      pollId: this.delObj.pollId
    };
    Poll.del_poll_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: "删除成功！",
          type: "success"
        });
        if (this.tableData.length === 1 && this.params.pageNum > 1) {
          this.params.pageNum --;
        }
        this.showReason = false;
        this.reason = "";
        this.getList();
      }
    })
    .finally(() => {
      this.isPending = false;
    })
  }
  // 编辑
  edit(e: any): void {
    this.queryData = e;
    this.title = "编辑投票";
    this.queryData.showDown = false;
    this.createEditOne = true;
  }
  // 创建投票
  createdBtn(): void {
    this.title = "创建投票";
    this.queryData = {};
    this.queryData.showDown = true;
    this.createEditOne = true;
  }
  createEditOver() {
    this.createEditOne = false;
    this.getList();
  }
  createEditOverDown(id: string) {
    this.createEditOne = false;
    if(id)this.queryData.pollId = id;
    this.queryData.showBtn = true;
    this.createEditTwo = true;
  }
  createEditTwoOverUp() {
    this.createEditOne = true;
    this.createEditTwo = false;
  }
  createEditTwoOver() {
    this.createEditTwo = false;
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.state ||
        this.params.pollType ||
        this.params.startDate ||
        this.params.endDate
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Poll.poll_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
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
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startDate = time[0];
      this.params.endDate = time[1];
    } else {
      this.params.startDate = "";
      this.params.endDate = "";
    }
    this.getList();
  }
  voteBtn(e: any) {
    this.queryData = {...e, showBtn: false};
    this.title = "投票对象";
    this.createEditTwo = true;
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  // 统计
  statistics(e: any) {
    let data = {
      pollId: e.pollId
    };
    Poll.poll_statistics_admin({ data }).then(res => {
      if (res.code === 0) {
        this.statisticsData = [];
        this.statisticsData.push(res.data);
        this.statisticsState = true;
      }
    });
  }
  // 审核
  audit(e: any) {
    this.auditObj.pollId = e.pollId;
    this.showAudit = true;
  }
  closeAudit() {
    this.auditObj = {
      state: 4,
      reason: "",
      pollId: ""
    };
    this.showAudit = false;
  }
  saveBtn() {
    let data = { ...this.auditObj };
    if (data.state === 2 && !data.reason || data.reason.includes(" ")){
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    this.isPending = true;
    Poll.audit_poll_admin({ data })
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
  recycleBtn() {
    this.title = "活动回收站"
    this.showRecycle = true;
  }
  recycleOver() {
    this.showRecycle = false;
    this.getList();
  }
}
</script>
<style lang="scss" scope>
</style>