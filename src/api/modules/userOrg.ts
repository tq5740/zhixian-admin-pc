/*
 module:
    权限接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2019-6-12:  用户类
 */
import ZxHttp from "../base";

class userOrg extends ZxHttp {
  query_org_reg(data: any) {
    return this.get("/org/query_org_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  update_org_reg(data: any) {
    return this.post("/org/update_org_reg", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new userOrg("user");
