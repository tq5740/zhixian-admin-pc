const article = () => import("@/views/business/article/arlist/index.vue");
const reg = () => import("@/views/business/article/reglist/index.vue");
const category = () =>
  import("@/views/business/article/arcategory/index.vue");
const index = () => import("@/views/index.vue");

const recycle = () => import("@/views/business/article/hszlist/index.vue");
export default [
  {
    path: "/article",
    component: index,
    children: [
      {
        path: "article",
        component: article
      },
      {
        path: "category",
        component: category
      },
      {
        path: "reg",
        component: reg
      },
      {
        path: "recycle",
        component: recycle
      }
    ]
  }
];
