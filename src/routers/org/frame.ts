const dep = () => import("@/views/org/frame/department/index.vue");
const move = () => import("@/views/org/frame/department/move.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/org",
    component: index,
    children: [
      {
        path: "dep",
        component: dep
      },
      {
        path: "move",
        component: move
      }
    ]
  }
];
