const qs = require("qs");
const deepClone = require("lodash.clonedeep");
export const detailApiData = {
  excludesSite: ["/system/upload", "/import_venue_org"],
  excludesToken: [
    "/user/get_userByToken",
    "/system/upload",
    "/import_venue_org"
  ],
  uploadUrl: ["/system/upload", "/import_venue_org"],
  isAddSiteHierarchy: false,
  siteHierarchy: "",
  isAddToken: false,
  token: "",
  checkUpload(url: string) {
    for (let i of this.uploadUrl) {
      if (url.includes(i)) {
        return true;
      }
    }
  },
  checkToken(userInfo: any, apiUrl: any) {
    if (userInfo) {
      for (let i of this.excludesToken) {
        if (!apiUrl.includes(i)) {
          this.isAddToken = true;
        } else {
          this.isAddToken = false;
          break;
        }
      }
      this.token = userInfo.token;
    } else {
      this.isAddToken = false;
    }
    return this;
  },
  setToken(data: any) {
    if (this.isAddToken && this.token) {
      data.token = this.token;
    }
    return this;
  },
  checkSite(configData: any, apiUrl: any) {
    if (configData) {
      for (let i of this.excludesSite) {
        if (!apiUrl.includes(i)) {
          this.isAddSiteHierarchy = true;
        } else {
          this.isAddSiteHierarchy = false;
          break;
        }
      }
      this.siteHierarchy = configData.hierarchy;
    } else {
      this.isAddSiteHierarchy = false;
    }
    return this;
  },
  setSite(data: any) {
    if (this.isAddSiteHierarchy) {
      data.siteHierarchy = this.siteHierarchy;
    }
    return this;
  },
  qsData(config: any) {
    if (config.method === "get") {
      for (let i in config.data.data) {
        if (config.data.data[i] === "") {
          delete config.data.data[i];
        }
      }
      config.url = config.url + "?" + qs.stringify(config.data.data);
    } else {
      if (!this.checkUpload(config.url)) {
        config.data = qs.stringify(config.data.data);
      }
    }
  },
  cloneData(config: any) {
    let cloneData = null;
    if (!this.checkUpload(config.url)) {
      // console.log(object)
      if (config.method === "get") {
        cloneData = deepClone(config.data);
      } else {
        cloneData = deepClone(config.data.data);
      }
      config.data = {
        data: cloneData
      };
    }
    return this;
  }
};
export const detailPending = {
  pending: [],
  removeAll() {
    this.pending.forEach((i: any, k: number) => {
      i.f();
    });
  },
  removePending(config: any) {
    this.pending.forEach((i: any, k: number) => {
      if (i.u === config.url + "&" + config.method) {
        //当当前请求在数组中存在时执行函数体
        i.f(); //执行取消操作
        //@ts-ignore
        this.pending.splice(k, 1); //把这条记录从数组中移除
      }
    });
  },
  setPending(config: any, cancelToken: any) {
    config.cancelToken = new cancelToken((c: any) => {
      //@ts-ignore
      this.pending.push({ u: config.url + "&" + config.method, f: c });
    });
  }
};
