/*
 module:
    封装axios
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-4: 封装axios
 */
import axios from "axios";
import store from "@/store/index";
import { Notification } from "element-ui";
import { detailPending, detailApiData } from "./utils";
let Base = "";
if (location.protocol.includes("s")) {
  Base = "https://api.weijiuye.com.cn:8443"
} else {
  Base = "http://" + location.hostname
}
const prodApi: any = {
  publics: Base + "/publics",
  user: Base + "/user",
  permission: Base + "/permission",
  article: Base + "/article",
  train: Base + "/train",
  live: Base + "/live",
  exam: Base + "/exam",
  eval: Base + "/eval",
  advert: Base + "/advert",
  work: Base + "/work"
};
// const prodApi: any = {
//   publics: "http://10.3.1.151:8001/publics",
//   user: "http://10.3.1.151:8002/user",
//   permission: "http://10.3.1.151:8003/permission",
//   article: "http://10.3.1.151:8004/article",
//   train: "http://10.3.1.151:8005/train",
//   live: "http://10.3.1.151:8006/live",
//   exam: "http://10.3.1.151:8007/exam",
//   eval: "http://10.3.1.151:8008/eval",
//   advert: "http://10.3.1.151:8009/advert",
//   work: "http://10.3.1.151:8010/work"
// }

if (process.env.NODE_ENV !== "production") {
  const colors = ["#28a0f6", "#fc703e", "#42b983", "#CC3366"];
  var devApi: any = {};
  var apiConfig = require("../../../api.json");
  Object.keys(apiConfig).forEach((i, k) => {
    devApi[i] = apiConfig[i];
    console.log(
      `%c当前${i}的api地址:${devApi[i]}`,
      `font-size:14px;color:${colors[k]};`
    );
  });
}

class ZxHttp {
  $http: any;
  $api: any;
  constructor(module: string) {
    this.$api = process.env.NODE_ENV !== "production" ? devApi : prodApi;
    this.$http = axios.create({
      baseURL:
        process.env.NODE_ENV !== "production" ? devApi[module] : prodApi[module]
    });
    // 因为transformResponse不能处理get的数据,所以统一在拦截器里处理
    this.$http.interceptors.request.use(
      (config: any) => {
        config.data.siteHierarchy = "A1-";
        detailPending.removePending(config);
        detailPending.setPending(config, axios.CancelToken);
        detailApiData
          .cloneData(config)
          .checkSite(store.state.configData, config.url)
          .setSite(config.data.data)
          .checkToken(store.state.userInfo, config.url)
          .setToken(config.data.data)
          .qsData(config);

        if (config.method === "get") {
          config.headers["Content-Type"] = "multipart/form-data";
        }
        return config;
      },
      (err: any) => Promise.reject(err)
    );
    this.$http.interceptors.response.use(
      (res: any) => {
        if (res.data.code === 401) {
          if (!store.state.checkFlag) {
            Notification({
              type: `error`,
              title: "提示",
              message: `登录过期,请重新登录!`
            });
          }
          localStorage.removeItem("admin_token");
          if (location.pathname !== "/login" && !store.state.checkFlag && location.pathname !== "/showPage") {
            setTimeout(() => {
              location.replace("/login");
            }, 1000);
          }
          store.state.checkFlag = true;
          detailPending.removeAll();
          return;
        }
        detailPending.removePending(res.config);
        if (res.data.code !== 0) {
          Notification({
            type: `error`,
            title: "提示",
            message: res.data.msg
          });
        }

        return res.data;
      },
      (error: any) => {
        !error.__CANCEL__ &&
          Notification({
            type: `error`,
            title: "提示",
            message: "网络错误或服务器异常"
          });
        return Promise.reject(error);
      }
    );
  }
  public get(
    url: string,
    data = { data: {} },
    config: object = {}
  ): Promise<any> {
    return this.$http
      .get(url, data, config)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public post(
    url: string,
    data = { data: {} },
    config: object = {}
  ): Promise<any> {
    return this.$http
      .post(url, data, config)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => {
        return Promise.reject(e);
      });
  }
}
export default ZxHttp;
