const staff = () => import("@/views/user/staff/staffList/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/user",
    component: index,
    children: [
      {
        path: "staff",
        component: staff
      }
    ]
  }
];
