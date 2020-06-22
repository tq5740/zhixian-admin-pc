<template>
  <div class="basic">
    <div>
      <el-radio-group v-model="skyNumber" style="margin-bottom: 30px;" size="mini" @change="getSkyNumber">
        <el-radio-button label="today">今天</el-radio-button>
        <el-radio-button label="yesterday">昨天</el-radio-button>
        <el-radio-button label="seven">最近7天</el-radio-button>
        <el-radio-button label="thirty">最近30天</el-radio-button>
      </el-radio-group>
      &nbsp;
      <el-radio-group v-model="params.client" style="margin-bottom: 30px;" size="mini" @change="getLine">
        <el-radio-button label="client_browser">浏览器</el-radio-button>
        <el-radio-button label="client_os">网络设备类型</el-radio-button>
        <el-radio-button label="client_isp">网络供应商</el-radio-button>
      </el-radio-group>
    </div>
    <el-row :gutter="24">
      <el-col :span="5">
        <div class="grid-content bg-purple userBg">
          <ul>
            <li class='money'>浏览量(PV)</li>
            <li class="txt">{{baidudata.PV}}
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple orgBg">
          <ul>
            <li class='money'>访客数(UV)</li>
            <li class="txt">{{baidudata.UV}}
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple orgBg">
          <ul>
            <li class='money'>IP</li>
            <li class="txt">{{baidudata.IP}}
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple orgBg">
          <ul>
            <li class='money'>跳出率</li>
            <li class="txt">{{baidudata.jump}}
            </li>
          </ul>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="grid-content bg-purple orgBg">
          <ul>
            <li class='money'>平均停留时长</li>
            <li class="txt">{{baidudata.time}}
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <el-row v-loading="loading">
      <div id="charts" :style="{width: '100%', height: '400px'}"></div>
      <br>
      <el-row>
        <el-table header-row-class-name="thead" :data="tableData" border element-loading-text="加载中...">
          <el-table-column prop="time" :label="titleTd[params.client]" min-width='120'>
          </el-table-column>
          <el-table-column prop="pv_count" label="浏览量(PV)" min-width='200'></el-table-column>
          <el-table-column prop="visitor_count" label="访客数(UV)" min-width="200" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column prop="ip_count" label="IP数" min-width='120'></el-table-column>
          <el-table-column prop="new_visitor_count" label="跳出率" min-width='120'></el-table-column>
          <!-- <el-table-column prop="new_visitor_ratio" label="新访客比率" min-width='180'> </el-table-column> -->
          <el-table-column prop="avg_visit_time" label="平均时长" min-width='160'>
          </el-table-column>
        </el-table>
      </el-row>
    </el-row>
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
require("echarts/lib/chart/bar");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

import { Component, Vue } from "vue-property-decorator";
import Baidu from "@api/baidu";
import { get7DaysBefore, getNow } from "@utils/index";
Component.registerHooks(["beforeRouteLeave"]);
//https://github.com/ktsn/vuex-class
@Component({})
export default class Trend extends Vue {
  skyNumber: string = "today";

  option: any = {
    color: ["#3398DB"],
    title: {
      text: ""
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: []
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
      axisTick: {
        alignWithLabel: true
      },
      data: []
    },
    yAxis: [
      {
        type: "value"
      }
    ],
    series: [
      {
        name: "浏览量(PV)",
        type: "bar",
        barWidth: 30, //柱图宽度
        data: []
      }
    ]
  };
  titleTd: any = {
    client_browser: "浏览器",
    client_os: "网络设备类型",
    client_isp: "网络供应商"
  };
  chart: any = null;
  loading: boolean = false;
  params = { startDate: "", endDate: "", client: "client_browser" };
  baidudata = {
    PV: 0,
    UV: 0,
    IP: 0,
    jump: "0%",
    time: `00:00:00`
  };
  time: string[] = [];
  timeArr = [
    {
      id: 1,
      text: `今天`
    },
    {
      id: 2,
      text: `昨天`
    },
    {
      id: 3,
      text: `最近七天`
    },
    {
      id: 4,
      text: `最近30天`
    }
  ];
  tableData: any[] = [];
  created() {
    this.initTimeT();
    // this.getLine();
  }
  mounted() {}

  //@ts-ignore
  beforeRouteLeave(to, from, next) {
    this.chart && this.chart.destroy();
    next();
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
  }
  // 今天
  initTimeT() {
    this.params.startDate = getNow(false);
    this.params.endDate = getNow(false);
    this.getLine();
  }
  // 昨天
  initTimeZT() {
    var date = new Date();
    var oneDay = 1000 * 60 * 60 * 24;
    var timestamp = date.getTime() - oneDay;
    var yesterday = new Date(timestamp);
    var n = yesterday.getFullYear();
    var y = (yesterday.getMonth() + 1) < 10 ? `0${yesterday.getMonth() + 1}` : yesterday.getMonth() + 1;
    var r =
      yesterday.getDate() < 10
        ? `0${yesterday.getDate()}`
        : yesterday.getDate();
    this.params.startDate = n + "" + y + "" + r;
    this.params.endDate = n + "" + y + "" + r;
    this.getLine();
  }
  // 周
  initTimeZ() {
    this.params.endDate = getNow(false);
    this.params.startDate = get7DaysBefore(false);
    this.getLine();
  }
  // 月
  initTimeY() {
    this.params.endDate = getNow(false);
    this.params.startDate = get7DaysBefore(false, new Date(), 30);
    this.getLine();
  }
  changeCharts() {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("charts"));
    // 绘制图表
    myChart.setOption(this.option);
  }
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startDate = time[0].split(" ")[0].replace(/-/g, "");
      this.params.endDate = time[1].split(" ")[0].replace(/-/g, "");
    } else {
      this.params.startDate = "";
      this.params.endDate = "";
    }
    this.getLine();
  }
  sec_to_time(s: number): string {
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
  getLine() {
    let data = { ...this.params };
    this.loading = true;
    Baidu.querySystemEnvironmentUp({ data })
      .then(res => {
        // if (res.code === 0) {
        //   const _r = res.data.body.data[0].result;
        //   this.baidudata.PV = _r.sum[0][0];
        //   this.baidudata.UV = _r.sum[0][1];
        //   this.baidudata.IP = _r.sum[0][2];
        //   this.baidudata.jump = _r.sum[0][3] + "%";
        //   this.baidudata.time = this.sec_to_time(_r.sum[0][4]);
        //   this.tableData = [];
        //   this.option.xAxis.data = [];
        //   this.option.series[0].data = [];
        //   _r.items[0].forEach((i: string[]) => {
        //     //@ts-ignore
        //     this.option.xAxis.data.push(i[0].name);
        //     //@ts-ignore
        //     this.tableData.push({ time: i[0].name });
        //   });
        //   _r.items[1].forEach((i: any, key: number) => {
        //     this.option.series[0].data.push(i[0]);
        //     this.tableData[key].pv_count = i[0];
        //     this.tableData[key].visitor_count = i[1];
        //     this.tableData[key].ip_count = i[2];
        //     this.tableData[key].new_visitor_count = i[3] + "%";
        //     this.tableData[key].avg_visit_time = this.sec_to_time(i[4]);
        //   });
        //   this.changeCharts();
        // }
        if (res.code === 0) {
          const _r = res.data.body.data[0].result;
          this.baidudata.PV = _r.sum[0][0];
          this.baidudata.UV = _r.sum[0][1];
          this.baidudata.IP = _r.sum[0][2];
          this.baidudata.jump = _r.sum[0][3] + "%";
          this.baidudata.time = this.sec_to_time(_r.sum[0][4]);
          this.tableData = [];
          this.option.xAxis.data = [];
          this.option.series[0].data = [];
          _r.items[0].forEach((i: string[]) => {
            //@ts-ignore
            this.option.xAxis.data.push(i[0].name);
            //@ts-ignore
            this.tableData.push({ time: i[0].name });
          });
          _r.items[1].forEach((i: any, key: number) => {
            this.option.series[0].data.push(i[0]);
            this.tableData[key].pv_count = i[0];
            this.tableData[key].visitor_count = i[1];
            this.tableData[key].ip_count = i[2];
            this.tableData[key].new_visitor_count = i[3] + "%";
            this.tableData[key].avg_visit_time = this.sec_to_time(i[4]);
          });
          this.changeCharts();
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
.basic {
  .bg-purple {
    background-repeat: no-repeat;
  }
  .el-row {
    margin-bottom: 20px;
  }

  .el-col {
    border-radius: 4px;
    // margin-left: 36px;
  }
  .h3-title {
    line-height: 60px;
    border-bottom: 1px solid #dcdcdc;
  }
  .grid-content {
    // border-radius: 4px;
    min-height: 136px;
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
      }
    }
  }
  .userBg {
    // background-color: rgb(248, 138, 110);
    // background-image: url(../../../../img/index/4.png);
  }
  .orgBg {
    border-left: 1px solid #ccc;
    // background-color: rgb(245, 181, 70);
    // background-image: url(../../../../img/index/1.png);
  }
  .jobBg {
    // background-color: rgb(59, 199, 207);
    // background-image: url(../../../../img/index/3.png);
  }
  .jyBg {
    // background-color: rgb(40, 161, 245);
    // background-image: url(../../../../img/index/2.png);
  }
  .active {
    color: #20a0ff;
    border: 1px solid #20a0ff;
    background-color: #ccecff;
  }
}
</style>
