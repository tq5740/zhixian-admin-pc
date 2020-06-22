/*
 module:
    org类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-13:  org类
 */
import ZxHttp from "../base";
interface OrgSite {
  orgId: string;
  siteName: string;
  siteLogo?: string;
  siteSlogan?: string;
  siteKeyword?: string;
  siteDescription?: string;
  serviceQq?: string;
  serviceTel?: string;
  twoDomain: string;
  selfDomain: string;
}
interface UpdateOrg {
  orgId: string;
  orgName: string;
  orgLicense: string;
  shortName: string;
  orgLogo: string;
  orgImg: string;
  orgType: string;
  natrue: number;
  industry: number;
  legalPerson: string;
  scale: number;
  phone: string;
  website?: string;
  intro: string;
  orgCode: string;
}
interface List {
  pageSize: number;
  pageNum: number;
  query?: string;
  state?: string;
  startTime?: string;
  endTime?: string;
  isRecommend?: boolean | string;
  orgType?: number | string;
  sortBy?: boolean;
  sortField?: string;
}
class Org extends ZxHttp {
  public updateOrgsite(data: { data: OrgSite }) {
    return this.post("/org/update_orgsite", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public orgList(data: { data: List }) {
    return this.get("/org/org_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public orgListGuest(data: { data: List }) {
    return this.get("/org/org_list_guest", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public auditOrg(data: {
    data: { orgId: string; state: number; reason: string };
  }) {
    return this.post("/org/audit_org", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryOrgsite(data: { data: { orgId: string } }) {
    return this.get("/org/query_orgsite", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryOrg(data: { data: { orgId: string } }) {
    return this.get("/org/query_org", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateOrg(data: { data: UpdateOrg }) {
    return this.post("/org/update_org", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recommendOrg(data: { data: { orgId: string; isRecommend: boolean } }) {
    return this.post("/org/recommend_org", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public isforbiddenOrg(data: { data: { state: number; orgId: string } }) {
    return this.post("/org/isforbidden_org", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryMyorgList() {
    return this.get("org/query_myorg_list")
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_orgsite(data: any) {
    return this.get("org/query_orgsite", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public query_venue_org_list(data: any) {
    return this.get("/org/query_venue_org_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 查询企业注册报名
  public query_org_reg_admin(data: any) {
    return this.get("/org/query_org_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 移动部门
  public dept_log_list_admin(data: any) {
    return this.get("/deptlog/dept_log_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_dept_log_admin(data: any) {
    return this.post("/deptlog/update_dept_log_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 培训学校
  public org_children_list_admin(data: any) {
    return this.get("/orgchildren/org_children_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_org_children_admin(data: any) {
    return this.post("/orgchildren/create_org_children_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_org_children_admin(data: any) {
    return this.post("/orgchildren/delete_org_children_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_org_children_admin(data: any) {
    return this.post("/orgchildren/update_org_children_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public is_recommend_admin(data: any) {
    return this.post("/orgchildren/is_recommend_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Org("user");
