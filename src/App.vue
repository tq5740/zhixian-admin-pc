<template>
  <div id="app">
    <el-row :gutter="0" class="maxheight">
      <div class="left-col maxheight" v-show="$store.state.userInfo">
        <aside-menu></aside-menu>
      </div>
      <div class="right-col maxheight" :class="{'left0' : isLoginPage}">
        <div class="right maxheight">
          <head-bar v-show="$store.state.userInfo"></head-bar>
          <router-view />
        </div>
      </div>
    </el-row>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import HeadBar from "@c/HeadBar.vue";
import AsideMenu from "@c/AsideMenu.vue";
import Lrz from "../node_modules/lrz/dist/lrz.all.bundle";

@Component({
  components: {
    HeadBar,
    AsideMenu
  }
})
export default class App extends Vue {
  get isLoginPage(): boolean {
    return this.$route.path === "/login" || this.$route.path === "/showPage";
  }
  created() {
    window.Lrz = Lrz;
  }
}
</script>
<style lang="scss" scoped>
  .maxheight {
    height: 100%;
  }
  // .content {
  //   height: calc(100% - 60px);
  // }

  .right {
    overflow: auto;
  }
  .left-col{
    width: 222px;
  }
  .right-col{
    background: #ecf1f5;
    position: absolute;
    left: 222px;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .left0{
    left: 0;
  }
  .left222{
    left: 222px;
  }
</style>
