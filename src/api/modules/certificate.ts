/*
 module:
    certificate
 */
import ZxHttp from "../base";
class BusinessApply extends ZxHttp {
  public certificateRegListAdmin(data: any) {
    return this.get("/cert/certificateReg_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 删除
  public deleteCertificateRegAdmin(data: any) {
    return this.post("/cert/delete_certificateReg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 审核
  public auditCertificateRegAdmin(data: any) {
    return this.post("/cert/audit_certificateReg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public certificate_list_admin(data: any) {
    return this.get("/cert/certificate_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_certificate_admin(data: any) {
    return this.get("/cert/query_certificate_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_certificate(data: any) {
    return this.post("/cert/create_certificate", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_certificate(data: any) {
    return this.post("/cert/update_certificate", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_certificate_admin(data: any) {
    return this.post("/cert/delete_certificate_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_certificate_admin(data: any) {
    return this.post("/cert/audit_certificate_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new BusinessApply("publics");
