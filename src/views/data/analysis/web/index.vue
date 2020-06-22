<template>
  <div class="web">
    <div>
      <el-radio-group v-model="skyNumber" style="margin-bottom: 30px;" size="mini" @change="getSkyNumber">
        <el-radio-button label="today">今天</el-radio-button>
        <el-radio-button label="yesterday">昨天</el-radio-button>
        <el-radio-button label="seven">最近7天</el-radio-button>
        <el-radio-button label="thirty">最近30天</el-radio-button>
      </el-radio-group>
    </div>
    <div class="web_map_left">
      <h3 class="h3-title">趋势图</h3>
      <el-row>
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;" size="mini" @change="getLogin">
          <el-radio-button label="PV">浏览量(PV)</el-radio-button>
          <el-radio-button label="UV">访客数(UV)</el-radio-button>
        </el-radio-group>
      </el-row>
      <div id="charts" class="pd20" v-loading="loading" :style="{width: '100%', height: '400px'}"></div>
    </div>

    <div class="web_visit_right">
      <h3 class="h3-title">新老访客</h3>
      <el-row class="pd20" :gutter="24" style="margin: 0;">
        <el-col :span="8" style="padding:0;">
          <div class="grid-content bg-purple userBg">
            <ul>
              <!-- <li class="money">{{basicInfo.userCount}}个
            </li>
            <li class='txt'>用户</li> -->
            </ul>
          </div>
        </el-col>
        <el-col :span="8" style="padding:0;">
          <div class="grid-content bg-purple orgBg">
            <ul>
              <li class="money">新访客</li>
              <li class="txt">{{newVisitor.ratio}}%</li>
            </ul>
          </div>
        </el-col>
        <el-col :span="8" style="padding:0;">
          <div class="grid-content bg-purple jobBg">
            <ul>
              <li class="money">老访客</li>
              <li class="txt1">{{oldVisitor.ratio}}%</li>
            </ul>
          </div>
        </el-col>
      </el-row>
      <br />
      <br />
      <div class="tab_visitor">
        <ul class="tab_visitor_title">
          <li>浏览量</li>
          <li>访客数</li>
          <li>跳出率</li>
          <li>平均访问时长</li>
          <li>平均访问页数</li>
        </ul>
        <ul class="tab_visitor_title">
          <li>{{newVisitor.pv_count}}</li>
          <li>{{newVisitor.visitor_count}}</li>
          <li>{{newVisitor.bounce_ratio}}%</li>
          <li>{{newVisitor.avg_visit_time}}</li>
          <li>{{newVisitor.avg_visit_pages}}</li>
        </ul>
        <ul class="tab_visitor_title">
          <li>{{oldVisitor.pv_count}}</li>
          <li>{{oldVisitor.visitor_count}}</li>
          <li>{{oldVisitor.bounce_ratio}}%</li>
          <li>{{oldVisitor.avg_visit_time}}</li>
          <li>{{oldVisitor.avg_visit_pages}}</li>
        </ul>
        <div style="clear: both"></div>
      </div>
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
import { Component, Vue } from "vue-property-decorator";
import Baidu from "@api/baidu";

// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入折线图组件
require("echarts/lib/chart/line");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
import { get7DaysBefore, getNow } from "@utils/index";

Component.registerHooks(["beforeRouteLeave"]);

//https://github.com/ktsn/vuex-class
@Component({})
export default class Landing extends Vue {
  newVisitor: any = {
    pv_count: "-",
    visitor_count: "-",
    bounce_ratio: "-",
    avg_visit_time: "-",
    avg_visit_pages: "-",
    ratio: "-"
  };
  oldVisitor: any = {
    pv_count: "-",
    visitor_count: "-",
    bounce_ratio: "-",
    avg_visit_time: "-",
    avg_visit_pages: "-",
    ratio: "-"
  };
  loading: boolean = false;
  tabPosition: string = "PV";
  skyNumber: string = "seven";
  basicInfo = {
    new: 0,
    newper: "0%",
    oldper: "0%",
    old: 0
  };
  time: string[] = [];
  chart: any = null;
  params: any = {
    metrics: "pv_count",
    startDate: get7DaysBefore(false),
    endDate: getNow(false)
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
      data: ["浏览量(PV)"]
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
        name: "浏览量(PV)",
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
    this.getLogin();
    this.getOldNew();
  }
  mounted() {}
  beforeRouteLeave(to: any, from: any, next: any) {
    this.chart && this.chart.destroy();
    next();
  }
  sec_to_time(s: any) {
    var t;
    if (s > -1) {
      var hour = Math.floor(s / 3600);
      var min = Math.floor(s / 60) % 60;
      var sec = s % 60;
      if (hour < 10) {
        t = "0" + hour + ":";
      } else {
        t = hour + ":";
      }

      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec.toFixed();
    }
    //@ts-ignore
    return t;
  }
  getOldNew(type: string = "new") {
    let data = { ...this.params };
    type === `new` ? (data.visitor = `new`) : (data.visitor = `old`);
    delete data.metrics;
    return Baidu.queryNewOldPeople({ data }).then(res => {
      if (res.code === 0) {
        const _r = res.data.body.data[0].result;
        if (type === `new`) {
          this.newVisitor = _r.newVisitor;
          this.oldVisitor = _r.oldVisitor;
          this.newVisitor.avg_visit_time = this.sec_to_time(
            _r.newVisitor.avg_visit_time
          );
          this.oldVisitor.avg_visit_time = this.sec_to_time(
            _r.oldVisitor.avg_visit_time
          );
        }
      }
    });
  }
  getSkyNumber(): void {
    switch (this.skyNumber) {
      case "today":
        this.initTimeT();
        break;
      case "yesterday":
        this.initTimeZT();
        break;
      case "seven":
        this.initTimeZ();
        break;
      case "thirty":
        this.initTimeY();
        break;
      default:
        break;
    }
    this.getOldNew();
  }
  // 今天
  initTimeT() {
    let d = getNow(false);
    this.params.startDate = d;
    this.params.endDate = d;
    this.getLogin();
  }
  // 昨天
  initTimeZT() {
    var date = new Date();
    var oneDay = 1000 * 60 * 60 * 24;
    var timestamp = date.getTime() - oneDay;
    var yesterday = new Date(timestamp);
    var n = yesterday.getFullYear();
    var y = (yesterday.getMonth() + 1) < 10 ? `0${yesterday.getMonth() + 1}` : yesterday.getMonth() + 1;
    var r = yesterday.getDate() < 10 ? `0${yesterday.getDate()}` : yesterday.getDate();
    this.params.startDate = n + "" + y + "" + r;
    this.params.endDate = n + "" + y + "" + r;
    this.getLogin();
  }
  // 周
  initTimeZ() {
    this.params.endDate = getNow(false);
    this.params.startDate = get7DaysBefore(false);
    this.getLogin();
  }
  // 月
  initTimeY() {
    this.params.endDate = getNow(false);
    this.params.startDate = get7DaysBefore(false, new Date(), 30);
    this.getLogin();
  }
  // 获取趋势图
  getLogin() {
    // if (this.loading) return;
    this.loading = true;
    if (this.tabPosition === "PV") {
      this.option.legend.data = "浏览量(PV)";
      this.option.series[0].name = "浏览量(PV)";
      this.params.metrics = `pv_count`;
    } else {
      this.option.legend.data = "访客数(UV)";
      this.option.series[0].name = "访客数(UV)";
      this.params.metrics = `visitor_count`;
    }

    let data = { ...this.params };
    Baidu.getTimeTrendRpt({ data })
      .then(res => {
        if (res.code === 0) {
          this.loading = true;
          this.option.xAxis.data = [];
          this.option.series[0].data = [];
          // 时间日期
          let times = res.data.body.data[0].result.items[0];
          // 人数
          let num = res.data.body.data[0].result.items[1];
          if (res.code === 0 && times.length > 0) {
            times.forEach((m: any, key: number) => {
              this.option.xAxis.data.push(m[0]);
              this.option.series[0].data.push(num[key][0]);
              // this.option.series[0].data.push(
              //   parseInt(Math.random() * 300 + 20)
              // );
            });
          }
          this.changeCharts();
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
  }
  changeCharts() {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("charts"));
    // 绘制图表
    myChart.setOption(this.option);
  }
}
</script>
<style lang="scss" scoped>

.tab_visitor {
  background-color: #fff;
  width: 100%;
  text-align: center;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
  .tab_visitor_title {
    width: 33.3%;
    float: left;
    border-right: 1px solid #ccc;
    li {
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
    }
  }
}
.web {
  /eddp/ .el-col-8 {
    padding: 0 !important;
  }
  .bg-purple {
    background-repeat: no-repeat;
  }
  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    border-radius: 4px;
  }
  .h3-title {
    line-height: 60px;
    // border-bottom: 1px solid #dcdcdc;
  }
  .grid-content {
    // border-radius: 4px;
    min-height: 136px;
    // color: #efefef;
    background: no-repeat;
    background-position-x: calc(100% - 10px);
    background-position-y: calc(100% - 3px);
    ul {
      width: 80%;
      margin: auto;
      .money {
        font-size: 16px;
        padding-top: 20px;
        margin-bottom: 10px;
      }
      .txt {
        font-size: 30px;
        color: #48cb6d;
      }
      .txt1 {
        font-size: 30px;
        color: #51a8f9;
      }
    }
  }
  .userBg {
    // background-color: rgb(248, 138, 110);
    // background-image: url(../../../../img/index/4.png);
    background-image: url("https://tongji.baidu.com/web/css/decorator/visit-type-icon.png");
    background-position: center;
  }
  .orgBg {
    border-left: 1px solid #ccc;
    // background-color: rgb(245, 181, 70);
    // background-image: url(../../../../img/index/1.png);
  }
  .jobBg {
    border-left: 1px solid #ccc;
    // background-color: rgb(59, 199, 207);
    // background-image: url(../../../../img/index/3.png);
  }
  .active {
    color: #20a0ff;
    border: 1px solid #20a0ff;
    background-color: #ccecff;
  }
}
</style>
