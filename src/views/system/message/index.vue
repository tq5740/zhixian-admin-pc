<template>
    <div id="record">
        <el-row>
            <el-form :inline="true">
                <el-form-item label="">
                    <el-input style="display:none"></el-input>
                    <el-input placeholder="请输入手机号进行搜索" v-model="params.query" class='w320' @keyup.13.native="getList">
                        <el-button class="clickBtn" @click="getList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="" class='fr'>
                    共有
                    <span class="fc303e">{{total}}</span>条数据，每页显示
                    <el-select placeholder="" v-model="params.pageSize" class='w65' @change='params.pageNum = 1;getList()'>
                        <el-option label="10" value=10></el-option>
                        <el-option label="20" value=20></el-option>
                        <el-option label="50" value=50></el-option>
                    </el-select>
                    条
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
                <el-table-column prop="iphone" label="手机号" min-width='80'></el-table-column>
                <el-table-column prop="openId" label="微信openID" min-width='80'></el-table-column>
                <el-table-column show-overflow-tooltip="true" prop="content" label="发送正文" min-width='140'></el-table-column>
                <el-table-column prop="createTime" label="发送时间" min-width='120'></el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination :current-page.sync="params.pageNum" class="mg15 fr" background @current-change="getList" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MessageApi from "@api/message";
import { debounce } from "typescript-debounce-decorator";
@Component({})
export default class Message extends Vue {
  tableData: object[] = [];
  loading: boolean = false;
  total: number = 0;
  toastMes: string = "";
  params = {
    pageSize: 10,
    pageNum: 1,
    query: ""
  };

  created() {
    console.log(1111)
    this.getList();
  }
  // method
  getList(): void {
    this.loading = true;
    if (this.params.query) {
      this.params.pageNum = 1;
    };
    MessageApi.system_message_list_admin({ data: this.params })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((i: any) => {
            i.createTime = this.$formatDate(i.createTime);
          });
          this.tableData = res.data.result;
          this.total = res.data.total;
        } else {
          this.$notify({
            title: "提示",
            message: res.msg,
            type: "error"
          });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss">
    .el-tooltip__popper {
        max-width: 700px;
    }
</style>   