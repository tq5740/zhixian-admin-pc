<template>
  <div class="resume">
    <el-row v-loading="loading" element-loading-text="加载中..." class="ml10">
      <div v-if="resumeInfo">
        <div class="resume-item">
          <h3 class="fc303e">| 基本信息</h3>
          <el-row class="use-basic-profile">
            <img class="photo fl" :src="resumeInfo.photo ? ((resumeInfo.photo && resumeInfo.photo.includes('http')) ? resumeInfo.photo :  $store.state.configData.imgDomain + resumeInfo.photo) : require('@/img/common/userp.svg')" alt="用户头像">
            <div class="userInfo fl">
              <p class="user-name">{{resumeInfo.userName || '-'}} - {{resumeInfo.sex === 1 ? '男' : resumeInfo.sex === 2 ? "女" : "-"}}</p>
              <p>{{resumeInfo.birthDate ? getAge(resumeInfo.birthDate) + '岁' : '-'}} | {{resumeInfo.eduStr || '-'}} | {{resumeInfo.startWorkYear ? getExperience(resumeInfo.startWorkYear) +'年工作经验' : '-'}}</p>
              <p v-if="!isDown">联系电话:
                <span>{{resumeInfo.phone}}</span>
              </p>
            </div>
          </el-row>
          <p class="pl">居住地区:
            <span class="p-detail">{{resumeInfo.city}} {{resumeInfo.district}}</span>
          </p>
          <!-- <p class="pl">工作状态 - <span class="p-detail">{{workStateArr[resumeInfo.workState]}}</span></p> -->
          <p class="pl" v-if="resumeInfo.tag">个性标签:
            <span class="tag"><span class="p-detail">{{resumeInfo.tag}}</span></span>
          </p>

        </div>
        <div class="intention">
          <h3 class="fc303e">| 求职意向</h3>
          <el-row v-if="intentionData">
            <p class="pl">意向职能: <span class="p-detail">{{intentionData.workCategoryTitle}}</span>
            </p>
            <p class="pl" v-if="intentionData.salary">期望薪资: <span class="p-detail">{{intentionData.salary}}元</span>
            </p>
            <p class="pl" v-if="intentionData.address">期望地点: <span class="p-detail">{{intentionData.address}}</span>
            </p>
          </el-row>
        </div>
        <div>
          <h3 class="fc303e">| 工作经历</h3>
          <el-row>
            <div v-for="i in resumeInfo.userWorkList" :key="i.userWorkId">
              <p class="company-name">{{i.orgName}}</p>
              <p class="position-orientation">{{i.workCastegoryTitle}}</p>
              <p class="time">{{i.startDate}} - {{i.endDate}}</p>
              <div class="companyInfo">
                <p><span class="tag" v-html="brString(i.intro)"></span>
                </p>
              </div>
            </div>
          </el-row>
        </div>
        <div>
          <h3 class="fc303e">| 教育经历</h3>
          <el-row>
            <div v-for="i in resumeInfo.userEduList" :key="i.userEduId">
              <span class="school-name">{{i.schoolName}}</span>
              <p class="major-name">{{i.majorName}}{{i.majorNam && i.education ? ' - ' : ''}}{{$mapTypeStr(i.education,$store.state.educationArr)}}</p>
              <p class="time">{{i.startDate}} - {{i.endDate}}</p>
              <div class="companyInfo">
                <p><span class="tag" v-html="brString(i.intro)"></span>
                </p>
              </div>
              <img class="photo" v-if="i.certificate" @click="showImgFn(i.certificate)" :src="i.certificate ? ((i.certificate && i.certificate.includes('http')) ? i.certificate :  $store.state.configData.imgDomain + i.certificate) : require('@/img/common/userp.svg')">
            </div>
          </el-row>
        </div>
        <div>
          <h3 class="fc303e">| 培训经历</h3>
          <el-row>
            <div v-for="i in resumeInfo.userTrainList" :key="i.userTrainId">
              <p class="program-name">{{i.project}}</p>
              <p class="institution-name">{{i.institutionName}}</p>
              <p class="time">{{i.startMonth}} - {{i.endMonth}}</p>
              <div class="companyInfo">
                <p><span class="tag" v-html="brString(i.intro)"></span>
                </p>
              </div>
              <img class="photo" v-if="i.certificate" @click="showImgFn(i.certificate)" :src="i.certificate ? ((i.certificate && i.certificate.includes('http')) ? i.certificate :  $store.state.configData.imgDomain + i.certificate) : require('@/img/common/userp.svg')">
            </div>
          </el-row>
        </div>
        <div class="mt10">
          <el-button class="fr mr20" type="danger" @click.native="resumeState(2)" v-if="interviewState1">不合适</el-button>
          <el-button class="fr" type="primary" @click.native="send" v-if="interviewState1">邀请面试</el-button>
          <el-button class="fr mr20" type="danger" @click.native="resumeState(5)" v-if="interviewState3">不通过</el-button>
          <el-button class="fr" type="primary" @click.native="resumeState(6)" v-if="interviewState3">面试通过</el-button>
          <el-button class="fr mr20" type="danger" @click.native="resumeState(7)" v-if="interviewState6">不入职</el-button>
          <el-button class="fr" type="primary" @click.native="resumeState(8)" v-if="interviewState6">&nbsp;&nbsp;&nbsp;&nbsp;入职&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
          <el-button type="primary" @click.native="down" v-if="isDown">下载简历</el-button>
          <el-button type="danger" @click.native="_close" v-if="showCloseBtn">关闭</el-button>
        </div>
      </div>
    </el-row>

    <el-dialog title="毕业证" v-if="showImg" :visible.sync="showImg" append-to-body>
      <img :src="imgSrc ? ((imgSrc && imgSrc.includes('http')) ? imgSrc :  $store.state.configData.imgDomain + imgSrc) : require('@/img/common/userp.svg')" alt="" class="img-max">
    </el-dialog>

    <!-- 选择对应职位 -->
    <el-dialog :close-on-click-modal="false" title="选择对应职位" v-if="showAuditWrok" :visible.sync="showAuditWrok" :before-close="closeAuditWrok" append-to-body>
      <el-row>
        <el-form :inline="true">
          <el-form-item label="">
            <el-input placeholder="请输入职位名称进行搜索" v-model="addQuery" class='w320' @keyup.13.native="onAddQuery">
              <el-button class="clickBtn" @click="onAddQuery" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="" class='fr'>
            共有
            <span class="fc303e">{{addTotal}}</span>条数据，每页显示
            <el-select placeholder="" v-model="addPageSize" class='w65' @change='getAddJobList'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table ref="addTable" highlight-current-row @current-change="handleSelectionChange" header-row-class-name="thead" :data="workList" border v-loading="loading3" element-loading-text="加载中...">
          <el-table-column prop="workTitle" label="职位名称" min-width="15%"></el-table-column>
          <el-table-column prop="educationStr" label="学历要求" min-width='10%'></el-table-column>
          <el-table-column prop="experienceStr" label="工作经验" min-width='10%'></el-table-column>
          <el-table-column prop="recruitNumber" label="招聘人数" min-width='10%'></el-table-column>
          <el-table-column prop="salary" label="薪资待遇" min-width='10%'></el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:10px">
        <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn">确定</el-button>
      </el-row>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" append-to-body width="45%" v-if="showBox" title="发送面试邀请" :visible.sync="showBox " :before-close="close">
      <v-send :bookingData="bookingObj" :userName="resumeInfo.userName" @close="close" @ok="ok"></v-send>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" append-to-body width="45%" v-if="entryBox" title="发送入职邀请" :visible.sync="entryBox" :before-close="closeEntryBox">
      <v-sendentry :bookingData="bookingObj" :userName="resumeInfo.userName" @close="close" @ok="ok"></v-sendentry>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
     module:
        业务组件
      author:
        lose_kl<https://github.com/NeverMore-KL>
      summary:
        2018-8-20:业务组件
     */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Archives from "@api/archives";
import Booking from "@api/booking";
import Job from "@api/job";
import { formatDate } from "@utils/index";
import { throws } from 'assert';
import Vtimer from "@c/Vtimer.vue";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "v-send": () => import("./Vsend.vue"),
    "v-sendentry": () => import("./VsendEntry.vue")
  }
})
export default class Resume extends Vue {
  @Prop({
    default: {
      bookingId: "",
      state: 0,
      userId: "",
      addressId: "",
      interviewTime: ""
    }
  })
  public bookingObj: any;
  @Prop({
    default: true
  })
  public isFileList!: boolean;
  @Prop({
    default: false
  })
  public isDown!: boolean;
  interviewTimeObj = {
    ymd: "",
    h: "",
    m: "",
    s: "00"
  };
  // workStateArr: any = ["", "在职", "离职", "在校大学生"];
  availableTimeArr: object[] = [
    {
      id: 1,
      text: "随时"
    },
    {
      id: 2,
      text: "一周内"
    },
    {
      id: 3,
      text: "一月内"
    },
    {
      id: 4,
      text: "待定"
    }
  ];
  loading: boolean = false;
  loading3: boolean = false;
  showBox: boolean = false;
  isPending: boolean = false;
  resumeInfo: any = null;
  addressArr: any[] = [];
  intentionData: any[] = [];
  interviewState1: boolean = false;
  interviewState3: boolean = false;
  interviewState4: boolean = false;
  interviewState6: boolean = false;
  showCloseBtn: boolean = true;
  showAuditWrok: boolean = false;
  workId: string = "";
  workList: any[] = [];

  addTotal: number = '';
  addQuery: string = "";
  addTotal: number = 0;
  addPageSize: number = 10;
  addPageNum: number = 1;
  addCheckbox: boolean = false;
  selectData: any[] = [];
  entryBox: boolean = false;
  showImg: boolean = false;
  imgSrc :string = "";

  brString(str: string): string {
    return str ? str.replace(/\n|\r\n/g, "<br>") : '';
  }

  getAge(str: string): string {
    let birthday = new Date(str);
    let d = new Date();
    let age =
      d.getFullYear() -
      birthday.getFullYear() -
      (d.getMonth() < birthday.getMonth() ||
      (d.getMonth() == birthday.getMonth() && d.getDate() < birthday.getDate())
        ? 1
        : 0);
    return age;
  }

  getExperience(str: string): string {
    let birthday = new Number(str);
    let d = new Date().getFullYear();
    return d - birthday;
  }

  created() {
    if(this.bookingObj.interviewTime){
      this.bookingObj.interviewTime = this.$formatDate(this.bookingObj.interviewTime);
    }
    this.getList();
    this.getIntention();
    if(this.bookingObj.state == 1){
      this.interviewState1 = true;
    }
    if(this.bookingObj.state == 3){
      this.interviewState3 = true;
    }
    if(this.bookingObj.state == 4){
      this.interviewState4 = true;
    }
    if(this.bookingObj.state == 6){
      this.interviewState6 = true;
    }
    if(this.bookingObj.state === 1 || this.bookingObj.state === 3 || this.bookingObj.state === 6){
      this.showCloseBtn = false;
    }

  }

  down() {
    this.getAddJobList();
    this.showAuditWrok = true;
  }
  getAddJobList() {
    this.loading3 = true;
    let data = {
      query: this.addQuery,
      pageSize: this.addPageSize,
      pageNum: this.addPageNum,
      sortBy: false,
      sortField: "updateTime", 
      state: 4 
    };
    Job.workList({ data })
      .then(res => {
        if (res.code === 0) {
          this.addTotal = res.data.total;
          res.data.result.forEach((i: any) => {
            i.educationStr = this.$store.state.educationArr[i.education].text;
            i.experienceStr = this.$store.state.experienceArr[i.experience].text;
            if (i.highSalary && !i.lowSalary) {
              i.salary = `0-${i.highSalary}`;
            } else if (!i.highSalary && i.lowSalary) {
              i.salary = `${i.lowSalary}元`;
            } else {
              i.salary = `${i.lowSalary}-${i.highSalary}`;
            }
          });
          this.workList = res.data.result;
        }
      })
      .finally(() => {
        this.loading3 = false;
      });
  }
  closeAuditWrok() {
    this.showAuditWrok = false;
  }
  handleSelectionChange(e: any) {
    this.selectData = e;
    this.workId = e.workId;
  }
  saveBtn() {
    if (this.selectData.length === 0 && !this.workId) {
      this.$notify({
        title: "错误",
        message: `请选择一个职位!`,
        type: "error"
      });
      return;
    }
    let data = { userId: this.bookingObj.userId, workId: this.workId };
    Booking.createBooking({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: `下载成功!`,
          type: "success"
        });
        this.$emit("okCB");
        this.showAuditWrok = false;
      }
    });
  }

  close() {
    this.showBox = false;
  }
  _close() {
    this.$emit("close");
  }

  ok() {
    this.close();
    this.$emit("okCB");
  }

  resumeState(e) {
    if(e === 8){
      this.entryBox = true;
    } else {
      this.$confirm(
        `是否将 "${this.resumeInfo.userName}" 的简历标记为${this.$store.state.resumeStates[e - 1].text}? `,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let data = { ...this.bookingObj, state: e };
          this.loading = true;
          Booking.updateBooking({ data })
            .then((res: any) => {
              if (res.code === 0) {
                this.$notify({
                  title: "提示",
                  message: `操作成功!`,
                  type: "success"
                });
                this.$emit("okCB");
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
  }

  entryBtn() {
    if (
      !this.interviewTimeObj.ymd ||
      !this.interviewTimeObj.m ||
      !this.interviewTimeObj.h
    ) {
      this.$notify({
        title: "提示",
        message: `请填写完整的入职时间!`,
        type: "error"
      });
      return;
    }
    let data = { ...this.bookingObj, state: 8, interviewTime: `${this.interviewTimeObj.ymd} ${this.interviewTimeObj.h}:${this.interviewTimeObj.m}:${this.interviewTimeObj.s}` };
    this.loading = true;
    Booking.updateBooking({ data })
      .then((res: any) => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `操作成功!`,
            type: "success"
          });
          this.$emit("okCB");
        } else {
          this.loading = false;
        }
      })
      .catch(() => {
        this.loading = false;
      });
  }
  closeEntryBox() {
    this.entryBox = false;
  }
  getYMD(e?: any) {
    if (e) {
      this.interviewTimeObj.ymd = e;
    } else {
      this.interviewTimeObj.ymd = "";
    }
  }
  getHour(e?: any) {
    if (e) {
      this.interviewTimeObj.h = e;
    } else {
      this.interviewTimeObj.h = "";
    }
  }
  getMin(e?: any) {
    if (e) {
      this.interviewTimeObj.m = e;
    } else {
      this.interviewTimeObj.m = "";
    }
  }

  send() {
    this.showBox = true;
  }

  getList() {
    this.loading = true;
    let data = { userId: this.bookingObj.userId };
    Archives.query_userinfo_edu_admin({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.eduStr = this.$mapTypeStr(
            res.data.education,
            this.$store.state.educationArr
          );
          this.resumeInfo = res.data;
        }
      })
      .finally(() => {
        this.$nextTick(() => {
          this.loading = false;
        });
      });
  }

  getIntention(){
    this.loading = true;
    let data = { 
      intentionId: this.bookingObj.intentionId,
      userId: this.bookingObj.intentionId ? null : this.bookingObj.userId
    };
    Booking.queryIntentionAdmin({ data })
      .then(res => {
        if (res.code === 0) {
          this.intentionData = res.data;
          if(this.intentionData && this.intentionData.workCategoryTitle){
            this.intentionData.workCategoryTitle = this.intentionData.workCategoryTitle.join('，');
          } else {
            this.intentionData.workCategoryTitle = ' ';
          }
          
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  @debounce(200, { leading: false })
  onAddQuery() {
    this.getAddJobList();
  }
  showImgFn(e: any) {
    this.showImg = true;
    this.imgSrc = e;
  }
}
</script>
<style lang="scss" scoped>
  h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .school-name,
  .company-name,
  .program-name {
    font-size: 18px;
    color: #333;
    margin-bottom: 8px;
  }
  .major-name,
  .position-orientation,
  .institution-name {
    font-size: 14px;
    color: #333;
  }
  .resume {
    min-height: 300px;
  }

  .user-name {
    font-size: 18px;
  }

  .resume-item {
    margin-bottom: 30px;
  }

  .use-basic-profile {
    margin-bottom: 12px;
  }

  .ml10 {
    margin-left: 10px;
  }

  .photo {
    display: block;
    width: 120px;
    height: 120px;
  }

  p {
    color: black;
    margin-bottom: 16px;
    font-size: 14px;
    &:first-of-type {
      padding-top: 4px;
    }
  }

  .userInfo {
    width: 300px;
    margin-left: 10px;
    p {
      margin-bottom: 20px;
    }
  }
  .tag {
    word-break: break-all;
    color: #999;
  }

  .pl {
    padding-left: 4px;
  }

  .p-detail {
    color: #999;
  }

  .time {
    color: #666;
    font-size: 14px;
    margin-bottom: 6px;
  }

  /*.companyInfo {*/
  /*padding-left: 10px;*/
  /*}*/

  .mt10 {
    margin-top: 24px;
  }

  .mr20 {
    margin-right: 20px;
  }
  .img-max{
    display: block;
    max-width: 100%;
  }
</style>
