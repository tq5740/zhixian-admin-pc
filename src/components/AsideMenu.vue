<template>
  <div id="asideMenu">
    <div class="logo-box">
      <a href="/" class="logo">
        <img src="../img/index/logo_old.png" alt="">
      </a>
    </div>
    <div class="menuBtn">
      <el-menu
        :default-active="key"
        @select="select"
        unique-opened
      >
        <el-submenu
          ref="test"
          :title="item.methodName"
          v-for="item in permissionList"
          :key="item.methodId"
          :index="item.pageUrl"
        >
          <template slot="title">
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '首页'">
              <use xlink:href="#icon-shouye"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '组织管理'">
              <use xlink:href="#icon-zuzhiguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '用户管理'">
              <use xlink:href="#icon-yonghuguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '文章管理'">
              <use xlink:href="#icon-wenzhangguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '培训管理'">
              <use xlink:href="#icon-peixunguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '直播管理'">
              <use xlink:href="#icon-zhiboguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '考试管理'">
              <use xlink:href="#icon-kaoshiguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '广告管理'">
              <use xlink:href="#icon-guanggaoguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '招聘管理'">
              <use xlink:href="#icon-zhaopinguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '证书管理'">
              <use xlink:href="#icon-zhengshuguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '测评管理'">
              <use xlink:href="#icon-cepingguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '其他管理'">
              <use xlink:href="#icon-qitaguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '内容管理'">
              <use xlink:href="#icon-neirongguanli"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '数据分析'">
              <use xlink:href="#icon-shujufenxi"></use>
            </svg>
            <svg class="menu-icon" aria-hidden="true" v-if="item.methodName === '系统管理'">
              <use xlink:href="#icon-xitongguanli"></use>
            </svg>
            <span>{{item.methodName}}</span>
          </template>
          <el-menu-item-group v-if="item.children && item.children.length > 0">
            <el-menu-item
              v-for="(i) in item.children"
              :key="i.methodId"
              :index="i.pageUrl"
            >{{i.methodName}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
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
    2018-7-26:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { matchUrl } from "@utils/index";
import { State, Mutation } from "vuex-class";
//https://github.com/ktsn/vuex-class
@Component({})
export default class AsideMenu extends Vue {
  get key(): string {
    let urlArr: Array<string> = matchUrl(this.$route.path);
    return `/${urlArr[0]}/${urlArr[1]}`;
  }
  @State("permissionList") permissionList: any;
  @State("secondMenu") secondMenu: any;
  @State("thirdMenu") thirdMenu: any;
  @Mutation("setSecondMenu") setSecondMenu: any;
  @Mutation("setThirdMenu") setThirdMenu: any;
  _matchUrl(url: string) {
    return matchUrl(url);
  }
  created() {
  }
  select(e: any) {
    if (e === this.key) return;
    let secondKey = `/${matchUrl(e)[0]}`;
    this.setSecondMenu({
      key: secondKey,
      data: this.permissionList
    });
    this.setThirdMenu({
      key: e,
      data: this.secondMenu[secondKey]
    });
    // console.log(this.secondMenu,this.thirdMenu)
    this.$router.push(e);
  }

}
</script>
<style lang="scss" scoped>
  .menuBtn::-webkit-scrollbar {/*滚动条整体样式*/
    width: 6px;
    height: 1px;
  }
  .menuBtn::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background-color: #717d9f;
  }
  .menuBtn::-webkit-scrollbar-track {/*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 10px;
    background: #EDEDED;
  }
  #asideMenu {
    position: relative;
    min-height: 100%;
    max-height: 100%;
    background: $navBg;
    .logo-box{
      height: 128px;
      text-align: center;
    }
    .logo{
      img{
        width: 81px;
        padding-top: 20px;
      }
    }
    .menuBtn{
      position: absolute;
      top: 128px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
    }
    .el-menu {
      padding-top: 1px;
      background-color: #282031!important;
      border-right: none;
    }
    .el-menu-item {
      padding-left: 74px!important;
      border: 1px solid #454d64;
      height: 50px;
      line-height: 50px;
      color: #fff;
      border-left: 4px solid transparent;
      margin-bottom: 1px;
      &:hover,
      &:focus {
        border-left: 4px solid $green;
      }
    }
    .el-menu-item.is-active {
      color: #fff;
      border-left: 4px solid $green;
      i {
        color: $green;
      }
      &::after{
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 8px;
        background: $green;
        position: absolute;
        left: 49px;
        top: 50%;
        margin-top: -4px;
      }
    }
  }
  .menu-icon{
    width: 16px;
    height: 16px;
    margin: auto 15px auto 30px;
  }
  /deep/ {
    .el-menu {
      background-color: transparent !important;
    }
    .el-submenu.is-active .el-submenu__title{
      border-bottom: none;
      background: $green;
      color: #fff!important;
      &:hover,
      &:focus {
        background-color: $green!important;
      }
      i{
        color: #fff!important;
      }
      .menu-icon{
        filter: drop-shadow(#ffffff 80px 0);
        position: relative;
        left: -80px;
        left: 0 \9;
      }
    }
    .el-submenu__title {
      height: 50px !important;
      line-height: 50px !important;
      padding: 0 !important;
      color: #c3cada !important;
      border: 1px solid #3a4258;
      border-left: 5px solid transparent;
      min-width: auto;
      background-color: #333A4D;
      margin-bottom: 1px;
      &:hover,
      &:focus {
        border-bottom: none;
        color: #fff!important;
        background-color: $green!important;
        i{
          color: #fff!important;
        }
        .menu-icon{
          filter: drop-shadow(#ffffff 80px 0);
          position: relative;
          left: -80px;
          left: 0 \9;
        }
      }
      i{
        font-size: 18px !important;
        color: #c3cada !important;
        right: 30px;
      }
    }
    .el-menu-item-group__title {
      padding: 0 !important;
    }
    .el-menu-item-group>ul>.el-menu-item{
      background-color: #3e4558;
    }
  }
</style>
