import ZxHttp from "../base";
interface List {
  pageSize: number;
  pageNum: number;
  query?: string;
  startTime?: string;
  endTime?: string;
  resourceType?: string;
}
interface Del {
  commentId: string;
}
interface Reply extends List {
  commentId: string;
}
class Comment extends ZxHttp {
  public comment_list(data: { data: List }) {
    return this.get("/comment/comment_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  //删除主评论
  public delete_comment(data: { data: Del }) {
    return this.post("/comment/delete_comment", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_reply(data: { data: Del }) {
    return this.post("/comment/delete_reply", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public reply_list(data: { data: Reply }) {
    return this.get("/comment/reply_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Comment("publics");
