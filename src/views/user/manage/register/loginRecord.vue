<template>
  <div>
    <el-row>
      <el-form>

        <el-form-item label="" class='fr'>
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
    </el-row>
    <el-row>
      <el-table header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="deviceStr" label="设备" min-width="120"></el-table-column>
        <el-table-column prop="ip" label="登录ip" min-width="120"></el-table-column>
        <el-table-column prop="loginTimeStr" label="登录时间" min-width='140'></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination :current-page.sync="params.pageNum" class="mg15 fr" background @current-change="getList" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
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
import { Component, Vue, Prop } from "vue-property-decorator";
import User from "@api/user";
import { debounce } from "typescript-debounce-decorator";
//https://github.com/ktsn/vuex-class
@Component({})
export default class LoginRecord extends Vue {
  @Prop() userId!: "";
  params = {
    pageSize: 10,
    pageNum: 1
  };
  tableData: any[] = [];
  total: number = 0;
  loading: boolean = false;
  deviceArr: any[] = [
    {
      id: 1,
      text: "手机"
    },
    {
      id: 2,
      text: "电脑"
    }
  ];
  created() {
    this.getList();
  }
  getList() {
    let data = {
      userId: this.userId,
      ...this.params
    };
    this.loading = true;
    User.userLoginList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.loginTimeStr = this.$formatDate(i.loginTime);
            i.deviceStr = this.$mapTypeStr(i.device, this.deviceArr);
          });
          this.tableData = res.data.result;
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
