<template>
  <div id="createAndEdit">
    <el-row>
      <el-table ref="table" header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="orgName" label="公司名称" min-width="100"></el-table-column>
        <el-table-column prop="workCastegoryTitle" label="工作职能" min-width="120"></el-table-column>
        <el-table-column label="工作时间段" min-width="120">
          <template slot-scope="scope">
            {{scope.row.startDate + ' 至 ' + scope.row.endDate}}
          </template>
        </el-table-column>
        <el-table-column prop="intro" label="工作简介" min-width="140"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="dele(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin: 20px auto" type="primary" @click='add'>添加工作经历</el-button>
      <div style="width: 100%; text-align: center">
        <el-button type="primary" @click='saveBtnUp'>上一步</el-button>
        <el-button type="primary" @click='saveBtnDown'>下一步</el-button>
      </div>
    </el-row>
    <el-dialog width="50%" :append-to-body="true" v-if="showEdit" :visible.sync="showEdit" :title="title" @close="closeEdit">
      <el-form label-width="120px">
        <el-form-item label="公司名称 : ">
          <el-input placeholder="请填写公司名称" v-model="params.orgName" class='w80per' clearable></el-input>
        </el-form-item>
        <el-form-item label="工作职能 : ">
          <el-cascader class='w80per' v-model="post" :options="classifyList" @change="handleChange" :show-all-levels="false" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="工作时间段 : ">
          <el-date-picker v-model="params.startDate" class='w200' type="month" placeholder="入职日期" value-format="yyyy-MM"></el-date-picker>
          &nbsp;至&nbsp;
          <el-date-picker v-model="params.endDate" class='w200' type="month" placeholder="离职日期" value-format="yyyy-MM"></el-date-picker>
        </el-form-item>
        <el-form-item label="工作简介 : ">
          <el-input placeholder="请填写工作简介" v-model="params.intro" class='w80per h300' type="textarea" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click='saveBtn' :loading="isPending">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from "vue-property-decorator";
import User from "@api/user";
import { emptyLast } from "@utils/index";

@Component({
  components: {
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: "" })
  public queryData: string;

  params: any = {
    userId: this.$store.state.userData.id,
    userWorkId: "",
    orgName: "",
    startDate: "",
    endDate: "",
    workCategoryId: "",
    intro: ""
  };
  loading: boolean = false;
  isPending: boolean = false;
  showEdit: boolean = false;
  tableData: any[] = [];
  userWorkId: string = "";
  title: string = "";

  classifyList: any[] = [];
  workTitle: string = "";
  post: any[] = [];

  created() {
    this.init();
  }
  init() {
    this.loading = true;
    let data = {
      userId: this.$store.state.userData.id,
    }
    User.user_work_list_admin({ data })
      .then((res) => {
        if(res.code === 0){
          this.tableData = res.data;
        }
      })
      .finally(() => {
        this.loading = false;
      })
  }
  add() {
    if (this.tableData.length >= 5) {
       this.$notify({
        title: "提示",
        message: `工作经历最多只能创建5条`,
        type: "error"
      });
      return;
    }
    this.params = {
      userId: this.$store.state.userData.id,
      userWorkId: "",
      orgName: "",
      startDate: "",
      endDate: "",
      workCategoryId: "",
      intro: ""
    };
    this.post = [];
    this.workCategoryId = "";
    this.getClassifyList();
    this.userWorkId = "";
    this.title = "添加工作经历";
    this.showEdit = true;
  }
  async edit(e: any) {
    Object.keys(this.params).forEach((i, index) => {
      this.params[i] = e[i];
    });
    await this.getClassifyList();
    if(e.workCategoryId){
      this.post = [
        ...this.$getFather(
          this.classifyList,
          this.classifyList,
          e.workCategoryId
        ),
        e.workCategoryId
      ]
    }
    this.userWorkId = e.userWorkId;
    this.title = "编辑工作经历";
    this.showEdit = true;
  }
  async getClassifyList() {
    if (this.$store.state.jobClassify.length === 0) {
      await this.$store.dispatch("getJobclassifyTree");
    }
    this.classifyList = [];
    this.classifyList = this.$forTree(
      this.$store.state.jobClassify,
      "workCategoryId",
      "workCategoryTitle"
    );
    emptyLast(this.classifyList);
  }
  handleChange(e: any) {
    this.params.workCategoryId = e[e.length - 1]
  }
  is() {
    if (this.params.orgName === "" || this.params.orgName.includes(" ")) {
      this.$notify({
        title: "提示",
        message: `请输入公司名称且不能含有空格`,
        type: "error"
      });
      return false;
    } else if (this.post.length === 0) {
      this.$notify({
        title: "提示",
        message: `请选择工作职能`,
        type: "error"
      });
      return false;
    } else if (!this.params.startDate || !this.params.endDate) {
      this.$notify({
        title: "提示",
        message: `请输入工作时间段`,
        type: "error"
      });
      return false;
    } else if (!this.params.intro) {
      this.$notify({
        title: "提示",
        message: `请输入工作简介`,
        type: "error"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn() {
    if(!this.is()) return; 
    let data = {
      ...this.params
    }
    if(data && data.intro){
      data.intro = data.intro.replace(/\n|\r\n/g, "<br>");
    }
    this.isPending = true;
    if (this.userWorkId) {
      data.userWorkId = this.userWorkId;
      User.update_user_work_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `操作成功!`,
              type: "success"
            });
            this.closeEdit();
          }
        })
        .finally(() => {
          this.isPending = false;
        })
    } else {
      User.create_user_work_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `操作成功!`,
              type: "success"
            });
            this.closeEdit();
          }
        })
        .finally(() => {
          this.isPending = false;
        })
    }
  }
  closeEdit() {
    this.showEdit = false;
    this.init();
  }
  dele(e: any) {
    this.$confirm('确认删除该条工作经历？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        userWorkId: e.userWorkId
      }
      User.delete_user_work_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功！",
              type: "success"
            });
            this.init();
          }
        })
    }).catch(() => { });
  }
  saveBtnUp() {
    this.$emit("createEditTwoOverUp")
  }
  saveBtnDown() {
    this.$emit("createEditTwoOverDown")
  }
}
</script>
<style lang="scss" scoped>
.w200 {
  width: 200px!important;
}
</style>