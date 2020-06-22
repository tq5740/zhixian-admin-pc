/*
 module:
    权限接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-6:  权限接口类
 */
import ZxHttp from "../base";
class Eval extends ZxHttp {
  // 修改层级
  public updateEvalHierarchy(data: any) {
    return this.post("/evaluation/updateEvalHierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public evaluation_list_admin(data: any) {
    return this.get("/evaluation/evaluation_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public del_evaluation_admin(data: any) {
    return this.post("/evaluation/del_evaluation_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_evaluation_admin(data: any) {
    return this.post("/evaluation/audit_evaluation_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_evaluation_admin(data: any) {
    return this.post("/evaluation/create_evaluation_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public is_recommend_admin(data: any) {
    return this.post("/evaluation/is_recommend_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_admin(data: any) {
    return this.post("/evaluation/online_offline_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_evaluation(data: any) {
    return this.get("/evaluation/query_evaluation", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_evaluation_admin(data: any) {
    return this.post("/evaluation/update_evaluation_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public evaluation_report_list_admin(data: any) {
    return this.get("/evaluation/evaluation_report_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_evaluation_report_admin(data: any) {
    return this.post("/evaluation/create_evaluation_report_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_evaluation_report_admin(data: any) {
    return this.post("/evaluation/delete_evaluation_report_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public update_evaluation_config_admin(data: any) {
    return this.post("/evaluation/update_evaluation_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_evaluation_config_admin(data: any) {
    return this.get("/evaluation/query_evaluation_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_evaluation_statistics_admin(data: any) {
    return this.get("/evaluation/query_evaluation_statistics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  } 
}
export default new Eval("eval");
