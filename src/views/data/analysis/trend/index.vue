<template>
  <div class="basic">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="请选择时间段 : ">
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content bg-purple userBg">
          <ul>
            <li class="money">{{baidudata.PV}}
            </li>
            <li class='txt'>浏览量(PV)</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple orgBg">
          <ul>
            <li class="money">{{baidudata.UV}}
            </li>
            <li class='txt'>访客数(UV)</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple jobBg">
          <ul>
            <li class="money">{{baidudata.newUV}}
            </li>
            <li class='txt'>新访客数</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple jyBg">
          <ul>
            <li class="money">{{baidudata.newUVper}}
            </li>
            <li class='txt'>新访客比率</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple userBg">
          <ul>
            <li class="money">{{baidudata.IP}}
            </li>
            <li class='txt'>IP</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple userBg">
          <ul>
            <li class="money">{{baidudata.time}}
            </li>
            <li class='txt'>平均访问时长</li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <div id="charts" class="pd20" :style="{width: '100%', height: '400px'}"></div>
    <br>
    <el-row>
      <el-table header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="time" label="日期" min-width='120'>
        </el-table-column>
        <el-table-column prop="pv_count" label="浏览量(PV)" min-width='200'></el-table-column>
        <el-table-column prop="visitor_count" label="访客数(UV)" min-width="200" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="new_visitor_count" label="新访客数" min-width='120'></el-table-column>
        <el-table-column prop="new_visitor_ratio" label="新访客比率" min-width='180'> </el-table-column>
        <el-table-column prop="ip_count" label="IP数" min-width='120'>
        </el-table-column>
        <el-table-column prop="avg_visit_time" label="平均时长" min-width='160'>
        </el-table-column>
      </el-table>
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
require("echarts/lib/chart/line");
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
  option: any = {
    title: {
      text: ""
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985"
        }
      }
    },
    legend: {
      data: ["浏览量(PV)", "访问量(UV)"]
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
        data: []
      },
      {
        name: "访问量(UV)",
        type: "line",
        smooth: true,
        data: []
      }
    ]
  };
  chart: any = null;
  loading: boolean = false;
  params = { startDate: "", endDate: "" };
  baidudata = {
    PV: 0,
    UV: 0,
    newUV: 0,
    newUVper: "0%",
    IP: 0,
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
    this.getLine();
  }
  mounted() {}

  //@ts-ignore
  beforeRouteLeave(to, from, next) {
    this.chart && this.chart.destroy();
    next();
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
    Baidu.queryTrendAnalysisUp({ data })
      .then(res => {
        if (res.code === 0) {
          const _r = res.data.body.data[0].result;
          this.baidudata.PV = _r.sum[0][0];
          this.baidudata.UV = _r.sum[0][1];
          this.baidudata.newUV = _r.sum[0][2];
          this.baidudata.newUVper = _r.sum[0][3] + "%";
          this.baidudata.IP = _r.sum[0][4];
          this.baidudata.time = this.sec_to_time(_r.sum[0][5]);
          this.option.xAxis.data = [];
          this.option.series[0].data = [];
          _r.items[0].forEach((i: string[]) => {
            this.option.xAxis.data.push(i[0]);
            this.tableData.push({ time: i[0] });
          });
          _r.items[1].forEach((i: any, key: number) => {
            this.option.series[0].data.push(i[0]);
            this.option.series[1].data.push(i[1]);
            this.tableData[key].pv_count = i[0];
            this.tableData[key].visitor_count = i[1];
            this.tableData[key].new_visitor_count = i[2];
            this.tableData[key].new_visitor_ratio = i[3] + "%";
            this.tableData[key].ip_count = i[4];
            this.tableData[key].avg_visit_time = this.sec_to_time(i[5]);

            // console.log(i);
            // ii.pv_count = i[0];
            // ii.visitor_count = i[1];
            // ii.new_visitor_count = i[2];
            // ii.new_visitor_ratio = i[3] + "%";
            // ii.ip_count = i[4];
            // ii.avg_visit_time = this.sec_to_time(i[5]);
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
    border-radius: 4px;
    min-height: 136px;
    color: #efefef;
    background: no-repeat;
    background-position-x: calc(100% - 10px);
    background-position-y: calc(100% - 3px);

    ul {
      width: 80%;
      margin: auto;
      .money {
        font-size: 20px;
        padding-top: 20px;
        margin-bottom: 20px;
      }
    }
  }
  .txt {
    padding-top: 30px;
  }
  .userBg {
    background-color: rgb(248, 138, 110);
    background-image: url(../../../../img/index/4.png);
  }
  .orgBg {
    background-color: rgb(245, 181, 70);
    background-image: url(../../../../img/index/1.png);
  }
  .jobBg {
    background-color: rgb(59, 199, 207);
    background-image: url(../../../../img/index/3.png);
  }
  .jyBg {
    background-color: rgb(40, 161, 245);
    background-image: url(../../../../img/index/2.png);
  }
  .active {
    color: #20a0ff;
    border: 1px solid #20a0ff;
    background-color: #ccecff;
  }
}
</style>
