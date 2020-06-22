/*
 module:
    main.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-11:init
 */
import "@style/reset.scss";
import Vue from "vue";
import VueJsonp from "vue-jsonp";
import App from "./App.vue";
import router from "./routers/router";
import store from "./store/index";
import "@style/icon.js";
import "./utils/polyfill";

import {
  matchUrl,
  getStorage,
  forTree,
  ForTree,
  GetApiTime,
  getApiTime,
  FormatDate,
  formatDate,
  FormatSeconds,
  formatSeconds,
  MapTypeStr,
  mapTypeStr,
  getFather,
  GetFather
  //getPDF
} from "./utils/index";
import useEle from "./utils/ele";
import User from "@api/user";
import System from "@api/system";
import vSelectAddress from "@c/VselectAddress/index.ts";
//use 组件并注册vue的原型
useEle.$use().$mount();
Vue.config.productionTip = false;
Vue.use(vSelectAddress);
Vue.use(VueJsonp);
interface ImgSize {
  [propsName: string]: string;
}
const imgSize: ImgSize = {
  "30x30": "/30x30",
  "100x100": "/100x100",
  "250x350": "/250x350",
  "224x126": "/224x126",
  "210x297": "/210x297",
  "400x250": "/400x250",
  "800x450": "/800x450"
};
declare module "vue/types/vue" {
  interface Vue {
    $forTree: ForTree;
    $getApiTime: GetApiTime;
    $formatDate: FormatDate;
    $formatSeconds: FormatSeconds;
    $mapTypeStr: MapTypeStr;
    $getFather: GetFather;
    $imgSize: ImgSize;
  }
}

Vue.prototype.$forTree = forTree;


//Vue.prototype.$getPDF = getPDF;


Vue.prototype.$getApiTime = getApiTime;
Vue.prototype.$formatDate = formatDate;
Vue.prototype.$formatSeconds = formatSeconds;
Vue.prototype.$mapTypeStr = mapTypeStr;
Vue.prototype.$getFather = getFather;
Vue.prototype.$imgSize = imgSize;

// // 批量替换图片 (图片防盗链)
// Vue.prototype.$getMainImgUrl = function (data: string, path: string, callback: any) {
//   let thirdImgArr: any = [];
//   let thirdImgNumber: any = 0;
//   let htmlText = data;
//   let divDom = document.createElement("div");
//   divDom.innerHTML = htmlText;
//   let imgArr = divDom.getElementsByTagName("img");
//   if (imgArr.length === 0) {
//     callback(data);
//     return;
//   }
//   for (let i = 0; i < imgArr.length; i++) {
//     if (!imgArr[i].src.includes("i.weijiuye.com.cn")) {
//       thirdImgArr.push(i);
//     } else {
//       callback(data);
//     }
//   }
//   for (let i = 0; i < thirdImgArr.length; i++) {
//     uploadImg(imgArr[i], path, (url: string) => {
//       thirdImgNumber += 1;
//       imgArr[thirdImgArr[i]].src = "https://i.weijiuye.com.cn" + url;
//       if (thirdImgNumber == thirdImgArr.length) {
//         callback(divDom.innerHTML);
//       }
//     });

//   }
// }

// // 绘制图片并上传 (图片防盗链)
// function uploadImg(imgDom: any, path: string, callback: any) {
//   try {
//     let canvas: any = document.createElement('canvas');
//     let ctx: any = canvas.getContext('2d');
//     let imgObject = new Image();
//     imgObject.setAttribute('crossOrigin', 'anonymous');
//     imgObject.src = imgDom.src;
//     imgObject.onload = function () {
//       canvas.width = imgObject.width;
//       canvas.height = imgObject.height;
//       ctx.drawImage(imgObject, 0, 0, imgObject.width, imgObject.height);
//       canvas.toBlob((blob: any) => {
//         let files = new File([blob], "FileName.png", { type: "image/png" });
//         var xhr = new XMLHttpRequest();
//         var formData = new FormData();
//         formData.append("file", files);
//         formData.append("uploadType", "2");
//         formData.append("token", store.state.userInfo ? store.state.userInfo.token : "");
//         formData.append("path", path);
//         xhr.open('POST', "https://www.weijiuye.com.cn/8001/system/upload");
//         xhr.send(formData);
//         xhr.onreadystatechange = function () {
//           if (xhr.readyState == 4 && xhr.status == 200) {
//             callback(JSON.parse(xhr.response).data.url);
//           }
//         }
//       })
//     }
//   } catch (error) {
//     callback(imgDom.src);
//   }
// }





async function init() {
  let pathname: string = window.location.pathname,
    matchUrlArr: Array<string> = matchUrl(pathname),
    _one: string = matchUrlArr[0],
    _two: string = matchUrlArr[1],
    first: string = pathname === "/" ? store.state.init1stMenu : `/${_one}`,
    second: string =
      pathname === "/" ? store.state.init2edMenu : `/${_one}/${_two}`,
    token: string = "";
  token = location.href.split("&t=")[1];
  if (!token) {
    token = getStorage("admin_token")
  }
  // const data = {
  //   doMain: location.hostname
  // };
  if (!token) {
    if (first !== "/login" && first !== "/showPage") {
      location.replace("/login");
      return;
    }
  }
  if (token) {
    try {
      var res = await User.getUserByToken({
        data: { token }
      });
      if (!res.data.isAdmin) {
        Vue.prototype.$notify({
          title: "警告",
          message: "请使用管理员账号登录！",
          type: "error"
        });
        setTimeout(() => {
          localStorage.removeItem("admin_token");
          location.replace("/login");
        }, 1000);
        return;
      }
      if (res.data.isAdmin && first === "/login") {
        location.replace("/");
        return;
      }
      if (res.code === 0 && res.data.isAdmin) {
        store.commit("setUserInfo", res.data);
        await store.dispatch(`getMethodTree`);
        store.commit("setSecondMenu", {
          data: store.state.permissionList,
          key: first
        });
        store.commit("setThirdMenu", {
          key: second,
          data: store.state.secondMenu[first]
        });
      }
    } catch (error) {
      if (!store.state.checkFlag) {
        localStorage.removeItem("admin_token");
        if (first !== "/login" && first !== "/showPage") {
          setTimeout(() => {
            location.replace("/login");
          }, 1000);
        }
      }
    }
  }
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
}
init();
