<template>
  <div id="createAndEdit">
      <el-table ref="mainTable" border :data="tableData" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column label="编号" width='70'>
          <template slot-scope='scope'>
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column prop="courseChapterTitle" label="章节名称" min-width='150'></el-table-column>
        <el-table-column label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.courseChapterRecord && scope.row.courseChapterRecord.stateStr || "未尝试"}}
          </template>
        </el-table-column>
        <el-table-column label="学习进度" min-width="80">
          <template slot-scope="scope">
            {{scope.row.courseChapterRecord && scope.row.courseChapterRecord.progress && Math.round(scope.row.courseChapterRecord.progress * 100) + "%" || "-"}}
          </template>
        </el-table-column>
        <el-table-column label="学习时长" min-width='110'>
          <template slot-scope="scope">
            {{scope.row.courseChapterRecord && scope.row.courseChapterRecord.length && $formatSeconds(scope.row.courseChapterRecord.length) || "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="courseChapterRecord.score" label="测试成绩" min-width='100'>
          <template slot-scope="scope">
            {{scope.row.courseChapterRecord && scope.row.courseChapterRecord.score || "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="courseChapterRecord.createTimeStr" label="开始学习时间" width='170'>
          <template slot-scope="scope">
            {{scope.row.courseChapterRecord && scope.row.courseChapterRecord.createTimeStr || "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="updateTimeStr" label="最后学习时间" width='170'>
          <template slot-scope="scope">
            {{scope.row.courseChapterRecord && scope.row.courseChapterRecord.updateTimeStr || "-"}}
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

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Course from "@api/train";

//https://github.com/ktsn/vuex-class
@Component({
})

export default class StatisticsUser extends Vue {
  @Prop({ default: {} })
  public queryData: any;
  @Prop({ default: "" })
  public from: string;

  stateArr: object[] = [
    {
      id: 1,
      text: "未尝试"
    },
    {
      id: 2,
      text: "未完成"
    },
    {
      id: 3,
      text: "已完成"
    }
  ];
  tableData: any[] = [];
  total: number = 0;
  loading: boolean = false;
  params: any = {
    pageSize: 10,
    pageNum: 1,
    courseId: this.queryData.courseId,
    userId: this.queryData.userId,
    sortBy: false,
    sortField: "updateTime",
    startTime: "",
    endTime: ""
  };
  
  created() {
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    let data = { ...this.params };
    Course.course_chapter_record_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((e: any, index: any) => {
            if (e.courseChapterRecord && e.courseChapterRecord.createTime) {e.courseChapterRecord.createTimeStr = this.$formatDate(e.courseChapterRecord.createTime, "YYYY-MM-DD hh:mm:ss")};
            if (e.courseChapterRecord && e.courseChapterRecord.updateTime) {e.courseChapterRecord.updateTimeStr = this.$formatDate(e.courseChapterRecord.updateTime, "YYYY-MM-DD hh:mm:ss")};
            if (e.courseChapterRecord && e.courseChapterRecord.state) {e.courseChapterRecord.stateStr = this.$mapTypeStr(e.courseChapterRecord.state, this.stateArr)};
          });
          this.tableData = res.data.result;
          this.total = res.data.total;
          this.loading = false;
        }
      })
      .finally(() => {
        this.loading = false;
      });
    
  }
}  
</script>
<style lang="scss" scoped>
</style>

