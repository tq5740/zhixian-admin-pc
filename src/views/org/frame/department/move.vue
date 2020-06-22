<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="企业名称" v-model="params.query" class='w230' @keyup.13.native="searchKey" @change="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" v-loading="loading" element-loading-text="加载中..." stripe>
        <el-table-column prop="deptName" label="企业名称" min-width="220"></el-table-column>
        <el-table-column prop="newHierarchy" label="新层级" min-width='110'></el-table-column>
        <el-table-column prop="oldHierarchy" label="旧层级" min-width='110'></el-table-column>
        <el-table-column sortable='custom' prop="createTimeStr" label="修改时间" min-width='110'></el-table-column>
        <el-table-column prop="" label="操作" min-width="70">
          <template slot-scope='scope'>
            <el-button type="text" v-if="prm.isUpdate" @click.native="edit(scope.row)">更新</el-button>
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
  </div>
</template>

<script lang="ts">
/*
 module:
    allroute
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-8:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import Org from "@api/org";
import Category from "@api/category";
import Article from "@api/article";
import Role from "@api/role";
import Train from "@api/train";
import Eval from "@api/eval";
import Advert from "@api/advert";
import Exam from "@api/exam";
import Work from "@api/job";
import { debounce } from "typescript-debounce-decorator";
import { State } from "vuex-class";

//https://github.com/ktsn/vuex-class
@Component({
  components: {
  }
})
export default class OrgList extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    query: ""
  };
  total: number = 0;
  loading: boolean = false;
  prm = {
    isRecommend: false,
    isAudit: false,
    isUpdate: false
  };
  tableData: any[] = [];
  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  async edit(e: any) {
    if(e.state == 1){
      this.$notify({
        title: "提示",
        message: "已编辑过了！",
        type: "warning"
      });
      return;
    }
    let data = {
      deptLogId: e.deptLogId
    }
    let res = await Org.update_dept_log_admin({ data }).catch(e => {
    });
    if(res.code === 0) {
      let data = {
        oldHierarchy: e.oldHierarchy,
        newHierarchy: e.newHierarchy
      }
      await Category.update_dept_logupdatePublicsHierarchy_admin({ data })
      await Article.updateArticleHierarchy({ data })
      await Role.updatePermissionHierarchy({ data })
      await Train.updateTrainHierarchy({ data })
      await Advert.updateAdvertHierarchy({ data })
      await Eval.updateEvalHierarchy({ data })
      await Exam.updateExamHierarchy({ data })
      await Work.updateWorkHierarchy({ data })
      this.$notify({
        title: "提示",
        message: "操作成功！",
        type: "success"
      });
      this.getList();
    }
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {
      if (
        this.params.query
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    Org.dept_log_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
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
}
</script>
<style lang="scss">
</style>
