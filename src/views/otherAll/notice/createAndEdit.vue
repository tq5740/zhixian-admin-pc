<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="110px" label-position="right">
        <el-form-item label="企业名称 : ">
          <el-select class="w80per" filterable clearable v-model="form.orgId" @visible-change="judgeOrg()" :disabled="orgDisabled">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公告标题 : ">
          <el-input placeholder="请输入公告标题" v-model="form.noticeTitle" class="w80per"></el-input>
        </el-form-item>
        <el-form-item label="公告简介 : ">
          <add-edit v-if="showIntro" :placeholder="'请输入公告简介'" :htmlStr="content ? content : ''" ref="addEditRefArlist"></add-edit>
        </el-form-item>
        <el-form-item label=" " label-width="120px">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">确定</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" title="提示" :visible.sync="isOrg" append-to-body>
        <span>该企业尚未认证，请先完善企业信息，审核通过后，再创建公告哦！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isOrg = false">取 消</el-button>
          <el-button type="primary" @click="isOrg = false;apply()">完善信息</el-button>
        </span>
      </el-dialog>
    </el-row>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Notice from "@api/data";
import Org from "@api/org";

@Component({
  components: {
    "add-edit": () => import ("@c/addEdit.vue")
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: "" })
  public title: any;
  @Prop({ default: {} })
  public queryData: any;
  orgListId: any[] = [];
  form: any = {
    orgId: this.$store.state.userInfo.org.orgId,
    noticeId: this.queryData.noticeId,
    noticeTitle: "",
    content: ""
  };
  isPending: boolean = false;
  isOrg: boolean = false;
  showIntro: boolean = true;
  orgDisabled: boolean = false;

  content: string = "";

  created() {
    this.init();
    this.getOrgList();
  }
  init () {
    if (this.queryData.noticeId) {
      this.orgDisabled = true;
      let data = {
        noticeId: this.queryData.noticeId
      }
      Notice.query_notice_admin({ data }).then(res => {
        if (res.code === 0) {
          Object.keys(this.form).forEach((i, index) => {
            this.form[i] = res.data[i];
          });
          this.content = this.form.content;
          this.showIntro = false;
          this.$nextTick(()=>{
            this.showIntro = true;
          })
        }
      });
    } else {
      this.form = {
        orgId: this.$store.state.userInfo.org.orgId,
        noticeId: this.queryData.noticeId,
        noticeTitle: "",
        content: ""
      }
    }
  }
  judgeOrg(){
    let myOrgId = this.orgListId.toString();
    if(!myOrgId.includes(this.form.orgId)){
      this.isOrg = true;
      this.form.orgId = "";
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
  is() {
    if (this.form.noticeTitle.length <= 0 || this.form.noticeTitle.length > 50 || this.form.noticeTitle.includes(" ")) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "公告标题字数在1-50且不能有空格"
      });
      return false;
    } else if (this.$refs.addEditRefArlist.getHtmlText() === "") {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请输入公告内容"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn_one() {
    if (!this.is()) return;
    const loading = this.$loading({
      lock: true,
      text: '正在保存中，请耐心等待~',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    let str = this.$refs.addEditRefArlist.getHtmlText();
    this.form.content = encodeURIComponent(str.replace(/http:/g, "https:")
      .replace(/section/g, "div")
      .replace(/strong/g, "div")
      .replace(/footer/g, "div")
      .replace(/\<img/g, '<img style="max-width:100%;height:auto"')
    )
    let data = { ...this.form };
    if (!this.queryData.noticeId) {
      Notice.create_notice_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          loading.close();
        });
    } else {
      Notice.update_notice_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
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
</style>