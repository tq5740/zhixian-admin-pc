const banner = () => import("@/views/system/banner/bannerlist/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/system",
    component: index,
    children: [
      {
        path: "banner",
        component: banner
      }
    ]
  }
];
