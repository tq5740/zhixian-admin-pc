const role = () => import("@/views/system/limits/role/index.vue");
const menu = () => import("@/views/system/limits/menu/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/system",
    component: index,
    children: [
      {
        path: "role",
        component: role
      },
      {
        path: "menu",
        component: menu
      }
    ]
  }
];
