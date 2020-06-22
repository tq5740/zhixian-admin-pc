<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="企业名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="企业类型" v-model="params.orgType" class='w150' @change="getList" clearable @clear="params.orgType = ''">
            <el-option v-for="(i) in orgTypeArrClone" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="推荐" v-model="params.isRecommend" class='w150' @change="getList" clearable @clear="params.isRecommend = ''">
            <el-option label="全部" value=""></el-option>
            <el-option label="已推荐" :value="1"></el-option>
            <el-option label="未推荐" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" v-loading="loading" element-loading-text="加载中..." stripe>
        <el-table-column align="center" prop="orgLogo" label="Logo" min-width='60'>
          <template slot-scope="scope">
            <img class="img-bor1" :src="scope.row._orgLogo" />
          </template>
        </el-table-column>
        <el-table-column label="企业名称" min-width="220">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="onClickOrgName(scope.row)">{{scope.row.orgName}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="orgTypeStr" label="企业类型" min-width='140'></el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='100'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="isRecommend" label="是否推荐" min-width='120'>
          <template slot-scope="scope">
            {{scope.row.isRecommend ? '已推荐' :"未推荐"}}
          </template>
        </el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width='120'></el-table-column>
        <el-table-column sortable='custom' prop="updateTimeStr" label="修改时间" width='170'>
        </el-table-column>
        <el-table-column prop="" label="操作" width="300">
          <template slot-scope='scope'>
            <el-button type="text" v-if="prm.isUpdate" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" v-if="prm.isAudit" @click.native="audit(scope.row)">审核</el-button>
            <!-- <el-button type="text" @click.native="site(scope.row)">站点</el-button> -->
            <el-button type="text" v-if="prm.isRecommend" @click.native="recommend(scope.row)"> {{scope.row.isRecommend ? '取消推荐' :"推荐"}}</el-button>
            <el-button type="text" v-if="$store.state.userInfo.userAdministrator.roleId === `1534131575199800`" @click.native="set(scope.row)">{{scope.row.state === 5 ?"启用":"禁用"}}</el-button>
            <!-- <el-button type="text" v-if="scope.row.state ===4" @click.native="showQR(scope.row)">二维码</el-button> -->
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
    <!-- 站点 -->
    <!-- <el-dialog :close-on-click-modal="false" width="50%" v-if="showSite" title="站点" :visible.sync="showSite" :before-close="closeSite">
      <site :orgId="orgId" @okCB="okCB_site"></site>
    </el-dialog> -->
    <!-- 编辑企业 -->
    <el-dialog :close-on-click-modal="false" width="50%" v-if="showEdit" title="编辑企业" :visible.sync="showEdit" :before-close="closeEdit">
      <edit :orgId="orgId" :orgTypeArr="orgTypeArr" @okCB="okCB_org"></edit>
    </el-dialog>
    <!-- 二维码 -->
    <el-dialog :close-on-click-modal="false" width="500px" v-if="showQRcode" title="" :visible.sync="showQRcode" :before-close="closeQR">
      <div v-loading="QRloading">
        <div id="QRcode">
          <img style="display:block;min-height:400px" :src="QRcodeUrl" alt="二维码">
        </div>
        <el-button style="margin-left:14px;margin-top:10px" type="primary" @click="print">打印</el-button>
      </div>
    </el-dialog>
    <!-- 预览弹出框 -->
    <el-dialog title="企业预览" width="400px" style="height: 900px; overflow: hidden;" class="org-name-dlog" :visible.sync="isShowOrgName">
      <iframe :src="orgNameSrc" style="height: 667px; border: 2px dashed red" width="375px" frameborder="0"></iframe>
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
import Org from "@api/org";
import User from "@api/user";
import { debounce } from "typescript-debounce-decorator";
import { State } from "vuex-class";

//https://github.com/ktsn/vuex-class
@Component({
  components: {
    // site: () => import("./site.vue"),
    edit: () => import("./edit.vue")
  }
})
export default class OrgList extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    state: "",
    startTime: "",
    endTime: "",
    isRecommend: "",
    orgType: "",
    sortBy: false,
    sortField: "updateTime"
  };
  auditObj = {
    orgId: "",
    state: 4,
    reason: ""
  };
  QRcodeUrl: string = "";
  total: number = 0;
  loading: boolean = false;
  showAudit: boolean = false;
  showSite: boolean = false;
  isPending: boolean = false;
  showEdit: boolean = false;
  showQRcode: boolean = false;
  QRloading: boolean = false;
  prm = {
    isRecommend: false,
    isAudit: false,
    isUpdate: false
  };
  tableData: any[] = [];
  time: string[] = [];
  orgNameSrc: string = "";
  isShowOrgName: boolean = false;
  orgTypeArr: object[] = this.$store.state.orgTypeArr;
  orgTypeArrClone: object[] = [];
  stateArr: object[] = [
    { id: 1, text: "草稿" },
    { id: 2, text: "未通过" },
    { id: 3, text: "审核中" },
    { id: 4, text: "已认证" },
    { id: 5, text: "禁用" }
  ];
  orgId: string = "";
  @State("configData")
  configData: any;
  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
    this.orgTypeArrClone = [...this.orgTypeArr];
    this.orgTypeArrClone.pop();
  }
  print() {
    let newWindow = window.open(); //打开新窗口
    let codestr = window.document.getElementById("QRcode")!.innerHTML;
    newWindow!.document.write(codestr); //向文档写入HTML表达式或者JavaScript代码
    newWindow!.document.close(); //关闭document的输出流, 显示选定的数据
    newWindow!.document.body.style.margin = "0";
    newWindow!.document.body.style.padding = "0";
    newWindow!.document.body.style.fontFamily = "Microsoft YaHei";
    newWindow!.onload = function() {
      newWindow!.print();
    };
    // };
    return true;
  }
  closeQR() {
    this.showQRcode = false;
    this.QRcodeUrl = "";
  }
  showQR(e: any) {
    this.showQRcode = true;
    let data = { type: 1, resourceId: e.orgId };
    this.QRloading = true;
    User.createQRCode({ data })
      .then(res => {
        this.QRcodeUrl = this.$store.state.configData.imgDomain + res.data;
      })
      .finally(() => {
        this.QRloading = false;
      });
  }
  set(e: any) {
    this.$confirm(
      `是否${e.state === 5 ? "启用" : "禁用"}企业 "${e.orgName}"?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    )
      .then(({ value }) => {
        this.loading = true;
        let data = {
          orgId: e.orgId,
          state: e.state === 5 ? 4 : 5
        };
        Org.isforbiddenOrg({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `操作成功`,
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
  onClickOrgName(e: any) {
    // 生产环境
    this.orgNameSrc = `https://m.weijiuye.com.cn/pages/user/org/detail?orgId=${e.orgId}&orgImg=${e.orgImg}&orgVideo=${e.orgVideo}&tabStatus=0`;
    
    this.isShowOrgName = true;
  }
  okCB_org() {
    this.closeEdit();
    this.getList();
  }
  edit(e: any) {
    this.orgId = e.orgId;
    this.showEdit = true;
  }
  closeEdit() {
    this.showEdit = false;
    this.orgId = "";
  }
  // site(e: any) {
  //   this.orgId = e.orgId;
  //   this.showSite = true;
  // }
  closeSite() {
    this.showSite = false;
    this.orgId = "";
  }
  okCB_site() {
    this.closeSite();
    this.getList();
  }
  saveBtn() {
    if(this.auditObj.state === 2 && !this.auditObj.reason || this.auditObj.reason.includes(" ")){
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    let data = { ...this.auditObj };
    this.isPending = true;
    Org.auditOrg({ data })
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
      orgId: "",
      state: 4,
      reason: ""
    };
  }

  audit(e: any) {
    this.auditObj.orgId = e.orgId;
    this.showAudit = true;
  }
  recommend(e: any) {
    this.$confirm(
      `是否${e.isRecommend ? "取消推荐" : "推荐"}企业 "${e.orgName}"?`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    )
      .then(({ value }) => {
        this.loading = true;
        let data = {
          orgId: e.orgId,
          isRecommend: !e.isRecommend ? 1 : 0
        };
        Org.recommendOrg({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `操作成功`,
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
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {
      if (
        this.params.state ||
        this.params.orgType ||
        this.params.isRecommend ||
        this.params.startTime ||
        this.params.endTime ||
        this.params.query
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    Org.orgList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            if (i.orgLogo) {
              i._orgLogo =
                this.configData.imgDomain + i.orgLogo + this.$imgSize["30x30"];
            } else {
              i._orgLogo =
                this.configData.imgDomain + "/default/cdwork/logo.png";
            }
            i.updateTimeStr = this.$formatDate(i.updateTime);
            i.orgTypeStr = this.$mapTypeStr(i.orgType, this.orgTypeArr);
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
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
}
</script>
<style lang="scss">
  .org-name-dlog {
    text-align: center;
    height: 750px;
    .el-dialog__body {
      padding: 0 !important;
      padding-bottom: 5px;
    }
  }
</style>
