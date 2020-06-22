<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createdBtn" v-if="prm.isCreate">创建讲师</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="讲师姓名" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="讲师状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table ref="mainTable" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="teacherImg" label="讲师照片" width='90' align='center'>
          <template slot-scope="scope">
            <img class='img-bor' :src="scope.row.teacherImg ? ($store.state.configData.imgDomain + scope.row.teacherImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/teacher.jpg' + $imgSize['30x30'])"/>
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="讲师姓名" min-width="80"></el-table-column>
        <el-table-column prop="idCard" label="讲师身份证号" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="120"></el-table-column>
        <el-table-column prop="school" label="所在单位" min-width="140"></el-table-column>
        <el-table-column prop="nature" label="单位性质" min-width="80"></el-table-column>
        <el-table-column prop="academicTitle" label="职称" min-width="80"></el-table-column>
        <el-table-column prop="scoreNumber" label="评分人数" min-width="80"></el-table-column>
        <el-table-column prop="score" label="评分" min-width="50"></el-table-column>
        <!-- <el-table-column prop="org" label="组织" min-width="140"></el-table-column> -->
        <el-table-column prop="stateStr" label="状态" min-width='70'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="user.userName" label="创建人" min-width='70'></el-table-column>
        <el-table-column prop="createTimeStr" label="创建时间" width='160'></el-table-column>
        <el-table-column prop="" label="操作" width="310">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="majorBtn(scope.row)">讲师培训</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="prm.isRecommend && scope.row.state == 4" type="text" @click.native="recommend(scope.row)">{{scope.row.isRecommend ? '取消推荐' : '推荐'}}</el-button>
            <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="del(scope.row)">删除</el-button>
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
    </el-row>
    <el-dialog width="70%" v-if="createEditOne" :title="title" :visible.sync="createEditOne" :close-on-click-modal="false" :before-close="createEditOver">
      <create-edit @createEditOver="createEditOver" @createEditOverDown="createEditOverDown" :queryData="queryData"></create-edit>
    </el-dialog>
    <el-dialog width="70%" v-if="createEditTwo" title="讲师培训" :visible.sync="createEditTwo" :close-on-click-modal="false" :before-close="createEditTwoOver">
      <major-list @createEditTwoOver='createEditTwoOver' @createEditTwoOverUp="createEditTwoOverUp" :queryData="queryData"></major-list>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="30%" title="删除" :visible.sync="showReason">
      <div>
        <el-input tyle="text" placeholder="请输入删除的原因" v-model="reason"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="delFn()">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Teacher from "@api/otherAll";
import Org from "@api/org";
@Component({
  components: {
    "create-edit": () => import("./createAndEdit.vue"),
    "major-list": () => import("./major/major_list")
  }
})
export default class TeacherList extends Vue {
  createEditOne: boolean = false;
  createEditTwo: boolean = false;
  title: any = "创建讲师";
  isPending: boolean = false;
  params: any = {
    pageSize: 10,
    pageNum: 1,
    teacherId: "",
    sortBy: false,
    sortField: "createTime",
    query: "",
    startDate: "",
    endDate: ""
  };
  prm = {
    isDelete: false,
    isCreate: false,
    isUpdate: false,
    isOnline: false,
    isRecommend: false
  };
  state: number = 4;
  teacherId: string | number = "";

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
  tableData: any[] = [];
  loading: boolean = false;
  time: string[] = [];
  total: number = 0;
  queryData: any = {};

  auditObj = {
    state: 4,
    reason: "",
    teacherId: ""
  };

  showReason: boolean = false;
  delObj: object = {};
  reason: string = "";

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  // 推荐
  recommend(e: any): void {
    let data = {
      teacherId: e.teacherId,
      isRecommend: !e.isRecommend ? 1 : 0
    };
    Teacher.is_recommend_teacher_admin({ data }).then(res => {
      if (res.code === 0) {
        this.getList();
      }
    });
  }
  // 上下线
  on_off(e: any): void {
    let data = {
      teacherId: e.teacherId,
      state: e.state == 4 ? 5 : 4
    };
    Teacher.online_offline_teacher_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: `${e.state == 4 ? "关闭" : "发布"}成功!`,
          type: "success"
        });
        this.getList();
      }
    })
  }
  // 执行逻辑删除
  del(e: any){
    this.showReason = true;
    this.delObj = e;
  }
  delFn(): void {
    if (this.reason === "" || this.reason.includes(" ")) {
      this.$notify.error({
        title: "错误",
        message: "删除原因必填，并且不能含有空格！"
      });
      return;
    }
    this.isPending = true;
    let data = {
      reason: this.reason,
      teacherId: this.delObj.teacherId
    };
    Teacher.delete_teacher_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: "删除成功！",
          type: "success"
        });
        if (this.tableData.length === 1 && this.params.pageNum > 1) {
          this.params.pageNum --;
        }
        this.showReason = false;
        this.reason = "";
        this.getList();
      }
    })
    .finally(() => {
      this.isPending = false;
    })
  }
  // 编辑
  edit(e: any): void {
    this.queryData = e;
    this.title = "编辑讲师";
    this.queryData.showDown = false;
    this.createEditOne = true;
  }
  // 创建讲师
  createdBtn(): void {
    this.title = "创建讲师";
    this.queryData = {};
    this.queryData.showDown = true;
    this.createEditOne = true;
  }
  createEditOver() {
    this.createEditOne = false;
    this.getList();
  }
  createEditOverDown(id: string) {
    this.createEditOne = false;
    if(id)this.queryData.teacherId = id;
    this.queryData.showBtn = true;
    this.createEditTwo = true;
  }
  createEditTwoOverUp() {
    this.createEditOne = true;
    this.createEditTwo = false;
  }
  createEditTwoOver() {
    this.createEditTwo = false;
    this.getList();
  }
  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.state ||
        this.params.teacherType ||
        this.params.startDate ||
        this.params.endDate
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    Teacher.teacher_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
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
  majorBtn(e: any) {
    this.queryData = {...e, showBtn: false};
    this.title = "讲师培训";
    this.createEditTwo = true;
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