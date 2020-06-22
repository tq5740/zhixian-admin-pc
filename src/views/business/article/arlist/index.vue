<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="created_article">创建文章</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="文章名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-cascader filterable :options="articleClassify" :props="keyName" v-model="categoryId" @change="ClassifyId" change-on-select clearable
            placeholder="分类名称"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="文章状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间"
            @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <!-- <el-table-column type="selection" min-width='55'></el-table-column> -->
        <el-table-column prop="articleImg" label="文章封面" width='100' align='center'>
          <template slot-scope="scope">
            <img class='img-bor'
              :src="scope.row.articleImg ? ($store.state.configData.imgDomain + scope.row.articleImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/article.jpg' + $imgSize['30x30'])" />
          </template>
        </el-table-column>
        <el-table-column label="文章名称" min-width="240">
          <template slot-scope='scope'>
            <a style="cursor: pointer" @click="onClickArtic(scope.row)">{{scope.row.articleTitle}}</a>
          </template>
        </el-table-column>

        <el-table-column prop="categoryTitle" label="文章分类" min-width='100'></el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width='170'></el-table-column>
        <el-table-column prop="" label="操作" width="500">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="prm.isAudit && scope.row.state != 5" type="text" @click.native="audit(scope.row)">审核</el-button>
            <el-button v-if="prm.isRecommend && scope.row.state == 4" type="text" @click.native="recommend(scope.row)">
              {{scope.row.isRecommend ? '取消推荐' : '推荐'}}</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 2 && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">
              {{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="scope.row.isOpenReg" type="text" @click.native="apply(scope.row)">报名列表</el-button>
            <el-button v-if="prm.isStatistics" type="text" @click.native="statistics(scope.row)">统计</el-button>
            <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="showDelDialog(scope.row)">删除</el-button>
            <el-button v-if="scope.row.regTemplate" type="text" @click.native="showAccessoryFn(scope.row)">附件</el-button>
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
    <el-dialog width="50%" v-if="createdEditState" :title="title" :visible.sync="createdEditState" :close-on-click-modal="false"
      :before-close="close">
      <create-edit @saveBtn_success="saveBtn_success" :queryData="queryArticleData" :title="{'title':title}"></create-edit>
    </el-dialog>
    <el-dialog width="70%" v-if="isApplyList" :title="title" :visible.sync="isApplyList" :close-on-click-modal="false">
      <apply-list :queryData="queryArticleData"></apply-list>
    </el-dialog>
    <el-dialog width="40%" v-if="statisticsState" title="统计" :visible.sync="statisticsState" :close-on-click-modal="false">
      <el-table header-row-class-name="thead" :data="statisticsData" border v-loading="loading" header-align="center" element-loading-text="加载中...">
        <el-table-column prop="browseNumber" label="浏览量" align="center" min-width="100"></el-table-column>
        <el-table-column prop="complimentNumber" label="点赞数" align="center" min-width="100"></el-table-column>
        <el-table-column prop="commentNumber" label="评论数" align="center" min-width="100"></el-table-column>
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

    <!-- 预览弹出框 -->
    <el-dialog title="文章预览" width="400px" style="height: 900px; overflow: hidden;" class="artic-dlog" :visible.sync="isShowArtic">
      <iframe :src="ArticSrc" style="height: 667px; border: 2px dashed red" width="375px" frameborder="0"></iframe>
    </el-dialog>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Article from "@api/article";
import Category from "@api/category";
import Org from "@api/org";
import { emptyLast } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue"),
    "apply-list": () => import("../../article/reglist/index.vue")
  }
})
export default class Companyreg extends Vue {
  isDelShow: boolean = false;
  createdEditState: boolean = false;
  statisticsState: boolean = false;
  statisticsData: any = [];
  forms: any = null;
  title: any = "创建文章";
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
    isAudit: false,
    isUpdate: false,
    isOnline: false,
    isRecommend: false,
    isStatistics: false
  };
  state: number = 4;
  reason: string = "";
  articleId: string | number = "";
  articleClassify: any[] = [];

  ArticSrc: string = "";
  isShowArtic: boolean = false;

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
  time: string[] = [];
  total: number = 0;
  categoryId: any = [];
  queryArticleData: any = {};

  delArticleId: string = "";
  delCause: string = "";

  isApplyList: boolean = false;

  onClickArtic(e: any) {
    // 生产环境
    this.ArticSrc =
      "https://m.weijiuye.com.cn/pages/article/detail?articleId=" + e.articleId;

    this.isShowArtic = true;
  }

  created() {
    this.getCategory();
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  ClassifyId(e: any) {
    if (e.length) {
      this.params.categoryIds = "" + e;
    } else {
      delete this.params.categoryIds;
    }
    this.getList();
  }
  // 推荐
  recommend(e: any): void {
    let data = {
      articleId: e.articleId,
      isRecommend: !e.isRecommend ? 1 : 0
    };
    Article.recommend_article_admin({ data }).then(res => {
      if (res.code === 0) {
        this.getList();
      }
    });
  }
  // 上下线
  on_off(e: any): void {
    if (e.state == 2) {
      this.$notify({
        title: "警告",
        message: `未通过审核不能发布`,
        type: "warning"
      });
      return;
    }
    if (e.state == 3) {
      this.$notify({
        title: "警告",
        message: `审核中不能发布`,
        type: "warning"
      });
      return;
    }
    let data = {
      articleId: e.articleId,
      state: e.state == 4 ? 5 : 4
    };
    Article.on_off_admin({ data }).then(res => {
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
    this.articleId = e.articleId;
  }
  // 审核
  saveBtn() {
    if ((this.state === 2 && !this.reason) || this.reason.includes(" ")) {
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    let data = {
      articleId: this.articleId,
      state: this.state,
      reason: this.reason
    };
    this.isPending = true;
    Article.audit_article_admin({ data })
      .then(res => {
        if (res.code === 0) {
          // this.$notify({
          //   title: "提示",
          //   message: "操作成功！",
          //   type: "success"
          // });
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
    this.delArticleId = e.articleId;
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
      articleId: this.delArticleId,
      reason: this.delCause
    };
    Article.del_article_admin({ data }).then(res => {
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

  // 报名用户
  apply(e: any) {
    this.queryArticleData = e;
    this.title = e.articleTitle + " 报名列表";
    this.isApplyList = true;
  }
  // 统计
  statistics(e: any) {
    this.statisticsState = true;
    let data = {
      articleId: e.articleId
    };
    Article.query_article_statistics_admin({ data }).then(res => {
      if (res.code === 0) {
        let resData = res.data;
        this.statisticsData = [
          {
            browseNumber: resData.browseNumber || 0,
            complimentNumber: resData.complimentNumber || 0,
            commentNumber: resData.commentNumber || 0
          }
        ];
      }
    });
  }
  // 关闭创建编辑回调
  close() {
    this.createdEditState = false;
    this.getList();
  }
  // 编辑
  edit(e: any): void {
    this.loading = true;
    let data = {
      articleId: e.articleId
    };
    Article.query_article_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.queryArticleData = res.data;
          this.createdEditState = true;
          this.title = "编辑文章";
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  // 创建文章
  created_article(): void {
    this.createdEditState = true;
    this.title = "创建文章";
  }
  // 创建成功
  saveBtn_success() {
    this.createdEditState = false;
    this.getList();
  }
  closeAudit() {
    this.showAudit = false;
    this.state = 4;
    this.reason = "";
  }
  getCategory() {
    let data = {};
    Category.category_list_article({ data }).then(res => {
      if (res.code === 0) {
        emptyLast(res.data);
        this.articleClassify = res.data;
      }
    });
  }
  getList(type: any) {
    if (type !== "type") {
      if (
        this.params.query ||
        this.params.categoryIds ||
        this.params.state ||
        this.params.startTime ||
        this.params.endTime
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Article.article_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
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
  showAccessoryFn(e: any) {
    window.open(
      this.$store.state.configData.fileDomain + e.regTemplate,
      "_blank"
    );
  }
}
</script>
<style lang="scss" scope>
  .img-bor {
    width: 30px;
    height: 30px;
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

