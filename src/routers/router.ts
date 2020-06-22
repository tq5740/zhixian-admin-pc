import Vue from "vue";
import Router from "vue-router";
import allRoutes from "./allRoutes";
import store from "@/store/index";
import { matchUrl } from "@utils/index";
import { Notification } from "element-ui";
Vue.use(Router);
const R = new Router({
  mode: "history",
  routes: allRoutes
});

// let token: string | null = null;
R.beforeEach(async (to, from, next) => {
  let result = matchUrl(to.path),
    urlSeconed = to.path === "/" ? store.state.init2edMenu : `/${result[0]}`,
    toMenu = store.state.secondMenu[urlSeconed],
    len = store.state.permissionList.length;
  store.commit("setActivePath", to.path);
  if (!toMenu && len > 0) {
    store.commit("setSecondMenu", {
      key: "/" + result[0],
      data: store.state.permissionList
    });
    let data = store.state.secondMenu["/" + result[0]];
    store.commit("setThirdMenu", {
      key: urlSeconed,
      data
    });
    toMenu = store.state.secondMenu[urlSeconed];
  }
  if (len > 0) {
    let _key = to.path === "/" ? store.state.init3rdMenu : to.path;
    toMenu &&
    toMenu.forEach(i => {
        if (i.pageUrl === _key) {
          store.commit("setActiveMenu", {
            key: i.pageUrl,
            data: i
          });
        }
      });
  }
  if (window._hmt) {
    if (to.path) {
      window._hmt.push(["_trackPageview", "" + to.fullPath]);
    }
  }
  next();
});
R.onError(() => {
  Notification({
    type: `error`,
    title: "提示",
    message: "网络错误或服务器异常"
  });
});
export default R;
