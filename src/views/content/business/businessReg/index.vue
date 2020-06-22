<template>
    <div>
        <el-row class="main-top">
            <el-form :inline="true">
                <el-form-item label="">
                    <el-input style="display:none"></el-input>
                    <el-input placeholder="企业名称" v-model="params.query" class='w230' @keyup.13.native="searchKey" @change="searchKey" clearable>
                        <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
                        <el-option :key="i.id" v-for="i in statesArr" :value="i.id" :label="i.text">

                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
                </el-form-item>
            </el-form>
        </el-row>
        
        <el-row class="main-body">
            <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" v-loading="loading" element-loading-text="加载中..." stripe>
                <el-table-column prop="orgName" label="企业名称" min-width='180'></el-table-column>
                <el-table-column prop="orgTypeStr" label="企业类型" min-width='120'></el-table-column>
                <el-table-column prop="parentOrg" label="主管单位" min-width='120'></el-table-column>
                <el-table-column prop="stateStr" label="状态" min-width='80'>
                  <template slot-scope="scope">
                    {{scope.row.stateStr}}
                    <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
                      <div slot="content">{{scope.row.reason}}</div>
                      <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="createUserName" label="申请人" min-width='80'></el-table-column>
                <el-table-column prop="phone" label="手机号码" min-width='120'></el-table-column>
                <el-table-column prop="createTimeStr" label="申请时间" width='160'></el-table-column>
                <el-table-column prop="" label="操作" width="270">
                    <template slot-scope='scope'>
                        <el-button type="text" @click.stop.native="edit(scope.row)">编辑</el-button>
                        <el-button type="text" v-if="prm.isAudit" @click.stop.native="audit(scope.row)">审核</el-button>
                        <el-button type="text" v-if="prm.isDelete" @click.stop.native="del(scope.row)">删除</el-button>
                        <el-button type="text" @click.stop.native="detail(scope.row)">详情</el-button>
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
        <el-dialog :close-on-click-modal="false" width="30%" title="审核" :visible.sync="showAudit" :before-close="closeAudit">
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
        <el-dialog :close-on-click-modal="false" width="30%" title="附件" :visible.sync="imgShow">
            <img :src="$store.state.configData.imgDomain + imgSrc" class="dialog-img" />
        </el-dialog>
        <el-dialog :close-on-click-modal="false" width="50%" title="编辑" :visible.sync="showEdit" :close="closeEdit">
          <el-form label-width="140px">
            <el-form-item label="企业类型 : ">
              <el-select placeholder="请选择企业类型" v-model="orgType" class='w80per' clearable @clear="orgType = ''">
                <el-option :key="i.id" v-for="i in orgTypeArr" :value="i.id" :label="i.text" v-show="i.id != 9"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主管单位 : ">
              <el-cascader placeholder="请选择主管单位" v-model="parentOrg" class='w80per' :options="deptDara" @change="changeDept" clearable filterable change-on-select></el-cascader>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" :loading="isPending" @click="saveParentBtn">保存</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" width="50%" title="详情" :visible.sync="showDetail">
            <div>
                <div class="org_item"><p>企业全称：</p><span>{{orgInfo.orgName}}</span></div>
                <div class="org_item"><p>企业简称：</p><span>{{orgInfo.shortName}}</span></div>
                <div class="org_item"><p>企业地址：</p><span>{{orgInfo.address}}</span></div>
                <div class="org_item"><p>统一信用码：</p><span>{{orgInfo.orgCode}}</span></div>
                <div class="org_item"><p>企业类型：</p><span>{{orgInfo.orgTypeStr}}</span></div>
                <div class="org_item"><p>企业性质：</p><span>{{orgInfo.natrue}}</span></div>
                <div class="org_item"><p>所属行业：</p><span>{{orgInfo.industry}}</span></div>
                <div class="org_item"><p>主管单位：</p><span>{{orgInfo.parentOrg}}</span></div>
                <div class="org_item"><p>企业规模：</p><span>{{orgInfo.scale}}</span></div>
                <div class="org_item"><p>注册时间：</p><span>{{orgInfo.regDate}}</span></div>
                <div class="org_item"><p>官方网址：</p><span>{{orgInfo.website}}</span></div>
                <div class="org_item"><p>管理员姓名：</p><span>{{orgInfo.contact}}</span></div>
                <div class="org_item"><p>管理员手机号码：</p><span>{{orgInfo.phone}}</span></div>
                <div class="org_item"><p>管理员电子邮箱：</p><span>{{orgInfo.email}}</span></div>
                <div class="org_item"><p>营业执照：</p><img :src="$store.state.configData.imgDomain + orgInfo.orgLicense" class="img100"></div>
                <div class="org_item"><p>企业形象：</p><img :src="orgInfo.orgImg ? $store.state.configData.imgDomain + orgInfo.orgImg : ''" class="img100"></div>
                <div class="org_item"><p>企业logo：</p><img :src="$store.state.configData.imgDomain + orgInfo.orgLogo" class="img100"></div>
                <div class="org_item"><p>企业简介：</p><span v-html="decodeURIComponent(orgInfo.intro || '')"></span></div>
            </div>
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
import Complaint from "@api/complaint";
import BusinessReg from "@api/businessReg";
import Org from "@api/org";
import User from "@api/userOrg";
import { debounce } from "typescript-debounce-decorator";
import { emptyLast } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Complaintlist extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    startTime: "",
    endTime: "",
    sortBy: false,
    sortField: "createTime"
  };
  imgSrc: string = "";
  imgShow: boolean = false;
  tableData: any[] = [];
  time: string[] = [];
  total: number = 0;
  loading: boolean = false;
  showAudit: boolean = false;
  showEdit: boolean = false;
  isPending: boolean = false;
  showDetail: boolean = false;
  auditObj = {
    orgRegId: "",
    state: 4,
    reason: ""
  };
  orgTypeArr: object[] = this.$store.state.orgTypeArr;
  statesArr: object[] = [
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
      text: "已创建"
    }
  ];
  prm = {
    isEdit: false,
    isAudit: false,
    isDelete: false
  };
  orgInfo: any[] = [];
  deptDara: any[] = [];
  editObj: any = {};
  parentOrg: any[] = [];
  orgType: string = "";

  rwoClick(row: any) {
      this.imgShow = true;
      this.imgSrc = row.attach;
  }
  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
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
    let data = { ...this.auditObj };
    this.isPending = true;
    BusinessReg.auditOrgRegAdmin({ data })
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
  closeAudit() {
    this.showAudit = false;
    this.auditObj = {
      orgRegId: "",
      state: 4,
      reason: ""
    };
  }
  del(e: any) {
    this.$confirm(`是否将 "${e.orgName}" 删除? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          orgRegId: e.orgRegId
        };
        BusinessReg.deleteOrgRegAdmin({ data })
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
  audit(e: any) {
    this.auditObj.orgRegId = e.orgRegId;
    this.showAudit = true;
  }
  async edit(e: any) {
    let data = {
      orgRegId: e.orgRegId
    }
    User.query_org_reg({ data })
      .then(res => {
        if(res.code === 0){
          let resData = res.data;
          this.editObj.orgName = resData.orgName;
          if(resData.orgCode){this.editObj.orgCode = resData.orgCode};
          if(resData.orgLicense){this.editObj.orgLicense = resData.orgLicense};
          this.editObj.orgRegId = resData.orgRegId;
          this.orgType = this.editObj.orgType = resData.orgType;
          this.editObj.deptName = resData.deptName;
          this.editObj.hierarchy = resData.hierarchy;
          this.editObj.industry = res ? res.id : "";
          this.editObj.scale = resData.scale;
          this.editObj.website = resData.website;
          this.editObj.contact = resData.contact;
          this.editObj.phone = resData.phone;
          this.editObj.address = resData.address;
          this.editObj.regDate = resData.regDate;
          this.editObj.natrue = resData.natrue;
          this.editObj.industry = resData.industry;
        }
      })
    this.showEdit = true;
    if (this.$store.state.deptTree.length === 0) {
      await this.$store.dispatch("getDeptTree");
    }
    this.deptDara = [];
    this.deptDara = this.$forTree(
      this.$store.state.deptTree,
      "hierarchy",
      "deptName"
    );
    this.delType(this.deptDara);
    emptyLast(this.deptDara);
    this.parentOrg = [
      ...this.$getFather(
        this.deptDara,
        this.deptDara,
        e.hierarchy
      ),
      e.hierarchy
    ];
  }
  delType(e: any) {
    for (let i = 0; i < e.length; i++) {
      if (e[i].type == 9) {
        e.splice(i, 1);
        i--;
      } else {
        if (e[i].children && e[i].children.length) {
          this.delType(e[i].children)
        }
      }
    }
  }
  @debounce(500, { leading: false })
  changeDept(e: any) {
    this.editObj.hierarchy = e[e.length - 1];
  }
  saveParentBtn() {
    if (this.orgType != "") {
      this.editObj.orgType = this.orgType;
    }
    let data = {
      ...this.editObj
    }
    User.update_org_reg({ data }).then(res => {
      if(res.code === 0){
        this.$notify({
          title: "提示",
          message: "操作成功！",
          type: "success"
        });
        this.closeEdit();
      }
    })
  }
  closeEdit() {
    this.showEdit = false;
    this.parentOrg = [];
    this.getList();
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  detail(e) {
    this.showDetail = true;
    if (e.intro.indexOf("%") !== -1) {
      let str = e.intro;
      let num = str.indexOf("%");
      if (str[num + 1] != 2 || str[num + 2] != 5) {
        e.intro = str.slice(0, num+1) + "25" + str.slice(num+1)
      };
    }
    this.orgInfo = e;
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
    this.loading = true;
    if (type !== 'type') {
      if (this.params.state || this.params.query || this.params.startTime || this.params.endTime) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    BusinessReg.orgRegListAdmin({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.orgTypeStr = this.$mapTypeStr(i.orgType, this.orgTypeArr);
            i.stateStr = this.statesArr[i.state - 1].text;
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
    // .reason-tooltip {
    //     width: 80px;
    //     height: 40px;
    // }
    .dialog-img {
        max-width: 100%;
    }
    .img100{
      max-width: 100%;
      margin-bottom: 20px;
    }
    .org_item{
      overflow: hidden;
      display: block;
      p{
        width: 20%;
        min-width: 10rem;
        text-align: right;
        float: left;
      }
      span{
        padding-left: 5%;
        float: left;
      }
    }
</style>
