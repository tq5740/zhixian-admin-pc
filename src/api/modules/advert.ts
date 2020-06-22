import ZxHttp from "../base";
class Advert extends ZxHttp {
  // 修改层级
  public updateAdvertHierarchy(data: any) {
    return this.post("/advert/updateAdvertHierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public advert_list_admin(data: any) {
    return this.get("/advert_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_advert_admin(data: any) {
    return this.post("/create_advert_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_advert_admin(data: any) {
    return this.post("/update_advert_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_admin(data: any) {
    return this.post("/online_offline_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_advert_admin(data: any) {
    return this.post("/audit_advert_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_advert_admin(data: any) {
    return this.get("/query_advert_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public advert_statistics_list_admin(data: any) {
    return this.get("/advert_statistics_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public advert_browse_list_admin(data: any) {
    return this.get("/advert_browse_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recycle_advert_list_admin(data: any) {
    return this.get("/recycle_advert_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public del_advert_admin(data: any) {
    return this.post("/del_advert_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_advert_admin(data: any) {
    return this.post("/delete_advert_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public rec_advert_admin(data: any) {
    return this.post("/rec_advert_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Advert("advert");
