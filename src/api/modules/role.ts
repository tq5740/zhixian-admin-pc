/*
 module:
    role类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-6:  role类
 */
import ZxHttp from "../base";
interface RolePage {
  data: {
    roleName?: string;
    pageSize: number;
    pageNum: number;
  };
}
export interface RoleInfoTypes {
  data: {
    roleName: string;
    type: string | number;
    checkScope: string | number;
    listMenu: string;
    roleId?: string;
  };
}
class Role extends ZxHttp {
  public roleList(data: RolePage) {
    return this.get("/role/role_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public roleListAdmin(data: RolePage) {
    return this.get("/role/role_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public createRole(data: RoleInfoTypes) {
    return this.post("/role/create_role", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryRole(data: {
    data: {
      roleId: string;
    };
  }) {
    return this.get("/role/query_role", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateRole(data: RoleInfoTypes) {
    return this.post("/role/update_role", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public deleteRole(data: {
    data: {
      roleId: string;
    };
  }) {
    return this.post("/role/delete_role", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 修改层级
  public updatePermissionHierarchy(data: any) {
    return this.post("/userAdmin/updatePermissionHierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Role("permission");
