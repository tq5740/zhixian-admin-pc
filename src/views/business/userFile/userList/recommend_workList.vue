<template>
  <div id="createAndEdit">
    <el-form :inline="true">
      <el-form-item label="">
        <el-input placeholder="职位名称" v-model="params.query" class='w230' @keyup.13.native="getList" @change="getList" clearable>
          <el-button @click="getList" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="工作性质" class='w150' v-model="params.workNature" @change="getList" clearable @clear="params.workNature = ''">
          <el-option v-for="(i) in $store.state.workNatureArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-select placeholder="学历要求" class='w150' v-model="params.education" @change="getList" clearable @clear="params.education = ''">
          <el-option v-for="(i) in $store.state.educationArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <el-row>
      <el-table ref="mainTable" @selection-change="handleSelectionChange" header-row-class-name="thead" :data="workListData" v-loading="loading" border element-loading-text="加载中...">
        <el-table-column type="selection" align="center" min-width='55' :selectable='selectInit'></el-table-column>
        <el-table-column prop="workTitle" label="职位名称" width='150'></el-table-column>
        <el-table-column prop="org.orgName" label="企业名称" width='150'></el-table-column>
        <el-table-column label="学历要求" min-width="100">
          <template slot-scope="scope">
            {{$mapTypeStr(scope.row.education, $store.state.educationArr)}}
          </template>
        </el-table-column>
        <el-table-column label="经验要求" min-width="100">
          <template slot-scope="scope">
            {{$mapTypeStr(scope.row.experience, $store.state.experienceArr)}}
          </template>
        </el-table-column>
        <el-table-column prop="recruitNumber" label="招聘人数" min-width="80"></el-table-column>
        <el-table-column label="工作性质" min-width="80">
          <template slot-scope="scope">
            {{$mapTypeStr(scope.row.workNature, $store.state.workNatureArr)}}
          </template>
        </el-table-column>
        <el-table-column label="薪资类型" min-width="80">
          <template slot-scope="scope">
            {{scope.row.salaryType == 1 ? '日薪' : scope.row.salaryType == 2 ? '月薪' : '年薪'}}
          </template>
        </el-table-column>
        <el-table-column label="薪资待遇" min-width="130">
          <template slot-scope="scope">
            {{scope.row.lowSalary && scope.row.highSalary ? scope.row.lowSalary + '-' + scope.row.highSalary : scope.row.lowSalary || scope.row.highSalary}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope='scope'>
            <el-button type="text" :style="scope.row.userBookingState == true ? 'color: #c0c4cc' : ''" @click.native="send(scope.row)">投递简历</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <span class="mag-top20">
          <el-checkbox class="mag-left20" v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="workListData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
          <el-button class="mag-left20" @click="send()">投递简历</el-button>
        </span>
      </el-row>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
            共有
            <span style="color: #fc703e">{{total}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params.pageSize" class='w65' @change='params.pageNum = 1;getList()'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)"
          layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Booking from "@api/booking";

@Component({
  components: {
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: [] })
  public data: any;
  @Prop({ default: "" })
  public queryData: string;

  workListData: any[] = [];
  total: number = 0;
  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];
  params: any = {
    pageSize: 10,
    pageNum: 1,
    sortBy: false,
    sortField: "updateTime",
    query: ""
  };
  loading: boolean = false;

  created() {
    this.workListData = this.data.result;
    this.total = this.data.total;
  }
  getList(type) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.workNature ||
        this.params.education
      ) {
        this.params.pageNum = 1;
      }
    }
    this.loading = true;
    let data = {
      ...this.params,
      userId: this.queryData
    }
    Booking.matching_work_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          this.workListData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  handleCheckAllChange() {
    if (this.toggleCheckbox) {
      this.$refs.mainTable.toggleAllSelection();
    } else {
      this.$refs.mainTable.clearSelection();
    }
    this.handleSelectionChange;
  }
  handleSelectionChange(e: any) {
    this.selectData = e;
    let checkedCount = e.length;
    this.toggleCheckbox = checkedCount === this.workListData.length && this.workListData.length != 0;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.workListData.length;
  }
  selectInit(row: any, index: any) {
    if(row.userBookingState == false){
      return true
    } else{
      return false
    }
  }
  send(e: any){
    if (this.selectData.length === 0 && !e) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个职位!`,
        type: "error"
      });
      return;
    }
    if (e && e.userBookingState == true) {
      this.$notify({
        title: "错误",
        message: `已投递过该职位!`,
        type: "warning"
      });
      return;
    }
    let id = e && e.workId ? '[' + JSON.stringify(e.workId) + ']' : JSON.stringify(this.selectData.map(i => i.workId));
    this.$confirm(
      "确定投递该简历到所选职位吗？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    )
      .then(() => {
        let data = {
          workIds: id,
          userId: this.queryData
        };
        Booking.recommend_user_intention_admin({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "操作成功！",
                type: "success"
              });
              this.$refs.mainTable.clearSelection();
            }
          })
      })
      .catch(() => {});
  }
}
</script>
<style lang="scss" scoped>  
</style>


