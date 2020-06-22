<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" @click="uploadUser">导入临时用户</el-button>
        </el-form-item>
        <el-form-item style="float: right; margin-right: 0;">
          <el-button type="primary" @click="add">加入正式用户</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table ref="mainTable" border @selection-change="handleSelectionChange" header-row-class-name="thead" :data="tableData" v-loading="loading" element-loading-text="加载中...">
        <el-table-column type="selection" min-width="55" align="center"></el-table-column>
        <el-table-column prop="employeeNumber" label="员工编号" min-width='100'></el-table-column>
        <el-table-column prop="realName" label="姓名" min-width="100"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width='120'></el-table-column>
        <el-table-column prop="email" label="电子邮箱" min-width='120'></el-table-column>
        <el-table-column prop="password" label="密码" min-width='120'></el-table-column>
        <el-table-column prop="deptName" label="部门" min-width='200' :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="portName" label="岗位" min-width='140'></el-table-column>
        <el-table-column prop="joinTimeStr" label="入职时间" width='110'></el-table-column>
        <el-table-column prop="error" label="错误原因" min-width='110'></el-table-column>
        <el-table-column prop="" label="操作" width="140">
          <template slot-scope='scope'>
            <el-button type="text" v-if="prm.isUpdate" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" v-if="prm.isDelete" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="prm.isDelete">
        <span class="mag-top20">
          <el-checkbox class="mag-left20" v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
          <el-button class="mag-left20" @click="del()">删除</el-button>
        </span>
      </el-row>
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
    <el-dialog v-if="uploadDialog" :visible.sync="uploadDialog" :before-close="uploadOver" title="导入临时用户" append-to-body>
      <el-form label-width="140px" label-position="right">
        <el-form-item label="用户导入模板下载：">
          <a target="_blank" :href="`${$store.state.configData.fileDomain}/user/import_user.xls`"><el-button>下载模板</el-button></a>
          &nbsp;&nbsp;
          <span>请下载模板，以该模板的解构整理好用户数据</span>
        </el-form-item>
        <el-form-item label="请选择导入文件：">
          <el-upload style="display:inline-block" :action="`${url}?token=${token}`" :show-file-list="false" :on-success='successImport' :on-progress="progressImport" :on-error="errorImport" accept=".xls, .xlsx" :disabled="flag">
            <el-button type="primary">点击上传</el-button>
          </el-upload>
          &nbsp;&nbsp;
          <span>仅支持xls文件导入</span>
          <div class="file-arr">
            <p v-for="(item, index) in fileArr" :key="index">{{item.name}}</p>
          </div>
          <el-progress v-show="showPercent" style="margin-top: 10px" color="#42b983" :percentage="percentNum"></el-progress>
        </el-form-item>
        <el-form-item label="">
          <el-button @click.native="uploadOver">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="40%" title="编辑临时用户" :visible.sync="showEdit" :before-close="closeEdit" append-to-body>
      <el-form label-width="110px">
        <el-form-item label="员工编号：">
          <el-input placeholder="请输入员工编号" v-model="editObj.employeeNumber" class='w80per'></el-input>
        </el-form-item>
        <el-form-item label="用户姓名：">
          <el-input placeholder="请输入姓名" v-model="editObj.realName" class='w80per'></el-input>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input placeholder="请输入手机号码" v-model="editObj.phone" class='w80per'></el-input>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input placeholder="请输入手机号码" v-model="editObj.password" class='w80per'></el-input>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="电子邮箱：">
          <el-input placeholder="请输入电子邮箱" v-model="editObj.email" class='w80per'></el-input>
        </el-form-item>
        <el-form-item label="企业部门：">
          <el-input placeholder="请输入企业部门" v-model="editObj.deptName" class='w80per'></el-input>
        </el-form-item>
        <el-form-item label="企业岗位：">
          <el-input placeholder="请输入企业岗位" v-model="editObj.portName" class='w80per'></el-input>
        </el-form-item>
        <el-form-item label="入职时间：">
          <el-date-picker value-format='yyyy-MM-dd' v-model="editObj.joinTime" type="date" placeholder="选择日期"></el-date-picker>
          &nbsp;
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click="savaBtn">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    staffList
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-21:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import User from "@api/user";
import { debounce } from "typescript-debounce-decorator";
import { State } from "vuex-class";
import { mobileReg, emailReg } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "c-e": () => import("./CreateAndEdit.vue")
  }
})
export default class staffList extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    query: ""
  };
  showBox: boolean = false;
  tableData: any[] = [];
  loading: boolean = false;
  isPending: boolean = false;
  showEdit: boolean = false;
  total: number = 0;
  stateArr: object[] = [
    {
      id: 2,
      text: "未通过"
    },
    {
      id: 3,
      text: "待审核"
    },
    {
      id: 4,
      text: "已通过"
    }
  ];
  selectData: any[] = [];
  editObj = {
    userTemporaryId: "",
    employeeNumber: "",
    realName: "",
    phone: "",
    email: "",
    password: "",
    deptName: "",
    portName: "",
    joinTime: ""
  };
  prm = {
    isAudit: false,
    isCreate: false,
    isDelete: false,
    isImport: false,
    isUpdate: false,
    isReset: false
  };

  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];
  
  delId: string = "";
  url: string = "";
  token: any = this.$store.state.userInfo.token;
  percentNum: number = 0;

  uploadDialog: boolean = false;
  showPercent: boolean = false;
  flag: boolean = false;
  fileArr: object[] = [];

  @State("configData")
  configData: any;
  created() {
    this.getList();
    this.url = User.importUserTemporaryAdmin();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  okCB() {
    this.closeEdit();
    this.getList();
  }
  handleCheckAllChange() {
    if (this.toggleCheckbox) {
      this.$refs.mainTable.toggleAllSelection();
    } else {
      this.$refs.mainTable.clearSelection();
    }
    this.handleSelectionChange;
  }
  handleSelectionChange(e: any) {
    this.selectData = e;
    let checkedCount = e.length;
    this.toggleCheckbox = checkedCount === this.tableData.length && this.tableData.length != 0;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
  }
  edit(e: any) {
    this.showEdit = true;
    Object.keys(this.editObj).forEach(i => {
      if (i === `joinTime`) {
          this.editObj.joinTime = this.$formatDate(e.joinTime);
        } else {
          //@ts-ignore
          this.editObj[i] = e[i];
        }
    });
  }
  closeEdit() {
    this.showEdit = false;
    this.editObj = {
      employeeNumber: "",
      userTemporaryId: "",
      realName: "",
      phone: "",
      email: "",
      password: "",
      deptName: "",
      portName: "",
      joinTime: ""
    };
  }
  del(e: any) {
    if (e) {
      this.delId = e.userTemporaryId;
    } else {
      if (this.selectData.length === 0) {
        this.$notify({
          title: "错误",
          message: `请至少选择一个用户!`,
          type: "error"
        });
        return;
      }
      let id = JSON.stringify(this.selectData.map(i => i.userTemporaryId));
      this.delId = id.replace(/"|\[|\]/g,'');
    }
    this.delFn();
  }
  delFn() {
    this.$confirm(`是否删除所选临时用户?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        let data = {
          userTemporaryIds: this.delId
        };
        User.delete_user_temporary_admin({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `删除成功!`,
                type: "success"
              });
              if ((this.selectData.length === this.tableData.length || this.tableData.length === 1 ) && this.params.pageNum > 1) {
                this.params.pageNum --;
              }
              this.toggleCheckbox = false;
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
  handleSelectionChange(e: any) {
    this.selectData = e;
  }
  updateBatchDept() {
    if (this.selectData.length === 0) {
      this.$notify({
        title: "错误",
        message: `请至少选择一位用户!`,
        type: "error"
      });
      return;
    }
    this.title = `移动部门`;
    this.showBox = true;
  }
  updateBatchPost() {
    if (this.selectData.length === 0) {
      this.$notify({
        title: "错误",
        message: `请至少选择一位用户!`,
        type: "error"
      });
      return;
    }
    this.title = `移动岗位`;
    this.showBox = true;
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.deptId || this.params.postId || this.params.query || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    User.user_temporary_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.joinTimeStr = this.$formatDate(i.joinTime).split(" ")[0];
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  successImport(e: any, file: any, list: any) {
    this.fileArr = list;
    if (e.code !==0) {
      this.$notify({
        title: "警告",
        type: "warning",
        message: e.msg
      });
      this.percentNum = 0;
    } else {
      this.$notify({
        title: "提示",
        type: "success",
        message: `导入成功`
      });
      this.percentNum = 100;
      this.importNum = e.data;
    }
    this.flag = false;
    this.showPercent = false;
  }
  progressImport(e: any) {
    this.flag = true;
    this.percentNum = e.percent - 1;
    this.showPercent = true;
  }
  errorImport(e: any){
    this.flag = false;
    this.$notify({
      title: "错误",
      type: "error",
      message: "上传失败！请检查网络"
    });
  }
  add() {
    this.$confirm(`确定把所有临时用户加入正式用户?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.loading = true;
      User.import_user()
        .then(res => {
          if (res.code === 0) {
            const sNum = res.data.success.length;
            const eNum = res.data.error.length;
            if (sNum > 0 && eNum === 0) {
              this.$notify({
                title: "提示",
                message: `添加成功${sNum}位用户！`,
                type: "success"
              });
            } else if (sNum > 0 && eNum > 0) {
              this.$notify({
                title: "提示",
                message: `添加成功${sNum}位用户，失败${eNum}位用户！`,
                type: "warning"
              });
            } else {
              this.$notify({
                title: "提示",
                message: `添加失败${eNum}位用户！`,
                type: "error"
              });
            }
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
  savaBtn() {
    if (
      !this.editObj.realName ||
      this.editObj.realName.includes(" ") ||
      !this.editObj.phone ||
      this.editObj.phone.includes(" ") ||
      !this.editObj.password ||
      this.editObj.password.includes(" ") ||
      !this.editObj.joinTime
    ) {
      this.$notify({
        title: "提示",
        message: `请填写必填项,并且不能含有空格!`,
        type: "error"
      });
      return;
    }
    if (!mobileReg(this.editObj.phone)) {
      this.$notify({
        title: "提示",
        message: `手机号填写不合法!`,
        type: "error"
      });
      return;
    }
    if (this.editObj.email && !emailReg(this.editObj.email)) {
      this.$notify({
        title: "提示",
        message: `电子邮箱填写不合法!`,
        type: "error"
      });
      return;
    }
    this.isPending = true;
    let joinTime = this.editObj.joinTime.split(" ")[0];
    let data = { ...this.editObj, joinTime };
    User.update_user_temporary_admin({ data })
      .then(res => {
        this.$notify({
          title: "提示",
          message: `编辑成功!`,
          type: "success"
        });
        this.showEdit = false;
        this.getList();
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  uploadUser() {
    this.uploadDialog = true;
    this.percentNum = 0;
  }
  uploadOver() {
    this.fileArr = [];
    this.uploadDialog = false;
    this.getList();
  }
}
</script>
<style lang="scss" scoped>
.mag-top20 {
  float: left;
  margin-top: 15px;
}
.mag-left20 {
  margin-left: 15px;
}
.file-arr {
  margin-top: 10px;
  line-height: 30px;
  p {
    margin: 0;
  }
}
</style>
