/*
 module:
    Address
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-15:  Address
 */
import ZxHttp from "../base";
class Archives extends ZxHttp {
  public query_userinfo_edu_admin(data: {
    data: {
      userId: string;
    };
  }) {
    return this.get("/edu/query_userinfo_edu_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Archives("user");
