<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <!-- 暂时隐藏
        <el-form-item label="期望地点：">
          <el-select v-model="params.district" class='w150' @change="getList" clearable @clear="params.district = ''">
            <el-option v-for="(i) in d" :key="i" :label="i" :value="i"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-select placeholder="工作意向" filterable clearable v-model="params.query" @change="changeJob">
            <el-option v-for="(i) in jobArr" :key="i.workId" :label="i.workTitle" :value="i.workId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="工作性质" v-model="params.workNature" class='w150' @change="getList" clearable @clear="params.workNature = ''">
            <el-option v-for="(i) in $store.state.workNatureArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item clearable v-show="params.workNature ===1">
          <el-select placeholder="薪资要求" v-model="salary" class='w150' @change="changeSalary" clearable @clear="salary = ''">
            <el-option v-for="(i) in $store.state.salaryArr" :key="i.id" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="学历要求：">
          <el-select v-model="params.highestEducation" @change="getList" class='w150'>
            <el-option v-for="(i) in $store.state.educationArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经验要求：">
          <el-select v-model="params.experience" @change="getList" class='w150'>
            <el-option v-for="(i) in $store.state.experienceArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="workTitle" label="意向职位" min-width="120"></el-table-column>
        <el-table-column prop="workCategoryTitle" label="意向职能" min-width="220"></el-table-column>
        <el-table-column prop="userName" label="姓名" min-width="100"></el-table-column>
        <el-table-column prop="salary" label="期望薪资" width='80'>
        </el-table-column>
        <el-table-column prop="birthDateStr" label="出生日期" width='110'></el-table-column>
        <el-table-column prop="highestEducationStr" label="学历" width='80'>
        </el-table-column>
        <el-table-column prop="workNatureStr" label="工作性质" width='80'>
        </el-table-column>
        <el-table-column prop="startWorkYear" label="工作年份" width='80'>
        </el-table-column>
        <el-table-column prop="address" label="工作地区" min-width='100'>
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
    <el-dialog :close-on-click-modal="false" v-if="showBox" title="用户简历" :visible.sync="showBox" :before-close="close">
      <v-resume :bookingObj="bookingObj" @okCB="okCB" :isDown="true" @close="close" :isFileList="false"></v-resume>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    SearchFile 
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-20:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import Booking from "@api/booking";
import Job from "@api/job";
import { debounce } from "typescript-debounce-decorator";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "v-resume": () => import("@c/Vresume.vue")
  }
})
export default class SearchFile extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    workNature: "",
    highestEducation: 0,
    experience: 0,
    province: "四川省",
    city: "成都市",
    district: "",
    lowSalary: "",
    highSalary: ""
  };
  d: string[] = [
    "锦江区",
    "青羊区",
    "金牛区",
    "武侯区",
    "成华区",
    "龙泉驿区",
    "青白江区",
    "新都区",
    "温江区",
    "金堂县",
    "双流县",
    "郫县",
    "大邑县",
    "蒲江县",
    "新津县",
    "都江堰市",
    "彭州市",
    "邛崃市",
    "崇州市",
    "高新西区",
    "高新区"
  ];
  defaultClassify: string[] = [];
  salary: string = "";
  tableData: any[] = [];
  intentionData: any[] = [];
  total: number = 0;
  loading: boolean = false;
  showBox: boolean = false;
  bookingObj = {
    userId: "",
    workCategoryId: "",
    intentionId: ""
  };
  jobArr: any[] = [];
  async created() {
    this.getList();
  }
  changeJob(val: any) {
    let res = this.jobArr.filter(i => i.workId === e)[0];
    this.params.query = res ? res.workTitle : "";
    this.bookingObj.workId = res ? res.workId : "";
    this.getList();
  }
  close() {
    this.showBox = false;
    this.bookingObj.userId = ``;
  }
  see(e: any) {
    console.log(e);
    this.bookingObj.userId = e.userId;
    this.bookingObj.intentionId = e.intentionId;
    this.showBox = true;
  }
  okCB() {
    this.close();
    this.getList();
  }
  changeSalary() {
    if (this.salary === "10000") {
      this.params.lowSalary = this.salary;
      //@ts-ignore
      this.params.highSalary = 0;
    } else if (this.salary === "2000") {
      //@ts-ignore
      this.params.lowSalary = 0;
      //@ts-ignore
      this.params.highSalary = this.salary;
    } else {
      let _salary = this.salary.split("-");
      this.params.lowSalary = _salary[0];
      this.params.highSalary = _salary[1];
    }
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.district || this.params.workNature || this.params.lowSalary || this.params.highSalary || this.params.query) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    for (let i in data) {
      //@ts-ignore
      if (data[i] === 0) {
        //@ts-ignore
        delete data[i];
      }
    }
    Booking.talentSearch({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.birthDateStr = this.$formatDate(i.birthDate).split(" ")[0];
            i.highestEducationStr = this.$mapTypeStr(
              i.education,
              this.$store.state.educationArr
            );
            i.workNatureStr = this.$mapTypeStr(
              i.workNature,
              this.$store.state.workNatureArr
            );
            i.workCategoryTitle = i.workCategoryTitle.join('');
            let work = JSON.parse(i.workTitle);
            i.workTitle = (work[0] ? work[0] : '') + (work[0] && work[1] ? '，' : '') + (work[1] ? work[1] : '');
            i.startWorkYear = i.startWorkYear ? new Date().getFullYear() - i.startWorkYear + "年" : '';
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss">
.v-choose-job {
  .el-form-item__label {
    @extend .fc303e;
  }
}
</style>
