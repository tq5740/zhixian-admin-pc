<template>
  <div id="sample">

    <el-dialog :close-on-click-modal="false" width="500px" :title="isEdit?'编辑模板':'创建模板'" v-if="dialogObj.showBox" :visible.sync="dialogObj.showBox" :before-close="close">
      <el-form>
        <el-form-item label="名称：">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input v-model="dialogObj.name" placeholder="请输入模板名称" class='w240'></el-input>
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="模板ID：">&nbsp;&nbsp;&nbsp;
          <el-input v-model="dialogObj.id" placeholder="请输入模板ID" class='w240'></el-input>
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label=" 微信模板：">
          <el-input type="textarea" rows=3 v-model="dialogObj.wechatTemplate" class='w240' placeholder="请输入微信模板"></el-input>
          <span class="fc303e"> *必填</span>
        </el-form-item>

        <el-form-item label="短信模板：">
          <el-input type="textarea" rows=3 v-model="dialogObj.smsTemplate" class='w240' placeholder="请输入短信模板"></el-input>
          <span class="fc303e"> *必填</span>
        </el-form-item>
        <el-form-item label="发送方式：">
          <el-checkbox-group v-model="dialogObj.mode">
            <el-checkbox label="短信"></el-checkbox>
            <el-checkbox label="微信"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button class='btn' @click.native='close'>取消</el-button>
          <el-button type="primary" :loading="dialogObj.isPending" @click.native='saveBtn'>确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-row>
      <el-form :inline="true">
        <el-button type="primary" class="mr10" icon="plus" @click='createSample'>创建角色</el-button>
        <el-form-item label="" class='fr'>
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
    </el-row>
    <el-row>
      <el-table header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="messageTitle" label="名称" min-width='100'></el-table-column>
        <el-table-column prop="wechatTemplateId" label="模板ID" min-width='80'></el-table-column>
        <el-table-column prop="wechatTemplate" label="微信模板" min-width='120'></el-table-column>
        <el-table-column prop="smsTemplate" label="短信模板" min-width='120'></el-table-column>
        <el-table-column prop="mode" label="发送方式" min-width='80'></el-table-column>
        <el-table-column prop="updateTime" label="创建时间" min-width='120'></el-table-column>
        <el-table-column label="操作" min-width='140'>
          <template slot-scope="scope">
            <span>
              <el-button type="text" size="small" @click='edit(scope.row)'>编辑</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination :current-page.sync="params.pageNum" class="mg15 fr" background @current-change="getList" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MessageApi from "@api/message";
import { debounce } from "typescript-debounce-decorator";
@Component({})
export default class Sample extends Vue {
  tableData: object[] = [];
  loading: boolean = false;
  total: number = 0;
  toastMes: string = "";
  params = {
    pageSize: 10,
    pageNum: 1
  };
  dialogObj: any = {
    showBox: false,
    id: "",
    name: "",
    wechatTemplate: "",
    smsTemplate: "",
    mode: ["短信"],
    isPending: false
  };
  systemMessageId: string = "";

  isEdit: boolean = false;

  created() {
    this.getList();
  }
  // method
  close(): void {
    this.dialogObj = {
      showBox: false,
      id: "",
      name: "",
      wechatTemplate: "",
      smsTemplate: "",
      mode: ["短信"],
      isPending: false
    };
  }
  edit(item: any): void {
    console.log(item);
    this.dialogObj.name = item.messageTitle;
    this.dialogObj.id = item.wechatTemplateId;
    this.systemMessageId = item.systemMessageId;
    this.dialogObj.wechatTemplate = item.wechatTemplate;
    this.dialogObj.smsTemplate = item.smsTemplate;
    this.dialogObj.mode = [];
    if (item.sms === 1) {
      this.dialogObj.mode.push("短信");
    }
    if (item.wechat === 1) {
      this.dialogObj.mode.push("微信");
    }

    this.isEdit = true;
    this.dialogObj.showBox = true;
  }
  saveBtn(): void {
    if (!this.dialogObj.name) {
      this.$notify({
        title: "提示",
        message: "模板名称为必填！",
        type: "error"
      });
      return;
    }
    if (!this.dialogObj.id) {
      this.$notify({
        title: "提示",
        message: "模板ID为必填！",
        type: "error"
      });
      return;
    }
    if (!this.dialogObj.wechatTemplate) {
      this.$notify({
        title: "提示",
        message: "微信模板内容为必填！",
        type: "error"
      });
      return;
    }
    if (!this.dialogObj.smsTemplate) {
      this.$notify({
        title: "提示",
        message: "短信模板内容为必填！",
        type: "error"
      });
      return;
    }
    if (!this.dialogObj.mode.length) {
      this.$notify({
        title: "提示",
        message: "发送方式为必填！",
        type: "error"
      });
      return;
    }
    this.loading = true;
    var data: any = {};
    data.messageTitle = this.dialogObj.name;
    data.wechatTemplateId = this.dialogObj.id;
    data.wechatTemplate = this.dialogObj.wechatTemplate;
    data.smsTemplate = this.dialogObj.smsTemplate;
    if (this.dialogObj.mode.indexOf("短信") !== -1) {
      data.sms = 1;
    } else {
      data.sms = 0;
    }
    if (this.dialogObj.mode.indexOf("微信") !== -1) {
      data.wechat = 1;
    } else {
      data.wechat = 0;
    }
    if (this.isEdit) {
      data.systemMessageId = this.systemMessageId;
    }
    if (!this.isEdit) {
      MessageApi.CreateSystemMessage({ data })
        .then(res => {
          if (res.code === 0) {
            this.close();
            this.getList();
          } else {
            this.$notify({
              title: "提示",
              message: res.msg,
              type: "error"
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      MessageApi.UpdateSystemMessage({ data })
        .then(res => {
          if (res.code === 0) {
            this.close();
            this.getList();
          } else {
            this.$notify({
              title: "提示",
              message: res.msg,
              type: "error"
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
  createSample(): void {
    this.isEdit = false;
    this.dialogObj.showBox = true;
  }
  getList(): void {
    this.loading = true;
    MessageApi.SystemMessageList({ data: this.params })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((i: any) => {
            i.updateTime = this.$formatDate(i.updateTime);
            i.mode = (function() {
              if (i.sms === 1 && i.wechat === 1) {
                return "短信,微信";
              }
              if (i.sms === 1) {
                return "短信";
              }
              if (i.wechat === 1) {
                return "微信";
              }
            })();
          });
          this.tableData = res.data.result;
          this.total = res.data.total;
        } else {
          this.$notify({
            title: "提示",
            message: res.msg,
            type: "error"
          });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
</style>
