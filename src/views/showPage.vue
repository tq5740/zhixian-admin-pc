<template>
  <div id="activity1">
    <h2 class="a1-title">“微就业”就近就业职位展示</h2>
    <div class="a1-content-box">
      <table class="a1-content">
        <tr class="a1-item-title">
          <td class="t1" style="width: 20%;">
            <p style="margin-left: 1rem">招聘职位</p>
          </td>
          <td class="t2" style="width: 10%">
            <p style="text-align: center">工作性质</p>
          </td>
          <td class="t3" style="width: 10%">
            <p style="text-align: center">招聘人数</p>
          </td>
          <td class="t4" style="width: 15%">
            <p style="text-align: center">薪资待遇</p>
          </td>
          <td class="t5" style="width: 12%">
            <p style="text-align: center">离我距离</p>
          </td>
          <td class="t6" style="width: 33%;">
            <p style="margin-left: 1rem">企业名称</p>
          </td>
        </tr>
        <tr class="a1-item-content" v-for="(item,index) in rollList" :key="index">
          <td class="t1">
            <p style="margin-left: 1rem">{{item.workTitle}}</p>
          </td>
          <td class="t2">
            <p style="text-align: center">{{workNature[item.workNature]}}</p>
          </td>
          <td class="t3">
            <p style="text-align: center">{{item.recruitNumber}}人</p>
          </td>
          <td class="t4">
            <p style="text-align: center">
              <span v-if="item.lowSalary == -1">面议</span>
              <span v-else>{{item.lowSalary, item.highSalary, item.salaryType}}</span>
            </p>
          </td>
          <td class="t5">
            <p style="text-align: center">{{formatDistance(item.distance)}}</p>
          </td>
          <td class="t6">
            <p style="margin-left: 1rem">{{item.org && item.org.orgName}}</p>
          </td>
        </tr>
      </table>
    </div>
    <div class="a1-foot">
      <div class="a1-foot-left">
        <p>就业安全 线上线下 就近就业</p>
        <p class="click-on-show" @click="isShowDialog=true; addressObj={}; addressStr = showAddress">当前位置：{{showAddress}}</p>
      </div>
      <div class="a1-foot-right">
        <p>查看更多职位信息<br>请扫描二维码</p>
        <div class="img-box">
          <img src="https://i.weijiuye.com.cn/default/cdwork/ewm_xcx.jpg" alt="">
          <img src="https://i.weijiuye.com.cn/default/cdwork/ewm_jy.png" alt="">
        </div>
      </div>
    </div>

    <el-dialog :close-on-click-modal="false" :title="'选择地址'" v-if="isShowDialog" :visible.sync="isShowDialog">
      <el-form>
        <el-form-item label="当前地址" :label-width="`80px`">
          <el-select v-model="addressStr" filterable clearable :filter-method="querySearchAsync" @change="getAddress" placeholder="请输入简略地址，并根据提示选择详细地址" class="w80per">
            <el-option v-for="item in addressOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" :label-width="`80px`">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button @click="isShowDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Work from "@api/job";
@Component({})
export default class ShowPage extends Vue {

  isShowDialog: boolean = false;
  workJobListData: any[] = [];
  rollList: any[] = [];
  imgDomain: any = this.$store.state.configData.imgDomain;
  pageSize: number = 50;
  pageNumber: number = 1;
  workNature: any[] = ["不限", "全职", "兼职", "实习"];
  lat: string = "30.657349";
  lng: string = "104.065837";
  addressStr: string = "成都市天府广场";
  addressObj: object = {};
  addressOptions: any[] = [];
  showAddress: string = "成都市天府广场";

  created() {
    if (window.localStorage.getItem("address")) {
      let address = window.localStorage.getItem("address");
      let obj = JSON.parse(address);
      this.addressStr = obj.addressStr;
      this.lat = obj.lat;
      this.lng = obj.lng;
      this.showAddress = obj.addressStr;
    };
    this.getWorkJobList(1);
    setInterval(() => {
      this.workJobListData.splice(0, 5);
      if (this.workJobListData.length < 1) {
        this.getWorkJobList(1,"clear");
      }
      this.rollList = this.workJobListData.slice(0, 5);
    }, 20000);
  }
  querySearchAsync(query) {
    if (!query) {
      this.addressOptions = [];
      this.addressStr = "";
    }
    let data = { key: 'VXUBZ-JL4CV-EXFPH-UVNCN-3VLP6-N2FZH', keyword: query, region: "四川", region_fix: 1, callbackName: 'QQmap', output: 'jsonp' }
    this.$jsonp("https://apis.map.qq.com/ws/place/v1/suggestion", data).then(res => {
      if (res.status == 0) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].value = res.data[i].address + "-" + res.data[i].title;
        }
        this.addressOptions = res.data;
      }
    })
  }
  getAddress() {
    let obj = {}; 
    obj = this.addressOptions.find((item)=>{
      return item.value === this.addressStr;
    });
    if (obj) {
      this.addressObj.address = obj.address || obj.title;
      this.addressObj.location = obj.location;
    }
  }
  onSubmit() {
    if (!this.addressObj.address) {
      return;
    }
    this.isShowDialog = false;
    this.addressStr = this.addressObj.address;
    this.showAddress = this.addressObj.address;
    this.lat = this.addressObj.location.lat;
    this.lng = this.addressObj.location.lng;
    let obj = {
      addressStr: this.addressStr,
      lat: this.lat,
      lng: this.lng
    }
    window.localStorage.setItem("address", JSON.stringify(obj));
    this.workJobListData = [];
    this.getWorkJobList(1);
  }
  //格式化距离
  formatDistance(distanceVal) {
    const distance = +distanceVal;
    if (distance >= 1) {
      return distance.toFixed(1) + "千米";
    } else if (distance > 0 && distance < 1) {
      return Math.round(distance * 1000) + "米";
    } else {
      return "0米";
    }
  }
  getWorkJobList(_pageNum: any,clear: string) {
    let data = {
      pageNum: _pageNum || this.pageNumber,
      pageSize: this.pageSize,
      sortField: "distance",
      lat: this.lat,
      lng: this.lng
    };
    Work.work_list({ data }).then(res => {
      if (res.code === 0) {
        if (res.data.result.length < 1) {
          this.$notify({
            title: "提示",
            message: "此地点周围暂未发现招聘，请尝试切换地点",
            type: "error"
          });
          return;
        }
        if (clear === "clear") {
          this.workJobListData = []
        }
        this.totalPageNumber = res.data.pages;
        this.workJobListData = this.workJobListData.concat(res.data.result);
        this.rollList = this.workJobListData.slice(0, 5);
        if (this.totalPageNumber !== 0) {
          ++this.pageNumber;
        }
      }
    });
  }
}
</script>
<style lang="scss" scoped>
  html {
    font-size: 10px;
  }
  #activity1 {
    background-color: #000 !important;
    position: relative;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    min-height: 100%;
    font-size: 3rem;
    color: #ef1919;
    font-weight: bold;
    overflow: hidden;
    .a1-title {
      font-weight: bold;
      letter-spacing: 0.8rem;
      font-size: 4.5rem;
      text-align: center;
      padding: 0.8rem 0 1rem 0;
    }
    .a1-content-box {
      width: 94%;
      margin: 0 auto;
      text-align: left;
    }
    .a1-content {
      table-layout: fixed;
      width: 100%;
      border: 0;
      border-collapse: collapse;
      border-spacing: 0;
    }
    .a1-content td {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 8px 5px;
      border: 2px solid #ef1919;
    }
    .a1-content td p {
      text-align: left;
      margin: 0.5rem 0;
    }
    .a1-item-content {
      color: #ff8400;
    }
    .a1-foot {
      display: flex;
      flex: 1;
      margin: 0 3%;
      justify-content: space-between;
      letter-spacing: 2px;
      font-size: 2.5rem;
      .a1-foot-left {
        margin-top: 2.5rem;
      }
      .a1-foot-right {
        width: 60rem;
        display: flex;
        justify-content: flex-end;
        p {
          color: #FF8400;
          text-align: right;
          line-height: 1.7em;
          margin-top: 2.5rem;
        }
        img {
          width: 10rem;
          height: 10rem;
          margin-left: 20px;
          margin-top: 1rem;
        }
      }
    }
  }
  .img-box {
    float: right;
  }
  .w80per {
    width: 80%;
  }
  .click-on-show {
    font-size: 2rem;
    cursor: pointer;
  }
</style>
