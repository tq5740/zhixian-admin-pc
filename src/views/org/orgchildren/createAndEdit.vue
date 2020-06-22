<template>
  <div id="createAndEdit">
    <el-row>
      <el-form label-width="110px" label-position="right">
        <el-form-item label="企业名称 : ">
          <el-select class="w80per" filterable clearable v-model="form.orgId" :disabled="orgDisabled">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作企业 : ">
          <el-select class="w80per" filterable clearable v-model="form.childrenId">
            <el-option v-for="(i) in $store.state.myOrgList" :key="i.orgId" :label="i.orgName" :value="i.orgId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :loading="isPending" @click="saveBtn_one">确定</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Org from "@api/org";

@Component({
  components: {
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
    childrenId: "",
    orgChildrenId: ""
  };
  isPending: boolean = false;
  orgDisabled: boolean = false;

  created() {
    this.init();
    this.getOrgList();
  }
  init () {
    if (this.queryData.orgChildrenId) {
      Object.keys(this.form).forEach((i, index) => {
        this.form[i] = this.queryData[i];
      });
    } else {

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
    if (!this.form.orgId) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请选择企业"
      });
      return false;
    } else if (!this.form.childrenId) {
      this.$notify({
        title: "提示",
        type: "error",
        message: "请选择合作企业"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn_one() {
    if (!this.is()) return;
    this.isPending = true;
    let data = { ...this.form };
    if (!this.queryData.orgChildrenId) {
      Org.create_org_children_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      Org.update_org_children_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
}
</script>
<style lang="scss" scoped>
</style>