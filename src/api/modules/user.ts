/*
 module:
    权限接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-6:  用户类
 */
import ZxHttp from "../base";
interface GetUserByTokenTypes {
  data: {
    token: string;
  };
}
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
interface OrgUserList extends List {
  deptId: string;
  postId: string;
}
interface CreateOrguser {
  photo?: string;
  deptId: string;
  postId?: string;
  email?: string;
  employeeNumber?: string;
  hireDate?: string;
  name: string;
  phone: string;
}
interface UpdataeOrguser extends CreateOrguser {
  userId: string;
}
class User extends ZxHttp {
  public getUserByToken(data: GetUserByTokenTypes) {
    return this.get("/user/get_userByToken", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public userLogin(data: {
    data: {
      password: string;
      phone: string;
      answerCode?: string;
      device: number;
    };
  }) {
    return this.post("/user/user_login", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recentlyRegList(data: { data: List }) {
    return this.get("/user/recently_reg_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateUserState(data: {
    data: {
      userId: string;
      state: string;
    };
  }) {
    return this.post("/user/update_user_state", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public userLoginList(data: {
    data: {
      userId: string;
      pageSize: number;
      pageNum: number;
    };
  }) {
    return this.get("/user/user_login_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public getImageCode(data: { data: { phone: string } }) {
    return this.get("/user/imageCode", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryUserVague(data: {
    data: {
      query: string;
    };
  }) {
    return this.get("/user/query_user_vague", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recentlyLoginList(data: { data: List }) {
    return this.get("/user/recently_login_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public orgUserList(data: { data: OrgUserList }) {
    return this.get("/user/orguser_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateBatchPost(data: {
    data: {
      userIds: string;
      postId: string;
    };
  }) {
    return this.post("/user/update_batch_post", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateBatchDept(data: {
    data: {
      userIds: string;
      deptId: string;
    };
  }) {
    return this.post("/user/update_batch_dept", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public deleteOrgUser(data: {
    data: {
      userId: string;
    };
  }) {
    return this.post("/user/delete_orguser", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public auditOrguserState(data: {
    data: {
      userId: string;
      reason?: string;
      state: number;
    };
  }) {
    return this.post("/user/audit_orguser_state", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createOrguser(data: { data: CreateOrguser }) {
    return this.post("/user/create_orguser", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateOrguser(data: { data: UpdataeOrguser }) {
    return this.post("/user/update_orguser", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryBasicSituationUser() {
    return this.get("/user/query_basic_situation_user")
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public latelyLoginUserStatistic(data: {
    data: { type: string, endTime: string, startTime: string };
  }) {
    return this.get("/user/lately_login_user_statistic", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createQRCode(data: any) {
    return this.get("/user/create_QRCode", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 重置密码
  public resetPassword(data: { data: { token: string, userId: string } }) {
    return this.post("/user/reset_password", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 重置密码 发短信
  public userResetPassword(data: { data: { token: string, userId: string } }) {
    return this.post("/user/user_reset_password", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 修改密码
  public updatePassword(data: { data: { oldPassword: string, newPassword: string } }) {
    return this.post("/user/update_userPassword", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 找回密码
  public forget_password(data: any) {
    return this.post("/user/forget_password", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public sendEmail(data: {
    data: { sendUserEmail: string; sendMessage: string; theme: string };
  }) {
    return this.get("/user/send_email", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 求职用户列表
  public work_user_reg_list(data: any) {
    return this.get("/user/work_user_reg_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_work_reg_user(data: any) {
    return this.get("/user/query_work_reg_user", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_work_reg_user(data: any) {
    return this.post("/user/update_work_reg_user", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_work_reg_user(data: any) {
    return this.post("/user/create_work_reg_user", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public user_edu_list_admin(data: any) {
    return this.get("/edu/user_edu_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_user_edu_admin(data: any) {
    return this.post("/edu/create_user_edu_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_user_edu_admin(data: any) {
    return this.post("/edu/update_user_edu_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_user_edu_admin(data: any) {
    return this.post("/edu/delete_user_edu_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_user_work_admin(data: any) {
    return this.post("/edu/create_user_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_user_work_admin(data: any) {
    return this.post("/edu/update_user_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public user_work_list_admin(data: any) {
    return this.get("/edu/user_work_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_user_work_admin(data: any) {
    return this.post("/edu/delete_user_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 导入临时用户-临时用户列表
  public user_temporary_list_admin(data: any) {
    return this.get("/usertemporary/user_temporary_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_user_temporary_admin(data: any) {
    return this.post("/usertemporary/update_user_temporary_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_user_temporary_admin(data: any) {
    return this.post("/usertemporary/delete_user_temporary_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public importUserTemporaryAdmin() {
    return this.$api.user + "/usertemporary/import_user_temporary_admin";
  }
  // 导入正式用户
  public import_user(data: any) {
    return this.post("/user/import_user", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 培训班级读卡认证
  public read_idcard_auth(data: any) {
    return this.post("/userAuth/read_idcard_auth", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 认证手机号：生成随机手机号码
  public generate_phone(data: any) {
    return this.get("/user/generate_phone", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 企业注册
  public create_org_reg(data: any) {
    return this.post("/org/create_org_reg", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 导出基本概况
  public exportBasicProfile() {
    return this.$api.user + "/user/export_basic_profile";
  }
}
export default new User("user");
