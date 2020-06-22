<template>
  <div class="basic">
    <div class="export" @click="exportFn">
      <svg class="dachu-icon" aria-hidden="true">
        <use xlink:href="#icon-daochu"></use>
      </svg>
      <span>导出</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple userBg">
          <svg class="menu-icon" aria-hidden="true">
            <use xlink:href="#icon-yonghu"></use>
          </svg>
          <ul>
            <li class="money" @click="link(1)">{{basicInfo.userCount}}</li>
            <li class='txt'>用户总数</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple orgBg">
          <svg class="menu-icon" aria-hidden="true">
            <use xlink:href="#icon-zuzhi"></use>
          </svg>
          <ul>
            <li class="money" @click="link(2)">{{basicInfo.orgCount}}</li>
            <li class='txt'>企业总数</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple jobBg">
          <svg class="menu-icon" aria-hidden="true">
            <use xlink:href="#icon-zhiwei"></use>
          </svg>
          <ul>
            <li class="money" @click="link(3)">{{basicInfo.recruitNumber}}</li>
            <li class='txt'>就业岗位</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple jyBg">
          <svg class="menu-icon" aria-hidden="true">
            <use xlink:href="#icon-jiuye"></use>
          </svg>
          <ul>
            <li class="money" @click="link(4)">{{basicInfo.bookingNumber}}</li>
            <li class='txt'>就业意向</li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <div class="logined">
      <h3 class="h3-title">最近登录</h3>
      <el-row style="margin-top:10px">
        <el-button @click.native="params.type = 'month';initTimeY();" :class="{'active' : params.type === 'month'}">日</el-button>
        <el-button @click.native="params.type = 'year';initTimeN();" :class="{'active' : params.type === 'year'}">月</el-button>
        <el-date-picker class="fr" v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
      </el-row>
      <div id="charts" :style="{width: '100%', height: '400px'}"></div>
    </div>
  </div>
</template>

<script lang="ts">
/*
 module:
    main.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-11:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入折现图组件
require("echarts/lib/chart/line");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

import { Component, Vue } from "vue-property-decorator";
import User from "@api/user";
import Job from "@api/job";
import { get7DaysBefore, getNow } from "@utils/index";
Component.registerHooks(["beforeRouteLeave"]);
//https://github.com/ktsn/vuex-class
@Component({})
export default class Landing extends Vue {
  basicInfo = {
    userCount: 0,
    bookingNumber: 0,
    recruitNumber: 0,
    orgCount: 0
  };
  time: string[] = [];
  chart: any = null;
  params = {
    type: "month",
    startTime: "",
    endTime: ""
  };
  timeRange: any = "";
  option: any = {
    tooltip: {
      trigger: "axis",
      // 提示背景颜色，默认为透明度为0.7的黑色
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985"
        }
      }
    },
    legend: {
      data: ["登录人数"]
    },
    grid: {
      left: "0%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: "category",
      // boundaryGap: false,
      data: []
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "登录人数",
        type: "line",
        smooth: true,
        data: [],
        areaStyle: {},
        itemStyle: {
          normal: {
            color: "rgb(124, 181, 236)",
            lineStyle: {
              color: "rgb(124, 181, 236)"
            }
          }
        }
      }
    ]
  };
  created() {
    this.initTimeY();
    this.getjob();
    this.getUser();
    this.getLogin();
  }
  mounted() {}
  //@ts-ignore
  beforeRouteLeave(to, from, next) {
    next();
  }
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startTime = time[0];
      this.params.endTime = time[1];
    } else {
      this.params.type = "month";
      // this.params.startTime = get7DaysBefore();
      // this.params.endTime = getNow();
      this.initTimeY();
    }
    this.getLogin();
  }
  // initTimeZ() {
  //   this.params.endTime = getNow();
  //   this.params.startTime = get7DaysBefore();
  //   this.getLogin();
  // }
  initTimeY() {
    var date = new Date();
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay: any = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    var n = new Date(nextMonthFirstDay - oneDay).getFullYear();
    var y = date.getMonth() + 1;
    var r = new Date(nextMonthFirstDay - oneDay).getDate();
    this.params.startTime = n + "-" + y + "-" + "01" + " " + "00:00:00";
    this.params.endTime = n + "-" + y + "-" + r + " " + "23:59:59";
    this.getLogin();
  }
  initTimeN() {
    var date = new Date();
    date.getFullYear();
    this.params.startTime =
      date.getFullYear() + "-" + "01" + "-" + "01" + " " + "00:00:00";
    this.params.endTime =
      date.getFullYear() + "-" + "12" + "-" + "31" + " " + "23:59:59";
    this.getLogin();
  }
  getjob() {
    Job.queryBasicSituationJob().then(res => {
      if (res.code === 0) {
        this.basicInfo.recruitNumber = res.data.recruitNumber || "0";
        this.basicInfo.bookingNumber = res.data.bookingNumber || "0";
      }
    });
  }
  getUser() {
    User.queryBasicSituationUser().then(res => {
      if (res.code === 0) {
        this.basicInfo.userCount = res.data.userCount || "0";
        this.basicInfo.orgCount = res.data.orgCount || "0";
      }
    });
  }
  getLogin() {
    let data = { ...this.params };
    User.latelyLoginUserStatistic({ data }).then(res => {
      this.option.xAxis.data = [];
      this.option.series[0].data = [];
      if (res.code === 0 && res.data.length > 0) {
        res.data.forEach((i: any) => {
          this.option.xAxis.data.push(i.time);
          this.option.series[0].data.push(i.loginuser);
        });
      }
      console.log(this.option.series[0].data);
      this.changeCharts();
    });
  }
  changeCharts() {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("charts"));
    // 绘制图表
    myChart.setOption(this.option);
  }
  link(e: number) {
    if (e === 1) {
      this.$router.push({
        path: "/user/reg"
      });
    } else if (e === 2) {
      this.$router.push({
        path: "/org/org"
      });
    } else if (e === 3) {
      this.$router.push({
        path: "/work/work"
      });
    } else if (e === 4) {
      this.$router.push({
        path: "/work/booking"
      });
    }
  }
  exportFn() {
    window.open(`${User.exportBasicProfile()}?token=${this.$store.state.userInfo.token}`)
  }
}
</script>
<style lang="scss" scoped>
.basic {
  position: relative;
  .export {
    cursor: pointer;
    position: absolute;
    top: -40px;
    left: 85px;
    color: #42B983;
    .dachu-icon {
      width: 14px;
      height: 14px;
      float: left;
      margin-top: 2px;
      margin-right: 4px;
    } 
  }
  .bg-purple {
    background-repeat: no-repeat;
    border-left: 6px solid;
    box-shadow:0px 1px 5px 0px rgba(0, 0, 0, 0.18);
  }
  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    border-radius: 3px;
  }
  .h3-title {
    line-height: 60px;
    border-bottom: 1px solid #dcdcdc;
  }
  .logined{
    padding: 0 20px 20px 20px;
    background: #fff;
  }
  .grid-content {
    border-radius: 3px;
    min-height: 150px;
    color: #666;
    background: no-repeat;
    background-position-x: calc(100% - 10px);
    background-position-y: calc(100% - 3px);
    background-color: #fff;
    .menu-icon{
      width: 44px;
      height: 44px;
      margin-top: 50px;
      margin-left: 15%;
      margin-right: 5%;
      float: left;
    }
    ul {
      float: left;
      margin-left: 4%;
      .money {
        cursor: pointer;
        font-size: 44px;
        padding-top: 30px;
      }
      .txt {
        color: #999;
      }
    }
  }
  .userBg {
    border-color: #6B76C5;
    background-image: url(../../../../img/index/4.png);
  }
  .orgBg {
    border-color: #3BC7CF;
    background-image: url(../../../../img/index/1.png);
  }
  .jobBg {
    border-color: #F5B546;
    background-image: url(../../../../img/index/3.png);
  }
  .jyBg {
    border-color: #28A4E2;
    background-image: url(../../../../img/index/2.png);
  }
  .active {
    color: #20a0ff;
    border: 1px solid #20a0ff;
    background-color: #ccecff;
  }
}
</style>
