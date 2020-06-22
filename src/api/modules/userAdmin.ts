/*
 module:
    权限接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-6:  用户类
 */
import ZxHttp from "../base";
interface CreateUpdate {
  userId: string;
  roleId: string;
  permissionDeptId: string;
}
interface List {
  pageSize: number;
  pageNum: number;
  query?: string;
  startTime?: string;
  endTime?: string;
  state?: string;
}
class UserAdmin extends ZxHttp {
  public userAdminstratorList(data: {
    data: {
      roleName: string;
      pageSize: number;
      pageNum: number;
      startTime: string;
      endTime: string;
      permissionDeptId: string;
      query: string;
    };
  }) {
    return this.get("/userAdmin/userAdminstrator_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public deleteUserAdminstrator(data: {
    data: {
      userId: string;
    };
  }) {
    return this.post("/userAdmin/delete_userAdminstrator", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createUserAdminstrator(data: { data: CreateUpdate }) {
    return this.post("/userAdmin/create_userAdminstrator", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateUserAdminstrator(data: { data: CreateUpdate }) {
    return this.post("/userAdmin/update_userAdminstrator", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new UserAdmin("permission");
