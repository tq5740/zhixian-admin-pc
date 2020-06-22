<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="职位名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="应聘方式" v-model="params.source" class='w150' @change="getList" clearable @clear="params.source = ''">
            <el-option :key="i.id" v-for="i in typesArr" :value="i.id" :label="i.text">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
            <el-option :key="i.id" v-for="i in $store.state.resumeStates" :value="i.id" :label="i.text">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change="changeTime" header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="userName" label="姓名" min-width="100"></el-table-column>
        <el-table-column prop="workTitle" label="所投职位" min-width="120"></el-table-column>
        <el-table-column prop="org.orgName" label="所投企业" min-width="180"></el-table-column>
        <el-table-column prop="phone" label="联系电话" min-width='120'></el-table-column>
        <el-table-column prop="salary" label="期望薪资" min-width='80'>
        </el-table-column>
        <el-table-column prop="birthDateStr" label="出生日期" width='120'></el-table-column>
        <el-table-column prop="highestEducationStr" label="学历" width='80'>
        </el-table-column>
        <el-table-column prop="startWorkYear" label="工作年份" width='80'>
        </el-table-column>
        <el-table-column prop="typeStr" label="应聘方式" width='80'>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" width='80'>
        </el-table-column>
        <el-table-column sortable='custom' prop="createTimeStr" label="创建时间" width='170'>
        </el-table-column>
        <el-table-column prop="" label="操作" width="80">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="see(scope.row)">简历</el-button>
          </template>
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
    <!-- width="35%" -->
    <el-dialog :close-on-click-modal="false" v-if="showBox" title="用户简历" :visible.sync="showBox" :before-close="close">
      <v-resume :bookingObj="bookingObj" @close="close" @okCB="okCB" :isFileList="isFileList"></v-resume>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    filelist
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-20:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import Booking from "@api/booking";

import { debounce } from "typescript-debounce-decorator";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "v-resume": () => import("@c/Vresume.vue")
  }
})
export default class FileList extends Vue {
  //筛选用
  time: string[] = [];
  params = {
    source: "",
    pageSize: 10,
    pageNum: 1,
    query: "",
    state: "",
    sortField: "updateTime",
    sortBy: false
  };
  tableData: any[] = [];

  typesArr: object[] = [
    {
      id: 1,
      text: "投递"
    },
    {
      id: 2,
      text: "搜索"
    }
  ];
  userId: string = "";
  total: number = 0;
  loading: boolean = false;
  showBox: boolean = false;
  isPending: boolean = false;
  isFileList: boolean = true;
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
    orgId: "",
    intentionId: ""
  };

  created() {
    this.getList();
  }

  changeTime() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  okCB() {
    this.close();
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
    e.state === 4 ? this.isFileList = false : this.isFileList = true;
    this.showBox = true;
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
    if (type !== 'type') {
      if (this.params.source || this.params.query || this.params.state) {
        this.params.pageNum = 1;
      }
    };
    let data = { ...this.params };
    Booking.bookingRecord({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
        }
        res.data.result.forEach((i: any) => {
          i.birthDateStr = i.birthDate ? this.$formatDate(i.birthDate).split(" ")[0] : '';
          i.createTimeStr = this.$formatDate(i.createTime);
          i.highestEducationStr = this.$mapTypeStr(
            i.education,
            this.$store.state.educationArr
          );
          i.typeStr = this.$mapTypeStr(i.source, this.typesArr);
          i.stateStr = this.$store.state.resumeStates[i.state - 1].text;
          i.startWorkYear = i.startWorkYear ? new Date().getFullYear() - i.startWorkYear + "年" : '';
        });
        this.tableData = res.data.result;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .el-dialog__header {
    padding-left: 30px;
  }
  .el-dialog__body {
    padding-top: 20px;
    .fc303e {
      margin-bottom: 14px;
    }
  }
  .mt10 .el-button {
    float: left !important;
  }
}
</style>
