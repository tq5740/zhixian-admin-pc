<template>
    <div>
        <el-row>
            <el-form :inline="true">
                <el-form-item label="">
                    <el-input placeholder="投票名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
                        <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
                <!-- <el-form-item>
                    <el-date-picker v-model="time" start-placeholder="删除时间段" end-placeholder="删除时间段" type="daterange" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
                </el-form-item> -->
            </el-form>
        </el-row>
        <el-row>
            <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
                <el-table-column prop="pollTitle" label="投票名称" min-width="200"></el-table-column>
                <el-table-column prop="updateUserName" label="删除人" min-width='140'></el-table-column>
                <el-table-column prop="updateTimeStr" sortable=' custom' label="删除时间" min-width='160'></el-table-column>
                <el-table-column prop="" label="操作" min-width="240">
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
import Poll from "@api/otherAll";
import Category from "@api/category";
import Org from "@api/org";
//https://github.com/ktsn/vuex-class
@Component({
  components: {}
})
export default class Companyreg extends Vue {
  params: any = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "createTime",
    query: "",
    startDate: "",
    endDate: ""
  };
  time: string[] = [];
  total: number = 0;
  loading: boolean = false;
  tableData: any[] = [];

  created() {
    this.getList();
  }

  // 恢复删除
  onResume(e: any): void {
    this.$confirm("您确定要还原吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    })
      .then(() => {
        Poll.recover_poll_admin({
          data: { pollId: e.pollId }
        }).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "成功",
              message: "还原成功！",
              type: "success"
            });
            this.getList();
          }
        });
      })
      .catch(() => {});
  }
  // 彻底删除
  onRadicalDel(e: any): void {
    this.$confirm("你确定要彻底删除吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Poll.delete_poll_admin({ data: { pollId: e.pollId } }).then(
          res => {
            if (res.code === 0) {
              this.$notify({
                title: "成功",
                message: "已彻底删除！",
                type: "success"
              });
              if (this.tableData.length === 1 && this.params.pageNum > 1) {
                this.params.pageNum --;
              }
              this.getList();
            }
          }
        );
      })
      .catch(() => {});
  }

  getList(type: any) {
    if (type !== 'type') { 
      if (this.params.query || this.params.categoryIds || this.params.startDate || this.params.endDate) {
        this.params.pageNum = 1;
      }
    };
    let data = { ...this.params };
    this.loading = true;
    Poll.recycle_poll_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.updateTimeStr = this.$formatDate(i.updateTime);
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
      this.params.startDate = time[0];
      this.params.endDate = time[1];
    } else {
      this.params.startDate = "";
      this.params.endDate = "";
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
}
</script>
<style lang="scss" scope>
</style>
