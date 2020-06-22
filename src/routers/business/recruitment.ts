const work = () => import("@/views/business/recruitment/job/index.vue");
const jobclassify = () =>
  import("@/views/business/recruitment/jobclassify/index.vue");
const index = () => import("@/views/index.vue");
const recycle = () => import("@/views/business/recruitment/hszlist/index.vue");
export default [
  {
    path: "/work",
    component: index,
    children: [
      {
        path: "work",
        component: work
      },
      {
        path: "jobclassify",
        component: jobclassify
      },
      {
        path: "recycle",
        component: recycle
      }
    ]
  }
];
