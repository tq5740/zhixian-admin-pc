/*
 module:
   action
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-11:init 
 */
import types from "./types";
var cloneDeep = require("lodash.clonedeep");
import router from "../routers/router";
export default {
  setPermissionList(state: types, payload: types["permissionList"]): void {
    if (payload) state.permissionList = payload;
  },

  setSecondMenu(state: types, payload: any): void {
    if (state.secondMenu[payload.key]) return;
    if (state.permissionList.length > 0) {
      for (let i = 0, len = payload.data.length; i < len; i++) {
        if (payload.data[i].pageUrl === payload.key) {
          state.secondMenu[payload.key] = payload.data[i].children;
          break;
        }
      }
    }
  },
  setThirdMenu(state: types, payload: any): void {
    /**
     *   只用户处于登录状态的时候才执行 并且 页面不为login
     */
    let key = payload.key;
    if (location.pathname === "/showPage") {
      return;
    }
    if (location.pathname === "/login") {
      if (!state.userInfo) return;
      else key = state.init2edMenu;
    }
    if (state.thirdMenu[key]) return;
    if (state.permissionList.length > 0) {
      try {
        for (let i = 0, len = payload.data.length; i < len; i++) {
          if (payload.data[i].pageUrl === key) {
            state.thirdMenu[key] = payload.data[i].children;
            break;
          }
        }
      } catch (error) {
        router.replace(state.init3rdMenu);
        return;
      }
    }
  },
  setActiveMenu(state: types, payload: { key: string; data: object }): void {
    if (state.activeMenu[payload.key]) return;
    state.activeMenu[payload.key] = cloneDeep(payload.data);
  },
  setActivePath(state: types, payload: types["activePath"]): void {
    state.activePath = payload;
  },
  setUserInfo(state: types, payload: types["userInfo"]): void {
    state.userInfo = payload;
  },
  setConfigData(state: types, payload: types["configData"]): void {
    state.configData = payload;
  },
  setJobClassify(state: types, payload: types["jobClassify"]): void {
    state.jobClassify = payload;
  },
  setPostTree(state: types, payload: types["postTree"]): void {
    state.postTree = payload;
  },
  setDeptTree(state: types, payload: types["deptTree"]): void {
    state.deptTree = payload;
  },
  setCompanyreg(state: types, payload: types["companyreg"]) {
    state.companyreg = payload;
  },
  setCourseData(state: types, payload: types["courseData"]) {
    state.courseData = payload;
  },
  setTrainData(state: types, payload: types["trainData"]) {
    state.trainData = payload;
  },
  setKnow(state: types, payload: types["know"]) {
    state.know = payload;
  },
  setExamData(state: types, payload: types["examData"]) {
    state.examData = payload;
  },
  setAdvertData(state: types, payload: types["advertData"]) {
    state.advertData = payload;
  },
  setLiveData(state: types, payload: types["liveData"]) {
    state.liveData = payload;
  },
  setUserData(state: types, payload: types["userData"]) {
    state.userData = payload;
  },
  setEvalData(state: types, payload: types["evalData"]) {
    state.evalData = payload;
  },
  setMyOrgList(state: types, payload: types["myOrgList"]) {
    state.myOrgList = payload;
  }
};
