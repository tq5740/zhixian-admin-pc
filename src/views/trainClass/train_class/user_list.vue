<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-input placeholder="姓名/电话/身份证" class='w230' v-model="params.query" @keyup.13.native="searchKey" clearable>
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" class='w150' v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table ref="mainTable" @selection-change="handleSelectionChange" @sort-change='sortFunc' header-row-class-name="thead" :data="tableData"
        border v-loading="loading" element-loading-text="加载中...">
        <el-table-column type="selection" align="center" min-width='55' :selectable='selectInit'></el-table-column>
        <el-table-column prop="idPhoto" label="证件照" width='70' align='center'>
          <template slot-scope="scope">
            <img v-if="scope.row.idPhoto && scope.row.idPhoto.includes('http')" class='img-bor' :src="scope.row.idPhoto" />
            <img v-else class='img-bor'
              :src="scope.row.idPhoto ? ($store.state.configData.imgDomain + scope.row.idPhoto + '/102x126') : require('@/img/common/userp.svg')" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width='80'>
          <template slot-scope="scope">
            <el-tooltip effect="dark" placement="top">
              <div slot="content">{{scope.row.userId ? "用户ID:" + scope.row.userId : "暂无用户ID，请认证"}}</div>
              <span>{{scope.row.name}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width='100'></el-table-column>
        <el-table-column prop="idNumber" label="身份证" min-width='110'></el-table-column>
        <el-table-column prop="testResult" label="考试结果" min-width='70'>
          <template slot-scope='scope'>
            {{scope.row.testResult == 1 ? "合格" : scope.row.testResult == 0 ? "不合格" : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="attendanceResult" label="考勤结果" min-width='70'>
          <template slot-scope='scope'>
            {{scope.row.attendanceResult == 1 ? "合格" : scope.row.attendanceResult == 0 ? "不合格" : "-"}}
          </template>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="280">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="readCardCert(scope.row, 'apply')"
              v-if="(scope.row.authState != 4 || !scope.row.idPhoto) && from === 'apply'">读卡认证</el-button>
            <el-button type="text" @click.native="readCardCert(scope.row, 'print')"
              v-if="(scope.row.authState != 4 || !scope.row.idPhoto) && from === 'print'">身份录入</el-button>
            <!-- <el-button type="text" @click.native="uploadIdCert(scope.row)" v-if="!scope.row.userId && scope.row.state == 1">上传认证</el-button> -->
            <el-button type="text" @click.native="apply(scope.row)"
              v-if="(scope.row.state == 1 || scope.row.state == 2) && scope.row.authState == 4 && scope.row.idPhoto">申请证书</el-button>
            <el-button type="text" @click.native="openPrint(scope.row)" v-if="(scope.row.state == 3 || scope.row.state == 4) && from === 'print'">打印证书
            </el-button>
            <el-button type="text" @click.native="look(scope.row)" v-if="scope.row.certificateUrl">查看证书</el-button>
            <el-button type="text" @click.native="reset(scope.row)" v-if="scope.row.userId && from === 'apply'">重置密码</el-button>
            <el-button type="text" @click.native="dataPreserve(scope.row)" v-if="prm.isSafeguard && from === 'apply'">数据维护</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="mag-top20">
        <span>
          <el-checkbox class="mag-left20" v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
            :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
          <el-button class="mag-left20" @click="apply()" v-if="from === 'apply'">申请证书</el-button>
          <el-button class="mag-left20" @click="openPrint()" v-if="from === 'print'">打印证书</el-button>
        </span>
      </el-row>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
            共有
            <span class="fc303e">{{total}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params.pageSize" class='w65' @change='params.pageNum = 1;getList()'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="60" value="60"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)"
          layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog title="创建培训班级学员" width="60%" :visible.sync="showAddUser" :close-on-click-modal='false' :before-close="closeAddUser" append-to-body>
      <add-user :options="options" from="trainClass"></add-user>
    </el-dialog>
    <iframe src="" frameborder="0" id="iframePrint" style="display:none;"></iframe>
    <div id="printBox" style="display:none;">
      <div
        style="position: relative; width: 917px; height: 580px; font-size: 14px; color: #000; font-family: 'Microsoft YaHei'; page-break-after:always"
        v-for="(item, key) in printData" :key="key">
        <!-- <img :src="$store.state.configData.imgDomain + '/publics/certificate/template.jpg'" alt="证书图片" style="position: absolute; top: 0; left: 0px;"> -->
        <img :src="$store.state.configData.imgDomain + item.idPhoto + '/102x126'" alt=""
          :style="`width: 102px; position: absolute; top: ${positionData.photoTop}px; left: ${positionData.photoLeft}px;`">
        <span
          :style="`position: absolute; top: ${positionData.nameTop}px; left: ${positionData.nameLeft}px; width: 6em; text-align: center;`">{{item.name}}</span>
        <span
          :style="`position: absolute; top: ${positionData.sexTop}px; left: ${positionData.sexLeft}px;`">{{item.sex == 1 ? "男" : item.sex == 2 ? "女" : ""}}</span>
        <span :style="`position: absolute; top: ${positionData.idnumberTop}px; left: ${positionData.idnumberLeft}px;`">{{item.idNumber}}</span>
        <span
          :style="`position: absolute; top: ${positionData.majorTop}px; left: ${positionData.majorLeft}px; width: 18em; text-align: center;`">{{queryUser.trainMajor}}</span>
        <span
          :style="`position: absolute; top: ${positionData.certnumberTop}px; left: ${positionData.certnumberLeft}px; color: #d74341;`">{{item.certificateNumber}}</span>
        <div :style="`position: absolute; top: ${positionData.dateTop}px; left: ${positionData.dateLeft}px;`">
          <span>{{item.timeYear}}</span>
          <span style="padding-left: 20px">{{item.timeMonth}}</span>
          <span style="padding-left: 20px">{{item.timeDay}}</span>
        </div>
      </div>
    </div>
    <el-dialog title="查看证书" width="957px" :visible.sync="showImg" :close-on-click-modal='false' append-to-body>
      <img :src="$store.state.configData.imgDomain + imgSrc" alt="证书图片">
    </el-dialog>
    <el-dialog :title="where === 'print' ? '身份录入' : '读卡认证'" width="60%" :visible.sync="showCreate" v-if="showCreate" :close-on-click-modal='false'
      append-to-body>
      <create-user :queryData="userObj" @close="closeCreate" :where="where"></create-user>
    </el-dialog>
    <el-dialog title="数据维护" width="60%" :visible.sync="updateBox" v-if="updateBox" :close-on-click-modal='false' append-to-body>
      <el-form label-width="120px" label-position="right">
        <el-form-item label="学习进度： ">
          <el-input type="number" placeholder="请输入学习进度" class='w150' @mousewheel.native.prevent v-model="updateData.studyProgress"></el-input>
          &nbsp;%
        </el-form-item>
        <el-form-item label="学习结果：">
          <el-radio-group v-model="updateData.studyResult">
            <el-radio :label="1">合格</el-radio>
            <el-radio :label="0">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考试分数： ">
          <el-input type="number" placeholder="请输入考试分数" class='w150' @mousewheel.native.prevent v-model="updateData.testScore"></el-input>
        </el-form-item>
        <el-form-item label="考试结果：">
          <el-radio-group v-model="updateData.testResult">
            <el-radio :label="1">合格</el-radio>
            <el-radio :label="0">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="维护原因：">
          <el-input placeholder="请输入维护原因" class='w80per' @mousewheel.native.prevent v-model="updateData.remark"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click="saveUpdate">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import { mobileReg } from "@utils/index";
import Trainclass from "@api/trainClass";
import User from "@api/user";
@Component({
  components: {
    "add-user": () => import("@c/AddUser.vue"),
    "create-user": () => import("./create_user.vue")
  }
})
export default class Companyreg extends Vue {
  @Prop({ default: {} })
  public queryUser: object;
  @Prop({ default: "" })
  public from: string;

  params: any = {
    classId: this.queryUser.classId,
    pageSize: 60,
    pageNum: 1,
    sortBy: false,
    sortField: "class_user_id",
    query: ""
  };
  prm = {
    isUpdate: false,
    isSafeguard: false
  };
  state: number = 4;

  stateArr: object[] = [
    {
      id: 1,
      text: "未申请"
    },
    {
      id: 2,
      text: "申请失败"
    },
    {
      id: 3,
      text: "未打印"
    },
    {
      id: 4,
      text: "已打印"
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  total: number = 0;
  showAddUser: boolean = false;

  options: any = {
    params: {
      classId: this.queryUser.classId,
      trainUserId: this.queryUser.trainUserId,
      sortBy: false,
      sortField: "updateTime",
      pageSize: 10,
      pageNum: 1
    },
    arrs: "userIds",
    arr: "userId",
    status: true
  };

  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];
  choiceId: string = "";

  showImg: boolean = false;
  imgSrc: string = "";

  printData: any[] = [];
  positionData: object = {};

  showCreate: boolean = false;
  where: string = "";
  isPending: boolean = false;
  userObj: object = {};

  updateBox: boolean = false;
  updateData: object = {
    studyProgress: null,
    studyResult: null,
    testScore: null,
    testResult: null,
    remark: "",
  };


  created() {
    if ("from" in this.queryUser) {
      if (this.queryUser.from === "未打印") {
        this.params.state = 3;
      } else if (this.queryUser.from === "已打印") {
        this.params.state = 4;
      }
    }
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  closeAddUser() {
    this.getList();
    this.showAddUser = false;
  }
  getList(type: any) {
    if (type !== "type") {
      if (this.params.query || this.params.state) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    if (this.from === "print") {
      Trainclass.train_class_user_print_list_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            });
            this.tableData = res.data.result;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      Trainclass.train_class_user_list_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.total = res.data.total;
            res.data.result.forEach((i: any) => {
              i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            });
            this.tableData = res.data.result;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
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
    this.toggleCheckbox =
      checkedCount === this.tableData.length && this.tableData.length != 0;
    this.isIndeterminate =
      checkedCount > 0 && checkedCount < this.tableData.length;
  }
  selectInit(row: any) {
    if (this.from === "apply") {
      if (
        (row.state == 1 || row.state == 2) &&
        row.authState == 4 &&
        row.idPhoto
      ) {
        return true;
      } else {
        return false;
      }
    }
    if (this.from === "print") {
      if (row.state == 3 || row.state == 4) {
        return true;
      } else {
        return false;
      }
    }
  }
  apply(e: any) {
    if (e) {
      this.choiceId = e.classUserId;
    } else {
      if (this.selectData.length === 0) {
        this.$notify({
          title: "错误",
          message: `请至少选择一个学员!`,
          type: "error"
        });
        return;
      }
      let id = JSON.stringify(this.selectData.map(i => i.classUserId));
      this.choiceId = id.replace(/"|\[|\]/g, "");
    }
    let data = {
      classId: this.queryUser.classId,
      trainUserIds: this.choiceId
    };
    this.loading = true;
    Trainclass.apply_certificate_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `申请成功${res.data.successCounts}人，申请失败${res.data.failCounts}人!`,
            type: "success"
          });
          this.getList();
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  openPrint(e: any) {
    if (e) {
      e.timeYear = this.$formatDate(e.certificateDate, "YYYY");
      e.timeMonth = this.$formatDate(e.certificateDate, "MM");
      e.timeDay = this.$formatDate(e.certificateDate, "DD");
      this.printData = [e];
    } else {
      if (this.selectData.length === 0) {
        this.$notify({
          title: "错误",
          message: `请至少选择一个学员!`,
          type: "error"
        });
        return;
      }
      let id = JSON.stringify(this.selectData.map(i => i.classUserId));
      this.choiceId = id.replace(/"|\[|\]/g, "");
      this.printData = this.selectData;
      for (let i = 0; i < this.printData.length; i++) {
        this.printData[i].timeYear = this.$formatDate(
          this.printData[i].certificateDate,
          "YYYY"
        );
        this.printData[i].timeMonth = this.$formatDate(
          this.printData[i].certificateDate,
          "MM"
        );
        this.printData[i].timeDay = this.$formatDate(
          this.printData[i].certificateDate,
          "DD"
        );
      }
    }
    Trainclass.query_class_print({ data: {} })
      .then(res => {
        if (res.code === 0) {
          this.positionData = res.data;
          this.printFn();
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  printFn() {
    let data = {
      classId: this.queryUser.classId,
      trainClassUserIds:
        (this.printData.length == 1 && this.printData[0].classUserId) ||
        this.choiceId,
      state: 4
    };
    this.loading = true;
    Trainclass.update_print_state({ data })
      .then(res => {
        if (res.code === 0) {
          let html = document.getElementById("printBox").innerHTML;
          let iframeWindow = document.getElementById("iframePrint");
          iframeWindow.contentWindow.document.body.innerHTML = html;
          iframeWindow.contentWindow.document.body.style =
            "margin: 0; padding: 0";
          iframeWindow.contentWindow.print();
          this.getList();
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  look(e: any) {
    this.imgSrc = e.certificateUrl;
    this.showImg = true;
  }
  readCardCert(e: any, str: string) {
    if (str === "print") {
      this.where = "print";
      this.userObj = e;
      this.userObj.hierarchy = this.queryUser.hierarchy;
      this.showCreate = true;
    } else {
      this.$jsonp("http://127.0.0.1:8080/api/ReadMsg")
        .then(res => {
          if (res.retmsg.includes("操作成功")) {
            if (e.idNumber && e.idNumber != res.cardno) {
              this.$notify({
                title: "提示",
                message: "身份证信息不一致，不能认证！",
                type: "error"
              });
              return;
            }
            this.userObj = {};
            this.userObj.imgStr = res.photobase64;
            this.userObj.name = res.name;
            this.userObj.sex = res.sex == "男" ? 1 : 2;
            this.userObj.nation = res.nation + "族";
            this.userObj.birthdayDate =
              res.born.toString().slice(0, 4) +
              "-" +
              res.born.toString().slice(4, 6) +
              "-" +
              res.born.toString().slice(6, 8);
            this.userObj.address = res.address;
            this.userObj.idNumber = res.cardno;
            this.userObj.issued = res.police;
            this.userObj.startDate =
              res.userlifeb.toString().slice(0, 4) +
              "-" +
              res.userlifeb.toString().slice(4, 6) +
              "-" +
              res.userlifeb.toString().slice(6, 8);
            this.userObj.endDate =
              res.userlifee.toString().slice(0, 4) +
              "-" +
              res.userlifee.toString().slice(4, 6) +
              "-" +
              res.userlifee.toString().slice(6, 8);
            this.userObj.phone = e.phone;
            this.userObj.classUserId = e.classUserId;
            this.userObj.idPhoto = e.idPhoto;
            this.userObj.hierarchy = this.queryUser.hierarchy;
            this.where = "apply";
            this.showCreate = true;
          } else {
            this.$notify({
              title: "提示",
              message: "读卡失败！请检查身份证放置位置是否正确！",
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$notify({
            title: "提示",
            message: "读卡失败！读卡器驱动或服务未能正确安装！",
            type: "error"
          });
        });
    }
  }
  reset(e: any): void {
    let data = { userId: e.userId };
    this.$confirm("确定要将此用户的密码重置为：cdjy9957吗？")
      .then(() => {
        User.resetPassword({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `密码重置成功!`,
                type: "success"
              });
            }
          })
          .finally(() => {});
      })
      .catch(() => {});
  }
  closeCreate() {
    this.showCreate = false;
    this.getList();
  }
  dataPreserve(e: any) {
    this.updateId = e.classUserId;
    this.updateBox = true;
  }
  saveUpdate() {
    this.isPending = true;
    this.updateData.classUserId = this.updateId;
    let data = {...this.updateData};
    data.studyProgress = this.updateData.studyProgress / 100;
    Trainclass.update_train_class_user_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `数据修改成功!`,
            type: "success"
          });
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
}
</script>
<style lang="scss" scope>
  .mag-top20 {
    margin-top: 15px;
  }
  .mag-left20 {
    margin-left: 18px;
  }
</style>

