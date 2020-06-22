/*
 module:
    post类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-13:  post类
 */
import ZxHttp from "../base";
class Post extends ZxHttp {
  public queryPort(data: {
    data: {
      portId: string;
    };
  }) {
    return this.get("/post/query_post", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryPostTree() {
    return this.get("/post/query_post_tree")
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_post_by_hierarchy(data: any) {
    return this.get("/post/query_post_by_hierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createPost(data: {
    data: {
      postName: string;
      parentId: string;
    };
  }) {
    return this.post("/post/create_post", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updatePost(data: {
    data: {
      postName: string;
      postId: string;
      parentId: string;
    };
  }) {
    return this.post("/post/update_post", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public deletePost(data: {
    data: {
      postId: string;
    };
  }) {
    return this.post("/post/delete_post", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Post("user");
