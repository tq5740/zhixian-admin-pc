<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="" class="btn-main">
          <el-button type="primary" icon="plus" v-if="prm.isCreate" @click.native="create">创建职位</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="职位名称" v-model="params.query" class='w230' @keyup.13.native="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="工作性质" v-model="params.workNature" class='w150' @change="getList" clearable @clear="params.workNature = ''">
            <el-option v-for="(i) in $store.state.workNatureArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
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
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column label="招聘职位" min-width="160">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="onClickJob(scope.row)">{{scope.row.workTitle}}</a>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="typeStr" label="招聘类型" min-width="120"></el-table-column> -->
        <el-table-column prop="workNatureStr" label="工作性质" min-width='80'></el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='100'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width='120'></el-table-column>
        <el-table-column sortable='custom' prop="updateTimeStr" label="修改时间" width='170'>
        </el-table-column>
        <el-table-column prop="" label="操作" width="320">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="prm.isAudit && scope.row.state === 2 || scope.row.state === 3" type="text" @click.native="audit(scope.row)">审核</el-button>
            <el-button v-if="prm.isOnline && scope.row.state !== 2 && scope.row.state !== 3" type="text" @click.native="release(scope.row)">{{scope.row.state === 4 ? "关闭":"发布"}}</el-button>
            <el-button v-if="prm.isDelete && scope.row.state !== 4" type="text" @click.native="showDelDialog(scope.row)">删除</el-button>
            <el-button v-if="prm.isStatistics" type="text" @click.native="statistics(scope.row)">统计</el-button>
            <el-button type="text" @click.native="refresh(scope.row)">刷新</el-button>
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
    <el-dialog width="50%" v-if="showBox" :title="title" :visible.sync="showBox" :close-on-click-modal="false" :before-close="close">
      <create-edit :jobData="jobObj" @close="close" :stateArr="stateArr"></create-edit>
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
    <el-dialog :close-on-click-modal="false" width="30%" title="统计" :visible.sync="showCount" :before-close="closeCount">
      <el-form>
        <el-form-item label="浏览数量 : ">
          <p>{{statisticsObj.browseNumber}}</p>
        </el-form-item>
        <el-form-item label="预约人数 : ">
          <p>{{statisticsObj.bookingNumber}}</p>
        </el-form-item>
        <el-form-item label="面试人数 : ">
          <p>{{statisticsObj.interviewNumber}}</p>
        </el-form-item>

      </el-form>
    </el-dialog>
    <!-- 删除框 -->
    <el-dialog width="30%" v-if="isDelShow" title="删除" :visible.sync="isDelShow" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="请填写删除原因：">
          <el-input rows="3" type="textarea" placeholder="原因不能为空" v-model="delCause"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDelShow = false">取 消</el-button>
        <el-button type="primary" @click="del">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 二维码 -->
    <el-dialog :close-on-click-modal="false" width="500px" v-if="showQRcode" title="企业二维码" :visible.sync="showQRcode" :before-close="closeQR">
      <div v-loading="QRloading">
        <div id="QRcode">
          <img style="display:block;min-height:400px" :src="QRcodeUrl" alt="二维码">
        </div>
        <el-button style="margin-left:14px;margin-top:10px" type="primary" @click="print">打印</el-button>
      </div>
    </el-dialog>
    <!-- 预览弹出框 -->
    <el-dialog title="职位预览" width="400px" style="height: 900px; overflow: hidden;" class="job-dlog" :visible.sync="isShowJob">
      <iframe :src="JobSrc" style="height: 667px; border: 2px dashed red" width="375px" frameborder="0"></iframe>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    职位管理
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:职位管理
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import Job from "@api/job";
import User from "@api/user";
import { debounce } from "typescript-debounce-decorator";
import { emptyLast } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue")
  }
})
export default class JobManage extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    type: "",
    workNature: "",
    state: "",
    query: "",
    sortBy: false,
    sortField: "updateTime",
    startTime: "",
    endTime: "",
    isDel: 0
  };
  prm = {
    isRecommend: false,
    isDelete: false,
    isCreate: false,
    isAudit: false,
    isUpdate: false,
    isOnline: false,
    isStatistics: false
  };
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

  QRcodeUrl: string = "";
  showQRcode: boolean = false;
  QRloading: boolean = false;
  loading: boolean = false;
  showBox: boolean = false;
  showAudit: boolean = false;
  isPending: boolean = false;
  showCount: boolean = false;
  title: string = "创建职位";
  time: string[] = [];
  tableData: any[] = [];
  total: number = 0;
  jobObj: any = null;
  auditObj = {
    workId: "",
    state: 1,
    reason: ""
  };
  statisticsObj = {
    bookingNumber: 0,
    browseNumber: 0,
    interviewNumber: 0
  };
  isDelShow: boolean = false;
  delJobId: string = "";
  delCause: string = "";
  isShowJob: boolean = false;
  JobSrc: string = "";

  deptDara: any[] = [];

  //life
  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
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
    return true;
  }
  closeQR() {
    this.showQRcode = false;
    this.QRcodeUrl = "";
  }
  showQR(e: any) {
    this.showQRcode = true;
    let data = { type: 2, resourceId: e.workId, workTitle: e.workTitle };
    this.QRloading = true;
    User.createQRCode({ data })
      .then(res => {
        this.QRcodeUrl = this.$store.state.configData.imgDomain + res.data;
      })
      .finally(() => {
        this.QRloading = false;
      });
  }
  statistics(e: any) {
    let { bookingNumber, browseNumber, interviewNumber } = e;
    this.statisticsObj = {
      bookingNumber,
      browseNumber,
      interviewNumber
    };
    this.showCount = true;
  }
  closeCount() {
    this.showCount = false;
    this.statisticsObj = {
      bookingNumber: 0,
      browseNumber: 0,
      interviewNumber: 0
    };
  }
  onClickJob(e) {
    // 生产环境
    this.JobSrc = "https://m.weijiuye.com.cn/pages/work/job/detail?workId=" + e.workId;

    this.isShowJob = true;
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.params.sortField = "updateTime";
    this.getList();
  }
  release(e: any) {
    this.$confirm(
      `${e.state === 4 ? "关闭职位将会把与该职位相关的简历全部标记为不合适，您是否要这样做？" : "您确定要发布职位" + e.workTitle + "吗？"}`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    )
      .then(() => {
        this.loading = true;
        let data = {
          workId: e.workId,
          state: e.state === 4 ? 5 : 4
        };
        Job.releaseJob({ data })
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
    console.log(JSON.stringify(data));
    Job.auditJob({ data })
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
      workId: "",
      state: 1,
      reason: ""
    };
  }
  audit(e: any) {
    this.auditObj.workId = e.workId;
    this.showAudit = true;
  }
  // recommend(e: any) {
  //   this.$confirm(
  //     `是否${e.isRecommend ? "取消推荐" : "推荐"}职位 "${e.workTitle}" 吗?`,
  //     "提示",
  //     {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning"
  //     }
  //   )
  //     .then(() => {
  //       let data = {
  //         workId: e.workId,
  //         isRecommend: e.isRecommend ? 0 : 1
  //       };
  //       this.loading = true;
  //       Job.recommendJob({ data })
  //         .then(res => {
  //           if (res.code === 0) {
  //             this.$notify({
  //               title: "提示",
  //               message: "操作成功",
  //               type: "success"
  //             });
  //             this.getList();
  //           } else {
  //             this.loading = false;
  //           }
  //         })
  //         .catch(() => {
  //           this.loading = false;
  //         });
  //     })
  //     .catch(() => {});
  // }
  // 展示删除细节
  showDelDialog(e: any): void {
    this.isDelShow = true;
    this.delJobId = e.workId;
  }
  // 执行逻辑删除
  del(): void {
    if (!this.delCause || this.delCause.includes(" ")) {
      this.$notify.error({
        title: "错误",
        message: "删除原因必填，并且不能含有空格！"
      });
      return;
    }
    let data = {
      workId: this.delJobId,
      reason: this.delCause
    };
    Job.delJob({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: "删除成功！",
          type: "success"
        });
        this.isDelShow = false;
        this.delCause = "";
        this.getList();
      }
    });
  }
  edit(e: any) {
    this.loading = true;
    let data = { workId: e.workId };
    Job.queryJob({ data })
      .then(res => {
        if (res.code === 0) {
          this.jobObj = res.data;
          this.title = "编辑职位";
          this.showBox = true;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  close() {
    this.showBox = false;
    this.jobObj = null;
    this.getList();
  }
  create() {
    this.title = "创建职位";
    this.showBox = true;
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
    if (type !== 'type') {if (this.params.query || this.params.state || this.params.workNature) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    this.loading = true;
    Job.workList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            // i.typeStr = this.$mapTypeStr(i.type, this.typeArr);
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            i.workNatureStr = this.$mapTypeStr(
              i.workNature,
              this.$store.state.workNatureArr
            );
            i.updateTimeStr = this.$formatDate(i.updateTime);
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
  refresh(e: any) {
    let data = {
      workId: e.workId
    }
    Job.updateJob({ data })
      .then((res: any) => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "刷新成功",
            type: "success"
          });
          this.getList();
        }
      })
  }
}
</script>
<style lang="scss">
  .job-dlog {
    text-align: center;
    height: 750px;
    .el-dialog__body {
      padding: 0!important;
      padding-bottom: 5px;
    }
  }
</style>
