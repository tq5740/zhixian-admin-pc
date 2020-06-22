/*
 module:
    权限接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-6:  用户类
 */
import ZxHttp from "../base";
interface List {
  pageSize: number;
  pageNum: number;
  query?: string;
  startTime?: string;
  endTime?: string;
  state?: string;
}
interface AuditUserauthState {
  userId: string;
  reason?: string;
  state: number;
}
interface UpdateUserauth {
  userId: string;
  name: string;
  idNumber: string;
}
interface UserauthInfo {
  phone: string;
  name: string;
  sex: string;
  nation: string;
  birthday: string;
  address: string;
  idNumber: string;
  issued: string;
  startDate: string;
  endDate: string;
  idPhoto: string;
}
class userAuth extends ZxHttp {
  userauthList(data: { data: List }) {
    return this.get("/userAuth/userauth_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  auditUserAuthState(data: { data: AuditUserauthState }) {
    return this.post("/userAuth/audit_userauth_state", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  updateUserauth(data: { data: UpdateUserauth }) {
    return this.post("/userAuth/update_userauth", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  sendUserAuthInfo(data: { data: UserauthInfo }) {
    return this.post("/userAuth/card_certification", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  query_org_reg(data: any) {
    return this.get("/org/query_org_reg", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  update_org_reg(data: any) {
    return this.post("/org/update_org_reg", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new userAuth("user");
