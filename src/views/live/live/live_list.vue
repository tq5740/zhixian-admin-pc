<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="created_live" v-if="prm.isCreate">创建直播</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="直播标题" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader filterable :options="liveClassify" :props="keyName" v-model="categoryId" @change="ClassifyId" change-on-select clearable placeholder="直播分类"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="直播状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @selection-change="handleSelectionChange" @sort-change='sortFunc'
        header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <!-- <el-table-column type="selection" align="center" min-width='55' v-if="prm.isDelete" :selectable='selectInit'></el-table-column> -->
        <el-table-column prop="liveImg" label="直播封面" width='100' align='center'>
          <template slot-scope="scope">
            <img class='img-bor' :src="scope.row.liveImg ? ($store.state.configData.imgDomain + scope.row.liveImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/live.jpg' + $imgSize['30x30'])"
            />
          </template>
        </el-table-column>
        <el-table-column prop="liveTitle" label="直播标题" min-width="140"></el-table-column>
        <el-table-column prop="categoryTitle" label="直播分类" min-width='100'></el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="userModelBO.userName" label="创建人" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width='180'></el-table-column>
        <el-table-column prop="" label="操作" width="470">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="addClass(scope.row)">章节</el-button>
            <el-button v-if="scope.row.state == 4" type="text" @click.native="liveReg(scope.row,'baoming')">报名</el-button>
            <el-button v-if="prm.isAudit && scope.row.state != 5" type="text" @click.native="audit(scope.row)">审核</el-button>
            <el-button v-if="prm.isRecommend && scope.row.state == 4" type="text" @click.native="recommend(scope.row)">{{scope.row.isRecommend ? "取消推荐" : "推荐"}}</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 2 && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="prm.isStatistics" type="text" @click.native="statistics(scope.row)">统计</el-button>
            <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="delCheck(scope.row)">删除</el-button>
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
    <el-dialog width="70%" v-if="createEditOne" :title="title" :visible.sync="createEditOne" :close-on-click-modal="false" :before-close="closeOne">
      <create-edit-one @createEditOneOver="createEditOneOver" :queryData="queryLiveData" :title="{'title':title}"></create-edit-one>
    </el-dialog>
    <el-dialog width="70%" v-if="createEditTwo" :title="title" :visible.sync="createEditTwo" :close-on-click-modal="false" :before-close="closeTwo">
      <create-edit-two @createEditTwoOver='createEditTwoOver' @createEditTwoOverUp='createEditTwoOverUp' @createEditTwoOverDown='createEditTwoOverDown' :queryData="queryLiveData" :title="{'title':title}" :isShow='isShow'></create-edit-two>
    </el-dialog>
    <el-dialog width="70%" v-if="createEditThree" :title="title" :visible.sync="createEditThree" :close-on-click-modal="false" :before-close="closeThree">
      <create-edit-three :options='liveData' @createEditThreeOverUp="createEditThreeOverUp" @createEditThreeOver="createEditThreeOver" :isShow='isShow'></create-edit-three>
    </el-dialog>
    <el-dialog width="70%" v-if="statisticsUser" title="观看直播用户报表" :visible.sync="statisticsUser" :close-on-click-modal="false" :before-close="statisticsUserOver">
      <statistics-user @statisticsUserOver="statisticsUserOver" from="live"></statistics-user>
    </el-dialog>
    <el-dialog width="50%" v-if="statisticsState" title="统计" :visible.sync="statisticsState" :close-on-click-modal="false">
      <el-table header-row-class-name="thead" :data="statisticsData" border v-loading="loading" header-align="center" element-loading-text="加载中...">
        <el-table-column prop="browseNumber" label="浏览量" align="center" min-width="80"></el-table-column>
        <el-table-column prop="chapterNumber" label="章节数量" align="center" min-width="80"></el-table-column>
        <el-table-column prop="studyNumber" label="直播报名人数" align="center" min-width="80">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="liveReg(scope.row)">{{scope.row.studyNumber}}</a>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="watchNumber" label="直播观看人数" align="center"></el-table-column> -->
      </el-table>
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

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import { emptyLast } from "@utils/index";
import Live from "@api/live";
import Category from "@api/category";
import Org from "@api/org";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "create-edit-one": () => import("./createAndEdit_one.vue"),
    "create-edit-two": () => import("./createAndEdit_two.vue"),
    "create-edit-three": () => import("@c/ChoiceUser.vue"),
    "statistics-user": () => import("@c/StatisticsUser.vue")
  }
})
export default class Companyreg extends Vue {
  isDelShow: boolean = false;
  createEditOne: boolean = false;
  createEditTwo: boolean = false;
  createEditThree: boolean = false;
  statisticsState: boolean = false;
  statisticsUser: boolean = false;
  statisticsData: any = [];
  forms: any = null;
  title: any = "创建直播";
  keyName: object = {
    label: "categoryTitle",
    value: "categoryId"
  };
  params: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "createTime",
    query: "",
    startTime: "",
    endTime: ""
  };
  prm = {
    isDelete: false,
    isCreate: false,
    isAudit: false,
    isUpdate: false,
    isOnline: false,
    isRecommend: false,
    isStatistics: false
  };
  state: number = 4;
  reason: string = "";
  liveId: string | number = "";
  liveClassify: any[] = [];

  ArticSrc: string = "";
  isShowArtic: boolean = false;
  isShow: object = {
    user: false,
    class: false
  }

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
  categoryId: any = [];
  queryLiveData: any = {};

  delLiveId: string = "";
  delCause: string = "";

  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];

  liveData: any = {
    params: {
        liveId: '',
        sortBy: false,
        sortField: "userId",
        pageSize: 10,
        pageNum: 1
    },
    arrs: 'liveRegIds',
    arr: 'liveRegId'
  }

  created() {
    this.getCategory();
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
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
  delCheck(e: any){
    // if (this.selectData.length === 0 && !e) {
    //   this.$notify({
    //     title: "错误",
    //     message: `请至少选择一个直播!`,
    //     type: "error"
    //   });
    //   return;
    // }
    // let id = e && e.liveId ? '[' + JSON.stringify(e.liveId) + ']' : JSON.stringify(this.selectData.map(i => i.liveId));
    this.delLiveId = e.liveId;
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
      liveId: e.liveId,
      isRecommend: !e.isRecommend ? 1 : 0
    };
    Live.is_recommend_admin({ data }).then(res => {
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
      liveId: e.liveId,
      state: e.state == 4 ? 5 : 4
    };
    Live.online_offline_live_admin({ data }).then(res => {
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
    this.liveId = e.liveId;
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
      liveId: this.liveId,
      state: this.state,
      reason: this.reason
    };
    this.isPending = true;
    Live.audit_live_admin({ data })
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
      liveIds: this.delLiveId,
      reason: this.delCause
    };
    Live.del_live_admin({ data }).then(res => {
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

  // 统计
  statistics(e: any) {
    if(e){
      let arr = this.$store.state.liveData;
      arr.id = e.liveId;
      this.$store.commit('setLiveData', arr)
    }
    let data = {
      liveId: this.$store.state.liveData.id
    };
    Live.live_statistics_admin({ data }).then(res => {
      if (res.code === 0) {
        res.data.passRatioStr = Math.round(res.data.passRatio * 100) + "%";
        let arr = [];
        arr.push(res.data);
        this.statisticsData = arr;
        this.statisticsState = true;
      }
    });
  }
  // 关闭第一步回调
  closeOne() {
    this.createEditOne = false;
    this.getList();
  }
  closeTwo() {
    this.createEditTwo = false;
    this.getList();
  }
  closeThree() {
    this.createEditThree = false;
    this.getList();
  }
  // 编辑
  edit(e: any): void {
    this.loading = true;
    let arr = this.$store.state.liveData;
    arr.id = e.liveId;
    this.$store.commit('setLiveData', arr)
    let data = {
      liveId: e.liveId
    };
    Live.query_live_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.queryLiveData = res.data;
          this.createEditOne = true;
          this.title = "编辑直播";
          this.isShow.liveBtn = true;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  // 创建直播
  created_live(): void {
    this.$store.state.liveData.id = '';
    this.createEditOne = true;
    this.title = "创建直播";
    this.isShow.liveBtn = true;
  }
  
  createEditOneOver() {
    this.isShow.class = false;
    this.createEditOne = false;
    this.createEditTwo = true;
  }
  createEditTwoOver() {
    this.createEditTwo = false;
  }
  createEditTwoOverUp() {
    this.createEditOne = true;
    this.createEditTwo = false;
  }
  createEditTwoOverDown() {
    this.isShow.user = false;
    this.createEditTwo = false;
    this.createEditThree = true;
  }
  createEditThreeOverUp() {
    this.isShow.class = false;
    this.createEditTwo = true;
    this.createEditThree = false;
  }
  createEditThreeOver() {
    this.createEditThree = false;
    this.getList();
  }
  closeAudit() {
    this.showAudit = false;
    this.state = 4;
    this.reason = "";
  }
  getCategory() {
    let data = {};
    Category.category_list_live({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        let arr = this.$store.state.liveData;
        arr.classify = res.data;
        this.$store.commit('setLiveData', arr)
        this.liveClassify = res.data;
      }
    });
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
    Live.live_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime, "YYYY-MM-DD hh:mm:ss");
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  addClass(e: any) {
    this.$store.commit('setLiveData', { id: e.liveId });
    this.isShow.class = true;
    e.state == 4 ? this.isShow.delete = false : this.isShow.delete = true;
    this.createEditTwo = true;
    this.title = "章节";
  }
  liveReg(e: any, str: string) {
    this.$store.commit('setLiveData', { id: e.liveId });
    this.isShow.user = true;
    if (str === 'baoming') {
      this.isShow.liveBtn = true;
      this.title = "直播报名"
    } else {
      this.isShow.liveBtn = false;
      this.title = "直播统计";
    }
    this.createEditThree = true;
  }
  studyLive() {
    this.isShow.study = true;
    this.statisticsUser = true;
  }
  statisticsUserOver() {
    this.statisticsUser = false;
    this.statistics();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
}
</script>
<style lang="scss" scope>
  .img-bor {
    width: 30px;
    height: 30px;
  }
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

