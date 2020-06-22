<template>
  <div id="applyList">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="exportArticleReg" :disabled="tableData.length ? false : true">导出报表</el-button>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" class='w150' v-model="params.state" @change="getarticleRegList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="realName" label="姓名" min-width="80" align="center"></el-table-column>
        <el-table-column prop="articleTitle" label="文章名称" min-width="140" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号码" width='120' align="center"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" width='170' align="center"></el-table-column>
        <el-table-column prop="post" label="职务" min-width='120' align="center"></el-table-column>
        <el-table-column prop="orgName" label="企业" min-width='140' align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" min-width='100' align="center"></el-table-column>
        <el-table-column prop="createTime" label="报名时间" width='170' align="center">
          <template slot-scope="scope">
            {{$formatDate(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width='70'>
          <template slot-scope="scope">
            {{$mapTypeStr(scope.row.state, stateArr)}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.remarks}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="160">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="audit(scope.row)">审核</el-button>
            <el-button type="text" @click.native="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item label="" >
            共有
            <span class="fc303e">{{total}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params.pageSize" class='w65' @change='params.pageNum = 1;getarticleRegList()'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getarticleRegList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog :close-on-click-modal="false" width="30%" title="审核" :visible.sync="showAudit" append-to-body>
      <div>
        <el-radio v-model="state" :label="4">通过</el-radio>
        <el-radio v-model="state" :label="2">不通过</el-radio>
        <br />
        <br />
        <el-input v-show="state ==2" tyle="text" placeholder="请输入审核不通过的原因" v-model="remarks"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    职位管理
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:职位管理
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
import Article from "@api/article";
import System from "@api/system";
//https://github.com/ktsn/vuex-class
@Component({
  components: {},
  props: {
    queryData: {
      type: Object
    }
  }
})
//CE = createAndEdit (i.state, this.stateArr)
export default class CreateAndEdit extends Vue {
  articleId: string = "";
  mapTypeStr: any = this.$mapTypeStr;
  formatDate: any = this.$formatDate;
  tableData: any = [];
  articleName: any = "";

  remarks: string = "";
  state: number = 4;
  total: number = 0;
  phone: string = "";
  params: any = {
    pageNum: 1,
    pageSize: 10
  };
  showAudit: boolean = false;
  loading: boolean = false;
  isPending: boolean = false;
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
      text: "已通过"
    }
  ];
  created() {
    this.articleName = this.queryData.articleId;
    this.getarticleRegList();
  }
  getarticleRegList(type) {
    if (type !== 'type') {if (this.params.query || this.params.state) {
      this.params.pageNum = 1;
    }};
    let data = {
      articleId: this.articleName,
      ...this.params
    };
    Article.articleReg_list({ data }).then(res => {
      if (res.code === 0) {
        this.tableData = res.data.result;
        this.total = res.data.total;
      }
    });
  }
  exportArticleReg() {
    if (this.articleName) {
      window.open(
        `${Article.export_articleReg()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&articleId=${this.articleName}`
        // `http://10.3.1.34:8084${Article.export_articleReg()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&articleId=${this.articleName}`
      );
    } else {
      window.open(
        `${Article.export_articleReg()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-`
        // `http://10.3.1.34:8084${Article.export_articleReg()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-`
      );
    }
  }
  // 审核_弹框
  audit(e: any) {
    this.remarks = "";
    this.state = 4;
    this.showAudit = true;
    this.phone = e.phone;
    this.articleId = e.articleId;
  }
  // 审核
  saveBtn() {
    if(this.state === 2 && !this.remarks || this.remarks.includes(" ")){
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    let data = {
      articleId: this.articleId,
      state: this.state,
      remarks: this.remarks,
      phone: this.phone
    };
    this.isPending = true;
    Article.audit_articleReg({ data })
      .then(res => {
        if (res.code === 0) {
          this.getarticleRegList();
          // this.$notify({
          //   title: "提示",
          //   message: "操作成功！",
          //   type: "success"
          // });
        }
      })
      .finally(() => {
        this.showAudit = false;
        this.isPending = false;
      });
  }
  // 删除
  del(e: any): void {
    let data = {
      phone: e.phone,
      articleId: e.articleId
    };
    this.$confirm("确认删除该报名吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Article.delete_articleReg_admin({ data }).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "删除成功！",
              type: "success"
            });
            this.getarticleRegList();
          }
        });
      })
      .catch(() => {
        // this.$message({
        //   type: "info",
        //   message: "已取消删除"
        // });
      });
  }
}
</script>
<style lang="scss" scoped>
</style>
