const work = () => import("@/views/business/userFile/userList/index.vue");
const reg = () => import("@/views/user/manage/register/index.vue");
const login = () => import("@/views/user/manage/login/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/user",
    component: index,
    children: [
      {
        path: "reg",
        component: reg
      },
      {
        path: "login",
        component: login
      },
      {
        path: "work",
        component: work
      }
    ]
  }
];
