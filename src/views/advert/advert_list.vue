<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="created_advert" v-if="prm.isCreate">创建广告</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="广告标题" class='w230' v-model="params.query" @keyup.13.native="searchKey" clearable>
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader placeholder="广告分类" class='w150' v-model="categoryId" :options="advertClassify" :props="keyName" @change="ClassifyId" filterable change-on-select clearable></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="广告类型" class='w150' v-model="params.type" @change="getList" clearable @clear="params.type = ''">
            <el-option v-for="(i) in typeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="广告状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-time-picker is-range v-model="time" @change='handleChangeTime' start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择投放时间段" value-format='HH:mm:ss'></el-time-picker>
        </el-form-item> -->
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="advertImg" label="广告封面" width='100' align='center'>
          <template slot-scope="scope">
            <img v-if="scope.row.advertImg && scope.row.advertImg.includes('http')" class='img-bor' :src="scope.row.advertImg+$imgSize['30x30']" />
            <img v-else class='img-bor' :src="scope.row.advertImg ? ($store.state.configData.imgDomain + scope.row.advertImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/advert.jpg' + $imgSize['30x30'])"/>
          </template>
        </el-table-column>
        <el-table-column prop="advertTitle" label="广告标题" min-width="140"></el-table-column>
        <el-table-column prop="categoryTitle" label="广告分类" min-width='100'></el-table-column>
        <el-table-column label="广告类型" min-width="100">
          <template slot-scope="scope">
            {{scope.row.type == 1 ? '图片广告' : '视频广告'}}
          </template>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width='80'></el-table-column>
        <el-table-column prop="timeStr" label="投放时间段" width='180'></el-table-column>
        <el-table-column prop="" label="操作" width="320">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="prm.isAudit && scope.row.state != 5" type="text" @click.native="audit(scope.row)">审核</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="prm.isStatistics" type="text" @click.native="statistics(scope.row)">统计</el-button>
            <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="showDelDialog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog width="70%" v-if="createEditOne" :title="title" :visible.sync="createEditOne" :close-on-click-modal="false" :before-close="createEditOneOver">
      <create-edit-one @createEditOneOver="createEditOneOver" :queryData="queryAdvertData" :title="{'title':title}"></create-edit-one>
    </el-dialog>
    <el-dialog width="70%" v-if="statisticsAdvert" title="广告浏览日志" :visible.sync="statisticsAdvert" :close-on-click-modal="false" :before-close="statisticsAdvertOver">
      <statistics-advert @statisticsUserOver="statisticsAdvertOver"></statistics-advert>
    </el-dialog>
    <el-dialog width="50%" v-if="statisticsState" title="统计" :visible.sync="statisticsState" :close-on-click-modal="false">
      <el-table header-row-class-name="thead" :data="statisticsData" border v-loading="loading" header-align="center" element-loading-text="加载中...">
        <el-table-column prop="provinceRatio" label="覆盖省份占比" align="center" min-width="80"></el-table-column>
        <el-table-column prop="cityRatio" label="覆盖城市占比" align="center" min-width="80"></el-table-column>
        <el-table-column prop="mobileRatio" label="移动端占比" align="center" min-width="80"></el-table-column>
        <el-table-column prop="browseNumber" label="浏览量" align="center" min-width="80">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="showPV(scope.row)">{{scope.row.browseNumber}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="clickNumber" label="点击量" align="center" min-width="80"></el-table-column>
        <el-table-column prop="ipNumber" label="IP量" align="center" min-width="80"></el-table-column>
        <el-table-column prop="startTimeStr" label="开始时间" align="center" min-width="80"></el-table-column>
        <el-table-column prop="endTimeStr" label="结束时间" align="center" min-width="80"></el-table-column>
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
import Advert from "@api/advert";
import Category from "@api/category";
import Org from "@api/org";
import { emptyLast } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "create-edit-one": () => import("./createAndEdit_one.vue"),
    "statistics-advert": () => import("./statisticsAdvert.vue")
  }
})
export default class Companyreg extends Vue {
  isDelShow: boolean = false;
  createEditOne: boolean = false;
  statisticsAdvert: boolean = false;
  statisticsState: boolean = false;
  statisticsData: any = [];
  title: any = "创建广告";
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
    isStatistics: false
  };
  state: number = 4;
  reason: string = "";
  advertId: string | number = "";
  advertClassify: any[] = [];

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
  typeArr: object[] = [
    {
      id: 1,
      text: "图片广告"
    },
    {
      id: 2,
      text: "视频广告"
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  showAudit: boolean = false;
  isPending: boolean = false;
  time: string[] = [];
  total: number = 0;
  categoryId: any = [];
  queryAdvertData: any = {};
  queryAdvertId: string = "";

  delAdvertId: string = "";
  delCause: string = "";

  created() {
    this.getCategory();
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  advertOnlineOffline() {
    let data = {
      state: 4,
      advertId: this.$store.state.advertData.id
    }
    Advert.online_offline_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.createEditThree = this.createEditTwo = this.createEditOne = false
        }
      })
  }
  ClassifyId(e: any) {
    if (e.length) {
      this.params.categoryId = "" + e;
    } else {
      delete this.params.categoryId;
    }
    this.getList();
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
      advertId: e.advertId,
      state: e.state == 4 ? 5 : 4
    };
    Advert.online_offline_admin({ data }).then(res => {
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
    this.advertId = e.advertId;
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
      advertId: this.advertId,
      state: this.state,
      reason: this.reason
    };
    this.isPending = true;
    Advert.audit_advert_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "审核成功！",
            type: "success"
          });
          this.closeAudit();
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  // 展示删除细节
  showDelDialog(e: any): void {
    this.isDelShow = true;
    this.delAdvertId = e.advertId;
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
      advertId: this.delAdvertId,
      reason: this.delCause
    };
    Advert.del_advert_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: "删除成功！",
          type: "success"
        });
        this.isDelShow = false;
        this.delCause = "";
        this.getList();
      }
    });
  }

  // 统计
  statistics(e: any) {
    if(e){
      let arr = this.$store.state.advertData;
      arr.id = e.advertId;
      this.$store.commit('setAdvertData', arr)
    }
    let data = {
      advertId: this.$store.state.advertData.id,
      pageSize: 10,
      pageNum: 1
    };
    Advert.advert_statistics_list_admin({ data }).then(res => {
      if (res.code === 0) {
        res.data.result.forEach(i => {
          i.startTimeStr = this.$formatDate(i.startTime, "YYYY-MM-DD");
          i.endTimeStr = this.$formatDate(i.endTime, "YYYY-MM-DD");
        });
        this.statisticsData = res.data.result;
        this.statisticsState = true;
      }
    });
  }
  // 编辑
  edit(e: any): void {
    this.title = "编辑广告";
    this.queryAdvertData = e;
    this.createEditOne = true;
  }
  // 创建广告
  created_advert(): void {
    this.title = "创建广告";
    this.queryAdvertData = {
      type: 1,
      device: 0
    }
    this.createEditOne = true;
  }
  
  createEditOneOver() {
    this.getList();
    this.createEditOne = false;
  }
  closeAudit() {
    this.showAudit = false;
    this.state = 4;
    this.reason = "";
  }

  getCategory() {
    let data = {};
    Category.category_list_advert({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        this.advertClassify = res.data;
      }
    });
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.categoryId ||
        this.params.state ||
        this.params.startTime ||
        this.params.endTime
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Advert.advert_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.timeStr = this.$formatDate(i.startTime, "hh:mm:ss") + ' 至 ' + this.$formatDate(i.endTime, "hh:mm:ss");
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
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
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  showPV() {
    this.statisticsAdvert = true;
  }
  statisticsAdvertOver() {
    this.statisticsAdvert = false;
    this.statistics();
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

