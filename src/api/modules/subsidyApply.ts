/*
 module:
    Address
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-15:  Address
 */
import ZxHttp from "../base";
class SubsidyApply extends ZxHttp {
  public certificateListAdmin(data: any) {
    return this.get("/cert/certificate_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 删除
  public deleteCertificateAdmin(data: any) {
    return this.post("/cert/delete_certificate_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 审核
  public auditCertificateAdmin(data: any) {
    return this.post("/cert/audit_certificate_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new SubsidyApply("user");
