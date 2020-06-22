/*
 module:
    jbob
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:  jbob
 */
import ZxHttp from "../base";

class Job extends ZxHttp {
  public workList(data: {
    data: {
      workId?: string;
      pageSize: number;
      pageNum: number;
      query?: string;
      startTime?: string;
      endTime?: string;
      state?: string | number;
      workNature?: string | number;
      type?: string | number;
      sortBy?: boolean;
      sortField?: string;
      isDel: number;
    };
  }) {
    return this.get("/work/work_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createJob(data: any) {
    return this.post("/work/create_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryJob(data: { data: { workId: string } }) {
    return this.get("/work/query_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateJob(data: any) {
    return this.post("/work/update_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 回收站列表
  public recycleWorkList(data: any) {
    return this.get("/work/recycle_work_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 逻辑删除
  public delJob(data: any) {
    return this.post("/work/del_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 物理删除
  public deleteJob(data: any) {
    return this.post("/work/delete_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 还原逻辑删除
  public recoverJob(data: any) {
    return this.post("/work/recover_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public recommendJob(data: {
    data: {
      workId: string;
      isRecommend: number;
    };
  }) {
    return this.post("/work/recommend_job", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public auditJob(data: {
    data: {
      workId: string;
      state: number;
      reason?: string;
    };
  }) {
    return this.post("/work/audit_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public releaseJob(data: any) {
    return this.post("/work/online_offline_work_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryBasicSituationJob() {
    return this.get("/work/query_basic_situation_work")
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 添加求职意向
  public create_intention_admin(data: any) {
    return this.post("/intention/create_intention_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 修改层级
  public updateWorkHierarchy(data: any) {
    return this.post("/work/updateWorkHierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 获取职位列表(用户端)
  public work_list(data: any) {
    return this.get("/work/work_list", data)
      .then((res) => Promise.resolve(res))
      .catch((e) => Promise.reject(e));
  }
}
export default new Job("work");
