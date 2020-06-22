const orgchildren = () => import("@/views/org/orgchildren/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/org",
    component: index,
    children: [
      {
        path: "orgchildren",
        component: orgchildren
      }
    ]
  }
];
