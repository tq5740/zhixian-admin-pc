<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item class="btn-main">
          <el-button type="primary" icon="plus" v-if="prm.isCreate" @click.native="create">创建考场地点</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item>
          <el-select placeholder="企业名称" filterable clearable v-model="params.orgId" @change="getList">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input placeholder="考场地点名称" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="examAddressTitle" label="考场地点名称" min-width='100'></el-table-column>
        <el-table-column prop="province" label="省份" min-width='100'></el-table-column>
        <el-table-column prop="city" label="城市" min-width='80'></el-table-column>
        <el-table-column prop="district" label="区县" min-width='100'></el-table-column>
        <el-table-column prop="street" label="街道地点" min-width='100'></el-table-column>
        <!-- <el-table-column prop="stateStr" label="状态" min-width='100'>
          <template slot-scope="scope">
            {{scope.row.stateStr}}
            <el-tooltip effect="dark" placement="top" v-show="scope.row.state == 2">
              <div slot="content">{{scope.row.reason}}</div>
              <img :src="require('@/img/common/tips.png')" class="reason-tooltip" />
            </el-tooltip>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width='180'>
          <template slot-scope="scope">
            <el-button v-if="prm.isUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="prm.isDelete" :disabled="scope.row.isDefault" type="text" @click.native="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='page-num'>
        <el-form :inline="true">
          <el-form-item label="">
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog :close-on-click-modal="false" :title="title" v-if="showBox" :visible.sync="showBox" :before-close="closeFunc">
      <el-form label-width="140px">
        <el-form-item label="企业：">
          <el-select filterable clearable v-model="addressInfo.orgId" class='w80per mr10'>
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考试地点名称：">
          <el-input v-model="addressInfo.examAddressTitle" placeholder="请输入考试地点名称，如：第一考场" auto-complete="off" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="考试地点：">
          <el-select v-model="addressStr" filterable clearable :filter-method="querySearchAsync" @change="getAddress" placeholder="请输入简略地点，并根据提示选择详细地点" class="w80per">
            <el-option v-for="item in addressOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号：">
          <el-input v-model="addressInfo.doorNumber" placeholder="请输入门牌号" auto-complete="off" class="w80per"></el-input>
          &nbsp;
          <span class="fc303e">(选填)</span>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click.native='saveBtn'>保存</el-button>
          <el-button @click.native='closeFunc'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Org from "@api/org";
import Exam from "@api/exam";
@Component({})
export default class AddressPage extends Vue {
  prm = {
    isAudit: false,
    isUpdate: false,
    isCreate: false,
    isDelete: false
  };
  params = {
    query: "",
    startTime: "",
    endTime: "",
    pageSize: 10,
    pageNum: 1,
    orgId: this.$store.state.userInfo.org.orgId
  };
  addressInfo = {
    examAddressId: "",
    examAddressTitle: "",
    province: "",
    district: "",
    city: "",
    street: "",
    doorNumber: "",
    lng: "",
    lat: "",
    orgId: ""
  };
  title: string = "创建考场地点";
  time: string[] = [];
  total: number = 0;
  tableData: any[] = [];
  loading: boolean = false;
  showBox: boolean = false;
  isPending: boolean = false;
  addressStr: string = "";
  addressOptions: any[] = [];
  stateArr: object[] = [
    {
      id: 1,
      text: "未通过"
    },
    {
      id: 2,
      text: "审核中"
    },
    {
      id: 3,
      text: "发布中"
    },
    {
      id: 4,
      text: "已关闭"
    }
  ];

  created() {
    this.getList();
    Object.keys(this.prm).forEach((i, index) => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
    this.getOrgList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.orgId) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    Exam.exam_address_list_admin({ data })
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
  changeOrg() {
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
  searchKey() {
    this.getList()
  }
  edit( e: any) {
    Object.keys(this.addressInfo).forEach((i, index) => {
      this.addressInfo[i] = e[i]
    })
    this.title = "编辑地点";
    this.addressStr = `${e.province || ''}${e.city || ''}${e.district || ''}${e.street || ''}`
    this.showBox = true;
  }
  del(e: any) {
    this.$confirm(`是否将 "${e.examAddressTitle}" 删除? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          examAddressId: e.examAddressId
        };
        Exam.delete_exam_address_admin({ data })
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
    this.title = `创建地点`;
    this.addressStr = "";
    this.showBox = true;
  }
  saveBtn(e: number | undefined) {
    if (!this.addressInfo.orgId) {
      this.$notify({
        title: "提示",
        message: "请选择企业",
        type: "error"
      });
      return false;
    }
    if (!this.addressStr) {
      this.$notify({
        title: "提示",
        message: "请填写并选择地点",
        type: "error"
      });
      return;
    }
    let { province, city, district, street, doorNumber } = this.addressInfo;
    let formatAddress: string =
      province + city + district + street + doorNumber;
    this.params.orgId = this.addressInfo.orgId;
    this.isPending = true;

    let data = { ...this.addressInfo };
    if (this.title === "创建地点") {
      Exam.create_exam_address_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "创建考试地点成功！",
            type: "success"
          });
          this.closeFunc();
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
    } else {
      Exam.update_exam_address_admin({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "修改地点成功！",
            type: "success"
          });
          this.closeFunc();
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
    }

  }
  closeFunc() {
    this.showBox = false;
    this.addressInfo = {
      examAddressId: "",
      examAddressTitle: "",
      province: "",
      district: "",
      city: "",
      street: "",
      doorNumber: "",
      lng: "",
      lat: "",
      orgId: ""
    };
    this.addressOptions = [];
  }
  
  querySearchAsync(query) {
    if (!query) {
      this.addressOptions = [];
      this.addressStr = "";
    }
    let data = { key: 'VXUBZ-JL4CV-EXFPH-UVNCN-3VLP6-N2FZH', keyword: query, region: "四川", region_fix: 1, callbackName: 'QQmap', output: 'jsonp' }
    this.$jsonp("https://apis.map.qq.com/ws/place/v1/suggestion", data).then(res => {
      if (res.status == 0) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].value = res.data[i].address + "-" + res.data[i].title;
        }
        this.addressOptions = res.data;
      }
    })
  }
  getAddress() {
    let obj = {}; 
    obj = this.addressOptions.find((item)=>{
      return item.value === this.addressStr;
    }); 
    if (obj) {
      this.addressInfo.province = obj.province;
      this.addressInfo.district = obj.district;
      this.addressInfo.city = obj.city;
      this.addressInfo.street = obj.address.replace(`${obj.province}${obj.city}${obj.district}`,"") || obj.title;
      this.addressInfo.lng = obj.location.lng;
      this.addressInfo.lat = obj.location.lat;  
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
