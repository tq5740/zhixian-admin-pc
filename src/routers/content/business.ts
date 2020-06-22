const appraisal = () => import("@/views/content/business/businessApply/index.vue"); // 鉴定报名
const agency = () => import("@/views/content/business/subsidyApply/index.vue"); // 补贴代办
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/content",
    component: index,
    children: [
      {
        path: "appraisal",
        component: appraisal
      },
      {
        path: "agency",
        component: agency
      }
    ]
  }
];
