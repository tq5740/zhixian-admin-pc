<template>
  <div id="createAndEdit">
    <el-row>
      <el-form :inline="true">
        <el-form-item v-if="'liveId' in this.options.params">
          <el-input placeholder="姓名/手机号" v-model="seek" class='w230' @change="seekSele(seek)" clearable>
            <template slot="append">
              <i class="el-icon-search" @click.stop="seekSele(seek)"> </i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="'liveId' in this.options.params">
          <el-select placeholder="报名方式" class='w150' v-model="options.params.regMode" @change="threeRecordListFun" clearable @clear="options.params.regMode = ''">
            <el-option label="管理员安排" value="1"></el-option>
            <el-option label="自主报名" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="'liveId' in this.options.params && !isShow.liveBtn">
          <el-button type="primary" icon="plus" @click="exportReg" :disabled="tableData.length ? false : true">导出报表</el-button>
        </el-form-item>
        <el-form-item v-if="'trainId' in this.options.params || 'courseId' in this.options.params">
          <el-button type="primary" @click.native="uploadDialog = true">导入用户</el-button>
        </el-form-item>
        <el-form-item v-if="!('liveId' in this.options.params) || ('liveId' in this.options.params && isShow.liveBtn)">
          <el-button type="primary" @click.native="addUserDialog = true">添加用户</el-button>
        </el-form-item>
        <el-form-item v-if="errorList.length>0">
          <a class="fc303e" style="cursor: pointer;" @click="errorBtn">导入失败{{errorList.length}}条，点击查看</a>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog v-if="uploadDialog" :visible.sync="uploadDialog" :before-close="uploadOver" title="导入用户" append-to-body>
      <el-form label-width="140px" label-position="right">
        <el-form-item label="用户导入模板下载：">
          <a target="_blank" :href="`${$store.state.configData.fileDomain}/train/user_reg.xlsx`"><el-button>下载模板</el-button></a>
          &nbsp;&nbsp;
          <span>请下载模板，以该模板的解构整理好用户数据</span>
        </el-form-item>
        <el-form-item label="请选择导入文件：">
          <el-upload style="display:inline-block" :action="`${course}?resourceId=${resource.resourceId}&resourceType=${resource.type}&token=${token}`" :show-file-list="false" :on-success='successImport' :on-progress="progressImport" :on-error="errorImport" accept=".xls, .xlsx" :disabled="flag">
            <el-button type="primary">点击上传</el-button>
          </el-upload>
          &nbsp;&nbsp;
          <span>仅支持xlsx文件导入</span>
          <el-progress v-show="percentNum > 0" style="margin-top: 10px" color="#42b983" :percentage="percentNum"></el-progress>
        </el-form-item>
        <el-form-item label="">
          <el-button @click.native="uploadOver">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-if="errorBox" :visible.sync="errorBox" title="导入失败列表" append-to-body>
      <el-table border :data="errorList">
        <el-table-column prop="userName" label="姓名(错误信息)" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号(错误信息)" min-width="120"></el-table-column>
      </el-table>
      <p class="fc303e" style="margin-top: 15px;">注：请导入本系统用户</p>
    </el-dialog>
    <el-row>
      <el-table ref="multipleTable" border :data="tableData" v-loading="loading" element-loading-text="拼命加载中" @selection-change='handleSelectionChange' :empty-text="notInit" @sort-change='sortFun'>
        <el-table-column type="selection" align="center" min-width='55' :selectable='selectInit' v-if="!('liveId' in options.params) || ('liveId' in options.params && isShow.liveBtn)"></el-table-column>
        <el-table-column prop="userPhoto" label="头像" max-width='60' align='center'>
          <template slot-scope="scope">
            <img v-if="scope.row.photo && scope.row.photo.includes('http')" style="width:30px;height:30px" class='img-bor' :src="scope.row.photo" />
            <img v-else style="width:30px;height:30px" class='img-bor' :src="scope.row.photo ? (imgDomain + scope.row.photo) : require('@/img/common/userp.svg')" />
          </template>
        </el-table-column>
        <el-table-column prop="userModelBO.userName" label="姓名" min-width="80" v-if="'examId' in options.params || 'liveId' in options.params"></el-table-column>
        <el-table-column prop="realName" label="姓名" min-width="100" v-else></el-table-column>
        <el-table-column prop="userModelBO.phone" label="手机号码" min-width="130" v-if="'examId' in options.params || 'liveId' in options.params"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="130" v-else></el-table-column>
        <el-table-column prop="regMode" label="报名方式" min-width="100">
          <template slot-scope="scope">
            {{scope.row.regMode === 1 ? '管理员安排' : '自主报名'}}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="100" v-if="'evalId' in options.params">
          <template slot-scope="scope">
            {{scope.row.state == 1 ? '未参加' : scope.row.state == 2 ? '已完成' : ''}}
          </template>
        </el-table-column>
        <el-table-column label="报名状态" min-width="100" v-if="'trainId' in options.params">
          <template slot-scope="scope">
            {{$mapTypeStr(scope.row.regState, regStateArr)}}
          </template>
        </el-table-column>
        <el-table-column label="学习状态" min-width="100" v-if="'trainId' in options.params">
          <template slot-scope="scope">
            {{$mapTypeStr(scope.row.state, stateArr)}}
          </template>
        </el-table-column>
        <el-table-column label="角色" min-width="80" v-if="'liveId' in options.params">
          <template slot-scope="scope">
            {{scope.row.role === 1 ? '主讲人' : scope.row.role === 2 ? '助教' : scope.row.role === 3 ? '互动者' : scope.row.role === 4 ? '旁观者' : ''}}
          </template>
        </el-table-column>
        <el-table-column prop="length" label="观看总时长" min-width="100" v-if="!('evalId' in options.params || 'examId' in options.params)">
          <template slot-scope="scope">
            {{scope.row.length != 0 ? $formatSeconds(scope.row.length) : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="updateTimeStr" label="最后观看时间" min-width="180" v-if="'liveId' in options.params"></el-table-column>
        <el-table-column prop="createTimeStr" label="报名时间" min-width="180" v-else></el-table-column>
        <!-- <el-table-column prop="communityImg" label="证件照" width='95' align='center' v-if="$store.state.trainData.id">
          <template slot-scope="scope">
            <img @click="showPic(scope.row)" style="height:30px;width:30px" class='img-bor' :src="scope.row.photoUrl ? (imgDomain + scope.row.photoUrl) : require('../img/common/zjz.png')" />
          </template>
        </el-table-column> -->
        <el-table-column prop="liveChapterTitle" label="上次观看章节" min-width="120" v-if="'liveId' in options.params">
          <template slot-scope="scope">
            {{scope.row.liveChapterTitle ? scope.row.liveChapterTitle : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="操作" width='170'>
          <template slot-scope="scope">
            <el-button type="text" @click="record(scope.row)" v-if="'liveId' in options.params && scope.row.length != 0 && !isShow.liveBtn">观看记录</el-button>
            <el-button type="text" @click.native="auditReg(scope.row)" v-if="('trainId' in options.params) && scope.row.regState && scope.row.regState != 4">审核报名</el-button>
            <el-button type="text" @click.native="deleteItem(scope.row)" v-if="scope.row.length == 0 || ('trainId' in options.params && scope.row.state == 1) || scope.row.examNumber == 0 || 'evalId' in options.params || ('liveId' in options.params && isShow.liveBtn && !scope.row.liveChapterTitle)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="'liveId' in options.params && isShow.liveBtn">
        <el-checkbox class="mg-left10" v-model='toggleCheckbox' :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
        <el-button class="mg-left10" type="default" size="small" @click.native="edit(1)" :disabled="isDisabled">设为主讲人</el-button>        
        <el-button class="mg-left10" type="default" size="small" @click.native="edit(2)">设为助教</el-button>
        <el-button class="mg-left10" type="default" size="small" @click.native="edit(3)">设为互动者</el-button>
        <el-button class="mg-left10" type="default" size="small" @click.native="edit(4)">设为旁观者</el-button>
        <el-button class="mg-left10" type="default" size="small" @click.native="deleteItem()">删除</el-button>
      </el-row>
      <el-row v-if="!('liveId' in options.params)">
        <el-checkbox class="mg-left10" v-model='toggleCheckbox' :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
        <el-button class="mg-left10" type="default" size="small" @click.native="deleteItem()">删除</el-button>
      </el-row>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
            共有
            <span class="fc303e">{{total}}</span>条数据，每页显示
            <el-select placeholder="" v-model="options.params.pageSize" class='w65' @change='options.params.pageNum = 1; threeRecordListFun();'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="options.params.pageNum" @current-change="threeRecordListFun('type')" :page-size="options.params.pageSize"
         layout="prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
      
      <el-dialog v-if="isShowPic" :visible.sync="isShowPic" title="用户照片" @close="isShowPic=false" append-to-body>
        <div>
          <img style="width: 100%;height:100%;" :src="userPic">
        </div>
      </el-dialog>

      <el-dialog v-if="showEdit" :visible.sync="showEdit" title="编辑直播用户角色" @close="showEdit=false" append-to-body>
        <div>
          <el-form label-width="140px">
            <el-form-item label="直播用户角色：">
              <el-radio-group v-model="role">
                <el-radio :label="1" v-if="!edits">主讲人</el-radio>
                <el-radio :label="2">助教</el-radio>
                <el-radio :label="3">互动者</el-radio>
                <el-radio :label="4">旁观者</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" @click.native="saveBtnEdit()">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </el-row>

    <el-dialog title="添加用户" width="60%" :visible.sync="addUserDialog" @close='userInit' :close-on-click-modal='false' :before-close="beforeClose" append-to-body>
      <add-user :options="options"></add-user>
    </el-dialog>

    <el-dialog width="70%" v-if="statisticsUser" :title="userName + '观看直播用户报表'" :visible.sync="statisticsUser" :close-on-click-modal="false" append-to-body>
      <statistics-user @statisticsUserOver="statisticsUserOver" :queryUser="queryData" from="live"></statistics-user>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" width="30%" title="审核" :visible.sync="showAuditTrain" append-to-body>
      <div>
        <el-radio v-model="auditObj.regState" :label="4">通过</el-radio>
        <el-radio v-model="auditObj.regState" :label="2">不通过</el-radio>
        <br />
        <br />
        <el-input v-show="auditObj.regState ==2" tyle="text" placeholder="请输入审核不通过的原因" v-model="auditObj.reason"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="saveAudit">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
  
    <el-row class='playing'>
      <el-button type="primary" @click.native="topBtn" v-if="!isShow.user">上一步</el-button>
      <span class="mg-left15">
        <el-button type="primary" @click.native="playing" v-if="!isShow.user" :disabled="isPlaying">提交</el-button>
      </span>
    </el-row>

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
import { Component, Vue, Prop } from "vue-property-decorator";
import Train from "@api/train";
import Exam from "@api/exam";
import Live from "@api/live";
import Eval from "@api/eval";

//https://github.com/ktsn/vuex-class
@Component({
  props: {
    options: {
      type: Object,
      default: {}
    },
    isShow: {
      type: Object,
      default: {}
    },
    isPlaying: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    resource(){
      let r ={}
      if(this.$route.path.includes('course')) {
        r.type = 2
        r.resourceId = this.$store.state.courseData.id
      } else if (this.$route.path.includes('exam')) {
        r.type = 3
        r.resourceId = this.$store.state.examData.id
      } else if (this.$route.path.includes('train')) {
        r.type = 1
        r.resourceId = this.$store.state.trainData.id
      }
      return r
    }
  },
  components: {
    "add-user": () => import("@c/AddUser.vue"),
    "statistics-user": () => import("@c/StatisticsUser.vue")
  }
})

export default class ChoiceUser extends Vue {
  course: any = "";
  options: any = this.options;
  errorList:any[] = [];
  token: any = this.$store.state.userInfo.token;
  bgActive: string = "";
  notInit: string = "暂无数据";
  
  addUserDialog: boolean = false; //-------------添加用户弹框
  uploadDialog: boolean = false; //-------------导入用户弹框
  loading: boolean = false;
  seek: string = ""; //-------------------------搜索
  total: number = 0; //-------------------------共多少条数据
  tableData: any[] = []; //--------------------表格
  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false; //------------表格全选状态
  selectData: any[] = [];
  userData1: null;
  userPic: string = "";
  isShowPic: boolean = false;
  liveOwner: string = "";
  errorBox: boolean = false;

  visibleRange: any = this.$store.state.visibleRange;
  stateInit: any = this.$store.state.stateInit;
  depData: any = this.$store.state.depData;
  portData: any = this.$store.state.portData;
  hierarchy: any = this.$store.state.configData.hierarchy;
  imgDomain: string = this.$store.state.configData.imgDomain;

  editLiveRegId: string = "";
  editLiveId: string = "";
  role: any = "";
  showEdit: boolean = false;
  edits: boolean = false;
  isDisabled: boolean = false;
  
  statisticsUser: boolean = false;
  queryData: object = {};
  userName: string = "";

  regStateArr: object[] = [
    {
      id: 2,
      text: "不通过"
    },
    {
      id: 3,
      text: "未审核"
    },
    {
      id: 4,
      text: "已审核"
    }
  ];
  stateArr: object[] = [
    {
      id: 1,
      text: "未尝试"
    },
    {
      id: 2,
      text: "未完成"
    },
    {
      id: 3,
      text: "已完成"
    }
  ];
  percentNum: number = 0;
  flag: boolean = false;

  isPending: boolean = false;
  auditObj: object = {
    regState: 4,
    reason: ""
  };
  showAuditTrain: boolean = false;

  created() {
    this.options.params.pageNum = 1;
    this.bgActive = 2;
    //  记录列表
    this.threeRecordListFun();
    this.course = Train.importCreateRecordAdmin();
  }
  // 搜索
  seekSele(query) {
    this.options.params.query = query;
    this.threeRecordListFun();
  }
  // 记录列表
  threeRecordListFun(type) {
    this.loading = true;
    if ( "courseId" in this.options.params ) {
      let data = {
        ...this.options.params,
        courseId: this.$store.state.courseData.id
      }
      Train.course_record_list_admin({ data }).then(
        res => {
          if (res.code == 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.createTimeStr = this.$formatDate(i.createTime, "YYYY-MM-DD hh:mm:ss");
              i.regTimeStr = this.$formatDate(i.regTime, "'YYYY-MM-DD hh:mm:ss'");
            });
            this.tableData = res.data.result;
            if (res.data.result.length === 0) {
              this.notInit = "暂无数据";
            }
            this.loading = false;
            delete this.options.params.query;
          }
        }
      )
    }
    if ( "trainId" in this.options.params) {
      let data = {
        ...this.options.params,
        trainId: this.$store.state.trainData.id
      }
      Train.train_record_list_admin({ data }).then(
        res => {
          if (res.code == 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.createTimeStr = this.$formatDate(i.createTime, "YYYY-MM-DD hh:mm:ss");
              i.regTimeStr = this.$formatDate(i.regTime, "'YYYY-MM-DD hh:mm:ss'");
            });
            this.tableData = res.data.result;
            if (res.data.result.length === 0) {
              this.notInit = "暂无数据";
            }
            this.loading = false;
            delete this.options.params.query;
          }
        }
      )
    }
    if ( "examId" in this.options.params) {
      let data = {
        ...this.options.params,
        examId: this.$store.state.examData.id
      }
      data.sortField = "examRegId";
      Exam.exam_reg_list_admin({ data }).then(
        res => {
          if (res.code == 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.createTimeStr = this.$formatDate(i.createTime, "YYYY-MM-DD hh:mm:ss");
              i.regTimeStr = this.$formatDate(i.regTime, "'YYYY-MM-DD hh:mm:ss'");
            });
            this.tableData = res.data.result;
            if (res.data.result.length === 0) {
              this.notInit = "暂无数据";
            }
            this.loading = false;
            delete this.options.params.query;
          }
        }
      )
    }
    if ( "liveId" in this.options.params) {
      if (type !== 'type') {
        if (
          this.options.params.query
        ) {
          this.options.params.pageNum = 1;
        }
      }
      let data = {
        ...this.options.params,
        liveId: this.$store.state.liveData.id
      }
      Live.live_reg_list_admin({ data }).then(
        res => {
          if (res.code == 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.updateTimeStr = this.$formatDate(i.updateTime, "YYYY-MM-DD hh:mm:ss");
              i.regTimeStr = this.$formatDate(i.regTime, "'YYYY-MM-DD hh:mm:ss'");
            });
            this.tableData = res.data.result;
            if (res.data.result.length === 0) {
              this.notInit = "暂无数据";
            }
            this.loading = false;
            delete this.options.params.query;
          }
        }
      )
    }
    if ( "evalId" in this.options.params) {
      let data = {
        ...this.options.params,
        evalId: this.$store.state.evalData.id
      }
      Eval.evaluation_report_list_admin({ data }).then(
        res => {
          if (res.code == 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.createTimeStr = this.$formatDate(i.createTime, "YYYY-MM-DD hh:mm:ss");
              i.regTimeStr = this.$formatDate(i.regTime, "'YYYY-MM-DD hh:mm:ss'");
            });
            this.tableData = res.data.result;
            if (res.data.result.length === 0) {
              this.notInit = "暂无数据";
            }
            this.loading = false;
            delete this.options.params.query;
          }
        }
      )
    }
  }
  errorBtn() {
    this.errorBox = true;
  }
  errorImport() {
    this.flag = false;
    this.$notify({
      title: "错误",
      type: "error",
      message: "上传失败！请检查网络"
    });
  }
  successImport(e: any) {
    if(e.code !==0){
      this.$notify({
        title: "提示",
        type: "error",
        message: e.msg
      });
    }else{
      if (e.data.successCount == 0 && e.data.errorList.length == 0) {
        this.$notify({
          title: "提示",
          type: "error",
          message: `导入失败,请检查文档格式是否正确!`
        });
      }
      if (e.data.successCount == 0 && e.data.errorList.length > 0) {
        this.$notify({
          title: "提示",
          type: "error",
          message: `导入失败,错误${e.data.errorList.length}条,请导入本系统用户!`
        });
      }
      if (e.data.successCount > 0 && e.data.errorList.length > 0) {
        this.$notify({
          title: "提示",
          type: "warning",
          message: `成功导入${e.data.successCount}条,失败${e.data.errorList.length}条,请导入本系统用户!`
        });
        this.uploadDialog = false;
      }
      if (e.data.successCount && e.data.errorList.length === 0){
        this.$notify({
          title: "提示",
          type: "success",
          message: `成功导入${e.data.successCount}条!`
        });
        this.uploadDialog = false;
      }
      this.flag = false;
      this.percentNum = 0;
      this.errorList  = e.data.errorList
    }
  }
  progressImport(e: any) {
    this.flag = true;
    this.percentNum = e.percent;
  }
  showPic(e: any) {
    if (e.photoUrl) {
      this.userPic = this.imgDomain + e.photoUrl;
      this.isShowPic = true;
    } else {
      this.$notify({
        title: "提示",
        message: "无法查看该用户照片",
        type: "warning"
      });
    }
  }
  sortFun(i) {
    this.options.params.sortBy = !this.options.params.sortBy;
    this.threeRecordListFun();
  }
  topBtn() {
    this.$emit("createEditThreeOverUp");
  }
  userInit() {
    this.errorList=[]
  }
  // 关闭弹窗回调
  beforeClose() {
    this.addUserDialog = false; //关闭弹框
    this.threeRecordListFun(); //跟新列表接口
  }
  // 上线
  playing() {
    this.$emit("createEditThreeOver");
  }
  // 审核报名
  auditReg(e: any) {
    this.showAuditTrain = true;
    this.auditObj.userIds = e.userId;
  }
  saveAudit() {
    if (this.regState === 2 && !this.auditObj.reason) {
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    this.isPending = true;
    let data = {
      ...this.auditObj,
      trainId: this.$store.state.trainData.id
    }
    Train.audit_train_record_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.showAuditTrain = false;
          this.threeRecordListFun();
        }
      }).finally(() => {
        this.isPending = false;
      })
  }
  //  删除记录列表弹框
  deleteItem(e: any) {
    if (e) {
      this.$confirm("确认删除吗？", "提示", {
        closeOnClickModal: false,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          if( "examId" in this.options.params ){
            this.options.params[this.options.arrs] = '["' + e[this.options.arr] + '"]';
          } else {
            this.options.params[this.options.arrs] = e[this.options.arr];
          }
          if( "liveId" in this.options.params ){
            this.options.params[this.options.arr] = e[this.options.arr];
            delete this.options.params[this.options.arrs];
          }
          if(this.tableData.length == 1 && this.options.params.pageNum > 1){
            this.options.params.pageNum --;
          }
          this.deleRecordListFun();
        })
        .catch(() => {});
    } else {
      if (this.selectData.length === 0) {
        this.$notify({
          title: "提示",
          message: "请先勾选列表",
          type: "warning"
        });
      } else {
        this.$confirm("确认删除吗？", "提示", {
          closeOnClickModal: false,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
          .then(() => {
            if( "examId" in this.options.params || "liveId" in this.options.params ){
              let id = JSON.stringify(this.selectData.map(i => i[this.options.arr]));
              this.options.params[this.options.arrs] = id;
            } else {
              let id = JSON.stringify(this.selectData.map(i => i.userId));
              this.options.params.userIds = id.replace(/"|\[|\]/g,'')
            }
            if(this.selectData.length === this.tableData.length && this.options.params.pageNum > 1){
              this.options.params.pageNum --;
            }
            this.deleRecordListFun();
          })
          .catch(() => {});
      }
    }
  }
  // 确认删除
  deleRecordListFun() {
    if( "courseId" in this.options.params ){
      let data = {
        ...this.options.params,
        courseId: this.$store.state.courseData.id
      }
      Train.delete_course_record_admin({
        data
      }).then(res => {
        if (res.code === 0) {
          delete this.options.params[this.options.arrs];
          this.threeRecordListFun();
          this.toggleCheckbox = false;
          this.$refs.multipleTable.clearSelection();
        }
      });
    }
    if( "trainId" in this.options.params ){
      let data = {
        ...this.options.params,
        trainId: this.$store.state.trainData.id
      }
      Train.delete_train_record_admin({
        data
      }).then(res => {
        if (res.code === 0) {
          delete this.options.params[this.options.arrs];
          this.threeRecordListFun();
          this.toggleCheckbox = false;
          this.$refs.multipleTable.clearSelection();
        }
      });
    }
    if( "examId" in this.options.params ){
      let data = {
        ...this.options.params,
        examId: this.$store.state.examData.id
      }
      Exam.delete_exam_reg_admin({
        data
      }).then(res => {
        if (res.code === 0) {
          delete this.options.params[this.options.arrs];
          this.threeRecordListFun();
          this.toggleCheckbox = false;
          this.$refs.multipleTable.clearSelection();
        }
      });
    }
    if( "liveId" in this.options.params ){
      let data = {
        ...this.options.params,
        liveId: this.$store.state.liveData.id
      }
      data.liveRegIds = data.liveRegIds.replace(/"|\[|\]/g,'')
      Live.del_live_reg_admin({
        data
      }).then(res => {
        if (res.code === 0) {
          delete this.options.params[this.options.arr];
          this.threeRecordListFun();
          this.toggleCheckbox = false;
          this.$refs.multipleTable.clearSelection();
          this.$notify({
            title: "提示",
            message: "操作成功！",
            type: "success"
          });
        }
      });
    }
    if( "evalId" in this.options.params ){
      let data = {
        ...this.options.params,
        evalId: this.$store.state.evalData.id
      }
      Eval.delete_evaluation_report_admin({
        data
      }).then(res => {
        if (res.code === 0) {
          delete this.options.params[this.options.arrs];
          this.threeRecordListFun();
          this.toggleCheckbox = false;
          this.$refs.multipleTable.clearSelection();
        }
      });
    }
  }
  // 考试次数或者学习时长为0的,才能被删除
  selectInit(row: any, index: any) {
    this.selectData.length > 1 ? this.isDisabled = true : this.isDisabled = false;
    if (row.examNumber == 0 || row.length == 0 || "liveId" in this.options.params || "evalId" in this.options.params) {
      return true
    } else if ("trainId" in this.options.params && row.stateReg != 4) {
      return true
    } else{
      return false
    }
  }
  // 底部全选
  handleCheckAllChange() {
    if (this.toggleCheckbox) {
      this.$refs.multipleTable.toggleAllSelection();
    } else {
      this.$refs.multipleTable.clearSelection();
    }
    this.handleSelectionChange;
  }
  handleSelectionChange(e: any) {
    this.selectData = e;
    let checkedCount = e.length;
    this.toggleCheckbox = checkedCount === this.tableData.length && this.tableData.length != 0;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
  }
  edit(e: any) {
    if(e === 1 || e === 2 || e === 3 || e === 4){
      if (this.selectData.length === 0) {
        this.$notify({
          title: "提示",
          message: "请先勾选列表",
          type: "warning"
        });
        return;
      }
      if (e === 1) {
        this.$confirm("确认修改角色吗？", "提示", {
          closeOnClickModal: false,
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(() => {
          this.role = e;
          this.editLiveRegId = this.selectData[0].liveRegId;
          this.editLiveId = this.selectData[0].liveId;
          this.edits = false;
          this.saveBtnEdit();
        })
        .catch(() => {
        }) 
      } else {
        this.edits = true;
        this.saveBtnEdits(e); 
      }
    } else {
      this.role = e.role;
      this.editLiveRegId = e.liveRegId;
      this.editLiveId = e.liveId;
      this.edits = false;
      this.showEdit = true;  
    }   
  }
  saveBtnEdit() {
    if (!this.edits) {
      let data = {
        liveId: this.editLiveId,
        liveRegId: this.editLiveRegId,
        role: this.role
      }
      Live.update_live_reg_admin({ data }).then(res => {
        if (res.code === 0) {
          this.role = "";
          this.showEdit = false;
          this.threeRecordListFun();
        }
      });  
    } else {
      this.saveBtnEdits();
    }
  }
  saveBtnEdits(e: any) {
    this.$confirm("确认修改角色吗？", "提示", {
      closeOnClickModal: false,
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    })
      .then(() => {
        let liveRegIds = JSON.stringify(this.selectData.map(i => i.liveRegId));
        let data = {
          liveRegIds: liveRegIds,
          role: e
        }
        Live.update_live_reg_role_admin({ data }).then(res => {
          if (res.code === 0) {
            this.role = "";
            this.showEdit = false;
            this.threeRecordListFun();
          }
        });
      })
      .catch(() => {
        this.role = "";
      })  
  }
  exportReg() {
    window.open(
      `${Live.exportLiveReg()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&liveId=${this.$store.state.liveData.id}`
    );
  }
  record(e: any){
    this.queryData = e;
    this.userName = e.userModelBO && e.userModelBO.userName+' ' || '';
    this.statisticsUser = true;
  }
  statisticsUserOver() {
    this.statisticsUser = false;
  }
  uploadOver() {
    this.uploadDialog = false;
    this.threeRecordListFun();
  }
}  
</script>
<style lang="scss" scoped>
.playing {
  position: absolute;
  bottom: 0px;
  text-align: center;
  width: 98%;
  padding: 20px 0;
}
.mg-left15{
  margin-left: 15px;
}
.mg-left10{
  margin-top: 10px;
  margin-left: 10px;
}
.page-num{
  margin-top: 20px;
  margin-bottom: 40px;
}
</style>

