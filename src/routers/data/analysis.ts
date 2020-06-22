const index = () => import("@/views/index.vue");
const rpt = () => import("@/views/data/analysis/web/index.vue");
const trend = () => import("@/views/data/analysis/trend/index.vue");
const domain = () => import("@/views/data/analysis/doMain/index.vue");
const system = () => import("@/views/data/analysis/environment/index.vue");
const region = () => import("@/views/data/analysis/region/index.vue");

export default [
  {
    path: "/data",
    component: index,
    children: [
      {
        path: "trend",
        component: trend
      },
      {
        path: "rpt",
        component: rpt
      },
      {
        path: "domain",
        component: domain
      },
      {
        path: "system",
        component: system
      },
      {
        path: "region",
        component: region
      }
    ]
  }
];
