<template>
  <div>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click.native="getExcel">导出报名企业</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-input placeholder="企业名称" v-model="params.query" class='w230' @keyup.13.native="searchKey" @change="searchKey" clearable>
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-input style="display: none"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-select placeholder="状态" class='w150' filterable v-model="params.state" @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
    </el-row>
    <el-row>
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="booth" label="展位号" min-width="80"></el-table-column>
        <el-table-column prop="org.orgName" label="企业名称" min-width="200"></el-table-column>
        <el-table-column prop="createTimeStr" sortable=' custom' label="报名时间" min-width='160'></el-table-column>
        <!-- <el-table-column prop="venueTitle" label="现场招聘名称" min-width='160'></el-table-column> -->
        <el-table-column prop="stateStr" label="状态" min-width='80'></el-table-column>
        <el-table-column prop="" label="操作" width="240">
          <template slot-scope='scope'>
            <el-button type="text" v-if="scope.row.orgId" @click.native="lookOrgAll(scope.row)">详情</el-button>
            <el-button type="text" v-if="prm.isAudit" @click.native="audit(scope.row)">审核</el-button>
            <el-button type="text" v-if="prm.isUpdate" @click.stop.native="editOrg(scope.row)">修改展位号</el-button>
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
    <el-dialog :close-on-click-modal="false" width="70%" :title="titleStr" :visible.sync="showAudit" :before-close="closeAudit" append-to-body>
      <div>
        <p>{{thisOrgName}}</p>
        <el-row>
          <el-table ref="addTable" header-row-class-name="thead" :data="orgJobData" border v-loading="loading2" element-loading-text="加载中...">
            <el-table-column prop="workTitle" label="职位名称" min-width="15%"></el-table-column>
            <el-table-column prop="educationStr" label="学历要求" min-width='10%'></el-table-column>
            <el-table-column prop="experienceStr" label="工作经验" min-width='10%'></el-table-column>
            <el-table-column prop="recruitNumber" label="招聘人数" min-width='10%'></el-table-column>
            <el-table-column prop="salary" label="薪资待遇" min-width='10%'></el-table-column>
            <el-table-column prop="createUserName" label="添加人" min-width='10%'></el-table-column>
            <el-table-column prop="createTimeStr" label="添加时间" min-width='15%'></el-table-column>
            <el-table-column prop="stateStr" label="状态" min-width='10%'>
              <template slot-scope="scope">
                {{(!scope.row.orgId && `-`) || scope.row.stateStr}}
                <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 1">
                  <div slot="content">{{scope.row.reason}}</div>
                  <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <span class="mag-top20">
            <el-button type="primary" @click="showAuditWork = true">审核</el-button>
          </span>
        </el-row>
        <el-dialog :close-on-click-modal="false" width="30%" title="审核" :visible.sync="showAuditWork" :before-close="closeAuditWork" append-to-body>
          <div>
            <el-radio v-model="auditObj.state" :label="4">通过</el-radio>
            <el-radio v-model="auditObj.state" :label="2">不通过</el-radio>
            <br />
            <br />
            <el-input v-show="auditObj.state ==2" tyle="text" placeholder="请输入审核不通过的原因" v-model="auditObj.reason"></el-input>
            <el-row style="margin-top:10px">
              <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn">确定</el-button>
            </el-row>
          </div>
        </el-dialog>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="30%" title="修改展位号" :visible.sync="showAuditNum" :before-close="closeAuditNum" append-to-body>
      <div>
        <el-input tyle="text" placeholder="请输入新展位号" v-model="numObj.numOrg"></el-input>
        <el-row style="margin-top:10px">
          <el-button type="primary" class="fr" :loading="isPending" @click="saveBtn1">确定</el-button>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" width="840px" title="详情" :visible.sync="showOrgAll" :before-close="closeOrgAll" append-to-body>
      <div class="orgall" id="pdfDom">
        <div class="orgall_haed">
          <span class="span_text">展位号：{{orgAll.boothId ? orgAll.boothId : "_______"}}</span>
          <h2>{{orgAll.orgName}}</h2>
        </div>
        <div class="orgall_data">
          <div class="orgall_title">
            <p>企业资料</p>
            <span>Enterprise information</span>
          </div>
          <div class="data">
            <ul class="data_box">
              <li>
                <div class="box">
                  <p>机构代码</p><span>{{orgAll.orgCode}}</span>
                </div>
              </li>
              <li>
                <div class="box">
                  <p>企业性质</p><span>{{orgAll.natrue}}</span>
                </div>
              </li>
              <li>
                <div class="box">
                  <p>企业规模</p><span>{{orgAll.scale}}</span>
                </div>
              </li>
              <li>
                <div class="box">
                  <p>成立时间</p><span>{{$formatDate(orgAll.createTime, "YYYY-MM-DD")}}</span>
                </div>
              </li>
              <li style="width: 100%">
                <div class="box">
                  <p>注册地址</p><span>{{orgAll.address}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="orgall_intro">
          <div class="orgall_title">
            <p>企业简介</p>
            <span>enterprise profile</span>
          </div>
          <div v-html="orgAll.intro != 'null' ? orgAll.intro : ''" class="intro"></div>
        </div>
        <div class="orgall_license">
          <div class="orgall_title">
            <p>营业执照</p>
            <span>business license</span>
          </div>
          <div class="license">
            <img :src="imgBase64" alt="">
          </div>
        </div>
        <div class="position" v-for="(item, index) in orgAll.venueWorkVOs" :key="index">
          <div class="title"><span></span>
            <p>职位{{index + 1}}</p>
          </div>
          <div class="data">
            <ul class="data_box">
              <li style="width: 100%">
                <div class="box">
                  <p>职位名称</p><span>{{item.workTitle}}</span>
                </div>
              </li>
              <li>
                <div class="box">
                  <p>招聘人数</p><span>{{item.recruitNumber}}人</span>
                </div>
              </li>
              <li>
                <div class="box">
                  <p>薪资范围</p><span>{{item.salary}}</span>
                </div>
              </li>
              <li>
                <div class="box">
                  <p>学历要求</p><span>{{item.educationStr}}</span>
                </div>
              </li>
              <li>
                <div class="box">
                  <p>经验要求</p><span>{{item.experienceStr}}</span>
                </div>
              </li>
              <li style="width: 100%">
                <div class="box">
                  <p>职位描述</p><br><br><span v-html="item.intro || ''"></span>
                </div>
              </li>
              <li style="width: 100%">
                <div class="box" v-for="(i, index) in item.addresses" :key="index">
                  <div class="boxs" style="width: 55%"><p>工作地点</p><span>{{(i.province || "") + (i.city || "") + (i.district || "") + (i.street || "") + (i.doorNumber || "")}}</span></div>
                  <div class="boxs" style="width: 20%"><p>联系人</p><span>{{i.contact}}</span></div>
                  <div class="boxs" style="width: 25%"><p>联系电话</p><span>{{i.tel}}</span></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="foot">
          <p>028-87709957 成都市金牛区二环路北一段4号</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Venue from "@api/venue";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    //"v-editor": () => import("@c/VEditor.vue")
    // "add-edit": () => import("@c/addEdit.vue")
  }
})
export default class Companyreg extends Vue {
  @Prop({ default: "" })
  public venueId: string;
  params = {
    pageSize: 10,
    pageNum: 1,
    venueId: "",
    sortBy: false,
    sortField: "createTime",
    query: "",
    startTime: "",
    endTime: ""
  };
  natureList: object[] = this.$store.state.natureList;
  prm = {
    isAudit: false,
    isUpdate: false
  };
  auditObj = {
    state: 4,
    reason: "",
    orgId: "",
    venueId: ""
  };
  stateArr: object[] = [
    {
      id: 1,
      text: "未提交"
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
    }
  ];
  tableData: any[] = [];
  thisOrg: any[] = [];
  loading: boolean = false;
  loading2: boolean = false;
  showAudit: boolean = false;
  showAuditWork: boolean = false;
  showAuditNum: boolean = false;
  showOrgAll: boolean = false;
  isPending: boolean = false;
  time: string[] = [];
  orgAll: any[] = [];
  total: number = 0;
  imgBase64: string = "";
  imgDomain: string = this.$store.state.configData.imgDomain;
  orgJobData: any[] = [];
  thisOrgName: string = "";
  numObj: object[] = [];
  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  titleStr: string = "";

  created() {
    this.params.venueId = this.venueId;
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  audit(e: any) {
    this.thisOrg = e;
    this.getJobListHrIsAll(e);
    this.titleStr = e.org.orgName + " 审核";
    this.showAudit = true;
  }
  getJobListHrIsAll(e) {
    this.thisOrgName = e.orgName;
    let data = {
      orgId: e.orgId,
      venueId: e.venueId,
      pageSize: 10,
      pageNum: 1
    };
    Venue.venue_work_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime, "YYYY-MM-DD");
            i.educationStr = this.$store.state.educationArr[i.education].text;
            i.experienceStr = this.$store.state.experienceArr[i.experience].text;
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            if (i.highSalary && !i.lowSalary) {
              i.salary = `0-${i.highSalary}`;
            } else if (!i.highSalary && i.lowSalary) {
              i.salary = `${i.lowSalary}元`;
            } else {
              i.salary = `${i.lowSalary}-${i.highSalary}`;
            }
          });
          this.orgJobData = res.data.result;
        }
      })
      .finally(() => {
        this.loading2 = false;
      });
  }
  saveBtn() {
    if (
      (this.auditObj.state === 2 && !this.auditObj.reason) ||
      this.auditObj.reason.includes(" ")
    ) {
      this.$notify.error({
        title: "错误",
        message: "原因填写不合法!"
      });
      return;
    }
    this.auditObj.orgId = this.thisOrg.orgId;
    this.auditObj.venueId = this.thisOrg.venueId;
    let data = { ...this.auditObj };
    this.isPending = true;
    Venue.auditVenueReg({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "操作成功！",
            type: "success"
          });
          this.closeAuditWork();
          this.getJobListHrIsAll(this.thisOrg);
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  closeAudit() {
    this.showAudit = false;
    this.getList('type');
  }
  closeAuditWork() {
    this.showAuditWork = false;
    this.auditObj = {
      state: 4,
      reason: "",
      orgId: "",
      venueId: ""
    };
  }
  lookOrgAll(e) {
    this.imgBase64 = "";
    this.showOrgAll = true;
    this.isPending = true;
    const data = {
      venueId: e.venueId,
      orgId: e.orgId
    };
    Venue.query_venue_org({ data })
      .then(res => {
        if (res.code === 0) {
          if (res.data.orgLicense) {
            this.getBase64Main(
              this.imgDomain + res.data.orgLicense,
              (res: any) => {
                this.imgBase64 = res;
              }
            );
          }
          this.orgAll = res.data;
          this.orgAll.intro != "" ? this.orgAll.intro = decodeURIComponent(this.orgAll.intro) : null;
          this.orgAll.natrue = this.$mapTypeStr(this.orgAll.natrue, this.natureList);
          this.orgAll.venueWorkVOs.forEach((i: any) => {
            i.educationStr = this.$store.state.educationArr[i.education].text;
            i.experienceStr = this.$store.state.experienceArr[i.experience].text;
          });
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  downloadBtn(e: any) {
    window.open(e);
  }
  closeOrgAll() {
    this.showOrgAll = false;
  }
  getBase64Image(img: any): any {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png"); // 可选其他值 image/jpeg
    return dataURL;
  }

  getBase64Main(src: any, cb: any) {
    var _this = this;
    var image = new Image();
    image.src = src + "?v=" + Math.random(); // 处理缓存
    image.crossOrigin = "*"; // 支持跨域图片
    image.onload = function() {
      var base64 = _this.getBase64Image(image);
      cb && cb(base64);
    };
  }

  getList(type: any) {
    if (type !== 'type') {
      if (
        this.params.venueId ||
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
    Venue.venueRegList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.stateStr = this.$mapTypeStr(i.state, this.stateArr);
            i.intro = i.intro ? decodeURIComponent(i.intro) : '';
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  editOrg(e: any) {
    this.numObj = e;
    this.numObj.numOrg = e.booth;
    this.showAuditNum = true;
  }
  closeAuditNum() {
    this.showAuditNum = false;
  }
  getExcel(e: any) {
    if (!this.params.venueId) {
      this.$notify.error({
        title: "错误",
        message: "请选择一个招聘会！"
      });
      return;
    }
    window.open(
      `${Venue.export_venue_org()}?token=${this.$store.state.userInfo.token}&venueId=${this.params.venueId}`
    );
  }
  saveBtn1() {
    this.pending1 = true;
    let data = {
      orgId: this.numObj.orgId,
      venueId: this.numObj.venueId,
      booth: this.numObj.numOrg
    };
    Venue.updateVenueOrg({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "编辑成功！",
            type: "success"
          });
          this.closeAuditNum();
          this.getList();
        }
      })
      .finally(() => {
        this.pending1 = false;
      });
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
<style lang="scss">
  .intro,
  .intro p,
  .intro span,
  .intro font {
    font-size: 16px !important;
    font-family: "Microsoft Yahei", sans-serif !important;
  }
</style>

<style lang="scss" scoped>
  .orgall {
    width: 800px;
    margin: 0 auto;
    .w150 {
      margin-right: 20px;
    }
    .orgall_haed {
      width: 100%;
      height: 418px;
      color: #fff;
      text-align: center;
      background: url(../../../../img/common/org_all_bg.png) center no-repeat;
      h2 {
        font-size: 34px;
        font-weight: bold;
        letter-spacing: 2px;
        padding-top: 50px;
        width: 90%;
        margin: 0 auto;
        line-height: 48px;
        margin-bottom: 15px;
      }
      span {
        border: 4px solid #fff;
        padding: 12px 30px;
        font-size: 27px;
        display: inline-block;
        margin-top: 150px;
      }
    }
    .orgall_data {
      padding-top: 40px;
    }
    .data {
      width: 95%;
      margin: 0 auto;
      .data_box {
        overflow: hidden;
        border-left: 1px solid #ccc;
        border-top: 1px solid #ccc;
        .box {
          padding: 15px 20px;
          border: 1px solid #ccc;
          margin-left: -1px;
          margin-top: -1px;
          display: flex;
          .boxs{
            display: flex;
            p {
              width: auto;
              white-space : nowrap;
            }
            span {
              color: #000;
              margin-left: 15px;
            }
          }
        }
        li {
          width: 50%;
          float: left;
          font-size: 16px;
          p {
            display: inline-block;
            width: 70px;
            margin: 0;
            color: #999;
          }
          span {
            color: #000;
            margin-left: 20px;
          }
        }
      }
    }
    .orgall_intro {
      width: 100%;
      padding: 8px 33px 35px 33px;
      background: #fffbf6;
      margin: 0 auto;
      margin-top: 80px;
    }
    .orgall_license {
      width: 640px;
      padding-top: 55px;
      margin: 0 auto;
      .license {
        text-align: center;
        img {
          max-width: 100%;
        }
      }
    }

    .orgall_title {
      text-align: center;
      font-weight: bold;
      padding: 28px 0;
      p {
        font-size: 20px;
        color: #e89028;
        margin-bottom: 5px;
        letter-spacing: 2px;
      }
      span {
        text-transform: uppercase;
        color: #cccccc;
      }
    }
    .position {
      padding-top: 58px;
      .title {
        text-align: center;
        span {
          display: block;
          width: 100%;
          height: 18px;
          background: #e89028;
        }
        p {
          width: 100px;
          color: #e89028;
          font-size: 20px;
          background: #fff;
          padding: 10px 0;
          margin: -35px auto 50px auto;
        }
      }
    }
    .foot {
      width: 100%;
      height: 132px;
      line-height: 132px;
      background: #e89028;
      color: #fff;
      text-align: center;
      margin-top: 70px;
      margin-bottom: 30px;
    }
  }
  .mag-top20 {
    float: left;
    margin-top: 15px;
  }
  .mag-left20 {
    margin-left: 15px;
  }
</style>
