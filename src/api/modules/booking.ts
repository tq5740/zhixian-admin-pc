/*
 module:
    org类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-13:  org类
 */
import ZxHttp from "../base";
class Booking extends ZxHttp {
  public bookingRecord(data: {
    data: {
      type: string;
      query: string;
      pageSize: number;
      pageNum: number;
      state: number;
      startTime: string;
      endTime: string;
      sortBy?: boolean;
      sortField?: string;
    };
  }) {
    return this.get("/booking/booking_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateBooking(data: {
    data: {
      bookingId: string;
      state: number;
      workId: string;
      userId: string;
      //state===3必传
      addressId?: string;
      //state===3必传
      interviewTime?: string;
      content?: string;
      phone?: string;
    };
  }) {
    return this.post("/booking/update_booking_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public talentSearch(data: any) {
    return this.get("/intention/intention_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryIntentionAdmin(data: any) {
    return this.get("/intention/query_intention_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public matching_work_list_admin(data: any) {
    return this.get("/intention/matching_work_list_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public recommend_user_intention_admin(data: any) {
    return this.post("/intention/recommend_user_intention_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createBooking(data: any) {
    return this.post("/booking/create_booking_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Booking("work");
