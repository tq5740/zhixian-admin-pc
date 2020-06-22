<template>
  <div v-loading="queryLoading">
    <el-row>
      <el-form label-width="120px">
        <el-form-item label="名称：">
          <el-input type="text" v-model="venue.venueTitle" placeholder="请输入现场招聘名称" class='w240'></el-input>
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="封面：">
          <el-upload action="" :show-file-list="false" :http-request="upLoadLogo" accept="image/gif,image/jpeg,image/jpg,image/png" v-loading="upLoadingLogo" element-loading-text="上传中..." class="avatar-uploader">
            <img style="height:100px;width:100px" v-if="venue.venueImg" :src="$store.state.configData.imgDomain+venue.venueImg+$imgSize['100x100']" class="avatar">
            <i style="height:100px;width:100px;line-height:100px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="fc303e">
            <!-- (不超过2M的图片,尺寸为100*100) -->
          </p>
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="venue.type" class='w240'>
            <el-option v-for="(i) in typeArr" :key="i.id" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="开始日期：">
          <el-date-picker class='w240' v-model="venue.startDate" :picker-options="pickerOptionsStartTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
          <span class="fc303e"> *必填</span>
        </el-form-item>

        <el-form-item label="结束日期：">
          <el-date-picker class='w240' v-model="venue.endDate" :picker-options="pickerOptionsEndTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
          <span class="fc303e"> *必填</span>
        </el-form-item>

        <el-form-item label="时间段：">
          <el-time-select placeholder="起始时间" v-model="p_startTime" :picker-options="{
      start: '00:00',
      step: '00:05',
      end: '23:59',
      maxTime: p_endTime
    }">
          </el-time-select>
          <span> 至 </span>
          <el-time-select placeholder="结束时间" v-model="p_endTime" :picker-options="{
      start: '00:00',
      step: '00:05',
      end: '23:59',
      minTime: p_startTime
    }">
          </el-time-select>
          <span class="fc303e"> *必填</span>
        </el-form-item>

        <el-form-item label="报名截止时间：">
          <el-date-picker class='w240' v-model="venue.deadline" :picker-options="pickerOptionsDeadlineTime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
          <span class="fc303e"> *必填</span>
        </el-form-item>

        <el-form-item label="联系人：">
          <el-input type="text" v-model="venue.contact" placeholder="请输入联系人姓名" class='w240'></el-input>
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input type="text" v-model="venue.phone" placeholder="请输入联系人电话" class='w240'></el-input>
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <!-- <el-form-item label="地点：">
          <v-select-address style="margin-top:-10px" ref="selectAddress"></v-select-address>
          <p class="fc303e"> *必填</p>
        </el-form-item> -->
        <el-form-item label="地点：">
          <el-input type="text" v-model="venue.address" placeholder="请输入街道地址" class='w280'></el-input>
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="企业参会须知：">
          <el-input type="textarea" :rows="5" v-model="venue.notice" placeholder="请输入参会须知">
          </el-input>

          <p class="fc303e"> *必填</p>
        </el-form-item>
        <el-form-item label="简介：">
          <add-edit :placeholder="'请输入现场招聘会简介'" :htmlStr="intro ? intro : ''" ref="addEditRefFair" v-if="showIntro"></add-edit>
          <p class="fc303e"> *必填</p>
        </el-form-item>
      </el-form>
    </el-row>
    <el-button style="margin-left:120px" @click="closeBtn">取消</el-button>
    <el-button type="primary" :loading="isPending" style="margin-left:20px" @click="saveBtn">确定</el-button>
  </div>
</template>

<script lang="ts">
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
import Venue from "@api/venue";
//import VEditor from "@c/VEditor.vue";
import System from "@api/system";
import { debounce } from "typescript-debounce-decorator";
import { miniSizePic, checkSize, mobileReg } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    //"v-editor": VEditor
    "add-edit": () => import("@c/addEdit.vue")
  },
  props: {
    typeArr: {
      type: Array
    }
  }
})
export default class CEfair extends Vue {
  @Prop()
  public venueId!: string;
  p_startTime: string = "";
  p_endTime: string = "";
  isPending: boolean = false;
  queryLoading: boolean = false;
  upLoadingLogo: boolean = false;
  venue: object = {
    orgId: this.$store.state.userInfo.org.orgId,
    venueTitle: "",
    type: 1,
    startDate: "",
    endDate: "",
    period: "",
    contact: "",
    phone: "",
    notice: "",
    intro: "",
    address: "",
    venueImg: "",
    deadline: ""
  };
  mapObj: object = {
    startDate: "开始日期",
    endDate: "结束日期",
    deadline: "报名截止时间",
    venueTitle: "现场招聘名称",
    contact: "联系人",
    phone: "联系电话",
    street: "街道",
    notice: "企业参会须知"
  };
  intro: string = "";
  pickerOptionsStartTime: object = {
    disabledDate: time => {
      return time.getTime() < new Date().getTime() - 1000 * 60 * 60 * 24;
    }
  };
  pickerOptionsEndTime: object = {
    disabledDate: time => {
      return (
        time.getTime() < new Date(this.venue.startDate) - 1000 * 60 * 60 * 24
      );
    }
  };
  pickerOptionsDeadlineTime: object = {
    disabledDate: time => {
      return time.getTime() > new Date(this.venue.startDate).getTime();
    }
  };
  showIntro: boolean = false;

  created() {
    if (this.venueId) {
      this.queryLoading = true;
      let data = { venueId: this.venueId };
      Venue.queryVenue({ data })
        .then(res => {
          if (res.code === 0) {
            this.p_startTime = res.data.period.split("-")[0];
            this.p_endTime = res.data.period.split("-")[1];
            Object.keys(this.venue).forEach((i: any) => {
              res.data.startDate = this.$formatDate(
                res.data.startDate,
                "YYYY-MM-DD"
              );
              res.data.endDate = this.$formatDate(
                res.data.endDate,
                "YYYY-MM-DD"
              );
              if (res.data.deadline) {
                res.data.deadline = this.$formatDate(
                  res.data.deadline,
                  "YYYY-MM-DD"
                )
              } else {
                let myDate = new Date(new Date()-24*60*60*1000);
                let y = myDate.getFullYear();
                let m = myDate.getMonth();
                let d = myDate.getDate();
                res.data.deadline = y + "-" + (m + 1) + "-" + d;
              }
              this.venue[i] = res.data[i];
              this.intro = this.venue.intro;
              if(this.venue && this.venue.notice){
                this.venue.notice = decodeURIComponent(encodeURIComponent(this.venue.notice).replace(/%3Cbr%3E/g, "%0A"));
              }
            });
          }
        })
        .finally(() => {
          this.queryLoading = false;
          this.showIntro = true;
        });
    } else {
      this.showIntro = true;
    }
  }
  async upLoadLogo(e: any) {
    // 注释的代码为上传前的判断工作
    // let res = await this._upImg(e);
    // if (this._checkSize(e.file.size)) {
    //   this.upLoadingLogo = false;
    //   return;
    // }
    this.upload(e, "venueImg");
  }
  _checkSize(size: number): boolean {
    let flag = checkSize(size, 2);
    if (flag) {
      this.$notify({
        title: "提示",
        message: `图片大小超过2M,请重新上传!`,
        type: "error"
      });
    }
    return flag;
  }
  // 压缩图片上传
  upload(file: any, key: string) {
    if (file.file.size < 2097152) {
      this.upLoadImg(file.file);
      return;
    }
    Lrz(file.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImg(rst.file);
    });
  }

  upLoadImg(file: any) {
    this.upLoadingLogo = true;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "2");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/work/venue/img");
    System.upload(formData)
      .then(res => {
        this.venue.venueImg = res.data.url;
      })
      .finally(() => {
        this.upLoadingLogo = false;
      });
  }

  async _upImg(e: any) {
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
    return Promise.resolve(res);
  }
  closeBtn() {
    this.$emit("close");
  }
  ifPTime(p_startTime: string, p_endTime: string): boolean {
    let H_start = p_startTime.split(":")[0];
    let M_start = p_startTime.split(":")[1];
    let H_end = p_endTime.split(":")[0];
    let M_end = p_endTime.split(":")[1];
    if (Number(H_start) > Number(H_end)) {
      return true;
    } else if (Number(H_start) == Number(H_end)) {
      if (Number(M_start) >= Number(M_end)) {
        return true;
      }
    }
    return false;
  }
  saveBtn() {
    for (let i in this.mapObj) {
      //@ts-ignore
      if (this.venue[i] === "") {
        this.$notify({
          title: "提示",
          //@ts-ignore
          message: `${this.mapObj[i]}不能为空!`,
          type: "error"
        });
        return;
      }
    }

    if (this.venue.startDate > this.venue.endDate) {
      this.$notify({
        title: "提示",
        //@ts-ignore
        message: `开始时间不能大于结束时间！`,
        type: "error"
      });
      return;
    }

    if (!this.p_startTime || !this.p_endTime) {
      this.$notify({
        title: "提示",
        //@ts-ignore
        message: `请填写时间段!`,
        type: "error"
      });
      return;
    }

    if (this.ifPTime(this.p_startTime, this.p_endTime)) {
      this.$notify({
        title: "提示",
        //@ts-ignore
        message: `开始时间段不能大于或等于结束时间段！`,
        type: "error"
      });
      return;
    }

    if (this.venue.startDate < this.venue.deadline) {
      this.$notify({
        title: "提示",
        //@ts-ignore
        message: `报名截止时间不能大于开始时间！`,
        type: "error"
      });
      return;
    }

    if (!mobileReg(this.venue.phone)) {
      this.$notify({
        title: "提示",
        //@ts-ignore
        message: `手机号不合法！`,
        type: "error"
      });
      return;
    }
    if (this.$refs.addEditRefFair.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入投票对象简介"
      });
      return;
    } 
    this.venue.period = this.p_startTime + "-" + this.p_endTime;
    this.venue.deadline = this.venue.deadline.split(" ")[0] + " " + "23:59:59";
    const loading = this.$loading({
      lock: true,
      text: '正在保存中，请耐心等待~',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    let str = this.$refs.addEditRefFair.getHtmlText();
    this.venue.intro = encodeURIComponent(str.replace(/http:/g, "https:")
      .replace(/section/g, "div")
      .replace(/strong/g, "div")
      .replace(/footer/g, "div")
      .replace(/\<img/g, '<img style="max-width:100%;height:auto"')
    )
    if (!this.venueId) {
      let data = { ...this.venue };
      if(data.notice){
        data.notice = data.notice.replace(/\n|\r\n/g, "<br>");
      }
      Venue.createVenue({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              //@ts-ignore
              message: `创建成功!`,
              type: "success"
            });
            this.$emit("okCb");
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      let data = { ...this.venue, venueId: this.venueId };
      if(data.notice){
        data.notice = data.notice.replace(/\n|\r\n/g, "<br>");
      }
      Venue.updateVenue({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              //@ts-ignore
              message: `编辑成功!`,
              type: "success"
            });
            this.$emit("okCb");
          }
        })
        .finally(() => {
          loading.close();
        });
    }
  }
}
</script>
<style lang="scss" scoped>
.w280{
  width: 360px;
}
</style>
