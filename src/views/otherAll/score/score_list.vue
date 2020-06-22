<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="评分内容" v-model="params.query" class='w230' @keyup.13.native="searchKey" @change="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @selection-change="handleSelectionChange" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column type="selection" align="center" min-width='55' v-if="prm.isDelete"></el-table-column>
        <el-table-column prop="content" label="评分内容" min-width="110"></el-table-column>
        <el-table-column prop="typeStr" label="资源类型" min-width='80'></el-table-column>
        <el-table-column prop="score" label="评分分数" min-width='80'></el-table-column>
        <el-table-column prop="createUser" label="评分人" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="评分时间" min-width='120'></el-table-column>
        <el-table-column prop="" label="操作" width="100">
          <template slot-scope='scope'>
            <el-button v-if="prm.isDelete" type="text" @click.native="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="prm.isDelete">
        <span class="mag-top20">
          <el-checkbox class="mag-left20" v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
          <el-button class="mag-left20" @click="delCheck">删除</el-button>
        </span>
      </el-row>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Other from "@api/otherAll";
@Component({
  components: {
  }
})
export default class Score extends Vue {
  params: any = {
    pageSize: 10,
    pageNum: 1,
    sortBy: false,
    sortField: "createTime",
    query: ""
  };
  prm = {
    isDelete: false
  };
  scoreId: string | number = "";

  tableData: any[] = [];
  loading: boolean = false;
  total: number = 0;

  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];
  delId: string = "";

  created() {
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
  delCheck(){
    if (this.selectData.length === 0) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个评分!`,
        type: "error"
      });
      return;
    }
    let id = JSON.stringify(this.selectData.map(i => i.scoreId));
    this.delId = id.replace(/"|\[|\]/g,'');
    this.del();
  }
  del(e: any): void {
    this.$confirm('确认删除所选评分?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        scoreId: e ? e.scoreId : this.delId
      };
      Other.delete_score_admin({ data }).then(res => {
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
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.state
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Other.score_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.typeStr = this.$mapTypeStr(i.resourcesType, this.$store.state.scoreArr);
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