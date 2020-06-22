/*
 module:
   图片上传
  author:
    chao
  summary:
    2018-8-21: created
 */
import ZxHttp from "../base";

class UpImg extends ZxHttp {
  // 查询求职意向
  public upload(data: any) {
    return this.post(`/system/upload`, data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new UpImg("publics");
