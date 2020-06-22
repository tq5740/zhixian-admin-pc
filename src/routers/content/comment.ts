const comment = () =>
  import("@/views/content/comment/commentlist/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/content",
    component: index,
    children: [
      {
        path: "comment",
        component: comment
      }
    ]
  }
];
