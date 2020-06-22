<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item class="btn-main">
          <el-button v-if="prm.isCreate" type="primary" icon="plus" @click.native="create">创建banner</el-button>
        </el-form-item>
        <el-form-item>
          <el-input style="display:none"></el-input>
          <el-input placeholder="banner标题" v-model="params.query" class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="类型" v-model="params.type" class='w150' @change="getList" clearable @clear="params.type = ''">
            <el-option v-for="(i) in typeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
            <el-option v-for="(i) in stateArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-date-picker v-model="time" start-placeholder="开始日期" end-placeholder="结束日期" type="daterange" placeholder="选择时间" @change='handleChangeTime' value-format='yyyy-MM-dd'> </el-date-picker>
        </el-form-item> -->
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <!-- <el-table-column prop="img" align='center' label="封面图" min-width="80">
          <template slot-scope="scope">
            <img style="width:100px;height:56.25px" :src="$store.state.configData.imgDomain+scope.row.img" alt="封面图" />
          </template>
        </el-table-column> -->
        <el-table-column prop="orgName" label="企业名称" min-width="160 "></el-table-column>
        <el-table-column prop="title" label="标题" min-width="120 "></el-table-column>
        <el-table-column prop="type" label="类型" min-width='80'>
          <template slot-scope="scope">
            {{scope.row.type === 1 ? '电脑' :"手机 "}}
          </template>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='80'></el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width='120'></el-table-column>
        <el-table-column sortable='custom' prop="updateTimeStr" label="修改时间" width='180'>
        </el-table-column>
        <el-table-column prop=" " label="操作" width="220">
          <template slot-scope='scope'>
            <el-button type="text" v-if="prm.isUpdate" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" v-if="prm.isOnline" @click.native="on_off(scope.row)">{{scope.row.state == 4 ? "关闭" : "发布" }}</el-button>
            <el-button type="text" v-if="prm.isDelete" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class='page-num'>
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
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>

    <el-dialog :close-on-click-modal="false" :title="title" v-if="showBox" :visible.sync="showBox" :before-close="close">
      <el-form label-width="120px">
        <el-form-item label="企业名称：">
          <el-select class='w80per' filterable clearable v-model="bannerObj.orgId" @visible-change="judgeOrg()" :disabled="orgDisabled">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="banner标题：">
          <el-input v-model="bannerObj.title" placeholder="请输入标题名称" class='w80per'></el-input>
        </el-form-item>
        <el-form-item label="banner类型：">
          <el-radio :disabled="!!isLoadedImg" v-model="bannerObj.type" :label="1"> 电脑 </el-radio>
          <el-radio :disabled="!!isLoadedImg" v-model="bannerObj.type" :label="2"> 手机 </el-radio>
        </el-form-item>
        <el-form-item label="图片尺寸：">
          <span v-show="bannerObj.type == 1">请上传尺寸为1920px*400px的图片</span>
          <span v-show="bannerObj.type == 2">请上传尺寸为750px*350px的图片</span>
        </el-form-item>
        <el-form-item label="banner图：">
          <el-upload action="" :show-file-list="false" :http-request="upLoad" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoading" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="bannerObj.img" :src="$store.state.configData.imgDomain+bannerObj.img" class="avatar">
            <i style="height:90px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接地址：">
          <el-input class='w80per' size="large" v-model="bannerObj.linkUrl" placeholder='例：http://www.baidu.com/' :rows="4">
          </el-input>
          <span class="fc303e"> *必须要加http或者https协议</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="isPending" @click='saveBtn'>保存</el-button>
        </el-form-item>
      </el-form>
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
import Banner from "@api/banner";
import { debounce } from "typescript-debounce-decorator";
import { miniSizePic, checkSize, checkSite } from "@utils/index";
import Org from "@api/org";
import System from "@api/system";
//https://github.com/ktsn/vuex-class
@Component({})
export default class BannerList extends Vue {
  params = {
    type: "",
    pageSize: 10,
    pageNum: 1,
    startTime: "",
    endTime: "",
    sortField: "createTime",
    sortBy: false,
    query: ""
  };
  bannerObj = {
    orgId: this.$store.state.userInfo.org.orgId,
    title: "",
    img: "",
    linkUrl: "",
    type: 1,
    bannerId: ""
  };
  typeArr: object[] = [
    {
      id: 1,
      text: "电脑"
    },
    {
      id: 2,
      text: "手机"
    }
  ];
  stateArr: object[] = [
    {
      id: 4,
      text: "发布中"
    },
    {
      id: 5,
      text: "已关闭"
    }
  ];
  title: string = "创建banner";
  time: string[] = [];
  total: number = 0;
  tableData: any[] = [];
  loading: boolean = false;
  showBox: boolean = false;
  isPending: boolean = false;
  upLoading: boolean = false;
  isLoadedImg: boolean = false;
  prm = {
    isCreate: false,
    isDelete: false,
    isUpdate: false,
    isOnline: false
  };
  orgDisabled: boolean = false;
  orgListId: any[] = [];
  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  async upLoad(e: any) {
    this.upLoading = true;
    let res: any;
    try {
      res = await miniSizePic(e.file);
    } catch (error) {
      this.$notify({
        title: "提示",
        message: `压缩图片失败,将使用原始图片!`,
        type: "error"
      });
      res = e.file;
    }
    if (checkSize(res.size, 2)) {
      this.$notify({
        title: "提示",
        message: `图片大小超过2M,请重新上传!`,
        type: "error"
      });
      this.upLoading = false;
      return;
    }
    // return;
    let formData = new FormData();
    let { token } = this.$store.state.userInfo;
    formData.append("file", res);
    formData.append("uploadType", "2");
    formData.append("token", token);
    formData.append("path", "/publics/banner/img");
    System.upload(formData)
      .then(res => {
        this.isLoadedImg = true;
        this.bannerObj.img = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  del(e: any) {
    this.$confirm(`是否将 "${e.title}" 的banner删除? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = { bannerId: e.bannerId };
        Banner.deleteBanner({ data })
          .then((res: any) => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: `删除成功!`,
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
  edit(e: any) {
    Object.keys(this.bannerObj).forEach(i => {
      //@ts-ignore
      this.bannerObj[i] = e[i];
    });
    this.getOrgList();
    this.title = "编辑banner";
    this.orgDisabled = true;
    this.showBox = true;
  }
  saveBtn() {
    if (this.bannerObj.orgId == "") {
      this.$notify({
        title: "错误",
        message: "请选择企业",
        type: "error"
      });
      return;
    }
    if (this.bannerObj.title == "") {
      this.$notify({
        title: "错误",
        message: "标题不能为空",
        type: "error"
      });
      return;
    }
    if (this.bannerObj.img == "") {
      this.$notify({
        title: "错误",
        message: "请上传一张图片",
        type: "error"
      });
      return;
    }
    if (!checkSite(this.bannerObj.linkUrl)) {
      this.$notify({
        title: "错误",
        message: "请输入以https://或者http://开头的正确网址！",
        type: "error"
      });
      return;
    }
    let data = { ...this.bannerObj };
    this.isPending = true;
    if (data.bannerId) {
      Banner.updateBanner({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "编辑成功！",
              type: "success"
            });
            this.close();
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      Banner.createBanner({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "创建成功！",
              type: "success"
            });
            this.close();
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  create() {
    this.title = "创建banner";
    this.orgDisabled = false;
    this.getOrgList();
    this.showBox = true;
  }
  close() {
    this.showBox = false;
    this.isLoadedImg = false;
    this.bannerObj = {
      orgId: this.$store.state.userInfo.org.orgId,
      title: "",
      img: "",
      linkUrl: "",
      type: 1,
      bannerId: ""
    };
  }
  sortFunc() {
    this.params.sortField = "updateTime";
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }

  handleChangeTime() {
    this.params.sortField = `createTime`;
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
    if (type !== 'type') {if (this.params.type || this.params.query || this.params.startTime || this.params.endTime) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    Banner.bannerList({ data })
      .then(res => {
        if (res.code === 0) {
          this.total = res.data.total;
          res.data.result.forEach((i: any) => {
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
  judgeOrg(){
    let myOrgId = this.orgListId.toString();
    if(!myOrgId.includes(this.bannerObj.orgId)){
      this.isOrg = true;
      this.bannerObj.orgId = "";
    }
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
        this.close();
        return;
      }
    }
    this.$store.state.myOrgList.forEach(element => {
      if(element.state === 4){
        this.orgListId = this.orgListId.concat(element.orgId);
      }
    });
  }
  // 跳转到企业管理页面
  apply(e: any) {
    this.$router.push({
      path: "/org/org"
    });
  }
  // 上下线
  on_off(e: any): void {
    let data = {
      bannerId: e.bannerId,
      state: e.state == 4 ? 5 : 4
    };
    Banner.online_offline_banner_admin({ data }).then(res => {
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
}
</script>
<style lang="scss" scoped>
</style>
