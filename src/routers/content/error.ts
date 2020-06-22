const errorreport = () => import("@/views/content/errorreport/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/content",
    component: index,
    children: [
      {
        path: "errorreport",
        component: errorreport
      }
    ]
  }
];
