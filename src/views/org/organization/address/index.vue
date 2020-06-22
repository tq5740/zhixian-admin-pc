<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item class="btn-main">
          <el-button type="primary" icon="plus" v-if="canCreate" @click.native="create">创建地址</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true">
        <el-form-item>
          <el-select placeholder="企业" filterable clearable v-model="params.orgId" @change="changeOrg">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="orgName" label="企业名称" min-width='100'></el-table-column>
        <el-table-column prop="title" label="地址标题" min-width='100'></el-table-column>
        <el-table-column prop="allAddress" label="企业详细地址" min-width='200'>
          <template slot-scope="scope">
            <span class="reason-tooltip" style="width:100%; overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2; ">{{scope.row.allAddress}}</span>
            <el-tooltip effect="dark" placement="top" v-show="scope.row.allAddress.length > 60">
              <div slot="content" style="max-width: 500px">{{scope.row.allAddress}}</div>
              <span class="reason-tooltip" style="position: absolute; top:0;display: inline-block;height:100%;width:90%;"></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系人" min-width='80'></el-table-column>
        <el-table-column prop="tel" label="联系电话" min-width='80'></el-table-column>
        <el-table-column label="操作" width='180'>
          <template slot-scope="scope">
            <el-button v-if="canUpdate" type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button v-if="canDelete" :disabled="scope.row.isDefault" type="text" @click.native="del(scope.row)">删除</el-button>
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
      <el-form label-width="100px" label-position="right">
        <el-form-item label="企业名称：">
          <el-select filterable clearable v-model="addressInfo.orgId" class='w80per mr10'>
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分部名称：">
          <el-input v-model="addressInfo.title" placeholder="请输入地址标题" auto-complete="off" class="w80per"></el-input>
          &nbsp;
          <span class="fc303e">(选填)</span>
        </el-form-item>
        <el-form-item label="工作地点：">
          <el-select v-model="addressStr" filterable clearable :filter-method="querySearchAsync" @change="getAddress" placeholder="请输入简略地址，并根据提示选择详细地址" class="w80per">
            <el-option v-for="item in addressOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号：">
          <el-input v-model="addressInfo.doorNumber" placeholder="请输入门牌号" auto-complete="off" class="w80per"></el-input>
          &nbsp;
          <span class="fc303e">(选填)</span>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input v-model="addressInfo.contact" placeholder="请输入联系人" auto-complete="off" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="addressInfo.tel" placeholder="请输入联系电话" auto-complete="off" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click.native='saveBtn'>确定</el-button>
          <el-button type="primary" :loading="isPending" @click.native='saveBtn(1)'>{{title}}并去发布职位</el-button>
          <el-button @click.native='closeFunc'>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    Address
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:Address
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import Address from "@api/address";
import Org from "@api/org";
import { mobileReg } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({})
export default class AddressPage extends Vue {
  params = {
    pageSize: 10,
    pageNum: 1,
    orgId: ""
  };
  addressInfo = {
    addressId: "",
    title: "",
    contact: "",
    tel: "",
    province: "",
    district: "",
    city: "",
    street: "",
    doorNumber: "",
    lng: "",
    lat: "",
    orgId: ""
  };
  title: string = "创建地址";
  total: number = 0;
  tableData: any[] = [];
  loading: boolean = false;
  showBox: boolean = false;
  isPending: boolean = false;
  canUpdate: boolean = false;
  canDelete: boolean = false;
  canCreate: boolean = false;
  addressStr: string = "";
  addressOptions: any[] = [];

  created() {
    this.getOrgList().then(res => {
      this.getList();
    });

    let { isCreate, isDelete, isUpdate } = this.$store.state.activeMenu[
      this.$route.path
    ];
    this.canUpdate = isUpdate;
    this.canDelete = isDelete;
    this.canCreate = isCreate;
  }
  changeOrg() {
    this.getList();
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
    this.params.orgId = this.$store.state.myOrgList[0].orgId;
  }
  edit(e: any) {
    Object.keys(this.addressInfo).forEach((i, index) => {
      this.addressInfo[i] = e[i];
    })
    this.title = "编辑地址";
    this.addressStr = `${this.addressInfo.province || ''}${this.addressInfo.city || ''}${this.addressInfo.district || ''}${this.addressInfo.street || ''}`
    this.showBox = true;
  }
  del(e: any) {
    this.$confirm(`是否将 "${e.allAddress}" 删除? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          addressId: e.addressId
        };
        Address.deleteAddress({ data })
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
  setDefault(e: any) {
    this.$confirm(`是否将 "${e.allAddress}" 设置为主地址? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          addressId: e.addressId
        };
        Address.setDefault({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "操作成功！",
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
    this.title = `创建地址`;
    this.addressStr = "";
    this.showBox = true;
  }
  saveBtn(e: number | undefined) {
    if (this.$store.state.myOrgList.length === 0) {
      this.$notify({
        title: "提示",
        message: "您暂无企业！",
        type: "error"
      });
      return false;
    }
    if (!this.addressInfo.orgId || this.addressInfo.orgId.includes(" ")) {
      this.$notify({
        title: "提示",
        message: "企业填写不合法！",
        type: "error"
      });
      return false;
    }
    if (!this.addressInfo.contact || this.addressInfo.contact.includes(" ")) {
      this.$notify({
        title: "提示",
        message: "联系人信息填写不合法！",
        type: "error"
      });
      return;
    }
    if (!this.addressInfo.tel || !mobileReg(this.addressInfo.tel)) {
      this.$notify({
        title: "提示",
        message: "联系人电话填写不合法！",
        type: "error"
      });
      return;
    }
    if (!this.addressStr) {
      this.$notify({
        title: "提示",
        message: "地址信息填写不合法！",
        type: "error"
      });
      return;
    }
    this.params.orgId = this.addressInfo.orgId;
    this.isPending = true;
    let data = { ...this.addressInfo };
    if (this.title === "创建地址") {
      Address.createAddress({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "创建地址成功！",
            type: "success"
          });
          if (e === 1) {
            this.$router.push(`/work/work`);
            return;
          }
          this.closeFunc();
          this.getList();
        }
      })
      .finally(() => {
        this.isPending = false;
      });
    } else {
      Address.updateAddress({ data }).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "修改地址成功！",
            type: "success"
          });
          if (e === 1) {
            this.$router.push(`/work/work`);
            return;
          }
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
      addressId: "",
      contact: "",
      title: "",
      tel: "",
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
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.orgId) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    Address.myAddress({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((item: any) => {
            item.allAddress =
              item.province +
              item.city +
              item.district +
              item.street +
              (item.doorNumber || "");
          });
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
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
