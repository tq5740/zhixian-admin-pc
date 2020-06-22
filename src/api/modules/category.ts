/*
 module:
    权限接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2019-04-29:  分类接口
 */
import ZxHttp from "../base";
class Category extends ZxHttp {
  // 文章
  public category_list_article(data: any) {
    return this.get("/article/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_article(data: any) {
    return this.post("/article/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_article(data: any) {
    return this.post("/article/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_article(data: any) {
    return this.post("/article/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 课程
  public category_list_course (data: any) {
    return this.get("/course/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_course(data: any) {
    return this.post("/course/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_course(data: any) {
    return this.post("/course/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_course(data: any) {
    return this.post("/course/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 培训
  public category_list_train (data: any) {
    return this.get("/train/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_train(data: any) {
    return this.post("/train/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_train(data: any) {
    return this.post("/train/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_train(data: any) {
    return this.post("/train/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 考试
  public category_list_exam (data: any) {
    return this.get("/exam/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_exam(data: any) {
    return this.post("/exam/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_exam(data: any) {
    return this.post("/exam/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_exam(data: any) {
    return this.post("/exam/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 广告
  public category_list_advert (data: any) {
    return this.get("/advert/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_advert(data: any) {
    return this.post("/advert/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_advert(data: any) {
    return this.post("/advert/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_advert(data: any) {
    return this.post("/advert/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 直播
  public category_list_live (data: any) {
    return this.get("/live/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_live(data: any) {
    return this.post("/live/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_live(data: any) {
    return this.post("/live/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_live(data: any) {
    return this.post("/live/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 测评
  public category_list_eval (data: any) {
    return this.get("/eval/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_eval(data: any) {
    return this.post("/eval/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_eval(data: any) {
    return this.post("/eval/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_eval(data: any) {
    return this.post("/eval/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 活动
  public category_list_poll (data: any) {
    return this.get("/poll/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_poll(data: any) {
    return this.post("/poll/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_poll(data: any) {
    return this.post("/poll/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_poll(data: any) {
    return this.post("/poll/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 链接
  public category_list_link (data: any) {
    return this.get("/link/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_link(data: any) {
    return this.post("/link/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_link(data: any) {
    return this.post("/link/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_link(data: any) {
    return this.post("/link/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 链接
  public category_list_teacher (data: any) {
    return this.get("/teacher/category_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_category_teacher(data: any) {
    return this.post("/teacher/create_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_category_teacher(data: any) {
    return this.post("/teacher/delete_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_category_teacher(data: any) {
    return this.post("/teacher/update_category", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 修改层级
  public update_dept_logupdatePublicsHierarchy_admin(data: any) {
    return this.post("/publics/updatePublicsHierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Category("publics");
