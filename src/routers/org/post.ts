const post = () => import("@/views/org/post/posttree/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/org",
    component: index,
    children: [
      {
        path: "post",
        component: post
      }
    ]
  }
];
