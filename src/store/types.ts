/*
 module:
   action
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-11:init  some demo
 */
interface Menu {
  [propsName: string]: Array<any>;
}
interface State {
  configData: any;
  activeMenu: {
    [propsName: string]: object;
  };
  checkFlag: boolean;
  permissionList: Array<any>;
  secondMenu: Menu;
  thirdMenu: Menu;
  activePath: string;
  userInfo: null | { [propsName: string]: any };
  jobClassify: { [propsName: string]: any }[];
  postTree: { [propsName: string]: any }[];
  deptTree: { [propsName: string]: any }[];
  educationArr: object[];
  workNatureArr: object[];
  experienceArr: object[];
  salaryArr: object[];
  natureList: object[];
  orgTypeArr: object[];
  industryList: object[];
  scaleList: object[];
  resumeStates: object[];
  companyreg: null | { [propsName: string]: any };
  readonly init1stMenu: string;
  readonly init2edMenu: string;
  readonly init3rdMenu: string;
  courseData: any;
  trainData: any;
  know: any;
  examData: any;
  advertData: any;
  liveData: any;
  testType: object[];
  diffcultyArr: object[];
  userData: any;
  evalData: any;
  myOrgList: object[];
  scoreArr: object[];
}
export { State as default };
