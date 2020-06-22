<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createdBtn" v-if="prm.isCreate">创建合作企业</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="合作企业名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select filterable clearable v-model="params.orgId" class='w320' @change="getList">
            <el-option placeholder="企业名称" v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body"> <!-- @selection-change="handleSelectionChange" @sort-change='sortFunc' -->
      <el-table ref="mainTable" header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <!-- <el-table-column type="selection" align="center" min-width='55' v-if="prm.isDelete" :selectable='selectInit'></el-table-column> -->
        <el-table-column prop="org.orgImage" label="Logo" width='100' align='center'>
          <template slot-scope="scope">
            <img class='img-bor' :src="scope.row.org.orgImage ? ($store.state.configData.imgDomain + scope.row.org.orgImage+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/logo.jpg' + $imgSize['30x30'])" />
          </template>
        </el-table-column>
        <el-table-column prop="org.orgName" label="合作企业名称" min-width="210"></el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='80'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width='180'></el-table-column>
        <el-table-column prop="" label="操作" width="230">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="prm.isRecommend" type="text" @click.native="recommend(scope.row)">{{scope.row.isRecommend ? "取消推荐" : "推荐"}}</el-button>
            <el-button v-if="prm.isDelete" type="text" @click.native="del(scope.row)">删除</el-button>
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog width="70%" v-if="createEdit" :title="title" :visible.sync="createEdit" :close-on-click-modal="false">
      <create-edit @createEditOver="createEditOver" :queryData="queryData" :title="{'title':title}"></create-edit>
    </el-dialog>
    <!-- 预览弹出框 -->
    <el-dialog title="合作企业预览" width="400px" style="height: 900px; overflow: hidden;" class="artic-dlog" :visible.sync="isShowPreview">
      <iframe :src="previewSrc" style="height: 667px; border: 2px dashed red" width="375px" frameborder="0"></iframe>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Orgchildren from "@api/org";
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue")
  }
})
export default class Companyreg extends Vue {
  createEdit: boolean = false;
  title: any = "创建合作企业";
  params: any = {
    orgId: this.$store.state.userInfo.org.orgId,
    pageSize: 10,
    pageNum: 1,
    sortBy: false,
    sortField: "createTime",
    query: "",
    address: ""
  };
  prm = {
    isDelete: false,
    isCreate: false,
    isUpdate: false,
    isRecommend: false
  };
  orgChildrenId: string | number = "";

  tableData: any[] = [];
  loading: boolean = false;
  total: number = 0;
  queryData: any = {};

  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];
  delId: string = "";

  isShowPreview: boolean = false;
  previewSrc: string = "";

  created() {
    this.getList();
    this.getOrgList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
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
        return;
      }
    }
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
    
  }
  delCheck(){
    if (this.selectData.length === 0) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个合作企业!`,
        type: "error"
      });
      return;
    }
    let id = JSON.stringify(this.selectData.map(i => i.orgChildrenId));
    this.delId = id.replace(/"|\[|\]/g,'');
    this.del();
  }
  del(e: any): void {
    this.$confirm('确认删除所选合作企业?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        orgChildrenId: e ? e.orgChildrenId : this.delId
      };
      Orgchildren.delete_org_children_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "删除成功！",
            type: "success"
          });
          if ((this.selectData.length === this.tableData.length || this.tableData.length === 1 ) && this.params.pageNum > 1) {
            this.params.pageNum --;
          }
          this.getList();
        }
      });
    }).catch(() => { });
  }
  edit(e: any): void {
    this.queryData = e;
    this.createEdit = true;
    this.title = "编辑合作企业";
  }
  createdBtn(): void {
    this.queryData = {};
    this.createEdit = true;
    this.title = "创建合作企业";
  }
  createEditOver() {
    this.createEdit = false;
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.orgId
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Orgchildren.org_children_list_admin({ data })
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
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  onClickTitle(e: any){
    // 生产环境
    this.previewSrc = "https://m.weijiuye.com.cn/pages/discover/publicorgchildren/detail?orgChildrenId=" + e.orgChildrenId;
    this.isShowPreview = true;
  }
  // 推荐
  recommend(e: any): void {
    let data = {
      orgChildrenId: e.orgChildrenId,
      isRecommend: !e.isRecommend ? 1 : 0
    };
    Orgchildren.is_recommend_admin({ data }).then(res => {
      if (res.code === 0) {
        this.getList();
      }
    });
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

