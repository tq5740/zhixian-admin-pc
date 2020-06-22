/*
 module:
    培训
  author:
    tanqing
  summary:
    2019-4-28:  培训
 */
import ZxHttp from "../base";
class Train extends ZxHttp {
  // 课程
  public course_chapter_record_list_admin(data: any) {
    return this.get("/course/course_chapter_record_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public course_list_admin(data: any) {
    return this.get("/course/course_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public is_recommend_course(data: any) {
    return this.post("/course/is_recommend_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_course_admin(data: any) {
    return this.post("/course/audit_course_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_course(data: any) {
    return this.post("/course/online_offline_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public del_course_admin(data: any) {
    return this.post("/course/del_course_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_course_admin(data: any) {
    return this.post("/course/delete_course_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recovery_course_admin(data: any) {
    return this.post("/course/recovery_course_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_course_admin(data: any) {
    return this.post("/course/update_course_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_course_admin(data: any) {
    return this.get("/course/query_course_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_course_admin(data: any) {
    return this.post("/course/create_course_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recycle_course_list_admin(data: any) {
    return this.get("/course/recycle_course_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_course_config_admin(data: any) {
    return this.get("/course/query_course_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_course_config_admin(data: any) {
    return this.post("/course/update_course_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  
  public create_course_chapter_admin(data: any) {
    return this.post("/course/create_course_chapter_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_course_chapter_admin(data: any) {
    return this.post("/course/delete_course_chapter_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_course_chapter_admin(data: any) {
    return this.post("/course/update_course_chapter_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_course_chapter_admin(data: any) {
    return this.get("/course/query_course_chapter_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public course_chapter_list_admin(data: any) {
    return this.get("/course/course_chapter_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public course_record_list_admin(data: any) {
    return this.get("/course/course_record_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_course_record_admin(data: any) {
    return this.post("/course/create_course_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_course_record_admin(data: any) {
    return this.post("/course/delete_course_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_course_statistics_admin(data: any) {
    return this.get("/course/query_course_statistics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public exportCourseUser() {
    return this.$api.train + "/course/export_course_user_admin";
  }


  // 培训
  
  public detailed_train_record_admin(data: any) {
    return this.get("/train/detailed_train_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public course_list_resources(data: any) {
    return this.get("/course/course_list_resources", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public train_list_admin(data: any) {
    return this.get("/train/train_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public is_recommend_train(data: any) {
    return this.post("/train/is_recommend_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_train_admin(data: any) {
    return this.post("/train/audit_train_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_train(data: any) {
    return this.post("/train/online_offline_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public del_train_admin(data: any) {
    return this.post("/train/del_train_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_train_admin(data: any) {
    return this.post("/train/delete_train_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recovery_train_admin(data: any) {
    return this.post("/train/recovery_train_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_train_admin(data: any) {
    return this.post("/train/update_train_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_train_admin(data: any) {
    return this.get("/train/query_train_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_train_admin(data: any) {
    return this.post("/train/create_train_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recycle_train_list_admin(data: any) {
    return this.get("/train/recycle_train_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_train_config_admin(data: any) {
    return this.get("/train/query_train_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_train_config_admin(data: any) {
    return this.post("/train/update_train_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  
  public create_train_resource_admin(data: any) {
    return this.post("/train/create_train_resource_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_train_resource_admin(data: any) {
    return this.post("/train/delete_train_resource_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_train_resource_admin(data: any) {
    return this.post("/train/update_train_resource_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_train_resource_admin(data: any) {
    return this.get("/train/query_train_resource_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public train_resource_list_admin(data: any) {
    return this.get("/train/train_resource_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public train_record_list_admin(data: any) {
    return this.get("/train/train_record_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_train_record_admin(data: any) {
    return this.post("/train/create_train_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_train_record_admin(data: any) {
    return this.post("/train/delete_train_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_train_statistics_admin(data: any) {
    return this.get("/train/query_train_statistics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public train_resource_sort_admin(data: any) {
    return this.post("/train/train_resource_sort_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_train_record_admin(data: any) {
    return this.post("/train/audit_train_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public importCreateRecordAdmin() {
    return this.$api.train + "/train/import_create_record_admin";
  }
  // 导出报表
  public exportTrainUserAdmin() {
    return this.$api.train + "/train/export_train_user_admin";
  }

  // 修改层级
  public updateTrainHierarchy(data: any) {
    return this.post("/train/updateTrainHierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Train("train");
