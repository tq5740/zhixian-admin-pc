<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createdBtn">创建讲师培训</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table ref="mainTable" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="certImg" label="证书扫描件" width='100'>
          <template slot-scope="scope">
            <img class='img-bor' :src="scope.row.certImg ? ($store.state.configData.imgDomain + scope.row.certImg+$imgSize['30x30']) : require('@/img/common/zhengshu.png')"/>
          </template>
        </el-table-column>
        <el-table-column prop="certNumber" label="正书编号" min-width='100'></el-table-column>
        <el-table-column prop="trainMajor" label="培训工种" min-width="140"></el-table-column>
        <el-table-column prop="majorLevel" label="专业级别" min-width="100"></el-table-column>
        <el-table-column prop="user.userName" label="创建人" min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width='170'></el-table-column>
        <el-table-column prop="" label="操作" width="140">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="edit(scope.row)" v-if="queryData.state != 4">编辑</el-button>
            <el-button type="text" @click.native="dele(scope.row)" v-if="queryData.state != 4">删除</el-button>
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <el-form v-if="queryData.showBtn">
        <el-form-item label=" " label-width="120px" class="mg-center">
          <el-button type="primary" @click="back">上一步</el-button>
          <el-button type="primary" @click="saveBtn">完成</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog width="70%" v-if="createEdit" :title="title" :visible.sync="createEdit" :close-on-click-modal="false" :before-close="createEditOver" append-to-body>
      <create-edit @createEditOver="createEditOver" :queryData="queryObj"></create-edit>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Teacher from "@api/otherAll";
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue")
  }
})
export default class Companyreg extends Vue {
  @Prop({ default: {} })
  public queryData: object;

  createEdit: boolean = false;
  title: any = "创建讲师培训";
  params: any = {
    pageSize: 10,
    pageNum: 1,
    teacherId: this.queryData.teacherId,
    sortBy: false,
    sortField: "createTime",
    query: ""
  };
  tableData: any[] = [];
  loading: boolean = false;
  total: number = 0;
  queryObj: object = {};

  created() {
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.type
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Teacher.teacher_major_list_admin({ data })
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
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  edit(e: any): void {
    this.createEdit = true;
    this.title = "编辑讲师培训";
    this.queryObj = e;
  }
  createdBtn(): void {
    this.createEdit = true;
    this.title = "创建讲师培训";
    this.queryObj = this.queryData;
  }
  createEditOver() {
    this.createEdit = false;
    this.getList();
  }
  dele(e: any) {
    let data = {
      teacherMajorId: e.teacherMajorId
    }
    Teacher.delete_teacher_major_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            type: "success",
            message: "操作成功！"
          });
          if (this.tableData.length === 1 && this.params.pageNum > 1) {
            this.params.pageNum --;
          }
          this.getList();
        }
      })
  }
  back(){
    this.$emit("createEditTwoOverUp");
  }
  saveBtn() {
    this.$emit("createEditTwoOver");
  }
}
</script>
<style lang="scss" scope>
.mg-center{
    text-align: center;
    margin-right: 13%;
  }
</style>