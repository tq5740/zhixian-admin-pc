<template>
  <div id="sendMessage">
    <el-row>
      <ul>
        <li class="item-box">
          <p class="text-name" style="float: left; margin-right: 10px">
            <span class="item-label">消息形式：</span>
          </p>
          <el-radio-group v-model="form.way">
            <el-radio :label="1">短信</el-radio>
            <!-- <el-radio :label="2">邮件</el-radio> -->
            <el-radio :label="4">微信</el-radio>
            <!-- <el-radio :label="3">小程序</el-radio> -->
          </el-radio-group>
        </li>
        <li class="item-box">
          <p class="text-name">
            <span class="item-label">角色名称：</span>
          </p>
          <el-select placeholder="请选择角色名称" v-model="form.roleName" class='w500' clearable @clear="form.roleName = ''">
            <el-option :key="i.roleId" v-for="i in roleArr" :value="i.roleId" :label="i.roleName">
            </el-option>
          </el-select>
        </li>
        <li class="item-box" v-if="form.way != 1">
          <p class="text-name">
            <span class="item-label">消息模板：</span>
          </p>
          <el-select placeholder="请选择消息模板" v-model="form.systemMessageId" class='w500' clearable @clear="form.systemMessageId = ''">
            <el-option :key="i.systemMessageId" v-for="i in messageArr" :value="i.systemMessageId" :label="i.messageTitle">
            </el-option>
          </el-select>
        </li>
        <li class="item-box" v-if="form.way != 1">
          <p class="text-name">
            <span class="item-label">消息模板内容：</span>
            <span class="notify">“【】”内的文字可作编辑或修改，用英文逗号“,”隔开。</span>
          </p>
          <el-input type="textarea" placeholder="请输入消息模板内容" v-model="form.wechatTemplate" class="w800" :disabled="isPending"></el-input>
        </li>
        <li class="item-box" v-if="form.way == 1 && form.roleName == null">
          <p class="text-name">
            <span class="item-label">手机号：</span>
            <span class="notify">可同时输入多个手机号，用英文逗号“,”隔开。</span>
          </p>
          <el-input type="textarea" placeholder="请输入手机号" v-model="form.phones" class="w800"></el-input>
        </li>
        <li class="item-box" v-if="form.way == 4 && form.roleName == null">
          <p class="text-name">
            <span class="item-label">微信OpenId：</span>
            <span class="notify">可同时输入多个微信OpenId，用英文逗号“,”隔开。</span>
          </p>
          <el-input type="textarea" placeholder="请输入微信OpenId" v-model="form.wxOpenIds" class="w800"></el-input>
        </li>
        <!-- <li class="item-box" v-if="form.way == 3 && form.roleName == null">
          <p class="text-name">
            <span class="item-label">小程序OpenId：</span>
            <span class="notify">可同时输入多个小程序OpenId，以英文逗号“,”隔开。</span>
          </p>
          <el-input type="textarea" placeholder="请输入小程序OpenId" v-model="form.xcxOpenId" class="w800"></el-input>
        </li> -->
        <li class="item-box" v-if="form.way == 1">
          <p class="text-name">
            <span class="item-label">消息内容：</span>
            <span class="notify">70字以内</span>
          </p>
          <el-input type="textarea" placeholder="请输入消息内容" v-model="form.content" class="w800"></el-input>
        </li>
        <li class="item-box" v-if="form.way == 1">
          <p class="text-name">
            <span class="item-label">消息签名：</span>
          </p>
          <el-input type="textarea" placeholder="请输入消息签名" v-model="form.type" class="w800"></el-input>
        </li>
        <li class="item-box">
          <p class="text-name" style="float: left">
            <span class="item-label">温馨提示：</span>
          </p>
          <div class="hint">
            <p>1.请不要频繁的发送，以免被用户当做骚扰信息或是垃圾信息而拒收屏蔽；</p>
            <p>2.不得传输任何非法的、辱骂性的、伤害性的、淫秽的信息；不能传输涉及国家安全的信息；不能传输任何不符合当地法规、国家法律的信息；</p>
            <p>3.为营造绿色通信环境，请遵守网络文明规范。请勿发送垃圾短信或恶意内容（如：催债类、广告类等），以避免短信发送不成功或被限制使用该功能等情况发生。</p>
          </div>
        </li>
      </ul>
      <el-button type="primary" :loading="isPending" @click="btn">{{isPending ? '正在发送' : '发送'}}</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { mobileReg } from "@utils/index";
import Publics from "@api/message";
import Role from "@api/role";

@Component({
  components: {
  }
})
export default class SendMessage extends Vue {
  form: any = {
    roleName: null,
    phones: "",
    content: "",
    type: "",
    way: 1
  };
  roleArr: any[] = [];
  messageArr: any[] = [];
  isPending: boolean = false;
  zm: any[] = ['P', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O'];
  other: object = {
    roleName: "其他",
    roleId: null
  }
  param: any = {
    pageSize: 99,
    pageNum: 1,
    sortField: "updateTime",
    sortBy: false
  }
  created() {
    this.getRoleList();
    this.getMessageTemplate();
  }
  getRoleList() {
    this.roleArr = [this.other];
    let data = { pageNum: 1, pageSize: 99 };
    Role.roleList({ data }).then(res => {
      if (res.code === 0) {
        this.roleArr = [...res.data.result, this.other];
      }
    });
  }
  getMessageTemplate() {
    let data = {
      ...this.param
    }
    Publics.system_message_list({ data }).then(res => {
      if (res.code === 0) {
        this.messageArr = res.data.result;
      }
    });
  }
  is() {
    if (this.form.way == 1) {
      if (this.form.roleName == null) {
        if (this.form.phones === '') {
          this.$notify({
            title: "提示",
            type: "error",
            message: "请输入手机号码！"
          });
          return false;
        }
        let arr = this.form.phones.replace(/ /g,'').split(",");
        for(let i = 0; i < arr.length; i ++){
          if (!mobileReg(arr[i])) {
            this.$notify({
              title: "提示",
              type: "error",
              message: `第${i+1}个手机号码有误或者格式有误！`
            });
            return false;
          }
        }
      }
      if (this.form.content === '' || this.form.content.length > 70) {
        this.$notify({
          title: "提示",
          type: "error",
          message: "请输入消息内容并且小于70字！"
        });
        return false;
      }
      if (this.form.type === '') {
        this.$notify({
          title: "提示",
          type: "error",
          message: "请输入消息签名！"
        });
        return false;
      }  
    } else {
      if (this.form.systemMessageId === '') {
        this.$notify({
          title: "提示",
          type: "error",
          message: "请选择消息模板！"
        });
        return false;
      }
      if (this.form.wechatTemplate === '') {
        this.$notify({
          title: "提示",
          type: "error",
          message: "请输入消息模板内容！"
        });
        return false;
      }
      if (this.form.roleName == null && this.form.wxOpenIds) {
        this.$notify({
          title: "提示",
          type: "error",
          message: "请输入微信OpenId！"
        });
        return false;
      }
    }
    return true;
  }
  btn() {
    if (!this.is()) return;
    if (this.isPending) return;
    this.$confirm('确认发送消息吗？', '群发消息', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      this.isPending = true;
      delete this.form.way;
      let data = { ...this.form };
      data.type = '【' + data.type + '】';
      data.phones = data.phones.replace(/1/g,"Q").replace(/2/g,"W").replace(/3/g,"E").replace(/4/g,"R").replace(/5/g,"T")
        .replace(/6/g,"Y").replace(/7/g,"U").replace(/8/g,"I").replace(/9/g,"O").replace(/0/g,"P");
      Publics.batch_sendMessage({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              type: "success",
              message: "消息发送成功！"
            });
            this.form = {
              way: 1
            }
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }).catch(() => {
      
    })
  }
}
</script>
<style lang="scss" scoped>
  #sendMessage{
    background-color: #fff;
    padding: 30px;
    .w500 {
      max-width: 500px;
      width: 100%;
    }
    .w800 {
      max-width: 800px;
      width: 100%;
    }
    .item-box{
      overflow: hidden;
      margin-bottom: 25px;
    }
    .text-name{
      margin-bottom: 5px;
    }
    .item-label{
      color: #606266;
    }
    .notify{
      color: #999;
    }
    .hint{
      width: 740px;
      color: #999;
      float: left;
    }
    /deep/{
      .el-textarea__inner{
        border-radius: 0;
        height: 100px;
        resize: none;
      }
      .el-radio{
        margin-bottom: 0;
      }
    }
  }
</style>