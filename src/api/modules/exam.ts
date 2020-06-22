/*
 module:
    考试
  author:
    tanqing
  summary:
    2019-5-7:  考试
 */
import ZxHttp from "../base";
class Exam extends ZxHttp {
  // 考试
  public exam_list_admin(data: any) {
    return this.get("/exam/exam_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public exam_statistics_admin(data: any) {
    return this.get("/exam/exam_statistics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_exam_admin(data: any) {
    return this.get("/exam/query_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_exam_admin(data: any) {
    return this.post("/exam/create_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_exam_admin(data: any) {
    return this.post("/exam/update_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recycle_exam_list_admin(data: any) {
    return this.get("/exam/recycle_exam_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_exam_admin(data: any) {
    return this.post("/exam/online_offline_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_exam_admin(data: any) {
    return this.post("/exam/audit_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public del_exam_admin(data: any) {
    return this.post("/exam/del_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_exam_admin(data: any) {
    return this.post("/exam/delete_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recover_exam_admin(data: any) {
    return this.post("/exam/recover_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_exam_record_admin(data: any) {
    return this.get("/exam/query_exam_record_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public is_recommend_exam_admin(data: any) {
    return this.post("/exam/is_recommend_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public repair_exam_admin(data: any) {
    return this.post("/exam/repair_exam_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 阅卷
  public teacher_submit_papers_admin(data: any) {
    return this.post("/answer/teacher_submit_papers_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_exam_paper_admin(data: any) {
    return this.get("/answer/query_exam_paper_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 题库
  public query_exam_bank_title_admin(data: any) {
    return this.get("/bank/query_exam_bank_title_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public exam_bank_list_admin(data: any) {
    return this.get("/bank/exam_bank_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_exam_bank_admin(data: any) {
    return this.get("/bank/query_exam_bank_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_exam_bank_admin(data: any) {
    return this.post("/bank/create_exam_bank_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_exam_bank_admin(data: any) {
    return this.post("/bank/update_exam_bank_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_exam_bank_admin(data: any) {
    return this.post("/bank/delete_exam_bank_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_papers_number_admin(data: any) {
    return this.get("/bank/query_papers_number_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 组卷策略
  public query_exam_tactics_admin(data: any) {
    return this.get("/tactics/query_exam_tactics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_exam_tactics_admin(data: any) {
    return this.post("/tactics/create_exam_tactics_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 组卷
  public exam_paper_list_admin(data: any) {
    return this.get("/papers/exam_paper_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  
  // 临时试题
  public question_temporary_list_admin(data: any) {
    return this.get("/temporary/question_temporary_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_question_temporary_admin(data: any) {
    return this.post("/temporary/create_question_temporary_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_question_temporary_admin(data: any) {
    return this.get("/temporary/query_question_temporary_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public add_question_temporary_admin(data: any) {
    return this.post("/temporary/add_question_temporary_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_question_temporary_admin(data: any) {
    return this.post("/temporary/update_question_temporary_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_question_temorary_admin(data: any) {
    return this.post("/temporary/delete_question_temorary_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public clear_question_temporary_admin(data: any) {
    return this.post("/temporary/clear_question_temporary_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 正式试题
  public create_exam_question_admin(data: any) {
    return this.post("/question/create_exam_question_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_exam_question_admin(data: any) {
    return this.post("/question/update_exam_question_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_exam_question_admin(data: any) {
    return this.post("/question/delete_exam_question_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_exam_question_admin(data: any) {
    return this.get("/question/query_exam_question_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public exam_question_list_admin(data: any) {
    return this.get("/question/exam_question_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public add_question_by_exam_bank_admin(data: any) {
    return this.post("/question/add_question_by_exam_bank_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recycle_exam_question_list_admin(data: any) {
    return this.get("/question/recycle_exam_question_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recover_exam_question_admin(data: any) {
    return this.post("/question/recover_exam_question_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }


  // 知识点
  public exam_point_list_admin(data: any) {
    return this.get("/point/exam_point_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public point_list_admin(data: any) {
    return this.get("/point/point_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_exam_point_admin(data: any) {
    return this.get("/point/query_exam_point_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_exam_point_admin(data: any) {
    return this.post("/point/create_exam_point_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_exam_point_admin(data: any) {
    return this.post("/point/update_exam_point_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_exam_point_admin(data: any) {
    return this.post("/point/delete_exam_point_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_exam_point_parent_admin(data: any) {
    return this.get("/point/query_exam_point_parent_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  //用户报名
  public exam_reg_list_admin(data: any) {
    return this.get("/reg/exam_reg_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public create_exam_reg_admin(data: any) {
    return this.post("/reg/create_exam_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_exam_reg_admin(data: any) {
    return this.post("/reg/audit_exam_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_exam_reg_admin(data: any) {
    return this.post("/reg/delete_exam_reg_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  //地址
  public create_exam_address_admin(data: any) {
    return this.post("/address/create_exam_address_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public update_exam_address_admin(data: any) {
    return this.post("/address/update_exam_address_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public delete_exam_address_admin(data: any) {
    return this.post("/address/delete_exam_address_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public audit_exam_address_admin(data: any) {
    return this.post("/address/audit_exam_address_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_exam_address_admin(data: any) {
    return this.post("/address/online_offline_exam_address_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public exam_address_list_admin(data: any) {
    return this.get("/address/exam_address_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_exam_address_admin(data: any) {
    return this.get("/address/query_exam_address_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 配置
  public update_exam_config_admin(data: any) {
    return this.post("/config/update_exam_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public query_exam_config_admin(data: any) {
    return this.get("/config/query_exam_config_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 修改层级
  public updateExamHierarchy(data: any) {
    return this.post("/exam/updateExamHierarchy", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 导出报表
  public exportExamDataAdmin() {
    return this.$api.exam + "/exam_import_export/export_exam_data_admin";
  }
  public importQuestionAdmin() {
    return this.$api.exam + "/exam_import_export/import_question_admin";
  }
  
}
export default new Exam("exam");
