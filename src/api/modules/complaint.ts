/*
 module:
    投诉
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-31:  投诉
 */
import ZxHttp from "../base";
interface List {
  pageSize: number;
  pageNum: number;
  startTime?: string;
  endTime?: string;
  sortBy?: boolean;
  sortField?: string;
  query?: string;
  state?: number;
}
class Complaint extends ZxHttp {
  public complaintList(data: { data: List }) {
    return this.get("/complaint/complaint_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_complaint(data: { data: { complaintId: string } }) {
    return this.post("/complaint/delete_complaint", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public auditComplaint(data: { data: any }) {
    return this.post("/complaint/audit_complaint", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Complaint("publics");
