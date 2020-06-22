const category = () => import("@/views/eval/evaluation/eval_category.vue");
const config = () => import("@/views/eval/evaluation/eval_config.vue");
const list = () => import("@/views/eval/evaluation/eval_list.vue");
const index = () => import("@/views/index.vue");
export default [
    {
      path: "/eval",
      component: index,
      children: [
        {
          path: "list",
          component: list
        },
        {
          path: "config",
          component: config
        },
        {
          path: "category",
          component: category
        }
      ]
    }
  ];