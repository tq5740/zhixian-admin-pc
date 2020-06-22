import ZxHttp from "../base";
class TrainClass extends ZxHttp {
  // 培训班级
  public train_class_list_admin(data: any) {
    return this.get("/trainclass/train_class_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_train_class_list_admin(data: any) {
    return this.post("/trainclass/create_train_class_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_train_class_list_admin(data: any) {
    return this.post("/trainclass/update_train_class_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_train_class_list_admin(data: any) {
    return this.post("/trainclass/delete_train_class_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 培训人员
  public train_class_user_list_admin(data: any) {
    return this.get("/trainclass/train_class_user_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public train_class_user_print_list_admin(data: any) {
    return this.get("/trainclass/train_class_user_print_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_train_class_user_admin(data: any) {
    return this.post("/trainclass/create_train_class_user_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_train_class_user_admin(data: any) {
    return this.post("/trainclass/update_train_class_user_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_train_class_user_admin(data: any) {
    return this.post("/trainclass/delete_train_class_user_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 证书
  public apply_exam(data: any) {
    return this.post("/trainclass/apply_exam", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public apply_repair_exam(data: any) {
    return this.post("/trainclass/apply_repair_exam", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_print_state(data: any) {
    return this.post("/trainclass/update_print_state", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public apply_certificate_admin(data: any) {
    return this.post("/trainclass/apply_certificate_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 申请证书
  public train_class_apply_list_admin(data: any) {
    return this.get("/trainclass/train_class_apply_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public train_class_print_list_admin(data: any) {
    return this.get("/trainclass/train_class_print_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  
  public query_class_print(data: any) {
    return this.get("/classprint/query_class_print", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new TrainClass("publics");
