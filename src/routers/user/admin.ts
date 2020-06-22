const admin = () => import("@/views/user/admin/adminList/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/user",
    component: index,
    children: [
      {
        path: "admin",
        component: admin
      }
    ]
  }
];
