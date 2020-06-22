<template>
  <div class="all" v-show="$store.state.userInfo">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>当前位置：{{methodName_1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{methodName_2}}</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>{{$store.state.activeMenu[$store.state.activePath] && $store.state.activeMenu[$store.state.activePath].methodName}}</el-breadcrumb-item> -->
    </el-breadcrumb>
    <div class="present">{{methodName_2}}</div>
    <div class="tabs">
      <router-view></router-view>
      <!-- <el-tabs type="border-card" @tab-click="tabsClick" v-model="$store.state.activePath">
        <el-tab-pane v-for="(item) in thirdMenu[key]" :key="item.id" :name="item.pageUrl" :label="item.methodName">
        </el-tab-pane>
        <router-view></router-view>
      </el-tabs> -->
    </div>
  </div>
</template>

<script lang="ts">
/*
 module:
    main.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-11:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import { matchUrl } from "@utils/index";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Index extends Vue {
  get urlArr(): Array<string> {
    return matchUrl(
      this.$route.path === "/"
        ? this.$store.state.init3rdMenu
        : this.$route.path
    );
  }
  get key(): string {
    return `/${this.urlArr[0]}/${this.urlArr[1]}`;
  }
  get key_one(): string {
    return `/${this.urlArr[0]}`;
  }
  get methodName_2(): string {
    let _methodName_2: string = "";
    this.$store.state.userInfo &&
      this.$store.state.userInfo.isAdmin &&
      this.$store.state.secondMenu[this.key_one].forEach((item: any) => {
        if (item.pageUrl === this.key) {
          _methodName_2 = item.methodName;
        }
      });
    return _methodName_2;
  }
  get methodName_1(): string {
    let _methodName_1: string = "";
    this.$store.state.permissionList.forEach((item: any) => {
      if (item.pageUrl === this.key_one) {
        _methodName_1 = item.methodName;
      }
    });
    return _methodName_1;
  }
  @State("thirdMenu") thirdMenu: any;
  tabsClick(tab: any) {
    // this.setActiveMenu(this.thirdMenu[this.key][tab.index]);
    this.$router.push(this.thirdMenu[this.key][tab.index].pageUrl);
  }
}
</script>
<style lang="scss" scoped>
.tabs {
  padding: 20px 30px 50px 30px;
  box-sizing: border-box;
}
.el-breadcrumb {
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e3e7f1;
  padding: 20px 0;
  padding-left: 30px;
  display: inline-block;
}
.present{
  margin: 25px 30px 0px 30px;
  color: #4e5c79;
  font-size: 16px;
  font-weight: bold;
}
/deep/{
  .el-breadcrumb__inner{
    color: #5b6a8b!important;
  }
}
</style>
