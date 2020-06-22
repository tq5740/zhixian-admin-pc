/*
 module:
   action
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-11:init 
 */
import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import types from "./types";
Vue.use(Vuex);
let state: types = {
  checkFlag: false,
  configData: {
    orgSiteId: "11111111111",
    orgId: "11111111111",
    siteName: "成都微就业",
    siteLogo: "/user/org/logo/logo.png",
    siteSlogan: "人人有事做，事事有人做",
    siteKeyword: "求职,招聘,培训,测评,就业,档案",
    siteDescription: "提供就近就业的微就业平台",
    serviceQq: "3126754",
    serviceTel: "02887709957",
    twoDomain: "www",
    selfDomain: "work.cn",
    imgDomain: "https://i.weijiuye.com.cn",
    fileDomain: "https://f.weijiuye.com.cn",
    vodDomain: "https://v.cdwork.cn",
    hierarchy: "A1-",
    updateUser: "11111111111",
    updateTime: "2018-01-01 00:00:00",
    isOpenGuide: true
  },
  activeMenu: {},
  activePath: "",
  permissionList: [],
  secondMenu: {},
  thirdMenu: {},
  userInfo: null,
  init1stMenu: "/index",
  init2edMenu: "/index",
  init3rdMenu: "/index/index",
  jobClassify: [],
  postTree: [],
  deptTree: [],
  myOrgList: [],
  educationArr: [
    {
      id: 0,
      text: "不限"
    },
    {
      id: 1,
      text: "初中及以下"
    },
    {
      id: 2,
      text: "高中"
    },
    {
      id: 3,
      text: "中技/中专"
    },
    {
      id: 4,
      text: "大专"
    },
    {
      id: 5,
      text: "本科"
    },
    {
      id: 6,
      text: "硕士"
    },
    {
      id: 7,
      text: "博士"
    }
  ],
  workNatureArr: [
    {
      id: 0,
      text: "不限"
    },
    {
      id: 1,
      text: "全职"
    },
    {
      id: 2,
      text: "兼职"
    },
    {
      id: 3,
      text: "实习"
    }
  ],
  experienceArr: [
    {
      id: 0,
      text: "不限"
    },
    {
      id: 1,
      text: "1年"
    },
    {
      id: 2,
      text: "2年"
    },
    {
      id: 3,
      text: "3-4年"
    },
    {
      id: 4,
      text: "5年及以上"
    }
  ],
  salaryArr: [
    {
      id: `2000`,
      text: "2000以下"
    },
    {
      id: `2000-4000`,
      text: "2000-4000"
    },
    {
      id: `4000-6000`,
      text: "4000-6000"
    },
    {
      id: `6000-8000`,
      text: "6000-8000"
    },
    {
      id: `8000-10000`,
      text: "8000-10000"
    },
    {
      id: `10000`,
      text: "10000以上"
    }
  ],
  natureList: [
    {
      id: 1,
      text: "私营企业"
    },
    {
      id: 2,
      text: "外资企业"
    },
    {
      id: 3,
      text: "国有企业"
    },
    {
      id: 4,
      text: "民办非企业"
    },
    {
      id: 5,
      text: "政府机关"
    },
    {
      id: 6,
      text: "事业单位"
    },
    {
      id: 7,
      text: "其它"
    }
  ],
  // 组织类型
  orgTypeArr: [
    {
      id: 1,
      text: "市场主体"
    },
    {
      id: 2,
      text: "机关群团"
    },
    {
      id: 3,
      text: "事业单位"
    },
    {
      id: 4,
      text: "社会组织"
    },
    {
      id: 5,
      text: "中/高职院校"
    },
    {
      id: 9,
      text: "部门"
    }
  ],
  // 行业
  industryList: [
    {
      id: 1,
      text: "计算机/互联网/通信/电子"
    },
    {
      id: 2,
      text: "会计/金融/银行/保险"
    },
    {
      id: 3,
      text: "专业服务/教育/培训"
    },
    {
      id: 4,
      text: "贸易/消费/制造/营运"
    },
    {
      id: 5,
      text: "房地产/建筑"
    },
    {
      id: 6,
      text: "能源/原材料"
    },
    {
      id: 7,
      text: "广告/媒体"
    },
    {
      id: 8,
      text: "制药/医疗"
    },
    {
      id: 9,
      text: "物流/运输"
    },
    {
      id: 10,
      text: "服务业"
    },
    {
      id: 11,
      text: "政府"
    },
    {
      id: 12,
      text: "非盈利机构"
    },
    {
      id: 13,
      text: "其他行业"
    }
  ],
  // 规模
  scaleList: [
    {
      id: 1,
      text: "50人以内"
    },
    {
      id: 2,
      text: "50-100人"
    },
    {
      id: 3,
      text: "101-200人"
    },
    {
      id: 4,
      text: "201-500人"
    },
    {
      id: 5,
      text: "501-1000人"
    },
    {
      id: 6,
      text: "1001-2000人"
    },
    {
      id: 7,
      text: "2000人以上"
    }
  ],
  resumeStates: [
    {
      id: 1,
      text: "已预约"
    },
    {
      id: 2,
      text: "不合适"
    },
    {
      id: 3,
      text: "待面试"
    },
    {
      id: 4,
      text: "拒绝面试"
    },
    {
      id: 5,
      text: "未通过"
    },
    {
      id: 6,
      text: "待入职"
    },
    {
      id: 7,
      text: "未入职"
    },
    {
      id: 8,
      text: "已入职"
    }
  ],
  testType: [
    {
      id: 1,
      text: "单选题"
    },
    {
      id: 2,
      text: "多选题"
    },
    {
      id: 3,
      text: "判断题"
    },
    {
      id: 4,
      text: "情景题"
    },
    {
      id: 5,
      text: "填空题"
    },
    {
      id: 6,
      text: "问答题"
    }
  ],
  diffcultyArr: [
    {
      id: 1,
      text: "困难"
    },
    {
      id: 2,
      text: "中等"
    },
    {
      id: 3,
      text: "简单"
    }
  ],
  scoreArr: [
    {
      id: 1,
      text: "企业"
    },
    {
      id: 2,
      text: "文章"
    },
    {
      id: 3,
      text: "课程"
    },
    {
      id: 4,
      text: "培训"
    },
    {
      id: 5,
      text: "考试"
    },
    {
      id: 6,
      text: "直播"
    },
    {
      id: 8,
      text: "测评"
    },
    {
      id: 9,
      text: "广告"
    },
    {
      id: 10,
      text: "活动"
    },
    {
      id: 11,
      text: "链接"
    },
    {
      id: 12,
      text: "教师"
    },
  ],
  // 现场招聘创建企业的参数
  companyreg: null,
  //培训
  courseData: { 
    classify: null, 
    category: null, 
    id: null 
  },
  trainData: { 
    classify: null, 
    category: null, 
    id: null 
  },
  know: {},
  examData: { 
    classify: null, 
    category: null, 
    id: null, 
    examTemplateId: "",
    rightNumber: null,
    errNumber: null
  },
  advertData: {},
  liveData: { 
    classify: null, 
    category: null, 
    id: null 
  },
  userData: {},
  evalData: { 
    classify: null, 
    category: null, 
    id: null 
  }
};
export default new Vuex.Store({
  state,
  mutations,
  actions
});
