/*
 module:
    chao
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-10-20
 */
import ZxHttp from "../base";
class OtherAll extends ZxHttp {
  // 投票管理
  public poll_list_admin(data: any) {
    return this.get("/poll/poll_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_poll_admin(data: any) {
    return this.post("/poll/create_poll_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_poll_admin(data: any) {
    return this.post("/poll/update_poll_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public del_poll_admin(data: any) {
    return this.post("/poll/del_poll_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_poll_admin(data: any) {
    return this.get("/poll/query_poll_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_poll_admin(data: any) {
    return this.post("/poll/online_offline_poll_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public poll_statistics_admin(data: any) {
    return this.get("/poll/poll_statistics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_poll_admin(data: any) {
    return this.post("/poll/audit_poll_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 投票回收站
  public recycle_poll_list_admin(data: any) {
    return this.get("/poll/recycle_poll_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recover_poll_admin(data: any) {
    return this.post("/poll/recover_poll_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_poll_admin(data: any) {
    return this.post("/poll/delete_poll_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 投票对象
  public poll_obj_list_admin(data: any) {
    return this.get("/poll/obj/poll_obj_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_poll_obj_admin(data: any) {
    return this.post("/poll/obj/create_poll_obj_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_poll_obj_admin(data: any) {
    return this.post("/poll/obj/update_poll_obj_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_poll_obj_admin(data: any) {
    return this.post("/poll/obj/delete_poll_obj_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_poll_obj_admin(data: any) {
    return this.get("/poll/obj/query_poll_obj_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 导出报表
  public exportPollObjDataAdmin() {
    return this.$api.publics + "/poll/obj/export_poll_obj_data_admin";
  }

  // 评分管理
  public score_list_admin(data: any) {
    return this.get("/score/score_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_score_admin(data: any) {
    return this.get("/score/query_score_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_score_admin(data: any) {
    return this.post("/score/delete_score_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 讲师管理
  public teacher_list_admin(data: any) {
    return this.get("/teacher/teacher_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_teacher_admin(data: any) {
    return this.post("/teacher/create_teacher_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_teacher_admin(data: any) {
    return this.post("/teacher/update_teacher_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_teacher_admin(data: any) {
    return this.post("/teacher/delete_teacher_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_teacher_admin(data: any) {
    return this.get("/teacher/query_teacher_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_teacher_admin(data: any) {
    return this.post("/teacher/online_offline_teacher_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public is_recommend_teacher_admin(data: any) {
    return this.post("/teacher/is_recommend_teacher_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 讲师培训
  public teacher_major_list_admin(data: any) {
    return this.get("/teacher/teacher_major_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_teacher_major_admin(data: any) {
    return this.post("/teacher/create_teacher_major_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_teacher_major_admin(data: any) {
    return this.post("/teacher/update_teacher_major_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_teacher_major_admin(data: any) {
    return this.post("/teacher/delete_teacher_major_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_teacher_major_admin(data: any) {
    return this.get("/teacher/query_teacher_major_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new OtherAll("publics");
