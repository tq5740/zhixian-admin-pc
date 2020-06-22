<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="状态 :">
          <el-select v-model="params.state" class='w240' @change="getList" clearable @clear="params.state = ''">
            <el-option :key="i.id" v-for="i in stateArr" :value="i.id" :label="i.text">

            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面试时间段 : ">
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="请输入职位名称进行搜索" v-model="params.query" class='w320' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>

          </el-input>
        </el-form-item>
        <el-form-item label="" class='fr'>
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
    </el-row>
    <el-row>
      <el-table @sort-change="changeTime" header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="workTitle" label="工作意向" min-width="120"></el-table-column>
        <el-table-column prop="userName" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="联系电话" min-width='120'></el-table-column>
        <el-table-column prop="salary" label="期望薪资" min-width='120'>
        </el-table-column>
        <el-table-column prop="birthDateStr" label="出生日期" min-width='120'></el-table-column>
        <el-table-column prop="highestEducationStr" label="学历" min-width='100'>
        </el-table-column>
        <el-table-column prop="startWorkYear" label="工作年份" min-width='100'>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='100'>
        </el-table-column>
        <el-table-column prop="interviewTimeStr" sortable='custom' label="面试时间" min-width='150'>
        </el-table-column>
        <el-table-column prop="" label="操作" min-width="240">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="see(scope.row)">简历</el-button>
            <!--  -->
            <el-button v-if="scope.row.state === 3" type="text" @click.native="noPass(scope.row)">未通过</el-button>
            <!--  -->
            <el-button v-if="scope.row.state === 3" type="text" @click.native="send(scope.row)">发送offer</el-button>
            <!--  -->
            <el-button v-if="scope.row.state === 5" type="text" @click.native="confirmJob(scope.row)">入职</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination :current-page.sync="params.pageNum" class="mg15 fr" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-row>
    <el-dialog :close-on-click-modal="false" v-if="showBox" title="用户简历" :visible.sync="showBox" :before-close="close">
      <v-resume :bookingObj="bookingObj" @close="close" :isFileList="false"></v-resume>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" v-if="showOffer" title="发送offer" :visible.sync="showOffer" :before-close="closeOffer">
      <v-offer :bookingData="bookingObj" :userName="userName" @ok="ok"></v-offer>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    interview
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-21:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import Booking from "@api/booking";
import { formatDate } from "@utils/index";

import { debounce } from "typescript-debounce-decorator";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "v-resume": () => import("@c/Vresume.vue"),
    "v-offer": () => import("@c/Voffer.vue")
  }
})
export default class Interview extends Vue {
  //筛选用
  params = {
    type: "",
    pageSize: 10,
    pageNum: 1,
    query: "",
    startTime: "",
    endTime: "",
    state: 3,
    sortBy: false,
    sortField: `interviewTime`
  };
  userName: string = "";
  time: string[] = [];
  stateArr: object[] = [
    {
      id: 3,
      text: "待面试(已发邀请)"
    },
    {
      id: 4,
      text: "未通过"
    },
    {
      id: 5,
      text: "待入职(已发offer)"
    },
    {
      id: 6,
      text: "未入职"
    },
    {
      id: 7,
      text: "已入职"
    }
  ];
  loading: boolean = false;
  showBox: boolean = false;
  showOffer: boolean = false;
  total: number = 0;
  tableData: any[] = [];
  bookingObj = {
    bookingId: "",
    state: 0,
    workId: "",
    userId: "",
    //state===3必传
    addressId: "",
    //state===3必传
    interviewTime: "",
    workTitle: "",
    phone: "",
    orgId: ""
  };

  created() {
    this.getList();
  }
  changeTime() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  closeOffer() {
    this.showOffer = false;
  }
  ok() {
    this.closeOffer();
    this.getList();
  }
  close() {
    this.showBox = false;
  }
  see(e: any) {
    Object.keys(this.bookingObj).forEach(i => {
      //@ts-ignore
      this.bookingObj[i] = e[i];
    });
    this.showBox = true;
  }
  noPass(e: any) {
    Object.keys(this.bookingObj).forEach(i => {
      //@ts-ignore
      this.bookingObj[i] = e[i];
    });
    this.$confirm(`是否将 "${e.userName}" 的简历标记为未通过? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = { ...this.bookingObj, state: 4 };
        data.interviewTime = formatDate(this.bookingObj.interviewTime);
        this.loading = true;
        Booking.updateBooking({ data })
          .then((res: any) => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `操作成功!`,
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
  send(e: any) {
    Object.keys(this.bookingObj).forEach(i => {
      //@ts-ignore
      this.bookingObj[i] = e[i];
    });
    this.userName = e.userName;
    this.showOffer = true;
  }
  confirmJob(e: any) {
    Object.keys(this.bookingObj).forEach(i => {
      //@ts-ignore
      this.bookingObj[i] = e[i];
    });
    this.$confirm(`是否确定 "${e.userName}" 入职? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let data = { ...this.bookingObj, state: 7 };
        data.interviewTime = formatDate(this.bookingObj.interviewTime);
        this.loading = true;
        Booking.updateBooking({ data })
          .then((res: any) => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `操作成功!`,
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
    Booking.bookingRecord({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
        }
        res.data.result.forEach((i: any) => {
          i.birthDateStr = this.$formatDate(i.birthDate).split(" ")[0];
          i.interviewTimeStr = this.$formatDate(i.interviewTime);
          i.highestEducationStr = this.$mapTypeStr(
            i.education,
            this.$store.state.educationArr
          );
          i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
          if (i.highSalary && !i.lowSalary) {
            i.salary = `0-${i.highSalary}`;
          } else if (!i.highSalary && i.lowSalary) {
            i.salary = `${i.lowSalary}元`;
          } else {
            i.salary = `${i.lowSalary}-${i.highSalary}`;
          }
          i.startWorkYear = i.startWorkYear ? new Date().getFullYear() - i.startWorkYear + "年" : '';
        });
        this.tableData = res.data.result;
        this.tableData.forEach((item) => {
          item.workTitle = item.workTitle.join('');
          item.workTitle = item.workTitle.substr(0,item.workTitle.length-1);
        });
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
</style>
