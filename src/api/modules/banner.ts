/*
 module:
    ZxHttp
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-22:  ZxHttp
 */
import ZxHttp from "../base";
interface List {
  type?: number | string;
  pageSize: number;
  pageNum: number;
  startTime?: string;
  endTime?: string;
  sortBy?: boolean;
  sortField?: string;
  query?: string;
}
interface CBanner {
  title: string;
  img: string;
  linkUrl: string;
  type: number;
}
interface UBanner extends CBanner {
  bannerId: string;
}
class Banner extends ZxHttp {
  public bannerList(data: { data: List }) {
    return this.get("/banner/banner_list", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public createBanner(data: { data: CBanner }) {
    return this.post("/banner/create_banner", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateBanner(data: { data: UBanner }) {
    return this.post("/banner/update_banner", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public deleteBanner(data: { data: { bannerId: string } }) {
    return this.post("/banner/delete_banner", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public online_offline_banner_admin(data: any) {
    return this.post("/banner/online_offline_banner_admin", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Banner("publics");
