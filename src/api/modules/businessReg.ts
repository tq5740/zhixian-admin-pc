/*
 module:
    Address
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-15:  Address
 */
import ZxHttp from "../base";
class BusinessReg extends ZxHttp {
  public orgRegListAdmin(data: any) {
    return this.get("/org/org_reg_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 删除
  public deleteOrgRegAdmin(data: any) {
    return this.post("/org/delete_org_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 审核
  public auditOrgRegAdmin(data: any) {
    return this.post("/org/audit_org_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new BusinessReg("user");
