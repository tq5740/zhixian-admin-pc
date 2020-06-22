<template>
  <div class="region">
    <el-row>
      <el-radio-group v-model="dayStr" style="margin-bottom: 30px;" size="mini" @change="changeDay">
        <el-radio-button label="today">今天</el-radio-button>
        <el-radio-button label="yesterday">昨天</el-radio-button>
        <el-radio-button label="seven">最近7天</el-radio-button>
        <el-radio-button label="thirty">最近30天</el-radio-button>
      </el-radio-group>
      <el-form :inline="true">
        <el-form-item label="请选择时间段 : ">
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <div id="map"></div>
      <div class="fl list">
        <el-table header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
          <el-table-column prop="province" label="省份" min-width='240'>
          </el-table-column>
          <el-table-column prop="pv" label="浏览量(PV)" min-width='200'></el-table-column>
          <el-table-column prop="per" label="占比" min-width='140'>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <br>
    <br>
    <div>
      <el-table :data="tableData5" style="width: 100%" @expand-change="open">
        <el-table-column type="expand">
          <template slot-scope="scope" v-if="isShow">
            <el-table :data="scope.row.children" style="width: 100%" :show-header="false">
              <el-table-column label="地域" prop="province"></el-table-column>
              <el-table-column label="浏览量(PV)" prop="pv"></el-table-column>
              <el-table-column label="访客数(UV)" prop="uv"></el-table-column>
              <el-table-column label="IP数" prop="IP"></el-table-column>
              <el-table-column label="跳出率" prop="bounce_ratio"></el-table-column>
              <el-table-column label="平均访问时长" prop="avg_visit_time"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="地域" prop="province"></el-table-column>
        <el-table-column label="浏览量(PV)" prop="pv"></el-table-column>
        <el-table-column label="访客数(UV)" prop="uv"></el-table-column>
        <el-table-column label="IP数" prop="IP"></el-table-column>
        <el-table-column label="跳出率" prop="bounce_ratio"></el-table-column>
        <el-table-column label="平均访问时长" prop="avg_visit_time"></el-table-column>
      </el-table>
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
require("echarts/map/js/china.js");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

import { Component, Vue } from "vue-property-decorator";
import Baidu from "@api/baidu";
import Highmaps from "highcharts/modules/map";
import { get7DaysBefore, getNow } from "@utils/index";

//@ts-ignore
const mapdata = require(`@utils/map.json`);

//https://github.com/ktsn/vuex-class
@Component({})
export default class Region extends Vue {
  tableData5: any = [];
  tableData6: any = [];
  index: number = 0;
  isShow: boolean = true;
  dayStr: string = "today";
  chart: any = null;
  params = {
    startDate: this._getnow(),
    endDate: this._getnow(),
    viewType: "city"
  };
  loading: boolean = false;
  tableData: any[] = [];
  time: string[] = [];
  option: any = {
    title: {
      // 是否显示
      show: true,
      // 主标题文本，'\n'指定换行
      text: "浏览量（PV）",
      // 水平安放位置，默认为左侧，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
      x: "center",
      // 垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
      y: "top"
    },
    // 工具提示
    tooltip: {
      // 显示策略，可选为：true（显示） | false（隐藏）
      show: true,
      // tooltip主体内容显示策略，只需tooltip触发事件或显示axisPointer而不需要显示内容时可配置该项为false
      showContent: true,
      // 触发类型，默认数据触发，见下图，可选为：'item' | 'axis'
      trigger: "item",
      // 位置指定，传入{Array}，如[x, y]， 固定位置[x, y]；传入{Function}，如function([x, y]) {return [newX,newY]}，默认显示坐标为输入参数，用户指定的新坐标为输出返回。
      // position: getTooltipPosition(0,0),
      // 内容格式器：{string}（Template） | {Function}，支持异步回调
      /*formatter: function(data){
                        console.log(data);
                        return data[1]+"："+data[5].count;
                    }*/
      // 拖拽重计算独有，数据孤岛内容格式器：{string}（Template） | {Function}，见表格下方
      // islandFormatter:
      // 显示延迟，添加显示延迟可以避免频繁切换，特别是在详情内容需要异步获取的场景，单位ms
      showDelay: 0,
      // 隐藏延迟，单位ms
      hideDelay: 0,
      // 动画变换时长，单位s，如果你希望tooltip的跟随实时响应，showDelay设置为0是关键，同时transitionDuration设0也会有交互体验上的差别。
      transitionDuration: 0,
      // 鼠标是否可进入详情气泡中，默认为false，如需详情内交互，如添加链接，按钮，可设置为true。
      //enterable: false,
      // 提示背景颜色，默认为透明度为0.7的黑色
      backgroundColor: "rgba(0,0,0,0.5)",
      // 提示边框颜色
      borderColor: "#FF7F50",
      // 提示边框圆角，单位px，默认为4
      borderRadius: 10,
      // 提示边框线宽，单位px，默认为0（无边框）
      borderWidth: 2,
      // 提示内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距，同css
      padding: [15, 15, 15, 15],

      // 文本样式，默认为白色字体
      textStyle: {
        // 颜色
        color: "#FF7F50",
        // 水平对齐方式，可选为：'left' | 'right' | 'center'
        align: "left",
        // 垂直对齐方式，可选为：'top' | 'bottom' | 'middle'
        baseline: "bottom",
        // 字体系列
        fontFamily: "Arial, 宋体, sans-serif",
        // 字号 ，单位px
        fontSize: 20,
        // 样式，可选为：'normal' | 'italic' | 'oblique'
        fontStyle: "italic",
        // 粗细，可选为：'normal' | 'bold' | 'bolder' | 'lighter' | 100 | 200 |... | 900
        fontWeight: "normal"
      }
    },
    // 工具箱，每个图表最多仅有一个工具箱
    toolbox: {},
    // 缩放漫游组件，仅对地图有效
    roamController: {
      // 显示策略，可选为：true（显示） | false（隐藏）
      show: true,
      // 水平安放位置，默认为左侧，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
      x: "right",
      // 垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
      y: "top",
      // 指定宽度，决定4向漫游圆盘大小，可指定 {number}（宽度，单位px）
      width: 120,
      // 指定高度，缩放控制键默认会在指定高度的最下方最大化显示，可指定 {number}（高度，单位px）
      height: 200,
      // 缩放漫游组件背景颜色，默认透明
      backgroundColor: "rgba(0,0,0,0.1)",
      // 缩放漫游组件边框颜色
      borderColor: "#1e90ff",
      // 缩放漫游组件边框线宽，单位px，默认为0（无边框）
      borderWidth: 1,
      // 缩放漫游组件内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距，同css
      padding: [15, 15, 15, 15],
      // 漫游组件文字填充颜色
      fillerColor: "#000",
      // 控制手柄主体颜色
      handleColor: "#e3655a",
      // 4向漫游移动步伐，单位px
      step: 10,
      // 必须，指定漫游组件可控地图类型
      mapTypeControl: {
        china: true
      }
    },
    series: [
      {
        // 图表类型，必要参数！如为空或不支持类型，则该系列数据不被显示。可选为：
        // 'line'（折线图） | 'bar'（柱状图） | 'scatter'（散点图） | 'k'（K线图）
        // 'pie'（饼图） | 'radar'（雷达图） | 'chord'（和弦图） | 'force'（力导向布局图） | 'map'（地图）
        type: "map",
        // 系列名称
        name: "浏览量（PV）",
        // 地图类型，支持world，china及全国34个省市自治区
        mapType: "china",
        // 是否开启滚轮缩放和拖拽漫游,默认为false（关闭），其他有效输入为true（开启），'scale'（仅开启滚轮缩放），'move'（仅开启拖拽漫游）
        roam: true,
        // 图形样式
        itemStyle: {
          // 默认状态下地图的文字
          normal: { label: { show: false } },
          // 鼠标放到地图上面显示文字
          emphasis: { label: { show: true } }
        },
        data: []
      }
    ]
  };
  created() {
    this.getData();
  }
  //@ts-ignore
  beforeRouteLeave(to, from, next) {
    this.chart && this.chart.destroy();
    next();
  }
  open(e: any, i: any): void {
    if (i && !this.tableData5[e.index].children) {
      this.isShow = false;
      this.index = e.index;
      let data = { ...this.params, area: e.area };
      Baidu.queryCityRegionalDistribution({ data })
        .then(res => {
          if (res.code === 0) {
            let _r = res.data.body.data[0].result.items;
            let arr: any = [];
            _r[0].forEach((i: any, k: any) => {
              arr.push({
                province: i[0].name,
                pv: _r[1][k][0],
                uv: _r[1][k][1],
                IP: _r[1][k][2],
                bounce_ratio: _r[1][k][3] + "%",
                avg_visit_time: this.sec_to_time(_r[1][k][4]),
                area: i[0].area
              });
            });
            this.tableData5[e.index].children = arr;
          }
        })
        .finally(() => {
          this.isShow = true;
        });
    }
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
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startDate = time[0].split(" ")[0].replace(/-/g, "");
      this.params.endDate = time[1].split(" ")[0].replace(/-/g, "");
    } else {
      this.dayStr = "today";
      this.changeDay(`today`);
    }
    this.getData();
  }
  _getnow() {
    return getNow()
      .split(" ")[0]
      .replace(/-/g, "");
  }
  changeDay(e: any) {
    switch (e) {
      case `today`:
        this.params.startDate = this._getnow();
        this.params.endDate = this._getnow();
        break;
      case `yesterday`:
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
        break;

      case `seven`:
        this.params.startDate = get7DaysBefore()
          .split(" ")[0]
          .replace(/-/g, "");
        this.params.endDate = getNow()
          .split(" ")[0]
          .replace(/-/g, "");
        break;
      case `thirty`:
        this.params.endDate = getNow(false);
        this.params.startDate = get7DaysBefore(false, new Date(), 30);
        break;
    }
    this.getData();
  }
  getData() {
    let data = { ...this.params };
    this.loading = true;
    Baidu.queryGeographicalDistributionUp({ data })
      .then(res => {
        if (res.code === 0) {
          let _r = res.data.body.data[0].result.items;
          let data: any[] = [];
          this.tableData = [];
          _r[0].forEach((i: any, k: number) => {
            if (i[0] === "四川") {
              data.push({
                name: i[0],
                value: _r[1][k][0],
                selected: true
              });
            } else {
              data.push({
                name: i[0],
                value: _r[1][k][0]
              });
            }
            this.tableData.push({
              province: i[0],
              pv: _r[1][k][0],
              per: _r[1][k][1] + "%"
            });
          });
          this.option.series[0].data = data;
          this.drawLine();
        }
      })
      .finally(() => {
        this.loading = false;
      });
    Baidu.queryGeographicalDistributionDown({ data }).then(res => {
      if (res.code === 0) {
        let _r = res.data.body.data[0].result.items;
        this.tableData5 = [];
        _r[0].forEach((i: any, k: any) => {
          this.tableData5.push({
            province: i[0].name,
            pv: _r[1][k][0],
            uv: _r[1][k][1],
            IP: _r[1][k][2],
            bounce_ratio: _r[1][k][3] + "%",
            avg_visit_time: this.sec_to_time(_r[1][k][4]),
            area: i[0].area,
            index: k
          });
        });
      }
    });
  }
  drawLine(): void {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById("map"));
    // 绘制图表
    myChart.setOption(this.option);
  }
}
</script>
<style lang="scss">
.region {
  overflow: hidden;
  #map {
    float: left;
    width: 50%;
    height: 450px;
  }
  .list {
    width: 49%;
    height: 450px;
    overflow-y: auto;
  }
  .el-table__expanded-cell {
    padding-right: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
