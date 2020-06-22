/*
 module:
    Dept
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-15:  Dept
 */
import ZxHttp from "../base";
import auth from "@/routers/user/auth";
class Dept extends ZxHttp {
  public deptList() {
    return this.get("/dept/dept_list")
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public createDept(data: {
    data: {
      deptName: string;
      parentId: string;
      type: string;
      legalPerson?: string;
      phone?: string;
      city?: string;
      province?: string;
      orgCode?: string;
      street?: string;
      district?: string;
    };
  }) {
    return this.post("/dept/create_dept", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public updateDept(data: {
    data: {
      deptName: string;
      deptId: string;
    };
  }) {
    return this.post("/dept/update_dept", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public deleteDept(data: {
    data: {
      deptId: string;
    };
  }) {
    return this.post("/dept/delete_dept", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public moveDept(data: {
    data: {
      deptId: string;
      parentId: string;
    };
  }) {
    return this.post("/dept/move_dept", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryUserPermissionDept(data: { data: String }) {
    return this.get("/dept/query_userPermission_dept", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Dept("user");
