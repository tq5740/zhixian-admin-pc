const auth = () => import("@/views/user/auth/authList/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/user",
    component: index,
    children: [
      {
        path: "auth",
        component: auth
      }
    ]
  }
];
