<template>
  <el-form :inline="true">
    <el-row>
      <el-form-item label="面试时间 :" label-width="100px">
        <v-timer @getYMD="getYMD" @getHour="getHour" @getMin="getMin"></v-timer>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="面试地点 :" label-width="100px">
        <el-select v-model="apiData.addressId" @change="changeAddress" class='w320'>
          <el-option v-for="(i) in addressArr" :key="i.addressId" :label="i.allAddress" :value="i.addressId"></el-option>
        </el-select>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="预约信息 :" label-width="100px">
        {{userName}}，你好，{{$store.state.userInfo.orgUser.orgName}},诚邀你于{{interviewTimeObj.ymd}} {{interviewTimeObj.h}}:{{interviewTimeObj.m}}参加我们的{{bookingData.workTitle}}面试，面试地点：{{activeContact.address}}。如因故不能按时到达或者不能参加面试， 请提前与我们联系,联系人:{{activeContact.contact}}，联系电话:{{activeContact.tel}}
      </el-form-item>
    </el-row>
    <el-row>
      <el-button :loading="isPending" type="primary" class="fr" @click.native="sendView">确定</el-button>
    </el-row>
  </el-form>
</template>

<script lang="ts">
/*
 module:
    业务组件
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-20:业务组件
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
import Booking from "@api/booking";
import Address from "@api/address";
import Vtimer from "@c/Vtimer.vue";
import { formatDate } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    "v-timer": Vtimer
  }
})
export default class Vsend extends Vue {
  @Prop({})
  public bookingData: any;
  @Prop({ default: "" })
  public userName!: string;
  interviewTimeObj = {
    ymd: "",
    h: "",
    m: "",
    s: "00"
  };

  isPending: boolean = false;
  addressArr: any[] = [];
  apiData = {
    bookingId: "",
    state: 0,
    workId: "",
    userId: "",
    addressId: "",
    interviewTime: "",
    phone: "",
    content: ""
  };
  activeContact = {
    contact: "",
    tel: "",
    address: ""
  };
  created() {
    this.getAddress();
  }
  changeAddress(e: any) {
    let res = this.addressArr.filter(i => i.addressId === e);
    this.activeContact.contact = res[0].contact;
    this.activeContact.tel = res[0].tel;
    this.activeContact.address = res[0].allAddress;
  }
  sendView() {
    if (
      !this.interviewTimeObj.ymd ||
      !this.interviewTimeObj.m ||
      !this.interviewTimeObj.h
    ) {
      this.$notify({
        title: "提示",
        message: `请填写完整的面试时间!`,
        type: "error"
      });
      return;
    }
    if (!this.apiData.addressId) {
      this.$notify({
        title: "提示",
        message: `请选择面试地址!`,
        type: "error"
      });
      return;
    }
    this.apiData.interviewTime = `${this.interviewTimeObj.ymd} ${
      this.interviewTimeObj.h
    }:${this.interviewTimeObj.m}:${this.interviewTimeObj.s}`;
    this.apiData.userId = this.bookingData.userId;
    this.apiData.workId = this.bookingData.workId;
    // this.apiData.orgId = this.bookingData.orgId;
    this.apiData.phone = this.bookingData.phone;
    this.apiData.bookingId = this.bookingData.bookingId;

    this.apiData.content = `${this.userName}，你好，${
      this.$store.state.userInfo.orgUser.orgName
    },诚邀你于${this.interviewTimeObj.ymd} ${this.interviewTimeObj.h}:${
      this.interviewTimeObj.m
    }参加我们的${this.bookingData.workTitle}面试，面试地点：${
      this.activeContact.address
    }。如因故不能按时到达或者不能参加面试， 请提前与我们联系,联系人:${
      this.activeContact.contact
    }，联系电话:${this.activeContact.tel}`;

    this.apiData.state = 3;
    let data = { ...this.apiData };
    //data.interviewTime = formatDate(this.apiData.interviewTime);
    this.isPending = true;
    Booking.updateBooking({ data })
      .then((res: any) => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `操作成功!`,
            type: "success"
          });
          this.$emit("ok");
        }
      })
      .finally(() => {
        this.isPending = false;
      });
  }
  getYMD(e?: any) {
    if (e) {
      this.interviewTimeObj.ymd = e;
    } else {
      this.interviewTimeObj.ymd = "";
    }
  }
  getHour(e?: any) {
    if (e) {
      this.interviewTimeObj.h = e;
    } else {
      this.interviewTimeObj.h = "";
    }
  }
  getMin(e?: any) {
    if (e) {
      this.interviewTimeObj.m = e;
    } else {
      this.interviewTimeObj.m = "";
    }
  }
  getAddress() {
    Address.myAddress({
      data: { pageSize: 99, pageNum: 1, orgId: this.bookingData.orgId }
    }).then(res => {
      if (res.code === 0) {
        this.addressArr = res.data.result.map((item: any) => ({
          tel: item.tel,
          contact: item.contact,
          addressId: item.addressId,
          allAddress:
            item.province +
            item.city +
            item.district +
            item.street +
            (item.doorNumber || "")
        }));
      }
    });
  }
}
</script>
<style lang="scss" scoped>
</style>
