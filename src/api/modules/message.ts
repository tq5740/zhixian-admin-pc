/*
 module:
    消息接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-12-12:  消息接口类
 */
import ZxHttp from "../base";
class Message extends ZxHttp {
  public SystemMessageList(data: any) {
    return this.get("/sms/system_message_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public CreateSystemMessage(data: any) {
    return this.post("/sms/create_system_message", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public UpdateSystemMessage(data: any) {
    return this.post("/sms/update_system_message", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public HistoryMessageList(data: any) {
    return this.get("/sms/history_message_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 发送验证码
  public send_authCode(data: any) {
    return this.post("/sms/send_authCode", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 群发消息
  public batch_sendMessage(data: any) {
    return this.post("/sms/batch_sendMessage", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 消息模板列表
  public system_message_list_admin(data: any) {
    return this.get("/sms/system_message_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 消息模板列表
  public system_message_list(data: any) {
    return this.get("/sms/system_message_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}

export default new Message("publics");
