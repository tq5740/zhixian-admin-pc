<template>
    <div>
        <el-row class="main-top">
            <el-form :inline="true">
                <el-form-item label="">
                    <el-input style="display:none"></el-input>
                    <el-input placeholder="职位名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
                        <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row class="main-body">
            <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
                <el-table-column prop="workTitle" label="职位名称" min-width="200"></el-table-column>
                <el-table-column prop="stateStr" label="状态" min-width='140'></el-table-column>
                <el-table-column prop="updateUserName" label="删除人" min-width='140'></el-table-column>
                <el-table-column prop="reason" label="删除原因" min-width='140'></el-table-column>
                <el-table-column prop="updateTimeStr" sortable=' custom' label="删除时间" min-width='160'></el-table-column>
                <el-table-column prop="" label="操作" min-width="140">
                    <template slot-scope='scope'>
                        <el-button type="text" @click="onResume(scope.row)">恢复</el-button>
                        <el-button type="text" @click="onRadicalDel(scope.row)">彻底删除</el-button>
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
import { Component, Vue } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Job from "@api/job";
//https://github.com/ktsn/vuex-class
@Component({
  components: {}
})
export default class Companyreg extends Vue {
  params: any = {
    pageSize: 10,
    pageNum: 1,
    type: "",
    workNature: "",
    query: "",
    sortBy: false,
    sortField: "updateTime",
    startTime: "",
    endTime: "",
    isDel: 1
  };
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
  total: number = 0;
  loading: boolean = false;
  tableData: any[] = [];

  created() {
    this.getList();
  }

  // 恢复删除
  onResume(e: any): void {
    this.$confirm("您确定要还原这个职位吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    })
      .then(() => {
        Job.recoverJob({
          data: { workId: e.workId, isDel: 0 }
        }).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "成功",
              message: "职位还原成功！",
              type: "success"
            });
            this.getList();
          } else {
            this.$notify({
              title: "错误",
              message: res.msg,
              type: "error"
            });
          }
        });
      })
      .catch(() => {});
  }
  // 彻底删除
  onRadicalDel(e: any): void {
    this.$confirm("你确定要彻底删除这个职位吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Job.deleteJob({ data: { workId: e.workId } }).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "成功",
              message: "职位已彻底删除！",
              type: "success"
            });
            if (this.tableData.length === 1 && this.params.pageNum > 1) {
              this.params.pageNum --;
            }
            this.getList();
          } else {
            this.$notify({
              title: "错误",
              message: res.msg,
              type: "error"
            });
          }
        });
      })
      .catch(() => {});
  }

  getList(type: any) {
    if (type !== 'type') {if (this.params.query || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    this.loading = true;
    Job.recycleWorkList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.updateTimeStr = this.$formatDate(i.updateTime);
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
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
    .img-bor {
      width: 30px;
      height: 30px;
    }
</style>
