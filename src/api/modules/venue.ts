/*
 module:
    权限接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-6:  权限接口类
 */
import ZxHttp from "../base";
interface List {
  pageSize: number;
  pageNum: number;
  query?: string;
  startDate?: string;
  endDate?: string;
  state?: string | number;
  type?: string | number;
  sortBy?: boolean;
  sortField?: string;
}
interface VenueData {
  venueTitle: string;
  type: number;
  startTime: string;
  endTime: string;
  period: string;
  contactName: string;
  contactPhone: string;
  street: string;
  notice: string;
  intro: string;
  province: string;
  city: string;
  district: string;
}
interface editVenueData extends VenueData {
  venueId: string;
}
interface VenueOrgList {
  venueId: string;
}
class Venue extends ZxHttp {
  public venueList(data: { data: List }) {
    return this.get("/venue/venue_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public myVenueAdmin(data: { data: List }) {
    return this.get("/venue/my_venue_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createVenue(data: { data: VenueData }) {
    return this.post("/venue/create_venue_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryVenue(data: { data: { venueId: string } }) {
    return this.get("/venue/query_venue_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateVenue(data: { data: editVenueData }) {
    return this.post("/venue/update_venue_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 逻辑删除招聘会
  public deleteVenue(data: { data: { venueId: string } }) {
    return this.post("/venue/del_venue_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateState(data: {
    data: { venueId: string; state: number; reason?: string };
  }) {
    return this.post("/venue/online_offline_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public auditVenue(data: {
    data: { venueId: string; state: number; reason?: string };
  }) {
    return this.post("/venue/audit_venue_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createVenueOrg(data: { data: { orgIds: string; venueId: string } }) {
    return this.post("/venue/create_venue_org", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateVenueOrg(data: any) {
    return this.post("/venue/update_venue_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public deleteVenueOrg(data: { data: { venueOrgId: string } }) {
    return this.post("/venue/delete_venue_org", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public importVenueOrg(data: any) {
    return this.post("/venue/import_venue_org", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public venue_work_list_admin(data: any) {
    return this.get("/venue/venue_work_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public venue_work_list(data: any) {
    return this.get("/venue/venue_work_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_venue_job(data: any) {
    return this.post("/venue/create_venue_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public is_recommend_admin(data: any) {
    return this.post("/venue/is_recommend_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public venueRegList(data: { data: VenueOrgList }) {
    return this.get("/venue/venue_org_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public auditVenueReg(data: {
    data: {
      state: number;
      reason?: string;
      venueRegId: string;
    };
  }) {
    return this.post("/venue/audit_venue_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_venue_job(data: {
    data: {
      venueJobId: string;
    };
  }) {
    return this.post("/venue/delete_venue_job", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_venue_org(data: any) {
    return this.get("/venue/query_venue_org_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public export_venue_org() {
    return this.$api.work + "/venue/export_venue_org_admin"
  }
}
export default new Venue("work");
