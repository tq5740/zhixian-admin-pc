/*
 module:
    chao
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-11-13
 */
import ZxHttp from "../base";
class Article extends ZxHttp {
  public article_list_admin(data: any) {
    return this.get("/article_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_article_admin(data: any) {
    return this.post("/create_article_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 获取回收站数据
  public recycle_article_list_admin(data: any) {
    return this.get("/recycle_article_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 物理删除文章
  public delete_article_admin(data: any) {
    return this.post("/delete_article_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 逻辑删除文章
  public del_article_admin(data: any) {
    return this.post("/del_article_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 恢复删除文章
  public rec_article_admin(data: any) {
    return this.post("/rec_article_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }



  public audit_article_admin(data: any) {
    return this.post("/audit_article_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public on_off_admin(data: any) {
    return this.post("/on_off_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recommend_article_admin(data: any) {
    return this.post("/recommend_article_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public articleReg_list(data: any) {
    return this.get("/articleReg_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_article_admin(data: any) {
    return this.get("/query_article_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_article_admin(data: any) {
    return this.post("/update_article_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_articleReg(data: any) {
    return this.post("/audit_articleReg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_articleReg_admin(data: any) {
    return this.post("/delete_articleReg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_article_statistics_admin(data: any) {
    return this.get("/article/query_article_statistics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public export_articleReg() {
    return this.$api.article + "/export_articleReg_admin";
  }

  // 修改层级
  public updateArticleHierarchy(data: any) {
    return this.post("/article/updateArticleHierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Article("article");
