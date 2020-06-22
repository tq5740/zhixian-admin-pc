<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="" class="btn-main">
          <el-button type="primary" icon="plus" v-if="prm.isCreate" @click.native="createJobFair">创建现场招聘</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="现场招聘名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="类型" v-model="params.type" class='w150' @change="getList" clearable @clear="params.type = ''">
            <el-option v-for="(i) in typeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="venueImg" label="招聘会封面" width='100' align='center'>
          <template slot-scope="scope">
            <img class='img-bor' :src="scope.row.venueImg ? ($store.state.configData.imgDomain + scope.row.venueImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/venue.jpg' + $imgSize['30x30'])"
            />
          </template>
        </el-table-column>
        <el-table-column label="招聘会名称" min-width="120">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="onClickFair(scope.row)">{{scope.row.venueTitle}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="typeStr" label="类型" min-width="60"></el-table-column>
        <el-table-column prop="deadlineStr" label="报名截止日期" min-width='100'></el-table-column>
        <el-table-column prop="startTimeStr" label="开始日期" min-width='100'></el-table-column>
        <el-table-column prop="endTimeStr" label="结束日期" min-width='100'></el-table-column>
        <el-table-column prop="period" label="时间段" min-width='100'></el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='80'></el-table-column>
        <el-table-column sortable='custom' prop="createTimeStr" label="创建时间" width='170'>
        </el-table-column>
        <el-table-column prop="" label="操作" width="450">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.auditBtn && scope.row.state === 4 && Date.now() < scope.row.deadline" type="text" @click.native="add(scope.row)">报名</el-button>
            <el-button v-if="prm.isOrgReg" type="text" @click.native="regOrg(scope.row)">报名企业</el-button>
            <el-button v-if="prm.isAudit && scope.row.state != 4 && scope.row.state != 5" type="text" @click.native="audit(scope.row)">审核</el-button>
            <el-button v-if="prm.isRecommend && scope.row.state == 4" type="text" @click.native="recommend(scope.row)">{{scope.row.isRecommend ? "取消推荐" : "推荐"}}</el-button>
            <el-button v-if="prm.isOnline" type="text" @click.native="closeVenue(scope.row)">{{scope.row.state == 4 ? '关闭' :'发布'}}</el-button>
            <el-button v-if="prm.isDelete" type="text" @click.native="del(scope.row)">删除</el-button>
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
    <el-dialog :close-on-click-modal="false" width="50%" v-if="showBox" :title="title" :visible.sync="showBox" :before-close="close">
      <create-edit :typeArr="typeArr" @okCb="okCb" :venueId="venueId" @close="close"></create-edit>
    </el-dialog>
    <!-- 报名 -->
    <el-dialog :title="dialogTitle" :close-on-click-modal="false" width="70%" v-if="showAdd" :visible.sync="showAdd" :before-close="closeAdd">
      <add-company ref="addCompany" @setDialogTitle="setDialogTitle" :venueId="venueId" :venueTitle="venueTitle" @close="closeAdd"></add-company>
    </el-dialog>
    <!-- 报名企业 -->
    <el-dialog :title="dialogTitle" :close-on-click-modal="false" width="70%" v-if="showRegOrg" :visible.sync="showRegOrg">
      <company-reg :venueId="venueId"></company-reg>
    </el-dialog>
    <!-- 预览弹出框 -->
    <el-dialog title="现场招聘预览" width="400px" style="height: 900px; overflow: hidden;" class="fair-dlog" :visible.sync="isShowFair">
      <iframe :src="FairSrc" style="height: 667px; border: 2px dashed red" width="375px" frameborder="0"></iframe>
    </el-dialog>

  </div>
</template>
<script lang="ts">
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Watch } from "vue-property-decorator";
import Venue from "@api/venue";
import { debounce } from "typescript-debounce-decorator";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue"),
    "add-company": () => import("./add.vue"),
    "company-reg": () => import("../companyreg/index.vue")
  }
})
export default class FairList extends Vue {
  params = {
    type: "",
    state: "",
    startDate: "",
    endDate: "",
    pageSize: 10,
    pageNum: 1,
    query: "",
    sortField: "createTime",
    sortBy: false
  };
  prm = {
    isRecommend: false,
    isDelete: false,
    isCreate: false,
    isAudit: false,
    isUpdate: false,
    isOnline: false,
    isOrgReg: false,
  };
  auditObj = {
    state: 4,
    reason: "",
    venueId: ""
  };

  dialogTitle: string = "选择职位";

  setDialogTitle(str: string): void {
    this.dialogTitle = str;
  }

  venueTitle: string = "";
  venueId: string = "";
  title = "创建现场招聘";
  total = 0;
  showAdd: boolean = false;
  loading: boolean = false;
  showBox: boolean = false;
  showAudit: boolean = false;
  isPending: boolean = false;
  tableData: any[] = [];
  isShowFair: boolean = false;
  FairSrc: string = "";

  time: string[] = [];
  stateArr: object[] = [
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
  typeArr: object[] = [
    {
      id: 1,
      text: "专场"
    },
    {
      id: 2,
      text: "校招"
    }
  ];
  showRegOrg: boolean = false;

  onClickFair(e: any) {
    // 生产环境
    this.FairSrc = "https://m.weijiuye.com.cn/pages/work/venue/detail?venueId=" + e.venueId;

    this.isShowFair = true;
  }

  //life
  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  closeAdd() {
    // this.getList();
    this.showAdd = false;
  }
  add(e: any) {
    this.venueId = e.venueId;
    this.venueTitle = e.venueTitle;
    this.dialogTitle = e.venueTitle + " 报名";
    this.showAdd = true;
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
    Venue.auditVenue({ data })
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
    this.auditObj = {
      state: 4,
      reason: "",
      venueId: ""
    };
    this.showAudit = false;
  }
  audit(e: any) {
    this.auditObj.venueId = e.venueId;
    this.showAudit = true;
  }
  closeVenue(e: any) {
    this.$confirm(
      `是否${e.state === 4 ? "关闭" : "发布"}现场招聘 "${e.venueTitle}" 吗?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    )
      .then(({ value }) => {
        this.loading = true;
        let data = {
          venueId: e.venueId,
          state: e.state === 4 ? 5 : 4
        };
        Venue.updateState({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "操作成功！",
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
  del(e: any) {
    this.$confirm(`是否将现场招聘 "${e.venueTitle}" 删除? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          venueId: e.venueId
        };
        Venue.deleteVenue({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "删除成功！",
                type: "success"
              });
              if (this.tableData.length === 1 && this.params.pageNum > 1) {
                this.params.pageNum --;
              }
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
  edit(e: any) {
    this.venueId = e.venueId;
    this.title = "编辑现场招聘";
    this.showBox = true;
  }
  close() {
    this.showBox = false;
    this.venueId = "";
  }
  okCb() {
    this.close();
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  createJobFair() {
    this.title = "创建现场招聘";
    this.showBox = true;
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
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.type ||
        this.params.state ||
        this.params.query ||
        this.params.startTime ||
        this.params.endTime
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Venue.venueList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.typeStr = this.$mapTypeStr(i.type, this.typeArr);
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            i.createTimeStr = this.$formatDate(i.createTime);
            i.deadlineStr = this.$formatDate(i.deadline, "YYYY-MM-DD");
            i.startTimeStr = this.$formatDate(i.startDate, "YYYY-MM-DD");
            i.endTimeStr = this.$formatDate(i.endDate, "YYYY-MM-DD");
            i.auditBtn = true;
            let date = new Date().getTime();
            if(i.deadline < date){
              i.auditBtn = false;
            }
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  handleSelectionChange(e: any) {
    this.selectData = e;
  }
  // 推荐
  recommend(e: any): void {
    let data = {
      venueId: e.venueId,
      isRecommend: !e.isRecommend ? 1 : 0
    };
    Venue.is_recommend_admin({ data }).then(res => {
      if (res.code === 0) {
        this.getList();
      }
    });
  }
  regOrg(e: any) {
    this.dialogTitle = e.venueTitle + " 报名企业"
    this.venueId = e.venueId;
    this.showRegOrg = true;
  }
}
</script>
<style lang="scss">
  .fair-dlog {
    text-align: center;
    height: 750px;
    .el-dialog__body {
      padding: 0 !important;
      padding-bottom: 5px;
    }
  }
</style>
