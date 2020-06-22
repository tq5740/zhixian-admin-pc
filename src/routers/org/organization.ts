// const address = () => import("@/views/org/organization/address/index.vue");
const org = () => import("@/views/org/organization/orgList/index.vue");
const reg = () => import("@/views/content/business/businessReg/index.vue"); // 企业申请
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/org",
    component: index,
    children: [
      {
        path: "org",
        component: org
      },
      {
        path: "reg",
        component: reg
      }
      // {
      //   path: "address",
      //   component: address
      // }
    ]
  }
];
