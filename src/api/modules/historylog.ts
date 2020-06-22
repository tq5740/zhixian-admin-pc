/*
 module:
   日志列表（管理端）
  author:
    谭清
  summary:
    2019-3-5: created
 */
import ZxHttp from "../base";
class Historylog extends ZxHttp {
  // 日志列表（管理端）
  public historylogListAdmin( data : any ) {
    return this.get("/historylog/historylog_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 查询日志（管理端）
  public queryHistorylogAdmin( data: any ) {
    return this.get("/historylog/query_historylog_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Historylog("publics");
