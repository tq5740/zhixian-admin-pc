<template>
  <div id="createAndEdit">
    <el-table ref="mainTable" border :data="tableData" v-loading="loading" element-loading-text="拼命加载中">
      <el-table-column label="资源类型" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.type == 3 ? '课程' : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="资源名称" min-width="130"></el-table-column>
      <el-table-column prop="state" label="状态" min-width="80"></el-table-column>
      <el-table-column label="学习进度" min-width="80">
        <template slot-scope="scope">
          <a style="cursor: pointer;" @click="courseReport(scope.row)" v-if="scope.row.progress">
            {{Math.round(scope.row.progress * 100) + "%"}}
          </a>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="lengthStr" label="学习时长"  min-width='95'></el-table-column>
      <el-table-column prop="completeTimeStr" label="完成时间"  min-width='110'></el-table-column>
      <el-table-column prop="score" label="测试成绩"  min-width='80'>
        <template slot-scope="scope">
          {{scope.row.scope || "-"}}
        </template>
      </el-table-column>
    </el-table>
    <el-dialog width="70%" v-if="statisticsStudy" :title="statisticsUser + ' 用户报表'" :visible.sync="statisticsStudy" :close-on-click-modal="false" append-to-body>
      <statistics-study :queryData="queryStudy"></statistics-study>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Train from "@api/train";

//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "statistics-study": () => import("@c/StatisticsStudy.vue")
  }
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
  statisticsStudy: boolean = false;
  statisticsUser: string = "";
  queryStudy: object = {};
  
  created() {
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    let data = { userId: this.queryData.userId, trainId: this.queryData.trainId };
    Train.detailed_train_record_admin({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.forEach((i: any) => {
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            i.lengthStr = i.length != 0 ? this.$formatSeconds(i.length) : "-";
            i.completeTime ? i.completeTimeStr = this.$formatDate(i.completeTime) : i.completeTimeStr = "-";
          });
          this.tableData = res.data;
          this.loading = false;
        }
      })
      .finally(() => {
        this.loading = false;
      });
    
  }
  courseReport(e: any) {
    this.queryStudy.userId = this.queryData.userId;
    this.queryStudy.courseId = e.id;
    this.statisticsStudy = true;
  }
}  
</script>
<style lang="scss" scoped>
</style>

