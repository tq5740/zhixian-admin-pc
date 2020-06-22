/*
 module:
    Address
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-15:  Address
 */
import ZxHttp from "../base";
class Baidu extends ZxHttp {
  public queryTrendAnalysisUp(data: {
    data: {
      startDate: string;
      endDate: string;
      visitor?: string;
    };
  }) {
    return this.get("/baiduApi/queryTrendAnalysisUp", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryNewOldPeople(data: {
    data: {
      startDate: string;
      endDate: string;
      visitor?: string;
    };
  }) {
    return this.get("/baiduApi/queryNewOldPeople", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
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
  public queryVisitedDomainName(data: {
    data: {
      startDate: string;
      endDate: string;
      source?: string;
    };
  }) {
    return this.get("/baiduApi/queryVisitedDomainName", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  // 系统环境图
  public querySystemEnvironmentUp(data: {
    data: {
      startDate: string;
      endDate: string;
    };
  }) {
    return this.get("/baiduApi/querySystemEnvironmentUp", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryGeographicalDistributionUp(data: {
    data: {
      startDate: string;
      endDate: string;
      viewType?: string;
    };
  }) {
    return this.get("/baiduApi/queryGeographicalDistributionUp", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public queryCityRegionalDistribution(data: {
    data: {
      startDate: string;
      endDate: string;
      viewType?: string;
    };
  }) {
    return this.get("/baiduApi/queryCityRegionalDistribution", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  // 地域分析下
  public queryGeographicalDistributionDown(data: {
    data: {
      startDate: string;
      endDate: string;
      viewType?: string;
    };
  }) {
    return this.get("/baiduApi/queryGeographicalDistributionDown", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new Baidu("publics");
