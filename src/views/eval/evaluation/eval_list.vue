<template>
  <div>
    <el-row class="main-top">
      <!-- <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="created_eval" v-if="prm.isCreate">创建测评</el-button>
        </el-form-item>
      </el-form> -->
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="测评标题" v-model="params.query" class='w230' @keyup.13.native="getList" @change="getList" clearable>
            <el-button @click="getList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader filterable :options="evalClassify" :props="keyName" v-model="categoryId" @change="ClassifyId" change-on-select clearable placeholder="测评分类"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="测评状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @selection-change="handleSelectionChange" @sort-change='sortFunc'
        header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <!-- <el-table-column type="selection" align="center" min-width='55' v-if="prm.isDelete" :selectable='selectInit'></el-table-column> -->
        <el-table-column prop="evalImg" label="测评封面" width='100' align='center'>
          <template slot-scope="scope">
            <img class='img-bor' :src="scope.row.evalImg ? ($store.state.configData.imgDomain + scope.row.evalImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/eval.jpg' + $imgSize['30x30'])" />
          </template>
        </el-table-column>
        <el-table-column prop="evalTitle" label="测评标题" min-width="140"></el-table-column>
        <el-table-column prop="categoryTitle" label="测评分类" min-width='100'></el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width='170'></el-table-column>
        <el-table-column prop="" label="操作" width="370">
          <template slot-scope='scope'>
            <!-- <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button> -->
            <el-button v-if="scope.row.state == 4" type="text" @click.native="evalReg(scope.row)">报名</el-button>
            <el-button v-if="prm.isAudit && scope.row.state != 5" type="text" @click.native="audit(scope.row)">审核</el-button>
            <el-button v-if="prm.isRecommend && scope.row.state == 4" type="text" @click.native="recommend(scope.row)">{{scope.row.isRecommend ? "取消推荐" : "推荐"}}</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 2 && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="prm.isStatistics" type="text" @click.native="statistics(scope.row)">统计</el-button>
            <!-- <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="delCheck(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-row v-if="prm.isDelete">
        <span class="mag-top20">
          <el-checkbox class="mag-left20" v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
          <el-button class="mag-left20" @click="delCheck">删除</el-button>
        </span>
      </el-row> -->
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)"
          layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog :close-on-click-modal="false" width="30%" title="审核" :visible.sync="showAudit" :before-close="closeAudit">
      <div>
        <el-radio v-model="state" :label="4">通过</el-radio>
        <el-radio v-model="state" :label="2">不通过</el-radio>
        <br />
        <br />
        <el-input v-show="state ==2" tyle="text" placeholder="请输入审核不通过的原因" v-model="reason"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn">确定</el-button>
        </el-row>
      </div>
    </el-dialog>

    <el-dialog width="70%" v-if="createEditOne" :title="title" :visible.sync="createEditOne" :close-on-click-modal="false">
      <create-edit-one @createEditOneOver="createEditOneOver" :queryData="queryEvalData" :title="title"></create-edit-one>
    </el-dialog>
    <el-dialog width="70%" v-if="createEditTwo" :title="title" :visible.sync="createEditTwo" :close-on-click-modal="false" :before-close="createEditTwoOver">
      <create-edit-two :options='evalData' @createEditTwoOverUp="createEditTwoOverUp" @createEditTwoOver="createEditTwoOver" :isShow='isShow'></create-edit-two>
    </el-dialog>
    <el-dialog width="30%" v-if="isDelShow" title="删除" :visible.sync="isDelShow" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="请填写删除原因：">
          <el-input rows="3" type="textarea" placeholder="原因不能为空" v-model="delCause"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDelShow = false">取 消</el-button>
        <el-button type="primary" @click="del">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" width="50%" title="统计" :visible.sync="showStatistics">
      <el-table header-row-class-name="thead" :data="statisticsData" border element-loading-text="加载中...">
        <el-table-column prop="browseNumber" label="浏览量" min-width="100" align="center"></el-table-column>
        <el-table-column prop="complimentNumber" label="点赞数" min-width='100' align="center"></el-table-column>
        <el-table-column prop="commentNumber" label="评论数" min-width='100' align="center"></el-table-column>
        <el-table-column prop="studyNumber" label="参与人数" min-width='100' align="center"></el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import { emptyLast } from "@utils/index";
import Eval from "@api/eval";
import Category from "@api/category";
import Org from "@api/org";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "create-edit-one": () => import("./createAndEdit_one.vue"),
    "create-edit-two": () => import("@c/ChoiceUser.vue")
  }
})
export default class Companyreg extends Vue {
  createEditOne: boolean = false;
  createEditTwo: boolean = false;
  queryEvalData: object = {};
  title: string = "";
  keyName: object = {
    label: "categoryTitle",
    value: "categoryId"
  };
  categoryId: any = [];
  isDelShow: boolean = false;
  params: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "updateTime",
    query: "",
    startTime: "",
    endTime: ""
  };
  prm = {
    isCreate: false,
    isUpdate: false,
    isDelete: false,
    isAudit: false,
    isOnline: false,
    isRecommend: false,
    isStatistics: false
  };
  state: number = 4;
  reason: string = "";
  evalId: string | number = "";
  evalClassify: any[] = [];

  stateArr: object[] = [
    {
      id: 1,
      text: "草稿"
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
    },
    {
      id: 5,
      text: "已关闭"
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  showAudit: boolean = false;
  isPending: boolean = false;
  total: number = 0;
  evalClassify: any[] = [];

  delEvalId: string = "";
  delCause: string = "";

  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];

  showStatistics: boolean = false;
  statisticsData: any[] = [];

  isShow: object = {
    user: false,
    class: false
  }
  evalData: any = {
    params: {
        evalId: '',
        sortBy: false,
        sortField: "userId",
        pageSize: 10,
        pageNum: 1
    },
    arrs: 'userIds',
    arr: 'userId'
  }

  created() {
    this.getCategory();
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
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
    this.toggleCheckbox = checkedCount === this.tableData.length && this.tableData.length != 0;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
  }
  selectInit(row: any, index: any) {
    if(row.state != 4){
      return true
    } else{
      return false
    }
  }
// 编辑
  edit(e: any): void {
    this.queryEvalData = e;
    this.createEditOne = true;
  }
  // 创建测评
  created_eval(): void {
    this.createEditOne = true;
    this.title = "创建测评";
  }
  createEditOneOver() {
    this.createEditOne = false;
    this.createEditTwo = true;
  }
  createEditTwoOverUp() {
    this.isShow.class = false;
    this.createEditOne = true;
    this.createEditTwo = false;
  }
  createEditTwoOver() {
    this.createEditTwo = false;
    this.getList();
  }
  delCheck(e: any){
    if (this.selectData.length === 0 && !e) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个测评!`,
        type: "error"
      });
      return;
    }
    let id = e && e.evalId ? '[' + JSON.stringify(e.evalId) + ']' : JSON.stringify(this.selectData.map(i => i.evalId));
    this.delEvalId = id;
    this.isDelShow = true;
  }
  ClassifyId(e: any) {
    if (e.length) {
      this.params.categoryId = "" + e[e.length - 1];
    } else {
      delete this.params.categoryId;
    }
    this.getList();
  }
  // 推荐
  recommend(e: any): void {
    let data = {
      evalId: e.evalId,
      isRecommend: !e.isRecommend ? 1 : 0
    };
    Eval.is_recommend_admin({ data }).then(res => {
      if (res.code === 0) {
        this.getList();
      }
    });
  }
  // 上下线
  on_off(e: any): void {
    if(e.state == 2){
      this.$notify({
        title: "警告",
        message: `未通过审核不能发布`,
        type: "warning"
      });
      return;
    }
    if(e.state == 3){
      this.$notify({
        title: "警告",
        message: `审核中不能发布`,
        type: "warning"
      });
      return;
    }
    let data = {
      evalId: e.evalId,
      state: e.state == 4 ? 5 : 4
    };
    Eval.online_offline_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: `${e.state == 4 ? "关闭" : "发布"}成功!`,
          type: "success"
        });
        this.getList();
      }
    });
  }
  // 审核_弹框
  audit(e: any) {
    this.showAudit = true;
    this.evalId = e.evalId;
  }
  // 审核
  saveBtn() {
    if (this.state === 2 && !this.reason || this.reason.includes(" ")){
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    let data = {
      evalId: this.evalId,
      state: this.state,
      reason: this.reason
    };
    this.isPending = true;
    Eval.audit_evaluation_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.closeAudit();
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  // 执行逻辑删除
  del(): void {
    if (!this.delCause || this.delCause.includes(" ")) {
      this.$notify.error({
        title: "错误",
        message: "删除原因必填，并且不能含有空格！"
      });
      return;
    }
    let data = {
      evalIds: this.delEvalId,
      reason: this.delCause
    };
    Eval.del_evaluation_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: "删除成功！",
          type: "success"
        });
        this.isDelShow = false;
        this.delCause = "";
        if ((this.selectData.length === this.tableData.length || this.tableData.length === 1 ) && this.params.pageNum > 1) {
          this.params.pageNum --;
        }
        this.getList();
      }
    });
  }
  closeAudit() {
    this.showAudit = false;
    this.state = 4;
    this.reason = "";
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.categoryId ||
        this.params.state
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Eval.evaluation_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            i.createTimeStr = this.$formatDate(i.createTime, "YYYY-MM-DD hh:mm:ss");
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  getCategory() {
    let data = {};
    Category.category_list_eval({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        let arr = this.$store.state.evalData;
        arr.classify = res.data;
        this.$store.commit('setEvalData', arr)
        this.evalClassify = res.data;
      }
    });
  }
  evalReg(e: any) {
    this.$store.commit('setEvalData', { id: e.evalId });
    this.isShow.user = true;
    this.createEditTwo = true;
    this.title = "测评报名";
  }
  @debounce(200, { leading: false })
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  statistics(e: any) {
    this.showStatistics = true;
    let data = {
      evalId: e.evalId
    }
    Eval.query_evaluation_statistics_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.statisticsData = [res.data];
        }
      })
  }
}
</script>
<style lang="scss" scope>
  .mag-top20 {
    float: left;
    margin-top: 15px;
  }
  .mag-left20 {
    margin-left: 15px;
  }
</style>
<style lang="scss">
  .artic-dlog {
    text-align: center;
    height: 750px;
    .el-dialog__body {
      padding: 0 !important;
      padding-bottom: 5px;
    }
  }
</style>

