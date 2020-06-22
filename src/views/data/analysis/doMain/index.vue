<template>
  <div class="basic">
    <el-row>
      <el-radio-group v-model="dayStr" style="margin-bottom: 30px;" size="mini" @change="changeDay">
        <!-- <el-radio-button label="yesterday">昨天</el-radio-button> -->
        <el-radio-button label="seven">最近7天</el-radio-button>
        <el-radio-button label="thirty">最近30天</el-radio-button>
      </el-radio-group>
      <el-form :inline="true">
        <el-form-item label="请选择时间段 : ">
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="grid-content bg-purple userBg">
          <ul>
            <li class="money">{{baidudata.PV}}
            </li>
            <li class='txt'>浏览量(PV)</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple orgBg">
          <ul>
            <li class="money">{{baidudata.UV}}
            </li>
            <li class='txt'>访客数(UV)</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple userBg">
          <ul>
            <li class="money">{{baidudata.IP}}
            </li>
            <li class='txt'>IP</li>
          </ul>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="grid-content bg-purple jyBg">
          <ul>
            <li class="money">{{baidudata.jump}}
            </li>
            <li class='txt'>跳出率</li>
          </ul>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="grid-content bg-purple userBg">
          <ul>
            <li class="money">{{baidudata.time}}
            </li>
            <li class='txt'>平均停留时长</li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-table header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="domain" label="域名" min-width='240'>
        </el-table-column>
        <el-table-column prop="pv_count" label="浏览量(PV)" min-width='200'></el-table-column>
        <el-table-column prop="ip_count" label="IP数" min-width='140'>
        </el-table-column>
        <el-table-column prop="jump" label="跳出率" min-width="120" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column prop="avg_visit_time" label="平均停留时长" min-width='180'>
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
import { Component, Vue } from "vue-property-decorator";
import Baidu from "@api/baidu";
import Highcharts from "highcharts";
import { get7DaysBefore, getNow } from "@utils/index";
require("highcharts/modules/exporting")(Highcharts);
Component.registerHooks(["beforeRouteLeave"]);
//https://github.com/ktsn/vuex-class
@Component({})
export default class Domain extends Vue {
  baidudata = {
    PV: 0,
    UV: 0,
    IP: 0,
    jump: "0%",
    time: `00:00:00`
  };
  dayStr = "seven";
  tableData: any[] = [];
  loading: boolean = false;
  params = {
    startDate: "",
    endDate: "",
    source: "through"
  };
  time: string[] = [];
  created() {
    this.changeDay(`seven`);
    this.getData();
  }

  changeDay(e: any) {
    switch (e) {
      case `yesterday`:
        var date = new Date();
        var oneDay = 1000 * 60 * 60 * 24;
        var timestamp = date.getTime() - oneDay;
        var yesterday = new Date(timestamp);
        var n = yesterday.getFullYear();
        var y = (yesterday.getMonth() + 1) < 10 ? `0${yesterday.getMonth() + 1}` : yesterday.getMonth() + 1;
        var r =
          yesterday.getDate() < 10
            ? "0" + yesterday.getDate()
            : yesterday.getDate();
        this.params.startDate = n + "" + y + "" + r;
        this.params.endDate = getNow(false);
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
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startDate = time[0].split(" ")[0].replace(/-/g, "");
      this.params.endDate = time[1].split(" ")[0].replace(/-/g, "");
    } else {
      this.dayStr = `seven`;
      this.changeDay("seven");
    }
    this.getData();
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
  getData() {
    let data = { ...this.params };
    this.loading = true;
    Baidu.queryVisitedDomainName({ data })
      .then(res => {
        if (res.code === 0) {
          let _r = res.data.body.data[0].result;
          _r.sum[0][3] = _r.sum[0][3] + "%";
          _r.sum[0][4] = this.sec_to_time(_r.sum[0][4]);
          Object.keys(this.baidudata).forEach((i: any, key: number) => {
            //@ts-ignore
            this.baidudata[i] = _r.sum[0][key];
          });
          _r.items[0].forEach((i: any, k: number) => {
            this.tableData.push({
              domain: i[0].name,
              domainId: i[0].domainId
            });
          });
          _r.items[1].forEach((i: any, k: number) => {
            this.tableData[k].pv_count = i[0];
            this.tableData[k].ip_count = i[2];
            this.tableData[k].visitor_count = i[1];
            this.tableData[k].jump = i[3] + "%";
            this.tableData[k].avg_visit_time = this.sec_to_time(i[4]);
          });
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
