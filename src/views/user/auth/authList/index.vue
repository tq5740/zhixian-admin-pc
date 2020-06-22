<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true" class="btn-main">
        <el-form-item label="">
          <el-button type="primary" @click="auth_onclick">认证</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item>
          <el-input style="display:none"></el-input>
          <el-input placeholder="姓名/身份证号" v-model="params.query" class='w230' @keyup.13.native="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" v-model="params.state" class="w150" @change="getList" clearable @clear="params.state = ''">
            <el-option :key="i.id" v-for="i in stateArr" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change="handleChangeTime" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table stripe @sort-change="changeTime" header-row-class-name="thead" :data="tableData" v-loading="loading" element-loading-text="加载中...">
        <el-table-column align="center" prop="idPhoto" label="证件照" width="80">
          <template slot-scope="scope">
            <img class="img-bor1" :src="scope.row._idPhoto">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
        <el-table-column prop="sex" label="性别" min-width="80">
          <template slot-scope="scope">{{scope.row.sex === 1 ? '男' : '女'}}</template>
        </el-table-column>
        <el-table-column prop="idNumber" label="身份证号" min-width="220"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="140"></el-table-column>
        <el-table-column prop="state" label="状态" min-width="100">
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width="100"></el-table-column>
        <el-table-column sortable="custom" prop="updateTimeStr" label="修改日期" width="160"></el-table-column>
        <el-table-column prop label="操作" width="100">
          <template slot-scope="scope">
            <!-- <el-button type="text" v-if="prm.isUpdate" @click.native="edit(scope.row)">编辑</el-button> -->
            <el-button type="text" v-if="prm.isAudit" @click.native="audit(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
            共有
            <span class="fc303e">{{total}}</span>条数据，每页显示
            <el-select placeholder v-model="params.pageSize" class="w65" @change='params.pageNum = 1;getList()'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </el-row>
    <!-- 审核 -->
    <el-dialog :close-on-click-modal="false" width="40%" title="审核" v-if="showAudit" :visible.sync="showAudit" :before-close="closeAudit">
      <el-form class="AuthInfo">
        <p>
          <span></span>
          <img class="w100px" v-if="auditObj.idPhoto" :src="(auditObj.idPhoto  && auditObj.idPhoto.includes('http')) ? auditObj.idPhoto : $store.state.configData.imgDomain+auditObj.idPhoto"></p>
        <p>
          <span>姓名：</span>
          {{auditObj.name}}
        </p>
        <p>
          <span>性别：</span>
          {{auditObj.sex === 1 ? '男' : '女'}}
        </p>
        <p>
          <span>民族：</span>
          {{auditObj.nation ? auditObj.nation : "-"}}
        </p>
        <p>
          <span>手机号码：</span>
          {{auditObj.phone}}
        </p>
        <p>
          <span>出生日期：</span>
          {{auditObj.birthday}}
        </p>
        <p>
          <span>户籍地址：</span>
          {{auditObj.address ? auditObj.address : "-"}}
        </p>
        <p>
          <span>身份证号：</span>
          {{auditObj.idNumber}}
        </p>
        <p v-if="auditObj.startDate && auditObj.endDate">
          <span>有效期：</span>
          {{auditObj.startDate}}至 {{auditObj.endDate}}
        </p>
        <p v-else>
          <span>有效期：</span>
          -
        </p>
        <p>
          <span>发证机关：</span>
          {{auditObj.issued ? auditObj.issued : "-"}}
        </p>
        <p>
          <span>身份证照：</span>
          <em class="img-box">
            <img class="w50" v-if="auditObj.idFace" :src="(auditObj.idFace  && auditObj.idFace.includes('http')) ? auditObj.idFace+$imgSize[`224x126`] : $store.state.configData.imgDomain+auditObj.idFace+$imgSize[`224x126`]" @click="showImgFn(auditObj.idFace)" style="margin-right:4%">
            <img class="w50" v-if="auditObj.idBack" :src="(auditObj.idBack  && auditObj.idBack.includes('http')) ? auditObj.idBack+$imgSize[`224x126`] : $store.state.configData.imgDomain+auditObj.idBack+$imgSize[`224x126`]" @click="showImgFn(auditObj.idBack)">
          </em>
        </p>
      </el-form>
      <el-dialog title="预览" width="40%" v-if="showImg" :visible.sync="showImg" append-to-body>
        <img class="w100" :src="showImgUrl">
      </el-dialog>
      <br>
      <br>
      <div>
        <el-radio v-model="auditObj.state" :label="4">通过</el-radio>
        <el-radio v-model="auditObj.state" :label="2">不通过</el-radio>
        <br>
        <br>
        <el-input v-show="auditObj.state ==2" tyle="text" placeholder="请输入审核不通过的原因" v-model="auditObj.reason"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog :close-on-click-modal="false" title="编辑" v-if="showEdit" :visible.sync="showEdit" :before-close="closeEdit">
      <el-form label-width="80px">
        <el-form-item label="姓名 : ">
          <el-input v-model="editObj.name" class="w320"></el-input>
        </el-form-item>
        <el-form-item label="身份证号 : ">
          <el-input v-model="editObj.idNumber" class="w320"></el-input>
        </el-form-item>
      </el-form>
      <el-row style="margin-top:10px">
        <el-button type="primary" class="fr" :loading="isPending1" @click="saveBtn1">确定</el-button>
      </el-row>
    </el-dialog>

    <el-dialog title="读取信息" :visible.sync="showAuthInfo" width="30%" v-if="showAuthInfo" @close="onDialogConfirmClick">
      <el-form class="AuthInfo">
        <p>
          <span>姓名：</span>
          {{authUserInfo.realName}}
        </p>
        <p>
          <span>性别：</span>
          {{params.sexA}}
        </p>
        <p>
          <span>民族：</span>
          {{apiData.nation}}
        </p>
        <p>
          <span>出生日期：</span>
          {{authUserInfo.birthDate}}
        </p>
        <p>
          <span>户籍地址：</span>
          {{authUserInfo.address}}
        </p>
        <p>
          <span>身份证号：</span>
          {{authUserInfo.idCard}}
        </p>
        <p>
          <span>有效期：</span>
          {{authUserInfo.startTime}} 至 {{authUserInfo.endTime}}
        </p>
        <p>
          <span>发证机关：</span>
          {{authUserInfo.issued}}
        </p>
        <p class="AuthInfoidPhoto">
          <span>身份证照：</span>
          <img v-if="apiData.imgStr" :src="['data:image/jpg;base64,']+apiData.imgStr" class="avatar">
        </p>
        <p class="AuthInfoPhone">
          <span>手机号：</span>
          <el-input placeholder="请输入手机号码" v-model="apiData.phone" class="w240"></el-input>
          <span class="fc303e">*必填</span>
        </p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approve">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示：该手机号用户已认证过身份证" :visible.sync="showCompareInfo" width="30%" v-if="showCompareInfo" @close="onDialogConfirmClick">
      <el-form class="AuthInfo">
        <p>
          <span>原姓名：</span>
          {{params.nameOld}}
        </p>
        <p>
          <span>原身份证号：</span>
          {{params.idOld}}
        </p>
      </el-form>
      <br>
      <el-form class="AuthInfo">
        <p>
          <span>读取姓名：</span>
          {{authUserInfo.realName}}
        </p>
        <p>
          <span>读取身份证号：</span>
          {{authUserInfo.idCard}}
        </p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="coverNo">不覆盖，保留原有</el-button>
        <el-button type="primary" @click="confirm1">覆盖为新身份信息</el-button>
      </span>
    </el-dialog>
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
import { Component, Vue } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import UserAuth from "@api/userAuth";
import System from "@api/system";
import UpImg from "@api/upImg";
import { constants } from "http2";
//https://github.com/ktsn/vuex-class
@Component({})
export default class AuthList extends Vue {
  stateArr: object[] = [
    {
      id: 3,
      text: "待审核"
    },
    {
      id: 2,
      text: "未通过"
    },
    {
      id: 4,
      text: "已认证"
    }
  ];
  prm = {
    isAudit: false,
    isUpdate: false
  };
  params: any = {
    state: "",
    query: "",
    pageSize: 10,
    pageNum: 1,
    startTime: "",
    endTime: "",
    sortBy: false,
    sortField: "updateTime",
    sexA: "",
    nameOld: "",
    idOld: ""
  };
  apiData: any = {
    phone: "",
    name: "",
    sex: "",
    nation: "",
    birthday: "",
    address: "",
    idNumber: "",
    issued: "",
    startDate: "",
    endDate: "",
    idPhoto: "",
    isAuth: "1",
    userId: "",
    imgStr: "",
    path: "/user/user/id"
  };
  editObj: any = {
    name: "",
    idNumber: "",
    userId: ""
  };
  authUserInfo: object = null;
  reader: any = new FileReader();
  showAuthInfo: boolean = false;
  showCompareInfo: boolean = false;
  showEdit: boolean = false;
  showAudit: boolean = false;
  showImg: boolean = false;
  showImgUrl: string = "";
  isPending: boolean = false;
  isPending1: boolean = false;
  upLoading: boolean = false;
  time: string[] = [];
  tableData: any[] = [];
  loading: boolean = false;
  total = 0;
  auditObj = {
    phone: "",
    name: "",
    sex: "",
    nation: "",
    birthday: "",
    address: "",
    idNumber: "",
    issued: "",
    startDate: "",
    endDate: "",
    idPhoto: "",
    isAuth: "1",
    idFace: "",
    idBack: "",
    state: 4,
    reason: "",
    userId: ""
  };
  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  onDialogConfirmClick() {
    this.apiData.phone = "";
    this.apiData.idPhoto = "";
  }
  dateFormat(e: any) {
    let BornF = e.substr(0, 4);
    let BornM = e.substr(4, 2);
    let BornE = e.substr(6, 2);
    let arr = new Array();
    arr.push(BornF);
    arr.push(BornM);
    arr.push(BornE);
    return arr.join("-");
  }
  showImgFn(e): void {
    this.showImg = true;
    this.showImgUrl =
      e && e.includes("http") ? e : this.$store.state.configData.imgDomain + e;
  }
  confirm(): void {
    let phone = this.apiData.phone;
    if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(phone)) {
      this.$notify({
        title: "提示",
        message: `请输入正确的手机号!`,
        type: "error"
      });
      return;
    } else {
      let data = { ...this.apiData };
      UserAuth.sendUserAuthInfo({ data })
        .then(res => {
          const resData = res.data;
          this.apiData.userId = resData.userId;
          if (res.code === 0) {
            if (resData.isUpdate == false) {
              this.params.nameOld = resData.name;
              this.params.idOld = resData.idNumber;
              this.showCompareInfo = true;
              return;
            }
            this.onDialogConfirmClick();
            this.$notify({
              title: "提示",
              message: "认证/修改成功！",
              type: "success"
            });
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
          this.showAuthInfo = false;
        });
    }
  }
  authInfo() {
    const {
      realName,
      sex,
      nation,
      birthDate,
      address,
      idCard,
      startTime,
      endTime,
      issued,
      photo
    }: any = this.authUserInfo;
    this.apiData.name = realName;
    this.apiData.sex = sex;
    this.apiData.nation = nation;
    this.apiData.imgStr = photo;
    this.apiData.birthday = birthDate;
    this.apiData.address = address;
    this.apiData.idNumber = idCard;
    this.apiData.startDate = startTime;
    this.apiData.endDate = endTime;
    this.apiData.issued = issued;
    this.params.sexA = sex == 1 ? "男" : "女";
  }
  //确认覆盖
  confirm1() {
    let data = { ...this.apiData, type: 1 };
    UserAuth.updateUserauth({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "覆盖成功！",
            type: "success"
          });
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
        this.showCompareInfo = false;
      });
  }
  //取消认证
  approve() {
    this.showAuthInfo = false;
    this.$notify({
      title: "提示",
      message: "取消认证",
      type: "error"
    });
  }
  //取消覆盖
  coverNo() {
    this.showCompareInfo = false;
    this.$notify({
      title: "提示",
      message: "取消覆盖",
      type: "error"
    });
  }
  closeEdit(): void {
    this.editObj = {
      name: "",
      idNumber: "",
      userId: ""
    };
    this.showEdit = false;
  }

  closeAudit() {
    this.auditObj = {
      phone: "",
      name: "",
      sex: "",
      nation: "",
      birthday: "",
      address: "",
      idNumber: "",
      issued: "",
      startDate: "",
      endDate: "",
      idPhoto: "",
      isAuth: "1",
      state: 4,
      reason: "",
      userId: ""
    };
    this.showAudit = false;
  }
  edit(e: any) {
    this.editObj.name = e.name;
    this.editObj.idNumber = e.idNumber;
    this.editObj.userId = e.userId;
    this.showEdit = true;
  }
  audit(e: any) {
    delete e.reason;
    e.state = 4;
    this.auditObj = e;
    this.auditObj.birthday = this.$formatDate(e.birthday).replace(
      "00:00:00",
      ""
    );
    this.auditObj.startDate = e.startDate
      ? this.$formatDate(e.startDate)
          .replace("00:00:00", "")
          .replace("08:00:00", "")
      : "";
    this.auditObj.endDate = e.endDate && e.endDate.length > 4
      ? this.$formatDate(e.endDate)
          .replace("00:00:00", "")
          .replace("08:00:00", "")
      : "长期";
    this.showAudit = true;
  }
  saveBtn1() {
    if (
      !this.editObj.name ||
      this.editObj.name.includes(" ") ||
      !this.editObj.idNumber ||
      this.editObj.idNumber.includes(" ")
    ) {
      this.$notify({
        title: "提示",
        message: "请输入完整的信息,并且不能含有空格！",
        type: "error"
      });
      return;
    }
    this.isPending1 = true;
    let data = { ...this.editObj };
    UserAuth.updateUserauth({ data })
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
        this.isPending1 = false;
      });
  }
  saveBtn() {
    if (
      this.auditObj.state === 2 &&
      (!this.auditObj.reason || this.auditObj.reason.includes(" "))
    ) {
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    this.isPending = true;
    let data = {
      state: this.auditObj.state,
      reason: this.auditObj.reason,
      userId: this.auditObj.userId
    };
    UserAuth.auditUserAuthState({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "操作成功！",
            type: "success"
          });
          this.closeAudit();
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  changeTime() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  handleChangeTime() {
    if (this.time) {
      let time = this.$getApiTime(this.time);
      this.params.startTime = time[0];
      this.params.endTime = time[1];
    } else {
      this.params.startTime = "";
      this.params.endTime = "";
    }
    this.getList();
  }
  getList(type: any) {
    if (type !== "type") {
      if (
        this.params.state ||
        this.params.query ||
        this.params.startTime ||
        this.params.endTime
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    this.loading = true;
    UserAuth.userauthList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i._idPhoto = i.idPhoto
              ? this.$store.state.configData.imgDomain +
                i.idPhoto +
                this.$imgSize[`30x30`]
              : require("@/img/common/userp.svg");
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
  auth_onclick() {
    this.$jsonp("http://127.0.0.1:8080/api/ReadMsg")
      .then(res => {
        if (res.retmsg.includes("操作成功")) {
          let _object_ = {};
          _object_.photo = res.photobase64;
          _object_.realName = res.name;
          _object_.sex = res.sex == "男" ? 1 : 2;
          _object_.nation = res.nation + "族";
          _object_.birthDate =
            res.born.toString().slice(0, 4) +
            "-" +
            res.born.toString().slice(4, 6) +
            "-" +
            res.born.toString().slice(6, 8);
          _object_.address = res.address;
          _object_.idCard = res.cardno;
          _object_.issued = res.police;
          _object_.startTime =
            res.userlifeb.toString().slice(0, 4) +
            "-" +
            res.userlifeb.toString().slice(4, 6) +
            "-" +
            res.userlifeb.toString().slice(6, 8);
          _object_.endTime =
            res.userlifee.toString().slice(0, 4) +
            "-" +
            res.userlifee.toString().slice(4, 6) +
            "-" +
            res.userlifee.toString().slice(6, 8);
          this.authUserInfo = _object_;
          this.showAuthInfo = true;
          this.onDialogConfirmClick();
          this.authInfo();
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
</script>
<style lang="scss" scoped>
  #headImg {
    float: right;
    padding-left: 10px;
  }
  .AuthInfo .AuthInfoPhone span {
    line-height: 39px;
  }
  .AuthInfo .AuthInfoidPhoto {
    height: 100px;
    overflow: hidden;
    margin-bottom: 10px;
    margin-top: 5px;
  }
  .AuthInfo p {
    line-height: 30px;
  }
  .AuthInfo p span {
    min-width: 6em;
    text-align: right;
    display: inline-block;
    vertical-align: top;
  }
  .AuthInfo span.fc303e {
    padding-left: 20px;
    text-align: left;
  }

  .avatar-uploader {
    display: inline-block;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    margin-top: -10px;
    height: auto;
    display: inline-block;
  }
  .w100 {
    max-width: 100%;
    margin-top: 15px;
  }
  .w100px {
    width: 100px;
  }
  .img-box {
    text-align: center;
    display: block;
  }
  .w50 {
    width: 48%;
  }
</style>
