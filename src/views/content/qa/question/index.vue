<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="" class="btn-main">
          <el-button type="primary" @click="create" v-if="prm.isCreate">创建问题</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="问题关键字" v-model="params.query" class='w230' @keyup.13.native="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="平台" v-model="params.type" class='w150' @change="getList" clearable @clear="params.type = ''">
            <el-option :key="i.id" v-for="i in typeArr" :value="i.id" :label="i.text">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="typeStr" label="平台" min-width="120"></el-table-column>
        <el-table-column prop="problemTitle" label="问题" min-width='200'></el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'></el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='140'></el-table-column>
        <el-table-column sortable="custom" prop="createTimeStr" label="创建时间" min-width='180'></el-table-column>
        <el-table-column prop="" label="操作" width="210">
          <template slot-scope='scope'>
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="prm.isOnline && scope.row.state != 2 && scope.row.state != 3" type="text" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button v-if="prm.isDelete && scope.row.state != 4" type="text" @click.native="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='page-num'>
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
    <el-dialog :title="title" v-if="showEdit" :visible.sync="showEdit" @close="closeEdit">
      <el-form label-width="80px">
        <el-form-item label="企业名称 : ">
          <el-select filterable clearable v-model="qaObj.orgId" class="w80per" :disabled="isDisabled">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题平台 : ">
          <el-radio-group v-model="qaObj.type">
            <el-radio :label="1">管理站</el-radio>
            <el-radio :label="2">微就业</el-radio>
            <el-radio :label="3">网络学院</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="输入问题 : ">
          <el-input class='w80per' v-model="qaObj.problemTitle"></el-input>
        </el-form-item>
        <el-form-item label="输入解答 : ">
          <add-edit v-if="showIntro" :placeholder="'请输入解答'" :htmlStr="answer ? answer : ''" ref="addEditRefQuestion"></add-edit>
        </el-form-item>
      </el-form>
      <el-row style="margin-top:10px">
        <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Qa from "@api/qa";
import { debounce } from "typescript-debounce-decorator";

@Component({
  components: {
    //"v-editor": () => import("@c/VEditor.vue")
    "add-edit": () => import ("@c/addEdit.vue")
  }
})
export default class Qalist extends Vue {
  prm = {
    isDelete: false,
    isCreate: false,
    isUpdate: false,
    isOnline: false
  };
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    type: "",
    sortField: "createTime",
    sortBy: false
  };
  showEdit: boolean = false;
  title: string = "创建问题";
  tableData: any[] = [];
  // time: string[] = [];
  total: number = 0;
  loading: boolean = false;
  isPending: boolean = false;
  qaObj: any = {
    orgId: this.$store.state.userInfo.org.orgId,
    type: 1,
    problemId: "",
    problemTitle: "",
    answer: ""
  };
  answer: string = "";
  showIntro: boolean = true;
  typeArr: object[] = [
    {
      id: 1,
      text: "管理站"
    },
    {
      id: 2,
      text: "微就业"
    },
    {
      id: 3,
      text: "网络学院"
    }
  ];
  stateArr: object[] = [
    {
      id: 1,
      text: "草稿"
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
  isDisabled: boolean = false;

  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  // 上下线
  on_off(e: any): void {
    let data = {
      problemId: e.problemId,
      state: e.state == 4 ? 5 : 4
    };
    Qa.online_offline_problem_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: `${e.state == 4 ? "关闭" : "发布"}成功!`,
          type: "success"
        });
        this.getList();
      }
    });
  }
  async getOrgList() {
    if (this.$store.state.myOrgList.length === 0) {
      await this.$store.dispatch("getMyOrgList");
      if (this.$store.state.myOrgList.length === 0) {
        this.$notify({
          title: "提示",
          message: "您暂无企业！",
          type: "error"
        });
        return;
      }
    }
  }
  edit(e: any) {
    this.loading = true;
    this.title = "编辑问题";
    let data = { problemId: e.problemId };
    Qa.query_problem_admin({ data })
      .then(res => {
        if (res.code === 0) {
          Object.keys(this.qaObj).forEach((i, index) => {
            this.qaObj[i] = res.data[i];
          })
          this.answer = this.qaObj.answer;
          this.showIntro = false;
          this.$nextTick(()=>{
            this.showIntro = true;
          })
        }
      })
      .finally(() => {
        this.loading = false;
      });
      
    this.showEdit = true;
    this.isDisabled = true;
    this.getOrgList();
  }
  saveBtn() {
    //@ts-ignore
    //this.qaObj.answer = this.$refs.editor.getHtml();
    this.qaObj.answer = encodeURIComponent(this.$refs.addEditRefQuestion.getHtmlText().replace(/http:/g, "https:"));

    if (!this.qaObj.problemTitle || !this.qaObj.answer) {
      this.$notify({
        title: "提示",
        message: `请输入完整的信息!`,
        type: "error"
      });
      return;
    }
    if ((this.title == "编辑问题")) {
      let data = { ...this.qaObj };
      this.isPending = true;
      Qa.update_problem_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "操作成功！",
              type: "success"
            });
            this.closeEdit();
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      let data = { ...this.qaObj };
      this.isPending = true;
      Qa.create_problem_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "操作成功！",
              type: "success"
            });
            this.closeEdit();
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  closeEdit() {
    this.showEdit = false;
  }
  del(e: any) {
    this.$confirm(`是否将 "${e.problemTitle}" 删除? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          problemId: e.problemId
        };
        Qa.delete_problem_admin({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "删除成功！",
                type: "success"
              });
              this.getList();
            } else {
              this.loading = false;
            }
          })
          .catch(() => {
            this.loading = false;
          });
      })
      .catch(() => {});
  }
  create() {
    this.title = "创建问题";
    this.isDisabled = false;
    this.qaObj = {
      orgId: this.$store.state.userInfo.org.orgId,
      type: 1,
      problemId: "",
      problemTitle: "",
      answer: ""
    };
    this.answer = "";
    this.showEdit = true;
    this.getOrgList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.type || this.params.query) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    Qa.problem_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            i.typeStr = this.$mapTypeStr(i.type, this.typeArr);
          });
          this.total = res.data.total;
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
