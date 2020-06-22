/*
 module:
    投诉
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-31:  问题
 */
import ZxHttp from "../base";
// interface List {
//   pageSize: number;
//   pageNum: number;
//   startTime?: string;
//   endTime?: string;
//   sortBy?: boolean;
//   sortField?: string;
//   query?: string;
//   state?: number;
// }
class Complaint extends ZxHttp {
  // 常见问题
  public create_problem_admin(data: any) {
    return this.post("/problem/create_problem_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_problem_admin(data: any) {
    return this.post("/problem/delete_problem_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public problem_list_admin(data: any) {
    return this.get("/problem/problem_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_problem_admin(data: any) {
    return this.get("/problem/query_problem_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_problem_admin(data: any) {
    return this.post("/problem/update_problem_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_problem_admin(data: any) {
    return this.post("/problem/online_offline_problem_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public opinion_list(data: { data: any }) {
    return this.get("/opinion/opinion_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_opinion(data: { data: any }) {
    return this.get("/opinion/query_opinion", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_opinion(data: { data: any }) {
    return this.post("/opinion/create_opinion", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_opinion(data: { data: any }) {
    return this.post("/opinion/delete_opinion", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Complaint("publics");
