/*
 module:
    直播
  author:
    tanqing
  summary:
    2019-5-7:  直播
 */
import ZxHttp from "../base";
class Live extends ZxHttp {
  // 直播
  public live_list_admin(data: any) {
    return this.get("/live/live_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public live_statistics_admin(data: any) {
    return this.get("/live/live_statistics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_live_admin(data: any) {
    return this.get("/live/query_live_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_live_admin(data: any) {
    return this.post("/live/create_live_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_live_admin(data: any) {
    return this.post("/live/update_live_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recycle_live_list_admin(data: any) {
    return this.get("/live/recycle_live_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_live_admin(data: any) {
    return this.post("/live/online_offline_live_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_live_admin(data: any) {
    return this.post("/live/audit_live_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public del_live_admin(data: any) {
    return this.post("/live/del_live_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_live_admin(data: any) {
    return this.post("/live/delete_live_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recover_live_admin(data: any) {
    return this.post("/live/recover_live_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_live_record_admin(data: any) {
    return this.get("/live/query_live_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public is_recommend_admin(data: any) {
    return this.post("/live/is_recommend_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public query_live_config_admin(data: any) {
    return this.get("/config/query_live_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_live_config_admin(data: any) {
    return this.post("/config/update_live_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public live_reg_list_admin(data: any) {
    return this.get("/reg/live_reg_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_live_reg_admin(data: any) {
    return this.post("/reg/create_live_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_live_reg_admin(data: any) {
    return this.post("/reg/update_live_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_live_reg_role_admin(data: any) {
    return this.post("/reg/update_live_reg_role_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_live_reg_admin(data: any) {
    return this.get("/reg/query_live_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public del_live_reg_admin(data: any) {
    return this.post("/reg/del_live_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public live_chapter_list_admin(data: any) {
    return this.get("/chapter/live_chapter_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_live_chapter_admin(data: any) {
    return this.post("/chapter/create_live_chapter_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_live_chapter_admin(data: any) {
    return this.post("/chapter/update_live_chapter_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_live_chapter_admin(data: any) {
    return this.get("/chapter/query_live_chapter_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_live_chapter_admin(data: any) {
    return this.post("/chapter/delete_live_chapter_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  
  public live_chapter_record_list_admin(data: any) {
    return this.get("/record/live_chapter_record_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 录播
  public live_chapter_record_list(data: any) {
    return this.get("/chapter/live_chapter_record_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public download_live_chapter_admin(data: any) {
    return this.post("/chapter/download_live_chapter_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public began_close_live_chapter_video_admin(data: any) {
    return this.post("/chapter/began_close_live_chapter_video_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 直播
  public start_live_admin(data: any) {
    return this.get("/chapter/start_live_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 修改层级
  public updateLiveHierarchy(data: any) {
    return this.post("/live/updateLiveHierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 导出报表
  public exportLiveReg() {
    return this.$api.live + "/reg/export_live_reg";
  }
}
export default new Live("live");
