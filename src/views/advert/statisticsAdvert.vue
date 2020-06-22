<template>
  <div id="createAndEdit">
    <el-row>
      <el-table ref="mainTable" border :data="tableData" v-loading="loading" element-loading-text="拼命加载中" @sort-change='sortFun'>
        <el-table-column label="设备" min-width="80">
          <template slot-scope="scope">
            {{scope.row.device == 1 ? '电脑端' : scope.row.device == 2 ? '移动端' : '不限'}}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" min-width="100"></el-table-column>
        <el-table-column prop="" label="地址" min-width="160">
          <template slot-scope="scope">
            {{scope.row.province + scope.row.city + scope.row.district + scope.row.street}}
          </template>
        </el-table-column>
        <el-table-column prop="createUser" label="点击人"  min-width='100'></el-table-column>
        <el-table-column prop="createTimeStr" label="点击时间" width='170'></el-table-column>
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
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Advert from "@api/advert";

@Component({
  components: {
  }
})

export default class StatisticsUser extends Vue {

  tableData: any[] = [];
  total: number = 0;
  params: any = {
    pageSize: 10,
    pageNum: 1,
    startTime: "",
    endTime: ""
  };
  
  created() {
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.startTime ||
        this.params.endTime
      ) {
        this.params.pageNum = 1;
      }
    }
    this.loading = true;
    let data = { ...this.params, advertId: this.$store.state.advertData.id };
    Advert.advert_browse_list_admin ({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
          });
          this.tableData = res.data.result;
          this.loading = false;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  sortFun() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
}  
</script>
<style lang="scss" scoped>
</style>

