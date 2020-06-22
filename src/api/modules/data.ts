/*
 module:
    chao
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-10-20
 */
import ZxHttp from "../base";
class Rest extends ZxHttp {
  public getTimeTrendRpt(data: {
    data: {
      startDate: string;
      endDate: string;
    };
  }) {
    return this.get("/baiduApi/getTimeTrendRpt", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 调查管理
  public survey_list_admin(data: any) {
    return this.get("/survey/survey/survey_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_survey_admin(data: any) {
    return this.post("/survey/survey/create_survey_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_survey_admin(data: any) {
    return this.post("/survey/survey/update_survey_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public del_survey_admin(data: any) {
    return this.post("/survey/survey/del_survey_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_survey_admin(data: any) {
    return this.get("/survey/survey/query_survey_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_survey_admin(data: any) {
    return this.post("/survey/survey/online_offline_survey_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public survey_statistics_admin(data: any) {
    return this.get("/survey/survey/survey_statistics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_survey_question_record_admin(data: any) {
    return this.get("/survey/question/query_survey_question_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 导出报表
  public exportSurveyData() {
    return this.$api.publics + "/survey/record/export_survey_data_admin";
  }

  // 调查回收站
  public recycle_survey_list_admin(data: any) {
    return this.get("/survey/survey/recycle_survey_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recover_survey_admin(data: any) {
    return this.post("/survey/survey/recover_survey_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_survey_admin(data: any) {
    return this.post("/survey/survey/delete_survey_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 调查试题
  public survey_question_list_admin(data: any) {
    return this.get("/survey/question/survey_question_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_survey_question_admin(data: any) {
    return this.post("/survey/question/create_survey_question_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_survey_question_admin(data: any) {
    return this.post("/survey/question/update_survey_question_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_survey_question_admin(data: any) {
    return this.post("/survey/question/delete_survey_question_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_survey_question_admin(data: any) {
    return this.get("/survey/question/query_survey_question_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 调查记录
  public survey_record_list_admin(data: any) {
    return this.get("/survey/record/survey_record_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_survey_record_admin(data: any) {
    return this.post("/survey/record/create_survey_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_survey_record_admin(data: any) {
    return this.post("/survey/record/delete_survey_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_survey_report_admin(data: any) {
    return this.get("/survey/record/query_survey_report_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 公告
  public notice_list_admin(data: any) {
    return this.get("/notice/notice_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_notice_admin(data: any) {
    return this.post("/notice/create_notice_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_notice_admin(data: any) {
    return this.post("/notice/delete_notice_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_notice_admin(data: any) {
    return this.post("/notice/update_notice_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_notice_admin(data: any) {
    return this.get("/notice/query_notice_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_notice_admin(data: any) {
    return this.post("/notice/online_offline_notice_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 链接
  public link_list_admin(data: any) {
    return this.get("/link/link_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_link_admin(data: any) {
    return this.post("/link/create_link_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_link_admin(data: any) {
    return this.post("/link/delete_link_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_link_admin(data: any) {
    return this.post("/link/update_link_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_link_admin(data: any) {
    return this.get("/link/query_link_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_link_admin(data: any) {
    return this.post("/link/online_offline_link_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Rest("publics");
