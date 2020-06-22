<template>
  <div id="c_job">
    <el-row>
      <el-form label-width="100px">
        <el-form-item label="企业名称：">
          <el-select :disabled="!!jobData" filterable clearable v-model="jobObj.orgId" class='w320 mr10' @change="changeOrg" @visible-change="judgeOrg">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-form-item label="工作地点：">
            <el-select v-model="jobObj.addressId" class='w320' multiple @change="getAddressId" @focus="isOrgId">
              <el-option v-for="(i) in addressArr" :key="i.addressId" :label="i.allAddress" :value="i.addressId"></el-option>
            </el-select>
            <el-button type="primary" style="margin-left:10px" @click="goURL">去创建地点</el-button>
          </el-form-item>
        </el-row>
        <el-form-item label="职位名称：">
          <el-input v-model="jobObj.workTitle" placeholder="请输入职位名称" class='w320'></el-input>
        </el-form-item>

        <el-form-item label="工作性质：">
          <el-radio-group v-model="jobObj.workNature">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1">全职</el-radio>
            <el-radio :label="2">兼职</el-radio>
            <el-radio :label="3">实习</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- <el-form-item label="招聘类型：">
          <el-select v-model="jobObj.type" class='w320'>
            <el-option v-for="(i) in typeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item label="学历要求：">
          <el-select v-model="jobObj.education" class='w320'>
            <el-option v-for="(i) in $store.state.educationArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="经验要求：">
          <el-select v-model="jobObj.experience" class='w320'>
            <el-option v-for="(i) in $store.state.experienceArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="职能名称：">
          <el-cascader class='w320' v-model="defaultClassify" :options="classifyList" @change="handleChange" clearable>
          </el-cascader>
          <span class="fc303e"> （选填）</span>
        </el-form-item>

        <el-form-item label="招聘人数：">
          <el-input type="number" :min="1" v-model="jobObj.recruitNumber" placeholder="请输入招聘人数" class='w150'></el-input>
          &nbsp;
          <!-- <span class="fc303e">填0表示若干</span> -->
        </el-form-item>

        <el-form-item label="薪资范围：">
          <el-select v-model="jobObj.salaryType" class='w150'>
            <el-option v-for="(i) in salaryTypeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
          <div v-show="jobObj.salaryType === 2" style="margin-top:6px">
            <el-input style="margin-right:4px" type="number" :min="0" placeholder="最低薪资" class='w240' v-model="jobObj.lowSalary">
              <template slot="append">元</template>
            </el-input>
            <el-input type="number" :min="0" placeholder="最高薪资" class='w240' v-model="jobObj.highSalary">
              <template slot="append">元</template>
            </el-input>
          </div>
          &nbsp;
          <el-input v-show="jobObj.salaryType === 1" placeholder="日薪" class='w150' v-model="jobObj.lowSalary">
            <template slot="append">元/天</template>
          </el-input>
        </el-form-item>

        <el-form-item label="福利待遇：">
          <span class="fc303e">最多选择8项（选填）</span>
        </el-form-item>
        <el-form-item>
          <el-checkbox-group v-model="jobObj.welfare" :max="8">
            <el-checkbox v-for="item in welFareArr" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="职位描述：">
          <!-- <v-editor ref="editor" :htmlStr="jobObj.intro"></v-editor> -->
          <el-input class="h300" type="textarea" :placeholder="'请输入职位描述'" v-model="jobObj.intro" ref="addEditRefOrg"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click="saveBtn">确定</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog
      width="30%"
      title="提示"
      :visible.sync="isOrg"
      append-to-body>
      <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建职位哦！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOrg = false">取 消</el-button>
        <el-button type="primary" @click="isOrg = false;apply()">完善信息</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
/*
 module:
    职位管理
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:职位管理
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
import Job from "@api/job";
import Address from "@api/address";
import Org from "@api/org";
import { emptyLast } from "@utils/index";
// import editor from "@c/VEditor.vue";
//https://github.com/ktsn/vuex-class
@Component({
  components: {
    //"v-editor": () => import("@c/VEditor.vue")
    // "add-edit": () => import("@c/addEdit.vue")
  },
  props: {
    stateArr: {
      type: Array
    }
  }
})
//CE = createAndEdit
export default class CEjob extends Vue {
  @Prop({ default: null })
  public jobData: any;
  defaultClassify: string[] = [];
  welFareArr: string[] = [
    "五险一金",
    "六险一金",
    "免费班车",
    "专业培训",
    "绩效奖金",
    "年终奖金",
    "定期体检",
    "餐饮补贴",
    "节日福利",
    "生日福利",
    "员工旅游",
    "股票期权",
    "交通补贴",
    "通讯补贴"
  ];
  addressArr: any[] = [];
  orgListId: any[] = [];
  address: any[] = [];
  salaryTypeArr: object[] = [
    {
      id: 1,
      text: "日薪"
    },
    {
      id: 2,
      text: "月薪"
    }
    
  ];
  jobObj = {
    workId: "",
    workTitle: "",
    workCategory: "",
    workNature: 1,
    type: 1,
    education: 0,
    recruitNumber: 1,
    salaryType: 2,
    experience: 0,
    lowSalary: "",
    highSalary: "",
    welfare: [],
    addressId: [],
    intro: "",
    workId: "",
    orgId: ""
    // hierarchy: null
  };
  mapJob = {
    orgId: "企业名称",
    addressId: "工作地点",
    workTitle: "职位名称"
  };
  params = {
    pageSize: 99,
    pageNum: 1,
    orgId: ""
  };
  salary: string = "";
  classifyList: any[] = [];
  isPending: boolean = false;
  isOrg: boolean = false;

  //life
  async created() {
    await this.getOrgList();
    if (this.$store.state.jobClassify.length === 0) {
      await this.$store.dispatch("getJobclassifyTree");
    }
    this.classifyList = [];
    this.classifyList = this.$forTree(
      this.$store.state.jobClassify,
      "workCategoryId",
      "workCategoryTitle"
    );
    emptyLast(this.classifyList);
    if (this.jobData) {
      if(this.jobData.intro){
        this.jobData.intro = decodeURIComponent(encodeURIComponent(this.jobData.intro).replace(/%3Cbr%3E/g, "%0A"));
      }
      this.params.orgId = this.jobData.orgId;
      await this.getAddress();
      Object.keys(this.jobObj).forEach(i => {
        if (i === "welfare") {
          this.jobObj[i] = JSON.parse(this.jobData[i]);
        } else {
          //@ts-ignore
          this.jobObj[i] = this.jobData[i];
        }
      });
      if(this.jobData.addresses && this.jobData.addresses.length){
        this.jobObj.addressId = [];
        this.jobData.addresses.forEach(i => {
          this.jobObj.addressId.push(i.addressId)
        });
      }
      this.defaultClassify = this.$getFather(
        this.classifyList,
        this.classifyList,
        this.jobObj.workCategory,
        true
      );
    }
  }
  isOrgId() {
    if(!this.jobObj.orgId){
      this.$notify({
        title: "提示",
        message: "请先选择企业",
        type: "error"
      });
    }
  }
  getAddressId(e: any) {
    this.jobObj.addressId = e;
  }
  changeOrg() {
    if( this.jobObj.orgId ){
      this.params.orgId = this.jobObj.orgId;
      this.getAddress();
    } else {
      this.addressArr = [];
      this.jobObj.addressId = [];
    }
  }
  judgeOrg() {
    let myOrgId = this.orgListId.toString();
    if(!myOrgId.includes(this.jobObj.orgId)){
      this.isOrg = true;
      this.jobObj.orgId = "";
    }
  }
  getAddress() {
    let data = { ...this.params };
    return Address.myAddress({ data }).then(res => {
      if (res.code === 0) {
        this.addressArr = res.data.result.map((item: any) => ({
          addressId: item.addressId,
          allAddress:
            (item.province || "") +
            item.city +
            item.district +
            item.street +
            (item.doorNumber || "")
        }));
      }
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
        this.$emit("close");
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
  goURL() {
    this.$router.push(`/work/id`);
  }
  saveBtn() {
    for (let i in this.mapJob) {
      //@ts-ignore
      if (this.jobObj[i] !== 0 && !this.jobObj[i] || !this.jobObj[i].length) {
        this.$notify({
          title: "提示",
          //@ts-ignore
          message: `请填写${this.mapJob[i]}!`,
          type: "error"
        });
        return;
      }
    }
    if (this.jobObj.salaryType === 1) {
      if (!this.jobObj.lowSalary) {
        this.$notify({
          title: "提示",
          //@ts-ignore
          message: `请填写日薪薪资!`,
          type: "error"
        });
        return;
      }
    }
    if (this.jobObj.salaryType === 2) {
      if (!this.jobObj.lowSalary || !this.jobObj.highSalary) {
        this.$notify({
          title: "提示",
          //@ts-ignore
          message: `请填写月薪薪资!`,
          type: "error"
        });
        return;
      }
      if (parseInt(this.jobObj.lowSalary) > parseInt(this.jobObj.highSalary)) {
        this.$notify({
          title: "提示",
          message: `最低薪资不能大于最高薪资!`,
          type: "error"
        });
        return;
      }
    }

    if (this.jobObj.recruitNumber < 1) {
      this.$notify({
        title: "提示",
        //@ts-ignore
        message: `招聘人数为具体数字且不小于1!`,
        type: "error"
      });
      this.jobObj.recruitNumber = 1;
      return;
    }
    if(!this.jobObj.intro){
      this.$notify({
        title: "提示",
        //@ts-ignore
        message: `请填写职位描述!`,
        type: "error"
      });
      return;
    }
    let data = {
      ...this.jobObj,
      welfare: JSON.stringify(this.jobObj.welfare),
      addressId: JSON.stringify(this.jobObj.addressId)
    };
    if(data && data.intro){
      data.intro = data.intro.replace(/\n|\r\n/g, "<br>");
    }
    if(!data.workCategory){
      data.workCategory = "[]"
    }
    this.isPending = true;
    if (this.jobData) {
      //@ts-ignore
      Job.updateJob({ data })
        .then((res: any) => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "修改成功",
              type: "success"
            });
            this.$emit("close");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      data.state = 4;
      Job.createJob({ data })
        .then((res: any) => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "创建成功",
              type: "success"
            });
            this.$emit("close");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  handleChange(val: any) {
    this.jobObj.workCategory = val[val.length - 1];
  }
}
</script>
<style lang="scss" scoped>
  #c_job {
    .el-checkbox {
      &:first-of-type {
        margin-left: 30px;
      }
    }
  }
  .eded {
    margin-left: 0px;
  }
  .w320 {
    width: 420px;
  }
</style>
