<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="姓名/手机号" v-model="params.query" class='w230' @keyup.13.native="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="设备" v-model="params.device" class='w150' @change="params.pageNum = 1; getList()" clearable @clear="params.device = ''">
            <el-option :key="i.id" v-for="i in deviceArr" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录时间段 : ">
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change="changeTime" header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column align="center" prop="photo" label="头像" width='80'>
          <template slot-scope="scope">
            <img class='img-bor1' :src="scope.row._photo" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="120"></el-table-column>
        <el-table-column prop="device" label="设备" min-width='80'>
          <template slot-scope='scope'>
            {{scope.row.device ===1 ? '手机' : '电脑'}}
          </template>
        </el-table-column>
        <el-table-column prop="loginAddress" label="地点" min-width='240'></el-table-column>
        <el-table-column prop="state" label="登录状态" min-width='100'>
          <template slot-scope='scope'>
            {{scope.row.state ===1 ? '在线' : '离线'}}
          </template>
        </el-table-column>
        <el-table-column prop="loginSite" label="登录站点" min-width='120'></el-table-column>
        <el-table-column prop="ip" label="登录ip" min-width='120'>
        </el-table-column>
        <el-table-column sortable='custom' prop="loginTimeStr" label="登录时间" width='170'>
        </el-table-column>
      </el-table>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item label="">
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
/*
 module:
    最近登录
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-20:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import User from "@api/user";
import { State } from "vuex-class";
//https://github.com/ktsn/vuex-class
@Component({})
export default class RecentlyLogin extends Vue {
  time: string[] = [];
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    startTime: "",
    endTime: "",
    device: "",
    sortField: "loginTime",
    sortBy: false
  };
  deviceArr: any[] = [
    {
      id: 1,
      text: "手机"
    },
    {
      id: 2,
      text: "电脑"
    }
  ];
  total: number = 0;
  loading: boolean = false;
  tableData: any[] = [];
  @State("configData") configData: any;
  created() {
    this.getList();
  }
  changeTime() {
    this.params.sortBy = !this.params.sortBy;
    this.params.pageNum = 1;
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.params.pageNum = 1;
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.device || this.params.query || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    User.recentlyLoginList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            if (i.photo) {
              if (i.photo.includes("http")) {
                i._photo = i.photo;
              } else {
                i._photo =
                  this.configData.imgDomain + i.photo + this.$imgSize["30x30"];
              }
            } else {
              i._photo = require("@/img/common/userp.svg");
            }
            i.loginTimeStr = this.$formatDate(i.loginTime);
            if (i.province) {
              i.loginAddress = i.province;
              if (i.city) {
                i.loginAddress = i.province + i.city;
                if (i.district) {
                  i.loginAddress = i.province + i.city + i.district;
                  if (i.street) {
                    i.loginAddress = i.province + i.city + i.district + i.street;
                  }
                }
              }
            } else {
              i.loginAddress = "";
            }
          });

          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
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
}
</script>
<style lang="scss" scoped>
</style>
