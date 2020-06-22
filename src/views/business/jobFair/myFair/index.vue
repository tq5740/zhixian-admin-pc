<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="现场招聘名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <!-- <el-table-column prop="name" label="展位" min-width="120"></el-table-column> -->
        <el-table-column prop="venueTitle" label="名称" min-width="180">
        </el-table-column>
        <el-table-column prop="startDateStr" label="开始日期" min-width='120'>
        </el-table-column>
        <el-table-column prop="endDateStr" label="结束日期" min-width='120'>
        </el-table-column>
        <el-table-column prop="period" label="时间段" min-width='120'></el-table-column>
        <el-table-column prop="address" label="地址" min-width='300'>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='100'></el-table-column>
        <el-table-column prop="" label="操作" width="160">
          <template slot-scope='scope'>
            <!-- @click.native="audit(scope.row)" -->
            <el-button type="text" @click.native="detail(scope.row)">详情</el-button>
            <el-button type="text" @click="getJobListHr(scope.row)">职位</el-button>
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
    <!-- 详情-->
    <el-dialog :close-on-click-modal="false" v-if="showDetail" :visible.sync="showDetail" :before-close="closeDetail">
      <div style="min-height:500px" v-loading="loading1" class="detail">
        <div class="venue-name">{{detailData.venueTitle}}</div>
        <p class="p"><span class="label">举办时间:</span>{{detailData._startDate}} - {{detailData._endDate}}({{detailData.period}})
        </p>
        <p class="p"><span class="label">举办地点:</span>{{detailData.address}}
        </p>
        <p class="p"><span class="label">联系人:</span>{{detailData.contact}}</p>
        <p class="p"><span class="label">联系电话:</span>{{detailData.phone}}</p>
        <div class="intro" v-html="detailData._intro"></div>
        <p class="notice-p"><span class="notice"><span class="line-icon"></span>参会须知</span></p>
        <div class="intro" v-html="detailData._notice"></div>
      </div>
    </el-dialog>

    <!-- 企业 -->
    <el-dialog :close-on-click-modal="false" title="已添加的职位" v-if="showOrg" :visible.sync="showOrg" :before-close="closeOrg">
      <el-row>
        <el-form :inline="true">
          <el-form-item label="">
            <el-button type="primary" class="mr10" icon="plus" @click="onAddShow">添加职位</el-button>
            <el-input placeholder="请输入职位名称进行搜索" v-model="alreadyAddQuery" class='w320' @keyup.13.native="onAlreadyAddQuery">
              <el-button class="clickBtn" @click="onAlreadyAddQuery" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="" class='fr'>
            共有
            <span class="fc303e">{{alreadyAddTotal}}</span>条数据，每页显示
            <el-select placeholder="" v-model="alreadyAddPageSize" class='w65' @change='getJobListHrIsAll'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table header-row-class-name="thead" :data="orgJobData" border v-loading="loading2" element-loading-text="加载中...">
          <el-table-column prop="workTitle" label="职位名称" min-width="15%"></el-table-column>
          <el-table-column prop="educationStr" label="学历要求" min-width='10%'></el-table-column>
          <el-table-column prop="experienceStr" label="工作经验" min-width='10%'></el-table-column>
          <el-table-column prop="recruitNumber" label="招聘人数" min-width='10%'></el-table-column>
          <el-table-column prop="salary" label="薪资待遇" min-width='13%'></el-table-column>
          <el-table-column prop="createUserName" label="添加人" min-width='13%'></el-table-column>
          <el-table-column prop="createTimeStr" label="添加时间" min-width='13%'></el-table-column>
          <el-table-column prop="stateStr" label="状态" min-width='10%'>
            <template slot-scope="scope">
              {{scope.row.stateStr}}
              <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
                <div slot="content">{{scope.row.reason}}</div>
                <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
              </el-tooltip>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="" label="操作" min-width="10%">
            <template slot-scope='scope'>
              <el-button type="text" @click="delJob(scope.row)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-row>
      <el-row>
        <el-pagination :current-page.sync="alreadyAddPageNum" class="mg15 fr" background @current-change="getJobListHrIsAll" :page-size="parseInt(alreadyAddPageSize)" layout="prev, pager, next, jumper" :total="alreadyAddTotal">
        </el-pagination>
      </el-row>
    </el-dialog>

    <!-- 添加 -->
    <el-dialog :close-on-click-modal="false" title="添加职位" v-if="addShow" :visible.sync="addShow" :before-close="closeAdd">

      <el-row>
        <el-form :inline="true">
          <el-form-item label="选择企业 :">
            <el-select filterable clearable v-model="myOrgId" class='w320 mr10' @change="changeOrg">
              <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学历要求 :">
            <el-cascader style="width: 130px" :options="educationData" @change="changeEducation" clearable filterable change-on-select></el-cascader>
          </el-form-item>
          <el-form-item label="工作经验 :">
            <el-cascader style="width: 130px" :options="experienceData" @change="changeExperience" clearable filterable change-on-select></el-cascader>
          </el-form-item>
          <!-- <el-form-item label="请选择修改时间段 : ">
            <el-date-picker style="width: 330px" v-model="addTime" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='addHandleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
          </el-form-item> -->
        </el-form>
      </el-row>

      <el-row>
        <el-form :inline="true">
          <el-form-item label="">
            <el-input placeholder="请输入职位名称进行搜索" v-model="addQuery" class='w320' @keyup.13.native="onAddQuery">
              <el-button class="clickBtn" @click="onAddQuery" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>

          <el-form-item label="" class='fr'>
            共有
            <span class="fc303e">{{addTotal}}</span>条数据，每页显示
            <el-select placeholder="" v-model="addPageSize" class='w65' @change='getAddJobList'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <el-table ref="addTable" @selection-change="handleSelectionChange" header-row-class-name="thead" :data="workList" border v-loading="loading3" element-loading-text="加载中...">
          <el-table-column type="selection" width="50" align="center"></el-table-column>
          <!-- <el-table-column prop="orgName" label="企业名称" min-width="15%"></el-table-column> -->
          <el-table-column prop="workTitle" label="职位名称" min-width="15%"></el-table-column>
          <el-table-column prop="educationStr" label="学历要求" min-width='10%'></el-table-column>
          <el-table-column prop="experienceStr" label="工作经验" min-width='10%'></el-table-column>
          <el-table-column prop="recruitNumber" label="招聘人数" min-width='10%'></el-table-column>
          <el-table-column prop="salary" label="薪资待遇" min-width='10%'></el-table-column>
          <el-table-column prop="updateUserName" label="修改人" min-width='10%'></el-table-column>
          <el-table-column prop="updateTimeStr" label="修改时间" min-width='15%'></el-table-column>
          <!-- <el-table-column prop="" label="操作" min-width="10%">
            <template slot-scope='scope'>
              <el-button type="text" @click="add(scope.row)">添加</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-row>
      <el-row>
        <span class="mag-top20">
          <el-checkbox v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="workList.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
          <el-button type="primary" class="mag-left20" icon="plus" size="medium" @click="add">添加</el-button>
        </span>
        <el-pagination :current-page.sync="addPageNum" class="mg15 fr" background @current-change="getAddJobList" :page-size="parseInt(addPageSize)" layout="prev, pager, next, jumper" :total="addTotal">
        </el-pagination>
      </el-row>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Venue from "@api/venue";
import Job from "@api/job";
import Org from "@api/org";
//https://github.com/ktsn/vuex-class
@Component({})
export default class MyFair extends Vue {
  params = {
    state: "",
    query: "",
    pageSize: 10,
    pageNum: 1,
    startDate: "",
    endDate: "",
    sortBy: false,
    sortField: "startDate"
  };

  alreadyAddQuery: string = "";
  alreadyAddTotal: number = 0;
  alreadyAddPageSize: number = 10;
  alreadyAddPageNum: number = 1;

  addShow: boolean = false;
  addQuery: string = "";
  addTotal: number = 0;
  addPageSize: number = 10;
  addPageNum: number = 1;
  addEducationId: string = "";
  addExperienceId: string = "";
  addTime: string[] = [];
  addStartTime: string = "";
  addEndTime: string = "";
  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;

  time: string[] = [];
  detailData: any = {};
  orgJobData: any[] = [];
  workList: any[] = [];
  selectData: any[] = [];
  total = 0;
  tableData: any[] = [];
  loading: boolean = false;
  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;
  loading4: boolean = false;
  showOrg: boolean = false;
  showDetail: boolean = false;
  venueId = "";
  myOrgId: string = "";
  // 学历
  educationData: any[] = [];
  // 经验
  experienceData: any[] = [];
  stateArr: object[] = [
    {
      id: 1,
      text: "未提交"
    },
    {
      id: 2,
      text: "未通过"
    },
    {
      id: 3,
      text: "审核中"
    },
    {
      id: 4,
      text: "发布中"
    }
  ];


  created() {
    this.getList();
    this.getEducation();
    this.getExperience();
    this.getOrgList();
  }
  onAddShow() {
    this.addShow = true;
    this.getAddJobList();
  }
  handleCheckAllChange() {
    if (this.toggleCheckbox) {
      this.$refs.addTable.toggleAllSelection();
    } else {
      this.$refs.addTable.clearSelection();
    }
    this.handleSelectionChange;
  }
  handleSelectionChange(e: any) {
    this.selectData = e;
    let checkedCount = e.length;
    this.toggleCheckbox = checkedCount === this.workList.length && this.workList.length != 0;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.workList.length;
  }

  addHandleChangeTime() {
    if (this.addTime) {
      let time = this.$getApiTime(this.time);
      this.addStartTime = time[0];
      this.addEndTime = time[1];
    } else {
      this.addStartTime = "";
      this.addEndTime = "";
    }
    this.getAddJobList();
  }

  async getEducation() {
    this.$store.state.educationArr.forEach(i => {
      this.educationData.push({ value: i.id, label: i.text })
    });
  }
  async getExperience() {
    this.$store.state.experienceArr.forEach(i => {
      this.experienceData.push({ value: i.id, label: i.text })
    });
  }

  @debounce(500, { leading: false })
  changeEducation(e: any) {
    this.addEducationId = e[e.length - 1];
    this.getAddJobList();
  }

  @debounce(500, { leading: false })
  changeExperience(e: any) {
    this.addExperienceId = e[e.length - 1];
    this.getAddJobList();
  }

  // delJob(e: any) {
  //   this.$confirm(`是否删除职位 "${e.workTitle}" 吗?`, "提示", {
  //     confirmButtonText: "确定",
  //     cancelButtonText: "取消",
  //     type: "warning"
  //   })
  //     .then(() => {
  //       let data = { venueJobId: e.venueJobId };
  //       Venue.delete_venue_job({ data }).then(res => {
  //         if (res.code === 0) {
  //           this.$notify({
  //             title: "提示",
  //             message: `删除成功!`,
  //             type: "success"
  //           });
  //           this.getJobListHrIsAll();
  //         }
  //       });
  //     })
  //     .catch(() => {});
  // }
  add(e: any) {
    if (this.selectData.length === 0 && !e) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个职位!`,
        type: "error"
      });
      return;
    }
    this.loading4 = true;
    let data = {
      venueId: this.venueId,
      workIds: e.workId ? JSON.stringify(e.workId) : JSON.stringify(this.selectData.map(i => i.workId))
      // orgId: this.$store.state.userInfo.org.orgId
    };
    Venue.create_venue_job({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `报名成功!`,
            type: "success"
          });
          this.getAddJobList();
          this.initSelect();
        }
      })
      .finally(() => {
        this.loading4 = false;
      });
  }

  initSelect() {
    this.$refs.addTable.clearSelection();
    this.toggleCheckbox = false;
    this.selectData = [];
  }

  closeOrg() {
    this.showOrg = false;
  }

  closeAdd() {
    this.getJobListHrIsAll();
    this.addShow = false;
    this.initSelect();
  }

  getAddJobList() {
    this.loading3 = true;
    let data1 = {
      venueId: this.venueId,
      query: this.addQuery,
      pageSize: this.addPageSize,
      pageNum: this.addPageNum,
      education: this.addEducationId,
      experience : this.addExperienceId,
      orgId: this.myOrgId,
      startDate: this.addStartTime,
      endDate: this.addEndTime
    };
    Job.workList({ data: data1 })
      .then(res => {
        if (res.code === 0) {
          this.addTotal = res.data.total;
          res.data.result.forEach((i: any) => {
            i.updateTimeStr = this.$formatDate(i.updateTime, "YYYY-MM-DD");
            i.educationStr = this.$store.state.educationArr[i.education].text;
            i.experienceStr = this.$store.state.experienceArr[i.experience].text;
            if (i.highSalary && !i.lowSalary) {
              i.salary = `0-${i.highSalary}`;
            } else if (!i.highSalary && i.lowSalary) {
              i.salary = `${i.lowSalary}元`;
            } else {
              i.salary = `${i.lowSalary}-${i.highSalary}`;
            }
          });
          this.workList = res.data.result;
        }
      })
      .finally(() => {
        this.loading3 = false;
      });
  }
  async getOrgList() {
    if (this.$store.state.myOrgList.length === 0) {
      await this.$store.dispatch("getMyOrgList");
      if (this.$store.state.myOrgList.length === 0) {
        this.$notify({
          title: "提示",
          message: "您暂无企业！",
          type: "error"
        });
        this.$emit("close");
        return;
      }
    }
  }
  changeOrg() {
    this.getAddJobList();
  }
  getJobListHr(e: any) {
    this.addPageNum = 1;
    this.alreadyAddPageNum = 1;
    this.showOrg = true;
    this.loading2 = true;
    this.venueId = e.venueId;
    this.getJobListHrIsAll();
  }

  getJobListHrIsAll() {
    let data = {
      // orgId: this.$store.state.userInfo.org.orgId,
      venueId: this.venueId,
      query: this.alreadyAddQuery,
      pageSize: this.alreadyAddPageSize,
      pageNum: this.alreadyAddPageNum
    };
    Venue.venue_work_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.alreadyAddTotal = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime, "YYYY-MM-DD");
            i.educationStr = this.$store.state.educationArr[i.education].text;
            i.experienceStr = this.$store.state.experienceArr[i.experience].text;
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            if (i.highSalary && !i.lowSalary) {
              i.salary = `0-${i.highSalary}`;
            } else if (!i.highSalary && i.lowSalary) {
              i.salary = `${i.lowSalary}元`;
            } else {
              i.salary = `${i.lowSalary}-${i.highSalary}`;
            }
          });
          this.orgJobData = res.data.result;
        }
      })
      .finally(() => {
        this.loading2 = false;
      });
  }

  closeDetail() {
    this.showDetail = false;
    this.detailData = {};
  }

  detail(e: any) {
    this.showDetail = true;
    this.loading1 = true;
    let data = { venueId: e.venueId };
    Venue.queryVenue({ data })
      .then(res => {
        if (res.code === 0) {
          res.data._startDate = this.$formatDate(
            res.data.startDate,
            "YYYY.MM.DD"
          );
          res.data._endDate = this.$formatDate(res.data.endDate, "YYYY.MM.DD");
          res.data._intro = decodeURIComponent(res.data.intro);
          res.data._notice = decodeURIComponent(res.data.notice).replace(/\n|\r\n/g, "<br>");
          this.detailData = res.data;
        }
      })
      .finally(() => {
        this.loading1 = false;
      });
  }

  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startDate = time[0];
      this.params.endDate = time[1];
    } else {
      this.params.startDate = "";
      this.params.endDate = "";
    }
    this.getList();
  }

  getList(type: any) {
    if (type !== 'type') {if (this.params.query || this.params.startDate || this.params.endDate) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    this.loading = true;
    Venue.myVenueAdmin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.startDateStr = this.$formatDate(i.startDate, "YYYY-MM-DD");
            i.endDateStr = this.$formatDate(i.endDate, "YYYY-MM-DD");
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  @debounce(200, { leading: false })
  onAlreadyAddQuery() {
    this.getJobListHrIsAll();
  }
  @debounce(200, { leading: false })
  onAddQuery() {
    this.getAddJobList();
  }
}
</script>
<style lang="scss" scoped>
  .venue-name {
    font-size: 24px;
    color: #333;
  }
  .mag-top20 {
    float: left;
    margin-top: 15px;
  }
  .mag-left20 {
    margin-left: 15px;
  }

  .detail {
    h1 {
      text-align: center;
    }
    .p {
      margin-top: 14px;
      font-size: 14px;
      color: #999;
    }
    .label {
      display: inline-block;
      width: 65px;
      font-weight: 700;
      color: #000;
      font-size: 14px;
      margin-right: 25px;
    }
    .notice-p {
      margin: 20px 0;
    }
    .intro {
      margin-top: 30px;
      /deep/ img {
        max-width: 100%;
      }
    }
    .notice {
      color: #fc703e;
      font-size: 20px;
    }
    .line-icon {
      display: inline-block;
      width: 4px;
      height: 20px;
      margin: 0 10px -3px 0;
      background-color: #fc703e;
    }
  }
</style>
