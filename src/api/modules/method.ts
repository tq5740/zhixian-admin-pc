/*
 module:
    权限接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-6:  权限接口类
 */
import ZxHttp from "../base";
class Method extends ZxHttp {
  public queryMethodTree(data: {
    data: {
      token: string;
    };
  }) {
    return this.get("/method/query_method_tree", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Method("permission");
