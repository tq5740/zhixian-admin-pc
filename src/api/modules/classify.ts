/*
 module:
    classify
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-14:  classify
 */
import ZxHttp from "../base";
class Classify extends ZxHttp {
  public getJobclassifyTree() {
    return this.get("/work_category/work_category_tree")
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createJobclassify(data: {
    data: {
      workCategoryTitle: string;
      parentId: string;
    };
  }) {
    return this.post("/classify/create_jobclassify", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateJobclassify(data: {
    data: {
      workCategoryTitle: string;
      workCategoryId: string;
      parentId: string;
    };
  }) {
    return this.post("/classify/update_jobclassify", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public deleteJobclassify(data: {
    data: {
      type: string;
      workCategoryId: string;
    };
  }) {
    return this.post("/classify/delete_jobclassify", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Classify("work");
