const question = () => import("@/views/content/qa/question/index.vue");
const opinion = () => import("@/views/content/qa/suggestion/index.vue");
const index = () => import("@/views/index.vue");
export default [
  {
    path: "/content",
    component: index,
    children: [
      {
        path: "question",
        component: question
      },
      {
        path: "opinion",
        component: opinion
      }
    ]
  }
];
