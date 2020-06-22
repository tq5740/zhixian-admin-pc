import ZxHttp from "../base";
class Publics extends ZxHttp {
  // 错误报告
  public error_report_list_admin(data: any) {
    return this.get("/errorreport/error_report_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_error_report_admin(data: any) {
    return this.get("/errorreport/query_error_report_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_error_report_admin(data: any) {
    return this.post("/errorreport/audit_error_report_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Publics("publics");
