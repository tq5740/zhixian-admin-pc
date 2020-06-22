
<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item>
          <el-select placeholder="请选择企业" filterable clearable v-model="myOrgId" class='w320' @change="changeOrg" @visible-change="judgeOrg()">
            <el-option v-for="(i, index) in $store.state.myOrgList" :key="index" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input placeholder="职位名称" v-model="addQuery" class='w230' @keyup.13.native="onAddQuery">
            <el-button class="clickBtn" @click="onAddQuery" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader placeholder="学历" class='w150' :options="educationData" @change="changeEducation" clearable filterable change-on-select></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-cascader placeholder="工作经验" class='w150' :options="experienceData" @change="changeExperience" clearable filterable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <el-table ref="addTable" @selection-change="handleSelectionChange" header-row-class-name="thead" :data="workList" border v-loading="loading3" element-loading-text="加载中...">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="workTitle" label="职位名称" min-width="120"></el-table-column>
        <el-table-column prop="educationStr" label="学历要求" min-width='100'></el-table-column>
        <el-table-column prop="experienceStr" label="工作经验" min-width='90'></el-table-column>
        <el-table-column prop="recruitNumber" label="招聘人数" min-width='80'></el-table-column>
        <el-table-column prop="salary" label="薪资待遇" min-width='110'></el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width='120'></el-table-column>
        <el-table-column prop="updateTimeStr" label="修改时间" min-width='100'></el-table-column>
        <el-table-column prop="venueAuditStr" label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.venueAuditStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <span class="mag-top20 mag-left20">
          <el-checkbox v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="workList.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
          <el-button type="primary" class="mag-left20" icon="plus" size="medium" @click="addPost">报名</el-button>
          &nbsp;
          <span class="fc303e">（默认勾选代表该职位已经报名该招聘会）</span>
        </span>
      </el-row>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
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
        <el-pagination :current-page.sync="addPageNum" background @current-change="getAddJobList" :page-size="parseInt(addPageSize)" layout="prev, pager, next, jumper" :total="addTotal">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
      <span>该企业尚未认证，请先完善企业信息，审核通过后，再报名招聘会哦！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOrg = false">取 消</el-button>
        <el-button type="primary" @click="isOrg = false;apply()">完善信息</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";

import Venue from "@api/venue";
import Job from "@api/job";
import Org from "@api/org";
import { isFunction } from 'util';
@Component({})
export default class AddCompany extends Vue {
  @Prop()
  public venueId!: string;
  @Prop()
  public venueTitle!: string;
  orgListId: any[] = [];

  showAdd: boolean = false;
  workList: any[] = [];
  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  addPageSize: number = 10;
  addPageNum: number = 1;
  addTotal: number = 0;
  addTime: string[] = [];
  addQuery: string = "";
  loading3: boolean = false;
  myOrgId: string = this.$store.state.userInfo.org.orgId;
  isOrg: boolean = false;
  selectData: any[] = [];

  // 学历
  educationData: any[] = [];
  // 经验
  experienceData: any[] = [];
  // 职位报名招聘会状态
  stateArr: object[] = [
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
      text: "通过审核"
    }
  ];

  created() {
    this.getEducation();
    this.getExperience();
    this.getAddJobList();
    this.getOrgList();
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
  async getEducation() {
    this.$store.state.educationArr.forEach(i => {
      this.educationData.push({ value: i.id, label: i.text });
    });
  }
  async getExperience() {
    this.$store.state.experienceArr.forEach(i => {
      this.experienceData.push({ value: i.id, label: i.text });
    });
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
  getAddJobList() {
    this.loading3 = true;
    let data1 = {
      venueId: this.venueId,
      query: this.addQuery,
      pageSize: this.addPageSize,
      pageNum: this.addPageNum,
      education: this.addEducationId,
      experience: this.addExperienceId,
      orgId: this.myOrgId,
      startDate: this.addStartTime,
      endDate: this.addEndTime,
      state: 4
    };
    Job.workList({ data: data1 })
      .then(res => {
        if (res.code === 0) {
          this.addTotal = res.data.total;
          res.data.result.forEach((i: any) => {
            i.updateTimeStr = this.$formatDate(i.updateTime, "YYYY-MM-DD");
            i.educationStr = this.$store.state.educationArr[i.education].text;
            i.experienceStr = this.$store.state.experienceArr[
              i.experience
            ].text;
            i.venueAuditStr = this.$mapTypeStr(i.venueAudit, this.stateArr);
            if (i.highSalary && !i.lowSalary) {
              i.salary = `0-${i.highSalary}`;
            } else if (!i.highSalary && i.lowSalary) {
              i.salary = `${i.lowSalary}元`;
            } else {
              i.salary = `${i.lowSalary}-${i.highSalary}`;
            }
          });
          this.workList = res.data.result;
          for (let i = 0; i < this.workList.length; i++) {
            if (this.workList[i].venueState === 1) {
              this.$nextTick(() => {
                this.$refs.addTable.toggleRowSelection(this.workList[i], true);
              })
            }
          }
        }
      })
      .finally(() => {
        this.loading3 = false;
      });
  }
  addPost(e: any) {
    if (!this.myOrgId) {
      this.$notify({
        title: "错误",
        message: `请选择企业!`,
        type: "error"
      });
      return;
    }
    if (this.selectData.length === 0) {
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
      workIds: e.workId
        ? JSON.stringify(e.workId)
        : JSON.stringify(this.selectData.map(i => i.workId))
      // orgId: this.myOrgId
    };
    Venue.create_venue_job({ data })
      .then(res => {
        if (res.code === 0) {
          this.$confirm('所选职位报名招聘会成功！', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'success'
          }).then(() => {
            this.$emit('close');
          }).catch(() => {
          });
        }
      })
      .finally(() => {
        this.loading4 = false;
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
    this.$store.state.myOrgList.forEach(element => {
      if(element.state === 4){
        this.orgListId = this.orgListId.concat(element.orgId);
      }
    });
  }
  changeOrg() {
    this.getAddJobList();
  }

  judgeOrg(){
    let myOrgId = this.orgListId.toString();
    if(!myOrgId.includes(this.myOrgId)){
      this.isOrg = true;
      this.myOrgId = "";
    }
  }
  // 跳转到企业管理页面
  apply(e: any) {
    this.$router.push({
      path: "/org/org"
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
  @debounce(200, { leading: false })
  onAddQuery() {
    this.getAddJobList();
  }
}
</script>
<style lang="scss" scoped>
  .mag-top20 {
    float: left;
    margin-top: 20px;
  }
  .mag-left20 {
    margin-left: 20px;
  }
</style>
